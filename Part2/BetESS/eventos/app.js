var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var mongoose = require('mongoose')

var indexRouter = require('./routes/index');

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

//
// setInterval(function(){
//   console.log('enviar para apostas');
//   pub_socket.send(['apostas', 'meowApostas!']);
//   console.log('enviar para utilizadores');
//   pub_socket.send(['utilizadores', 'meowUtilizadores!']);
// }, 1000);

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/eventos', indexRouter);




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
