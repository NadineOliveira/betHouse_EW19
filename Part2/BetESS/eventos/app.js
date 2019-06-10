var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var Eventos = require('./controllers/evento')


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

const trataPedido = (message) => {
  console.log("Eventos: Recebi pedido")
};

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Rotas começam aqui
app.post("/eventos", async (req,res) => {
  var odd1 = req.body.odd1
  var oddx = req.body.oddx
  var odd2 = req.body.odd2
  var data = req.body.data
  var equipa1 = req.body.equipa1
  var equipa2 = req.body.equipa2
  Eventos.insert({odd1: odd1, oddx: oddx, odd2: odd2, data: data, estado: 0, equipa1: equipa1, equipa2: equipa2})
    .then(evento => res.jsonp(evento))
    .catch(err => res.status(500).send(err))
})

app.get("/eventos", async (req,res) => {
  Eventos.listByEstado(0)
      .then(eventos => res.jsonp(eventos))
      .catch(err => res.status(500).send(err))     
})

app.get("/eventos/top", async (req,res) => {
  Eventos.topList()
      .then(eventos => res.jsonp(eventos))
      .catch(err => res.status(500).send(err))     
})

app.get("/eventos/concluidos", async (req,res) => {
  Eventos.listByEstado(1)
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

app.get("/eventos/concluir/:id", async (req,res) => {
  Eventos.finishEvent(req.params.id)
      .then(evento => res.jsonp(evento))
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


// Rotas começam aqui
app.get("/eventos", async (req, res) => {
  res.send("Eventos recebeu pedido");
})

module.exports = app;
