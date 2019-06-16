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
  // [origem resposta|pedido identificador cenasDependentes]

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
      console.log("É retira Saldo")
      // Assumir que vem id logo a seguir e quantia, do tipo retiraSaldo user@gmail.com 123
      var valorGasto = parseFloat(messageSplit[3])
      var done = User.retiraSaldo(id,valorGasto )
      if (done) {
        pub_socket.send([sender, "utilizadores resposta " + id + " " + "ok"])
        console.log("Saldo retirado")
      }
      break;

    case "aumentaSaldo":
      // Assumir que vem id logo a seguir e quantia, do tipo aumentaSaldo user@gmail.com 123
      var valor = parseFloat(messageSplit[3])
      var done = User.aumentaSaldo(id, valor)
      if (done) {
        pub_socket.send([sender, "utilizadores resposta " + id + " " + "ok"])
        console.log("Saldo adicionado")
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
app.get("/utilizadores", async (req, res) => {
  if(req.user && req.user.admin){
    User.list().then(doc => {
      res.jsonp(doc)
    })
  } else res.status(500).send("Rota Protegida")
});

app.get("/utilizadores/saldo/:email", async (req, res) => {
  console.log("GET SALDO")
  var email = req.params.email
  User.getSaldo(email).then(doc => {
    res.jsonp(doc)
  })
});


//Update premium
app.post("/utilizadores/premium/", async (req, res) => {
  if(req.user && ((req.user.email === req.body.email) || req.user.admin)) {
    var email = req.body.email
    var premium = req.body.premium
    var novoUser = await User.updatePremium(email, premium)
    res.jsonp (novoUser)
  }
  else res.status(500).send("Operação Protegida")
});

//Update admin
app.post("/utilizadores/admin/", async (req, res) => {
  if(req.body.admin) {
    if(req.user && req.user.admin){
      var email = req.body.email
      var user = await User.updateAdmin(email,true)
      res.jsonp(user)
    } else res.status(500).send("Erro ao atualizar Utilizador")
  } else {
    if(req.user && req.user.email===req.body.email) {
      var email = req.body.email
      var user = await User.updateAdmin(email,false)
      res.jsonp(user)
    } else res.status(500).send("Operação Protegida")
  }
});

// Aumentar saldo
app.post("/utilizadores/aumentaSaldo/", async (req, res) => {
  if(req.user && ((req.user.email === req.body.email) || req.user.admin)) {
    var email = req.body.email
    var valor = req.body.valor
    var novoUser = await User.aumentaSaldo(email, valor)
    res.jsonp (novoUser)
  }
  else res.status(500).send("Operação Protegida")
});


app.get("/utilizadores/retiraSaldo/:email/:valor", async (req, res) => {
  if(req.user && req.user.email === req.params.email) {
    var email = req.params.email
    var valor = req.params.valor
    var novoUser = await User.retiraSaldo(email, valor)
    res.jsonp (novoUser)
  } else res.status(500).send("Operação Protegida")
});

app.post('/utilizadores/login', async function(req,res){
  var email = req.body.email
  var password = req.body.password
  var user = await User.validatePassword(email, password)

  if(user){
      var token = jwt.sign({ email : user.email, premium : user.premium, admin : user.admin}, key.tokenKey); // Fica no token também
      res.jsonp({ token, "premium" : user.premium, "admin" : user.admin }) // Para o frontend saber se é premium ou não
  } 
  else res.status(400).send("Erro no Login")
});

app.post('/utilizadores', async (req,res) => {
  var email = req.body.email;
  var password = req.body.password;
  var premium = req.body.premium;
  var admin = req.body.admin;
  var novoUser = await User.inserir({email: email, password: password, saldo : 0, premium : premium, admin : admin})
  if (novoUser) {
    var token = jwt.sign({ email : novoUser.email, premium : novoUser.premium, admin : novoUser.admin}, key.tokenKey); // Fica no token também
    res.jsonp({ token, "premium" : novoUser.premium, "admin" : novoUser.admin }) // Para o frontend saber se é premium ou não
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
