const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', function (err, conn) {
  conn.createChannel(function (err, ch) {
    const ex = 'logs'

    ch.assertExchange(ex, 'fanout', { durable: true })

    ch.assertQueue('', { exclusive: true }, function (err, q) {
      console.log('[x] Waiting for messages in %s. To exit press CTRL + C', q.queue)

      ch.bindQueue(q.queue, ex, '')

      ch.consume(q.queue, function (msg) {
        console.log('[x] %s', msg.content.toString())
      }, { noAck: true })
    })
  })
})
