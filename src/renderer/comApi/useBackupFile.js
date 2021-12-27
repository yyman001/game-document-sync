const { copy, ensureDir, remove } = require('../../utils/FileClass').default
const { compressDir, unCompress } = require('../../utils/compressClass').default
const path = require('path')
const fs = require('fs-extra')

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

  const restoreFile = async (backPatch, docPatch) => {
    const fileIsExists = await fs.pathExists(backPatch)
    if (!fileIsExists) {
      return [true, '还原文件不存在!']
    }

    const isRestore = await unCompress(backPatch, docPatch)
    // TODO: 检查一次还原后的文件是否正真存在
    const message = isRestore ? '还原成功!' : '还原失败!'
    return [false, message]
  }

  return {
    backupFile,
    restoreFile
  }
}
