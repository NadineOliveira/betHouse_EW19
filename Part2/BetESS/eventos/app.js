var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var Eventos = require('./controllers/evento')
var cors = require('cors')
var bodyParser = require('body-parser');
var jwt = require("jsonwebtoken");

var mongoose = require('mongoose')


//ligação ao mongo

//BD
mongoose.connect('mongodb://bd_eventos:27017/eventos', {useNewUrlParser : true})
.then(() => console.log("Mongo ready na bd de eventos " + mongoose.connection.readyState))
.catch(erro => console.log("Erro de ligacao: " + erro))


// ZeroMQ
const pub_socket = require('zeromq').socket('pub');
const sub_socket = require('zeromq').socket('sub');

const pub_address = process.env.ZMQ_EVENTOS_PUB_ADDRESS;

pub_socket.bindSync(pub_address);


    const apostas_address = process.env.ZMQ_APOSTAS_PUB_ADDRESS;
    const utilizadores_address = process.env.ZMQ_UTILIZADORES_PUB_ADDRESS;

console.log('Sub socket nos eventos a ligar-se a apostas e utilizadores');
sub_socket.connect(apostas_address);
sub_socket.connect(utilizadores_address);

//Subscreve aquilo que é enviado para ele
sub_socket.subscribe("eventos");


sub_socket.on('message', function(topic, message) {
  console.log('Eventos recebeu topico:', topic.toString(), 'com mensagem:', message.toString());
  trataPedido (message);
});

const trataPedido = async (message) => {


  var msgString = message.toString().split(" ")
  var type = msgString[1]
  console.log("Type =", type)

  switch (type) {

    case "eventoFechouResposta":
        // Message indica qual o evento que devemos acordar
        // apostas eventoFechouResposta idEvento ok
      var id = msgString[2]
      sub_socket.emit(id, message)
      
      break;


  
    default:
      console.log("Não sei o que fazer com message " + message)

      break;
  }
};

var app = express();
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({
  extended: false
}));

//Middleware para verificação de existencia de header com jwt token
app.use( function(req, res, next) {
  try {
    console.dir(req.headers)
    const token = req.headers.authorization
    console.log("Token = " + token)
    if (token) {
      jwt.verify(token, "EW2019", function (err, payload) {
          if (err) {
            console.log("Erro na verificacao do token : " + err)
            next()
          }
          console.log("Payload do token : " + payload)
          if (payload) {
            req.user = payload;
            next()
          }
          else {
            console.log("Payload vazio")
            next()
          }
      })
    }
    else next()
  }

  catch(e){
    console.log("Erro no middleware de autenticacao : " + e)
    next()
  }
});


// Rotas começam aqui
app.post("/eventos", async (req,res) => {
  if (req.user && req.user.admin)
  {
      console.log(req.body)
    var odd1 = req.body.odd1
    var oddx = req.body.oddx
    var odd2 = req.body.odd2
    var data = req.body.data
    var hora = req.body.hora
    var equipa1 = req.body.equipa1
    var equipa2 = req.body.equipa2
    var premium = req.body.premium
    var resultado = "N/A"
    
    Eventos.insert({odd1: odd1, oddx: oddx, odd2: odd2, data: data, hora: hora, estado: 0, equipa1: equipa1, equipa2: equipa2,resultado: resultado, premium : premium})
      .then(evento => res.jsonp(evento))
      .catch(err => res.status(500).send(err))
  }
  else {
    res.send("Não possui privilégios para adicionar eventos")
  }
})

app.get("/eventos", async (req,res) => {
  console.log("Req.user = " + req.user)
  // Se esta autenticado e é premium, mostrar tudo
  if (typeof req.user !== 'undefined' && (req.user.premium || req.user.admin)) {
    console.log("Premium pediu eventos")
    // Se é premium, listar todos os eventos incluindo os premium
    Eventos.listByEstadoPremium(0)
        .then(eventos => res.jsonp(eventos))
        .catch(err => res.status(500).send(err))
  }
  else {
    //Lista eventos nao premium, pois é user normal ou nao autenticado
    console.log("CARREGA EVENTOS GUEST")
    Eventos.listByEstado(0)
        .then(eventos => res.jsonp(eventos))
        .catch(err => res.status(500).send(err))
  }
})

app.get("/eventos/top", async (req,res) => {
  Eventos.topList()
      .then(eventos => res.jsonp(eventos))
      .catch(err => res.status(500).send(err))     
})

app.get("/eventos/concluidos", async (req,res) => {
  Eventos.listByEstadoPremium(1)
      .then(eventos => res.jsonp(eventos))
      .catch(err => res.status(500).send(err))     
})

app.get("/eventos/:id", async (req,res) => {
  Eventos.getById(req.params.id)
      .then(evento => res.jsonp(evento))
      .catch(err => res.status(500).send(err))     
})

app.get("/eventos/data/:data", async (req,res) => {
  Eventos.listByExactDate(req.params.data)
      .then(eventos => res.jsonp(eventos))
      .catch(err => res.status(500).send(err))     
})

app.post("/eventos/concluir/:id", async (req,res) => {

  if (req.user && req.user.admin) {
    var idEvento = req.params.id

    var result = req.body.estado
    var resultado = req.body.resultado

    var evento = await Eventos.getById(idEvento)
    var oddVencedora = 0

    switch (result) {
      case "1":
        oddVencedora = evento.odd1

      break;

      case "2":
        oddVencedora = evento.odd2
        
      break;

      case "3":
        oddVencedora = evento.oddx
        
      break;
    }
    // Notificar apostas que o evento com id ID terminou e enviar resultado e odd do resultado, para fazer contas nas apostas
    pub_socket.send(["apostas", "eventos eventoFechou " + idEvento + " " + result + " " + oddVencedora ])

    const respostaFecharEvento = (message) => {
      // Recebi resposta, verificar se é ok
      // "apostas eventoFechouResposta " + idEvento + " ok"
        var msg = message.toString().split(" ")
        var feedback = msg[3]
        
        if (feedback == "ok") {
          Eventos.finishEvent(idEvento, result, resultado)
            .then(evento => res.jsonp(evento))
            .catch(err => res.status(500).send(err))
        }
    }

        sub_socket.once(idEvento, respostaFecharEvento)
  }
  else {
    res.send("Não possui privilégios para fechar eventos")
  }
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({erro: err});
});



module.exports = app;
