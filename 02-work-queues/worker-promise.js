const amqp = require('amqplib');


const open = amqp.connect().then((c) => {
	return c.createChannel();
});

open.then((ch) => {
	const queueName = 'task-queue';
	const queueOptions = {
		durable: true
	}
	ch.assertQueue(queueName, queueOptions);
	ch.prefetch(1);

	/*
		Set the prefetch count for this channel. 
		The count given is the maximum number of 
		messages sent over the channel that can be 
		awaiting acknowledgement; once there are 
		count messages outstanding, the server will 
		not send more messages on this channel until 
		one or more have been acknowledged.
	*/
	console.log('[*] Waiting for messages in %s. To exit press ctrl + c', queueName);


	/*
	 * consume
	**/
	const consumeOptions = {
		noAck: false
	}

	ch.consume(queueName, (msg) => {
		const secs = msg.content.toString().split('.').length - 1;

		console.log('[x] Received %s', msg.content.toString());

		setTimeout(function () {
			console.log('[x] done');
			ch.ack(msg)
		}, secs * 1000);
	}, consumeOptions)
});

