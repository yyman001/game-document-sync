const PandaDB = require('panda-db')

const db = new PandaDB({
  name: 'test-dabase',
  dir: './database'
})

// add
db.set('test1', {name: 'test1'})
db.set('test2', {name: 'test2'})

// select
console.log('select "test2":', db.get('test2'))

// update
setTimeout(() => {
  db.set('test1', {name: 'update'})
}, 1000)

// get all keys
console.log('get all keys:', db.keys)
// get list
console.log('get list:', db.keys.map(k => db.get(k)))
// del
db.delete('test2')
