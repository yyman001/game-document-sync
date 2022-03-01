
const client = require('./client')
const filePath = './download.txt'

client.get('/upload.txt', filePath)
  .then((data) => {
    console.log('d:=>', data)
    if (data.res.status === 200) {
      console.log('download-success:', filePath)
    } else {
      console.log(`error:${data}`)
    }
  })
  .catch((e) =>
    console.log(`catch-error:${e}`)
  )
