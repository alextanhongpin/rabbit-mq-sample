const amqp = require('amqplib')
process.env.AMQP_URI = 'amqp://localhost'

const ok = amqp.connect(process.env.AMQP_URI).then((conn) => {
  return conn.createChannel()
})

return ok

// From another file
// const channel  = await Channel()

// #publish(exchange, routingKey, content, [options])
// options.expiration {String}
// options.userId {String}
// options.CC {String, [String]} 
// options.priority {String}
// options.mandatory {Boolean}
// options.contentType  {String}
// options.contentEncoding {String}
// options.headers {Object}
// options.correlationId {String}
// options.replyTo {String}
// options.messageId {String}
// options.timestamp {Number}
// options.type {String}
// options.appId {String}

// #consume(queue, function(msg) {...}, options)
// options.consumerTag {String} 
// options.noLocal = 