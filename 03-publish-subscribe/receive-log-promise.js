const amqp = require('amqplib');


const open = amqp.connect().then((c) => {
	return c.createChannel();
});

open.then((ch) => {

	const exchangeName = 'logs';
	const exchangeType = 'fanout';
	const exchangeOptions = {
		durable: false
	}

	const queueName = '';
	const queueOptions = {
		exclusive: true
	}

	ch.assertExchange(exchangeName, exchangeType, exchangeOptions).then((ok) => {
		console.log('ok', ok);
		ch.assertQueue(queueName, queueOptions).then((q) => {
			console.log('q', q);
			console.log('[x] Waiting for messages in %s. To exit press CTRL + C', q.queue);
			ch.bindQueue(q.queue, exchangeName, '');

			const consumerOptions = {
				noAck: true
			}
			ch.consume(q.queue, (msg) => {
				console.log('[x] %s', msg.content.toString());
			}, consumerOptions);
		});
	});
	
});