const amqp = require('amqplib/callback_api');

ampq.connect('amqp://localhost', function (err, conn) {

	conn.createChannel(function (err, ch) {

		const q = 'task_queue';
		const msg = process.argv.slice(2).join(' ') || 'Hello World!';

		ch.assertQueue(q, { durable: true });
		ch.sendToQueue(q, new Buffer(msg), { persistent: true });
		console.log("[x] Sent '%s'", msg);
	});

	setTimeout(function () {
		conn.close();
		process.exit(0)
	}, 500);
});
