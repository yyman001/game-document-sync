
const client = require('./client')

async function list () {
  // 不带任何参数，默认最多返回100个文件。
  let result = await client.list()
  console.log(result)
  const txf = tarnslateData(result.objects)
  console.log('=======转换后======')
  console.log(txf)
}

list()

function tarnslateData (list) {
  return list.map(({name, url, lastModified, size, etag}) => {
    const isDirectory = name.endsWith('/')
    // 移除最后面的/
    const filename = name.replace(/\/$/ig, '')
    // 根据 / 分割 获取到最后的文件名
    const file = name.split('/').slice(-1).pop()

    return {
      filename: `/${filename}`,
      // 文件夹: 直接文件夹名称不带后缀
      // 文件: 文件名带后缀(除非文件没有后缀)
      basename: isDirectory ? filename : file,
      lastmod: lastModified,
      size,
      type: isDirectory ? 'directory' : 'file',
      etag: null
    }
  })
}

function getDirectorys (list) {
  return list.filter(x => x.type === 'directory')
}

function getFiles (list) {
  return list.filter(x => x.type === 'file')
}
