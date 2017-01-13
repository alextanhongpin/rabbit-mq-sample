const amqp = require('amqplib')

const open = amqp.connect().then((c) => {
  return c.createChannel()
})

open.then((ch) => {
  const queueName = 'task-queue'
  const queueOptions = {
    durable: true
  }

  const msg = process.argv.slice(2).join(' ') || 'hello world'
	/*
	 * 1. Assert a queue into existence
	**/
  ch.assertQueue(queueName, queueOptions)
	/*
	 * 2. Send to a queue to be consumed
	**/
  ch.sendToQueue(queueName, new Buffer(msg), { persistent: true })
  console.log("[x] Sent '%s'", msg)

  setTimeout(function () {
    ch.close()
    process.exit(0)
  }, 500)
})

