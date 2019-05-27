var q = 'tasks1';

var open = require('amqplib').connect('amqp://localhost');

// Consumer
open.then(function(conn) {
    return conn.createChannel();
  }).then(function(ch) {
    return ch.assertQueue(q).then(function(ok) {
      return ch.consume(q, function(msg) {
        if (msg !== null) {
          console.log(msg.content.toString());
        }
      });
    });
  }).catch(console.warn);
