const amqp = require('amqplib')

const open = amqp.connect().then((c) => {
  return c.createChannel()
})

const args = process.argv.slice(2)

if (args.length == 0) {
  console.log('Usage: receive_logs_direct.js [info] [warning] [error]')
  process.exit(1)
}

open.then((ch) => {
  const exchangeName = 'direct_logs'
  const exchangeType = 'direct'
  const exchangeOptions = {
    durable: true
  }

  const queueName = ''
  const queueOptions = {
    exclusive: true
  }

  ch.assertExchange(exchangeName, exchangeType, exchangeOptions)

  ch.assertQueue(queueName, queueOptions, (err, q) => {
    console.log('[*] Waiting for logs. To exit press CTRL + C')

    args.forEach((severity) => {
      ch.bindQueue(q.queue, exchangeName, severity)
    })

    ch.consume(q.queue, function (msg) {
      console.log(' [x] %s: %s', msg.fields.routingKey, msg.content.toString())
    }, { noAck: true })
  })
})

