const http = require('http')
const amqp = require('amqplib')

const exchangeName = 'my-first-exchange'
const exchangeType = 'direct'
const exchangeOptions = {
  autoDelete: false //  if true, the exchange will be destroyed once the number of bindings for which it is the source drop to zero. Defaults to false.
}

const queueName = 'first-queue'

amqp.connect('amqp://localhost').then((conn) => {
  return conn.createChannel()
}).then((channel) => {
	// return ch.assertQueue(q)
  return channel.assertExchange(exchangeName, exchangeType, exchangeOptions).then((ok) => {
    console.log('ok', ok)
    return startServer(channel)
  })
}).catch(console.warn)

function startServer (channel) {
  const promise = new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      console.log(req.url)
			/*
			 * Publish
			**/
      resolve(channel.publish(exchangeName, queueName /* send to specific queue */, new Buffer(req.url)))
      res.writeHead(200, { 'Content-Type': 'text/html'})
      res.end('<h1>Simple HTTP Server in node.js</h1>')
    })
    server.listen(8001)
  })
  return promise
}
