const amqp = require('amqplib');

const open = amqp.connect().then((c) => {
	return c.createChannel();
});



const qu = {
	//name: 'charge',
	options: {
		autoDelete: false,
	}
}

open.then((ch) => {
	console.log('worker:queue')
	ch.assertQueue('charge_queue', qu.options).then((q) => {
		ch.consume(q.queue, (msg) => {
			console.log('msg', msg.properties)
			/*
			 * { consumerTag: String }
			**/
			setTimeout(() => {
				ch.sendToQueue(msg.properties.replyTo, new Buffer('done'), { correlationId: 'verified' })
				console.log('done');
				ch.ack(msg)
				// ch.close();
				// process.exit(0);
			}, 1500);

		});;

		
	});
});