const express = require('express');
const amqp = require('amqplib');
const amqpURL = 'amqp://localhost';

let io = require('socket.io');

const app = express();
var server = require('http').createServer(app);
app.use(express.static(__dirname));


const ex = {
	name: 'credit_charge',
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

	ch.assertExchange('credit_charge', 'direct', { autoDelete: false }).then((data) => {
		
		console.log('assertExchange', data)
		ch.assertQueue('charge', { autoDelete: false }).then((q) => {

			console.log('assertQueue', q)
			ch.bindQueue('charge', 'credit_charge')
			startServer(ch);
		});
	});
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

			ch.bindQueue(q.queue, 'credit_charge');
			ch.consume(q.queue, (msg) => {
				console.log('consume', msg)
				if (msg.properties.correlationId === 'verified') {
					ch.close()
					res.send('charged! Thanks');
				}
			}, { noAck: true });
			ch.sendToQueue('charge', new Buffer(JSON.stringify({ card: 'details'})), { 
				correlationId: 'verified', 
				replyTo: q.queue 
			});

		});
	});
	server.listen(8002);
	console.log('listening to port *:8002')
}

// Binding keys
// *.orange.* 
// - quick.orange.rabbit
// - quick.orange.fox

// *.*.rabbit
// lazy.#

// - quick.orange.rabbit
// - lazy.orange.elephant
// - lazy.brownfox

// Will "*" binding catch a message sent with an empty routing key?
// Will "#.*" catch a message with a string ".." as a key? Will it catch a message with a single word key?
// How different is "a.*.#" from "a.#"?