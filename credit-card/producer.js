/*
 * 1. Exchange: What you publish to.
 * 2. Queue: What you consume from
 * 3. Binding: bind exchange to queue
 * 4. Publish: The exchange you want to target
 *
**/

const amqp = require('amqplib');

const open = amqp.connect().then((c) => {
	return c.createChannel();
});

open.then((ch) => {

	const qName = 'charge_credit';
	ch.assertQueue(qName, { durable: false });
	ch.prefetch(1);


	ch.consume(qName, (msg) => {

		if (msg) {
			console.log(msg)
			const n = msg.content.toString();
			console.log(n)
		}

		
		ch.ack(msg);
	});

	ch.sendToQueue(msg.properties.replyTo, 
			new Buffer('charging credit card to ' + msg.properties.replyTo), 
			{ 
				correlationId: msg.properties.correlationId 
			}
		);
});

