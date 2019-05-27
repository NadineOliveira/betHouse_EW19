const express = require('express');
var bodyParser = require('body-parser');
const app = express();
app.use(bodyParser());

var qWriteUtilizadores = 'users_write';
var qReadUtilizadores = 'users_read';
var qWriteEventos = 'events_write';
var qReadEventos = 'events_read';
var qWriteApostas = 'bets_write';
var qReadApostas = 'bets_read';

var open = require('amqplib').connect('amqp://localhost');
var port = 7000

//Consumer
var consumer = async (res, queue) => {
    open.then(function(conn) {
        return conn.createChannel();
      }).then(function(ch) {
        return ch.assertQueue(queue).then(function(ok) {
          return ch.consume(queue, function(msg) {
            if (msg !== null) {
              res.status(200).send(msg.content.toString());
            }
          });
        });
      }).res.status(500).send("Error");

}

// Publisher
var publisher = async (queue, msg) => {
    return open.then(function(conn) {
        return conn.createChannel();
    }).then(function(ch) {
        return ch.assertQueue(queue).then(function(ok) {
            return ch.sendToQueue(queue, Buffer.from(msg));
    });
    }).catch(console.warn);
}


app.get('/eventos/', async (req, res) => {
    open.then(function(conn) {
        return conn.createChannel();
    }).then(function(ch) {
        return ch.assertQueue(qWriteEventos).then(function(ok) {
            console.log('Eventos SENT')
            return ch.sendToQueue(qWriteEventos, Buffer.from('eventos'));
    });
    }).catch(console.warn);
})


app.listen(port, () => console.log(`Listening on port ${port}`));

