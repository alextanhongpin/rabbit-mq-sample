
const amqp = require('amqplib');
const open = amqp.connect().then((c) => {
	return c.createChannel();
});

open.then((ch) => {
	console.log('*opened');
	ch.assertQueue('', { exclusive: true }).then((q) => {

		console.log('assertQueue', q)

		const corr = generateUuid();


		ch.consume(q.queue, (msg) => {

			console.log('msg', msg)
			if (msg.properties.correlationId === corr) {
          		console.log(' [.] Got %s', msg.content.toString());
          		setTimeout(() => {
          			ch.close();
          			process.exit(0)
          		}, 500);
			}
		}, { noAck: true })

		ch.sendToQueue('charge_credit', new Buffer('Hello from consumer'), {
			correlationId: corr,
			replyTo: q.queue
		});
	});	
});

function generateUuid() {
  return Math.random().toString() +
         Math.random().toString() +
         Math.random().toString();
}