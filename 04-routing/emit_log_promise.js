const amqp = require('amqplib');

const open = amqp.connect().then((c) => {
	return c.createChannel();
});


open.then((ch) => {
	const exchangeName = 'direct_logs';
	const exchangeType = 'direct';
	const exchangeOptions = {
		durable: true
	}
	const args = process.argv.slice(2);
	const msg = args.slice(1).join(' ') || 'Hello World!';
	const severity = (args.length >  0) ? args[0] : 'info';

	ch.assertExchange(exchangeName, exchangeType, exchangeOptions);
	ch.publish(exchangeName, severity, new Buffer(msg));
	console.log('[x] Sent %s: "%s"', severity, msg);

	setTimeout(() => { 
		ch.close(); 
		process.exit(0) 
	}, 500);
});