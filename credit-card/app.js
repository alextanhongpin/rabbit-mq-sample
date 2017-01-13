const express = require('express');
const amqp = require('amqplib');
const amqpURL = 'amqp://localhost';

let io = require('socket.io');

const app = express();
var server = require('http').createServer(app);
app.use(express.static(__dirname));


const ex = {
	name: 'credit_exchange',
	type: 'direct',
	options: {
		autoDelete: false
	}
}

const qu = {
	name: 'charge',
	options: {
		autoDelete: false,
		exclusive: true
	}
}

const open = amqp.connect().then((c) => {
	return c.createChannel();
});

open.then((ch) => {
	startServer(ch);
});
/*
 * 1. Exchange: What you publish to.
 * 2. Queue: What you consume from
 * 3. Binding: bind exchange to queue
 * 4. Publish: The exchange you want to target
 *
**/

function startServer(ch) {


	app.get('/credit_charge', (req, res) => {
		ch.assertQueue('', qu.options).then((q) => {
			ch.consume(q.queue, (msg) => {
				console.log('consume', msg)
				if (msg.properties.correlationId === 'verified') {
					res.send('charged! Thanks');
				}
			}, { noAck: true });
			ch.sendToQueue('charge_queue', new Buffer(JSON.stringify({ card: 'details'})), { 
				correlationId: 'verified', 
				replyTo: q.queue 
			});

		});
	});
	server.listen(8002);

}