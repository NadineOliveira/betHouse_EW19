var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var jwt = require("jsonwebtoken");
var Aposta = require('./controllers/aposta')
var cors = require('cors')

var mongoose = require('mongoose')


//ligação ao mongo

//BD
mongoose.connect('mongodb://bd_apostas:27017/apostas', {useNewUrlParser : true})
.then(() => console.log("Mongo ready na bd de apostas " + mongoose.connection.readyState))
.catch(erro => console.log("Erro de ligacao: " + erro))

// ZeroMQ
const pub_socket = require('zeromq').socket('pub');
const sub_socket = require('zeromq').socket('sub');

const pub_address = process.env.ZMQ_APOSTAS_PUB_ADDRESS;

pub_socket.bindSync(pub_address);


const eventos_address = process.env.ZMQ_EVENTOS_PUB_ADDRESS;
const utilizadores_address = process.env.ZMQ_UTILIZADORES_PUB_ADDRESS;

console.log('Sub socket nas apostas a ligar-se a eventos e utilizadores');
sub_socket.connect(eventos_address);
sub_socket.connect(utilizadores_address);

//Subscreve aquilo que é enviado para ele
sub_socket.subscribe("apostas");

sub_socket.on("message", (topic, message) => {
  console.log("Apostas recebeu mensagem com topico " + topic.toString() + " e mensagem " + message.toString())
  trataPedido(message)
});

// Formato das mensagens : [origem resposta|pedido identificador cenasDependentes (saldo, retiraSaldo, ...)]

const trataPedido = async (message) => {


  var msgString = message.toString().split(" ")
  var type = msgString[1]
  console.log("Type =", type)

  switch (type) {

    case "resposta":
        // Message indica qual o evento que devemos acordar
        // utilizadores resposta id valor
      var id = msgString[2]
      sub_socket.emit(id, message)
      
      break;

    case "eventoFechou":
      // eventos eventoFechou idEvento resultado oddVencedora
      // 1 - Verificar apostas no evento cujo prognostico = resultado
      var idEvento = msgString[2]
      var result = msgString[3]
      var oddVencedora = parseFloat( msgString[4] )
      var apostasEvento = await Aposta.listByEvento(idEvento)
      apostasEvento.forEach(aposta => {
        // Se acertou na aposta
        if (aposta.prognostico == result) {
          var user = aposta.user
          var total = parseFloat( aposta.valor) * oddVencedora

          pub_socket.send(["utilizadores", "apostas aumentaSaldo " + user + " " + total])

          // Preciso de esperar por resposta? Vou assumir que nao

        }
        // Fecha a aposta de qualquer forma
        // Com await nao funciona
        var marcarFechado =  Aposta.payAposta(aposta._id)
        
      });

      //Marcar como finalizado, para responder ao pedido REST
      pub_socket.send(["eventos", "apostas eventoFechouResposta " + idEvento + " ok"])
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
app.post("/apostas", async (req,res) => {
  if (req.user) {
    var data = req.body.data
    var valor = req.body.valor
    var prognostico = req.body.prognostico
    var evento = req.body.evento
    var user = req.user.email
    pub_socket.send(["utilizadores", "apostas saldo " + user])

    //Envia ao micro servico de utilizadores apostas saldo user
    // recebe utilizadores resposta nuno 12345

    const respostaSaldo = (message) => {
      console.log("Foi acordada a respostaSaldo, mensagem : " + message.toString())
      var messageBody = message.toString().split(" ")
      var type = messageBody[1]
      if (type == "resposta") {

        var saldo = parseFloat(messageBody[3])
        console.log("Recebi valor " + saldo)

        if (saldo >= parseFloat(valor)) {
          
          pub_socket.send(["utilizadores", "apostas retiraSaldo " + user + " " + parseFloat(valor)])

          const respostaRetiraSaldo = (message) => {
            // recebe utilizadores resposta id ok
            console.log("Foi acordada a respostaRetiraSaldo, mensagem : " + message.toString())
            var msgBody = message.toString().split(" ")
            var type = msgBody[1]
            if (type == "resposta") {
              var resposta = msgBody[3]

              console.log("Recebi resposta à retirada de saldo " + resposta)
              if (resposta == "ok") {
                console.dir({data: data, valor: valor, prognostico: prognostico, recebido: 0, evento: evento, user:user})
                Aposta.insert({data: data, valor: valor, prognostico: prognostico, recebido: 0, evento: evento, user:user})
                .then(aposta => res.jsonp(aposta))
                .catch(err => res.status(500).send(err)) 
              }
            
            }
          
          }
          sub_socket.once(user, respostaRetiraSaldo)
        }
        else {
          res.jsonp({erro: "Saldo insuficiente, o seu saldo é de " + saldo})
        }

      }
      
    }

    sub_socket.once(user, respostaSaldo)
  }
  else {
    res.send("Não está autenticado")
  }
})

app.get("/apostas", async (req,res) => {
  if (req.user) {
    // Está autenticado, filtrar apostas por id
    var email = req.user.email
    Aposta.listReceber(email)
      .then(apostas => res.jsonp(apostas))
      .catch(err => res.status(500).send(err))

  }
  else {
    res.send("Nao esta autenticado")
  }
       
})

app.get("/apostas/recebidas", async (req,res) => {
  if (req.user) {
    // Está autenticado, filtrar apostas por id
    var email = req.user.email
    Aposta.listRecebidas(email)
      .then(apostas => res.jsonp(apostas))
      .catch(err => res.status(500).send(err))

  }
  else {
    res.send("Nao esta autenticado")
  }
})

app.get("/apostas/total", async (req,res) => {
  Aposta.list()
      .then(apostas => res.jsonp(apostas))
      .catch(err => res.status(500).send(err))     
})

app.get("/apostas/:id", async (req,res) => {
  Aposta.getById(req.params.id)
      .then(aposta => res.jsonp(aposta))
      .catch(err => res.status(500).send(err))     
})

app.get("/apostas/evento/:evento", async (req,res) => {
  Aposta.listByEvento(req.params.evento)
      .then(apostas => res.jsonp(apostas))
      .catch(err => res.status(500).send(err))     
})

app.get("/apostas/data/:data", async (req,res) => {
  Aposta.listByExactDate(req.params.data)
      .then(apostas => res.jsonp(apostas))
      .catch(err => res.status(500).send(err))     
})

app.get("/apostas/concluir/:id", async (req,res) => {
  Aposta.payAposta(req.params.id)
      .then(aposta => res.jsonp(aposta))
      .catch(err => res.status(500).send(err))     
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
  res.render('error');
});



module.exports = app;
