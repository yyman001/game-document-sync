const { copy, ensureDir, remove } = require('../../utils/FileClass').default
const { compressDir } = require('../../utils/compressClass').default
const path = require('path')

export default function () {
  const backupFile = async ({docPatch, tempPatch, backPatch, gameDocDir}) => {
    const [error] = await copy(docPatch, tempPatch)
    if (error) return [error, null]
    // 检查存档目录是否存在
    await ensureDir(backPatch)
    const platform = 'zip'
    const timeStamp = Date.now()
    const fileName = `${gameDocDir}_t${timeStamp}`
    // 保存文件路径
    const savePath = path.join(backPatch, fileName)
    // 压缩存档
    const [compressError, compressData] = await compressDir(tempPatch, savePath, platform)

    if (compressError) return [compressError, null]
    await remove(tempPatch)

    return [null, { message: '备份成功!', platform, timeStamp, fileName, savePath, ...compressData }]
  }

  return {
    backupFile
  }
}
