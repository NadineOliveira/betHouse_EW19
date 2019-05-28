var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();

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


sub_socket.on('message', function(topic, message) {
  console.log('Apostas recebeu topico:', topic.toString(), 'com mensagem:', message.toString());
  trataPedido (message);
});

const trataPedido = (message) => {
  console.log("Apostas: Recebi pedido")
};


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/apostas', indexRouter);

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
