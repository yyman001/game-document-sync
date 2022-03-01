
const client = require('./client')
const path = require('path')
const file = path.join('./test.txt')

client.put('/upload.txt', file)
  .then((data) => {
    if (data.res.status === 200) {
      console.log('upload-success:', data.name, data.url)
    } else {
      console.log(`error:${data}`)
    }
  })
  .catch((e) =>
    console.log(`catch-error:${e}`)
  )
