var qWriteEventos = 'events_write';
var qReadEventos = 'events_read';

var Event = require('./eventosModel');
var mongoose = require('mongoose');



mongoose
.connect('mongodb://127.0.0.1:27017/iBand', {useNewUrlParser: true})
.then(()=> console.log('Mongo status: ' + mongoose.connection.readyState))
.catch(()=> console.log('Mongo: Erro na Conexão.'))



var open = require('amqplib').connect('amqp://localhost');
// Consumer
open.then(function(conn) {
    return conn.createChannel();
  }).then(function(ch) {
    return ch.assertQueue(qWriteEventos).then(function(ok) {
      return ch.consume(qWriteEventos, function(msg) {
        if (msg.content.toString() === 'eventos') {
          console.log(msg.content.toString())
          console.log(JSON.stringify(Event.find().sort({date: 1}).exec()))
          
        }
      });
    });
  }).catch(console.warn);
