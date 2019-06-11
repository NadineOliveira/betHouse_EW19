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

// Formato das mensagens : [destino, origem resposta|pedido identificador cenasDependentes (saldo, retiraSaldo, ...)]
const trataPedido = (topic, message) => { 
  console.log("Apostas: Recebi pedido com topico " + topic.toString() + " e mensagem " + message.toString())
  // Message indica qual o evento que devemos acordar
  var msgString = message.toString().split(" ")
  var type = msgString[1]
  console.log("Type =", type)

  if (type == "resposta") {
    // utilizadores resposta id valor
    var id = msgString[2]
    sub_socket.emit(id, message)
  }

  else {
    console.log("apostas nao sabe o que fazer com pedido")
    console.log("Array: " + msgString)
  }

  

};

sub_socket.on("message", trataPedido);

var app = express();
app.use(cors())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Middleware para verificação de existencia de header com jwt token
app.use( function(req, res, next) {
  try {
  const token = req.headers.authorization.split(" ")[1]
  console.log("Token = " + token)
  jwt.verify(token, "EW2019", function (err, payload) {
      console.log("Payload é " + JSON.stringify(payload))
      if (payload) {
          console.log("User existe, preencher req.user");
                  req.user=payload
                  next()
      } else {
         next()
      }
  })
}catch(e){
  next()
}
});

// Rotas começam aqui
app.post("/apostas", async (req,res) => {
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

      if (saldo > parseFloat(valor)) {
        
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
              Aposta.insert({data: data, valor: valor, prognostico: prognostico, recebido: 0, evento: evento, user:user})
              .then(aposta => res.jsonp(aposta))
              .catch(err => res.status(500).send(err)) 
            }
          
          }
        
        }
        sub_socket.once(user, respostaRetiraSaldo)
      }

    }
    else {
      res.json({erro: "Saldo insuficiente"})
    }
  }

  sub_socket.once(user, respostaSaldo)

})

app.get("/apostas", async (req,res) => {
  Aposta.listReceber()
      .then(apostas => res.jsonp(apostas))
      .catch(err => res.status(500).send(err))     
})

app.get("/apostas/recebidas", async (req,res) => {
  Aposta.listRecebidas()
      .then(apostas => res.jsonp(apostas))
      .catch(err => res.status(500).send(err))     
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
