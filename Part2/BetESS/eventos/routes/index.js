var express = require('express');
var router = express.Router();
var Evento = require('../models/evento');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("Eventos recebeu pedido");
});

router.get('/todos', function(req, res, next) {
  console.log("Recebi /todos");
  Evento.find()
    .then(result => {
      res.send(result)
    })

});

module.exports = router;
