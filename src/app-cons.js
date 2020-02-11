let consume = function(nbAgent) {
    var open = require('amqplib').connect('amqp://guest:guest@localhost');
    var counter = 0;

    // Publisher
    var connect = open.then(function(conn) {
      return conn.createChannel();
    })
    .then(async function(ch) {
        let exchange = 'node';
        let queue = 'nodeq';
        await ch.assertExchange(exchange, 'direct', {durable:true})
        let q = await ch.assertQueue(queue, {durable:true});
        await ch.bindQueue(q.queue, exchange, '');
        await ch.prefetch(1);
        return ch;
    })
    .then(function(ch) {
        for (var j = 0; j < 5; j++) {
            ch.consume('nodeq', function(msg) {
                console.log('take ' + j + ':' + counter);
                setTimeout(function() {
                    if(msg.content) {
                        console.log(" [x] %s", msg.content.toString());
                    }
                    ch.ack(msg);
                    counter ++;
                    console.log('fini ' + j + ':' + counter);
                }, 5000);
            }, { noAck: false });
        }
    })
    .catch(function(err) {
        console.error(err);
    });
}

consume();