var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var Aposta = require('./controllers/aposta')


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


const trataPedido = (message) => {
  console.log("Apostas: Recebi pedido")
};

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Rotas começam aqui
app.post("/apostas", async (req,res) => {
  var data = req.body.data
  var valor = req.body.valor
  var prognostico = req.body.prognostico
  var evento = req.body.evento
  //var user = req.user.email
  Aposta.insert({data: data, valor: valor, prognostico: prognostico, recebido: 0, evento: evento})
    .then(aposta => res.jsonp(aposta))
    .catch(err => res.status(500).send(err))
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
