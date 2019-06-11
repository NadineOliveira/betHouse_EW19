var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var jwt = require("jsonwebtoken");
const key = require("./key");

var cors = require('cors')

var app = express();
app.use(cors())
var mongoose = require('mongoose')

var User = require("./controllers/User")


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

const trataPedido = async (message) => {
  // Ja vem sem topico
  // [destino, origem resposta|pedido identificador cenasDependentes]

  console.log("Utilizadores : Tratar pedido : " + message );
  var messageSplit = message.toString().split(" ")
  var sender = messageSplit[0]
  console.log("Sender: " + sender)
  var id = messageSplit[2]
  var pedido = messageSplit[1]
  switch (pedido) {
    case "saldo":
      // Assumir que vem id logo a seguir, do tipo saldo user@gmail.com
      console.log("É saldo")
      var objSaldo = await User.getSaldo(id)
      pub_socket.send([sender, "utilizadores resposta " + id + " " + objSaldo.saldo]);
      console.log("Enviou saldo")
      break;
    case "retiraSaldo":
      // Assumir que vem id logo a seguir e quantia, do tipo retiraSaldo user@gmail.com 123
      var valorGasto = parseFloat(messageSplit[3])
      var done = User.retiraSaldo(id,valorGasto )
      if (done) {
        pub_socket.send([sender, "utilizadores resposta " + id + " " + "ok"])
        console.log("Saldo retirado")
      }

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
            User.getUser(payload.email).then(
                (doc)=>{
                  console.log("User existe, preencher req.user");
                    req.user = doc;
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
  User.list().then(doc => {
    res.jsonp(doc)
  })
});

app.post('/utilizadores/login', async function(req,res){
  var email = req.body.email
  var password = req.body.password
  var user = await User.validatePassword(email, password)

  if(user){
      var token = jwt.sign({ email : user.email}, key.tokenKey);
      res.jsonp({ token })
  } 
  else res.status(400).send("Erro no Login")
});

app.post('/utilizadores', async (req,res) => {
  var email = req.body.email;
  var password = req.body.password;
  var novoUser = await User.inserir({email: email, password: password, saldo : 0})
  if (novoUser) {
    var token = jwt.sign({ email : novoUser.email}, key.tokenKey);
    res.status(200).json({ token });
    }
  else {
    res.status(500).send("Erro no registo!")

  }
  

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
