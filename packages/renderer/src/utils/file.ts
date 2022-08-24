import { copy, ensureDir, remove } from '@/utils/FileClass'
import { compressDir, unCompress } from '@/utils/compressClass'
import path from 'path'
const fs = require('fs-extra')

/**
 * 备份文件
 * @param param0
 * @returns
 */
export const backupFile = async ({
  HOME_DIR,
  docPatch,
  tempPatch,
  backPatch,
  gameDocDir,
  saveFiles
}: any) => {
  let error
  if (Array.isArray(saveFiles) && saveFiles.length) {
    ;[error] = await copy(docPatch, tempPatch, (input: string) => {
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

/**
 * 还原备份
 *
 * @param backPatch
 * @param docPatch
 * @returns
 */
export const restoreFile = async (backPatch: string, docPatch: string) => {
  const fileIsExists = await fs.pathExists(backPatch)
  if (!fileIsExists) {
    return [true, '还原文件不存在!']
  }

  const isRestore = await unCompress(backPatch, docPatch)
  // TODO: 检查一次还原后的文件是否正真存在
  const message = isRestore ? '还原成功!' : '还原失败!'
  return [false, message]
}

/**
 * 自定义还原备份文件
 *
 * @param homedir
 * @param backPatch
 * @param gameItem
 * @returns
 */
export const customRestoreFile = async (homedir: string, backPatch:string, gameItem: any) => {
  const { gameDocPath, gameDocDir } = gameItem
  if (backPatch.indexOf(gameDocDir) === -1) throw new Error('无效文件!')
  const docPath = path.join(homedir, gameDocPath.replace(gameDocDir, ''))
  return restoreFile(backPatch, docPath)
}
