# RabbitMQ

### Message Durability

When RabbitMQ quits or crashes it will forget the queues and messages.
To prevent loss of messages, we need to mark both the queue and messages as durable for both the consumer and producer code.

```javascript
// Durable queue
ch.assertQueue('hello', {durable: true})

// Persistent message
ch.sendToQueue(q, new Buffer(msg), { persistent: true })
```

### Fair Dispatch
A prefetch value of 1 tells RabbitMQ not to give more than one message to a worker at a time.
```javascript
ch.prefetch(1);
```

### Exclusive Queue

Sometimes, we want the queue to be automatically deleted (non-durable queue) once the consumer is disconnected.
```javascript
ch.assertExchange(ex, 'fanout', {durable: false})

ch.assertQueue('', {exclusive: true})
```
When the connection that declared it closes, the queue will be deleted because it is declared as exclusive.


Glossary
1. Exchange: What you publish to.
2. Queue: A buffer that stores messages. What you consume from.
3. Binding: Bind exchange to queue.
4. Publish: The exchange you want to target.
5. Producer: A user application that sends messages.
6. Consumer: A user application that receives messages.

To keep it short, a `Producer` publishes a `Message` to an `Exchange`.
The `Exchange` is binded to a `Queue` through a `binding`.
The `Message` will be stored as buffer in the `Queue`.
A `Consumer` will than consume the `Message` from the `Queue`.

The `Exchange` has a name.
The `Consumer` and `Producer` should use the same `Exchange` name.


```
    const msg = 'Message in a bottle.';

    const channel = yield amqpConn().createConfirmChannel();

    // not recommended - sent to queue direct
    // const q = 'hello';
    // yield channel.assertQueue(q);
    // channel.sendToQueue(q, new Buffer(msg));

    // recommended - publish to exchange with routing key
    // dev code: exchange, queue and bind queue - preferred to do this in the devops code
    // yield channel.assertExchange('rocks', 'direct');
    // yield channel.assertQueue('rockqueue');
    // yield channel.bindQueue('rockqueue', 'rocks', 'thrower');
    // publish to and exchange with a routing key
    channel.publish('rocks', 'thrower', new Buffer(msg));

    yield channel.waitForConfirms();
    channel.close();

    return `Sent ${msg}`;

  }).catch(err => {
    return `Error: ${err}`;
  });

``