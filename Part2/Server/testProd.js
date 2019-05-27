var queue = 'tasks1'

var open = require('amqplib').connect('amqp://localhost');

open.then(function(conn) {
    return conn.createChannel();
  }).then(function(ch) {
    return ch.assertQueue(queue).then(function(ok) {
      return ch.sendToQueue(queue, Buffer.from('something to do'));
    });
  }).catch(console.warn);