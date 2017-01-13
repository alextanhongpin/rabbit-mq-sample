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

	const msg = process.argv.slice(2).join(' ') || 'hello world';
	ch.assertExchange(exchangeName, exchangeType, exchangeOptions);
	ch.publish(exchangeName, '', new Buffer(msg));

	console.log('[x] Sent %s', msg);
	setTimeout(function () {
		ch.close();
		process.exit(0);
	}, 500);
});
