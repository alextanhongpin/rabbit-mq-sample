const amqp = require('amqplib');


const open = amqp.connect().then((c) => {
	return c.createChannel();
});

open.then((ch) => {

	const queueName = 'hello';
	const queueOptions = {
		durable: false
	}
	/*
	 * 1. Assert a queue into existence
	**/
	ch.assertQueue(queueName, queueOptions);
	/*
	 * 2. Send to a specific queue to be consumed
	**/
	ch.sendToQueue(queueName, new Buffer('hello world'));
	console.log('[x] Sent "Hello World!"');


	setTimeout(function () {
		ch.close();
		process.exit(0);
	}, 500);
});

