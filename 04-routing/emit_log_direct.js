const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', function (err, conn) {
  conn.createChannel(function (err, ch) {
    const ex = 'direct_logs'
    const args = process.argv.slice(2)
    const msg = args.slice(1).join(' ') || 'Hello World!'
    const severity = (args.length > 0) ? args[0] : 'info'

    ch.assertExchange(ex, 'direct', { durable: true })
    ch.publish(ex, severity, new Buffer(msg))
    console.log('[x] Sent %s: "%s"', severity, msg)
  })

  setTimeout(function () {
    conn.close()
    process.exit(0)
  }, 500)
})

