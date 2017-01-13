const amqp = require('amqplib/callback_api')

ampq.connect('amqp://localhost', function (err, conn) {
  conn.createChannel(function (err, ch) {
    const q = 'task_queue'

    ch.assertQueue(q, { durable: true })
    ch.prefetch(1)

    console.log('[*] Waiting for messages in $s. To exit press ctrl + c', q)

    ch.consume(q, function (msg) {
      const secs = msg.content.toString().split('.').length - 1

      console.log('[x] Received %s', msg.content.toString())

      setTimeout(function () {
        console.log('[x] done')

        ch.ack(msg)
      }, secs * 1000)
    }, { noAck: false })
  })
})
