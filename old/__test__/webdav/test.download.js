const webdav = require('webdav')
const { createClient } = webdav
const fs = require('fs-extra')
const url = 'https://dav.jianguoyun.com/dav/'
const client = createClient(url, {
  username: 'yyman001@qq.com',
  password: 'akuz6vqd5iccz67w'
})

async function demo () {
  const directoryItems = await client.getDirectoryContents('/', { deep: true })
  console.log('directoryItems:', directoryItems)
  const fileItems = await client.getDirectoryContents(directoryItems[0].filename)
  console.log('fileItems:', fileItems)
  // const str: string = await client.getFileContents("/config.json", { format: "text" })
  const fileBuffer = await client.getFileContents(fileItems[0].filename)
  const writeFileName = './test-download.pdf'
  await fs.writeFile(writeFileName, fileBuffer)
  console.log('download ok')
}

demo()
