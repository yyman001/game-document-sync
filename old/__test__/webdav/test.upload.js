const webdav = require('webdav')
const { createClient } = webdav
const fs = require('fs-extra')
const url = 'https://dav.jianguoyun.com/dav/'
const client = createClient(url, {
  username: 'yyman001@qq.com',
  password: 'akuz6vqd5iccz67w'
})

const isOverwrite = false
const uploadFileName = './test.txt'
const saveDir = '/games_doc_sync'
const saveFileName = 'upload-test.txt'

async function checkDir (path) {
  if (await client.exists(path) === false) {
    await client.createDirectory(path)
    console.log('目录不存在,创建', path)
  }
  console.log('目录已存在')
}

async function upload () {
  const fileBuffer = await fs.readFile(uploadFileName)
  console.log('fileBuffer', fileBuffer)
  await checkDir(saveDir)
  await client.putFileContents(`${saveDir}/${saveFileName}`, fileBuffer, {
    overwrite: isOverwrite
  })
  console.log('upload ok')
}

upload()
