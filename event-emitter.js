var EventEmitter = require('events').EventEmitter

var emitter = new EventEmitter()

emitter.on('hello', function() {  
  console.log('hello')
})

console.log('before hello')

emitter.emit('hello')

console.log('after hello')