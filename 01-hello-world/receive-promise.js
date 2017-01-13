const amqp = require('amqplib')

const open = amqp.connect().then((c) => {
  return c.createChannel()
})

open.then((ch) => {
  const queueName = 'hello'
  const queueOptions = { durable: false }

	/*
	 * 1. Assert a queue into existence
	**/
  ch.assertQueue(queueName, queueOptions)
  console.log('[*] Waiting for messages in %s. To exit press CTRL + C', queueName)

  const consumeOptions = {
		// consumerTag: (string): a name which the server will use to distinguish message deliveries for the consumer; mustn't be already in use on the channel. It's usually easier to omit this, in which case the server will create a random name and supply it in the reply.
		// noLocal: (boolean): in theory, if true then the broker won't deliver messages to the consumer if they were also published on this connection; RabbitMQ doesn't implement it though, and will ignore it. Defaults to false.
		// noAck (boolean): if true, the broker won't expect an acknowledgement of messages delivered to this consumer; i.e., it will dequeue messages as soon as they've been sent down the wire. Defaults to false (i.e., you will be expected to acknowledge messages).
		// exclusive: (boolean): if true, the broker won't let anyone else consume from this queue; if there already is a consumer, there goes your channel (so usually only useful if you've made a 'private' queue by letting the server choose its name).
		// priority: (integer): gives a priority to the consumer; higher priority consumers get messages in preference to lower priority consumers.
		// arguments (object): arbitrary arguments. Go to town.
    noAck: true
  }

	/*
	 * 2. Set up a consumer with a callback to be invoked with each message.
	**/
  ch.consume(queueName, (msg) => {
    console.log('[*] Received %s', msg.content.toString())
  }, consumeOptions)


  // ch.sendToQueue(queueName, new Buffer('hello world'))
})

