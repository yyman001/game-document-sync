import useConfig from './useConfig'
const { copy, ensureDir, remove } = require('../../utils/FileClass').default
const { compressDir, unCompress } = require('../../utils/compressClass').default
const path = require('path')
const fs = require('fs-extra')

export default function () {
  const { homedir } = useConfig()

  const backupFile = async ({docPatch, tempPatch, backPatch, gameDocDir, saveFiles}) => {
    let error
    if (Array.isArray(saveFiles) && saveFiles.length) {
      [error] = await copy(docPatch, tempPatch, (input) => {
        // 不勾选文件夹的情况下需要对文件夹路径返回真才可以继续后面的copy
        if (fs.lstatSync(input).isDirectory()) {
          return true
        }
        return saveFiles.includes(input)
      })
    }

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

  const customRestoreFile = async (backPatch, gameItem) => {
    const { gameDocPath, gameDocDir } = gameItem
    if (backPatch.indexOf(gameDocDir) === -1) throw new Error('无效文件!')
    const docPath = path.join(homedir.value, gameDocPath.replace(gameDocDir, ''))
    return restoreFile(backPatch, docPath)
  }

  return {
    backupFile,
    restoreFile,
    customRestoreFile
  }
}
