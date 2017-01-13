const amqp = require('amqplib');

const exchangeName = 'my-first-exchange';
const exchangeType = 'direct';

const queueName = 'first-queue-name';
const queueOptions = {
	autoDelete: false // if true, the queue will be deleted when the number of consumers drops to zero (defaults to false)
}
const routingKey = 'first-queue';

amqp.connect('amqp://localhost').then((conn) => {
	return conn.createChannel();
}).then((channel) => {
	channel.assertExchange(exchangeName, exchangeType);
	channel.assertQueue(queueName, queueOptions).then((q) => {
		channel.bindQueue(q.queue, exchangeName, routingKey);
		return channel.consume(q.queue, (message) => {
			if (message !== null) {
				console.log(message.content.toString());
				channel.ack(message);
			}
		});
	});
});