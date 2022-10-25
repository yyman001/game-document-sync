import { copy, ensureDir, remove } from '@/utils/FileClass'
import { compressDir, unCompress } from '@/utils/compressClass'
import { getPath } from '@/utils/index'
const fs = require('fs-extra')

export type BackupFileData =
  | [unknown, null]
  | [
      null,
      {
        message: string
        platform: string
        timeStamp: string|number
        fileName: string
        savePath: string
        entryPath: string
        outPath: string
        type: string
      }
    ]

/**
 * 备份文件
 * @param param0
 * @returns
 */
export const backupFile = async ({ docPath, tempPath, backPath, gameDocDir, saveFiles }: any): Promise<BackupFileData> => {
  let error
  if (Array.isArray(saveFiles) && saveFiles.length) {
    ;[error] = await copy(docPath, tempPath, (input: string) => {
      // 不勾选文件夹的情况下需要对文件夹路径返回真才可以继续后面的copy
      if (fs.lstatSync(input).isDirectory()) {
        return true
      }
      return saveFiles.includes(input)
    })
  }

  if (error) return [error, null]
  // 检查存档目录是否存在
  await ensureDir(backPath)
  const platform = 'zip'
  const timeStamp = Date.now()
  const fileName = `${gameDocDir}_t${timeStamp}`
  // 保存文件路径
  const savePath = getPath(backPath, fileName)
  // 压缩存档
  const [compressError, compressData] = await compressDir(tempPath, savePath, platform)

  if (compressError) return [compressError, null]
  await remove(tempPath)

  return [null, { message: '备份成功!', platform, timeStamp, fileName, savePath, ...compressData }] as BackupFileData
}

/**
 * 还原备份
 *
 * @param backPath
 * @param docPath
 * @returns
 */
export const restoreFile = async (backPath: string, docPath: string) => {
  const fileIsExists = await fs.pathExists(backPath)
  if (!fileIsExists) {
    return [true, '还原文件不存在!']
  }

  const isRestore = await unCompress(backPath, docPath)
  // TODO: 检查一次还原后的文件是否正真存在
  const message = isRestore ? '还原成功!' : '还原失败!'
  return [false, message]
}

/**
 * 自定义还原备份文件
 *
 * @param homedir
 * @param backPath
 * @param gameItem
 * @returns
 */
export const customRestoreFile = async (homedir: string, backPath: string, gameItem: any) => {
  const { gameDocPath, gameDocDir } = gameItem
  if (backPath.indexOf(gameDocDir) === -1) throw new Error('无效文件!')
  const docPath = getPath(homedir, gameDocPath.replace(gameDocDir, ''))
  return restoreFile(backPath, docPath)
}
