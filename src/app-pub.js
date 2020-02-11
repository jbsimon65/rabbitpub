let publishMsg = function() {
    var open = require('amqplib').connect('amqp://guest:guest@localhost');

    // Publisher
    var connect = open.then(function(conn) {
      return conn.createChannel();
    })
    .then(async function(ch) {
        var exchange = 'node';
        await ch.assertExchange(exchange, 'direct', {durable:true});
        console.log('msg envoyé');
        return ch.publish(exchange,'', Buffer.from('hello grrr'));
    })
    .catch(function(err) {
        console.error(err);
    });
}

setInterval(function() {
    console.log('top');
    publishMsg();
}, 10)

