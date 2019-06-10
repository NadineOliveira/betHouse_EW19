var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var jwt = require("jsonwebtoken");

const User = require("./models/User");
const key = require("./key");

var app = express();


var mongoose = require('mongoose')


//ligação ao mongo

//BD
mongoose.connect('mongodb://bd_utilizadores:27017/utilizadores', {useNewUrlParser : true})
    .then(() => console.log("Mongo ready na bd de utilizadores " + mongoose.connection.readyState))
    .catch(erro => console.log("Erro de ligacao: " + erro))

// ZeroMQ
const pub_socket = require('zeromq').socket('pub');
const sub_socket = require('zeromq').socket('sub');

const pub_address = process.env.ZMQ_UTILIZADORES_PUB_ADDRESS;

pub_socket.bindSync(pub_address);

const eventos_address = process.env.ZMQ_EVENTOS_PUB_ADDRESS;
const apostas_address = process.env.ZMQ_APOSTAS_PUB_ADDRESS;
 
console.log('Sub socket nos utilizadores a ligar-se a eventos e apostas');
sub_socket.connect(eventos_address);
sub_socket.connect(apostas_address);

//Subscreve aquilo que é enviado para ele
sub_socket.subscribe("utilizadores");


sub_socket.on('message', function(topic, message) {
  console.log('utilizadores recebeu topico:', topic.toString(), 'com mensagem:', message.toString());
  trataPedido (message);
});

const trataPedido = (message) => {
  console.log("Utilizadores : Recebi pedido : " + message );
  console.log("Message: " + message);
  var messageSplit = message.toString().split(" ")
  var sender = messageSplit [0] // Quem envia a mensagem e quer resposta
  var pedido = messageSplit[1]
  switch (pedido) {
    case "saldo":
      // Assumir que vem id logo a seguir, do tipo saldo user@gmail.com
      pub_socket.send([sender, "pediste saldo bro"]);
      break;
    case "retiraSaldo":
      // Assumir que vem id logo a seguir e quantia, do tipo retiraSaldo user@gmail.com 123

      break;
    default:
      break;
  }
};

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
    const token = req.headers.authorization.split(" ")[1]
    jwt.verify(token, key.tokenKey, function (err, payload) {
        console.log(payload)
        if (payload) {
            User.findById(payload.userId).then(
                (doc)=>{
                  console.log("User existe, preencher req.user");
                    req.user=doc;
                    next()
                }
            )
        } else {
           next()
        }
    })
}catch(e){
    next()
}
});


// Rotas começam aqui
app.get("/utilizadores", async (req, res) => {
  console.log(req.user);
  res.send("Utilizadores recebeu pedido");
});

app.post('/login', function(req,res){
  user.findOne ({ email:req.body.email }).then((user)=>{
          User.comparePassword(req.body.password,(err, isMatch)=>{
              if(isMatch){
                  var token = jwt.sign({ email : user.email, userId: user._id}, key.tokenKey);
                  res.status(200).json({
                      token
                  })
              }
              else{
                  res.status(400).json({message:'Invalid Password/email'});
              }
          })
  }).catch((err)=>{
      res.status(400).json({message:'Invalid Password/email'});
  })
});

app.post('/register', function(req,res){
  var email = req.body.email;
  var password = req.body.password;
  User.create({email: email, password: password, saldo : 0})
    .then(user => {
        var token = jwt.sign({ email : user.email, userId: user._id}, key.tokenKey);
        res.status(200).json({ token });})
    .catch(error => {
      console.log("Erro : " + error);
      res.json({erro : error});
  });
  
  
});


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
  res.json({error : err});
});

module.exports = app;
