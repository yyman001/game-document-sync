import { FieldValue } from 'firebase/firestore'
import { BufferLike, GetFileContentsOptions } from 'webdav'

export interface BackupItem {
  /*
    fileName: "Aragami_t1651668926252"
    filePath: "E:\\git\\game-document-sync\\backup\\Aragami\\Aragami_t1651668926252.zip"
    fileType: "zip"
    gameDocDir: "Aragami"
    gameDocPath: "\\AppData\\LocalLow\\Lince Works\\Aragami"
    gameName: "Aragami"
    platformTye: "Windows_NT"
    remask: ""
    steamId: "280160"
    timeStamp: 1651668926252
  */
  fileName: string
  filePath: string
  fileType: string
  gameDocDir: string
  gameDocPath: string
  gameName: string
  platformTye: string
  timeStamp: number
  remask?: string
  steamId?: string
}

export interface GameItem {
  /*
    gameAppPath: "D:\\games\\Blasphemous 2\\Blasphemous 2.exe"
    createTime: 1627979168366
    gameDocDir: "Aragami"
    gameDocPath: "\\AppData\\LocalLow\\Lince Works\\Aragami"
    gameName: "Aragami"
    gamePlatform: []
    lastBackTime: 1631010065840
    nickName: "荒神"
    steamId: "280160"
    systemType: "Windows"
  */
  gameAppPath: string | null// 应用的路径
  createTime: number
  gameDocDir: string
  gameDocPath: string
  gameName: string
  gamePlatform: string | any[] | null // todo: 后期改为 string, 类型为 free(破解版), steam, epic, gog, 其他...未知
  lastRestoreTime?: number // 最近还原时间
  lastBackTime?: number // 最后备份时间
  lastRunTime?: number // 最后运行时间
  playtime?: number // 记录运行时长
  nickName: string
  steamId: string | null
  systemType: string
  pathType?: string
  createdAt?: FieldValue
}

export interface GameDocItem {
  /*
    gameDocDir: "Darksiders3"
    gameDocPath: "\\AppData\\Local\\Darksiders3"
    gameName: "Darksiders3"
    nickName: "暗黑血统III"
    steamId: "606280"
    systemType: "Windows"
  */
  pathType?: string
  steamId?: string
  gameDocDir: string
  gameDocPath: string
  gameName: string
  nickName: string
  systemType: string
}

export interface FileItem {
  basename: string
  dirname: string
  fileType: string
  path: string
  size: number
  // 创建时间
  ctimeStamp?: string | number
  // 修改时间
  timeStamp: string | number
  type: 'directory' | 'file'
  comparsedName: string
}

export interface WebDavFile {
  // "Terraria_t1646059713386.zip"
  basename: string
  // "Terraria/Terraria_t1646059713386.zip"
  comparsedName: string
  // "pv25HsbR5U2ntsjUNbL6gQ"
  etag: string
  // "/games_doc_sync/Terraria/Terraria_t1646059713386.zip"
  filename: string
  // "Mon, 28 Feb 2022 14:51:29 GMT"
  lastmod: string
  // "application/zip"
  mime: string
  //  5283447
  size: number
  type: 'file'
}

export interface WebDavDirectory {
  basename: string
  etag: string
  filename: string
  lastmod: string
  size: number
  type: 'directory'
}

export interface SdkConfig {
  type: string
  url: string
  usearname: string
  password: string
  rootDirectoryName?: string
  accessKeyId?: string
  accessKeySecret?: string
  bucket?: string
}

/* 上传下载sdk接口规范 */
export interface SDK {
  [x: string]: any
  // 创建
  getClient(): void
  // 销毁
  destroy(): void
  // 上传
  uploadFile(
    filePath: Buffer | string,
    gameDocDir: string,
    fileName: string,
    isOverwrite?: boolean,
    cb?: Function,
    progressFn?: Function
  ): Promise<boolean>
  // 下载
  downloadFile(coludFilename: string, writeFilePath: string, cb: Function): Promise<boolean>
}

export interface IWebDav extends SDK {
  getDirectoryContents(filename: string): Array<any>
  getFileContents(filename: string, options?: GetFileContentsOptions):Promise<BufferLike>
  getDirectoryStructure(): { directoryItems: any[]; fileItems: any[] }
  ensureDir(path: string): boolean
}

export interface LocalFile {
  // 文件名
  // : "Aragami_t1641735966693.zip"
  basename: string
  // 文件夹名称
  // Aragami
  dirname: string
  // 文件绝对路径
  // "C:\\my_git_project\\game-document-sync\\backup\\Aragami\\Aragami_t1641735966693.zip",
  path: string
  // 文件大小(字节)
  size: number
  // 时间戳
  timeStamp: number
  // 文件类型
  type: 'file' | 'directory'
}

export interface LocalFileFormat extends LocalFile {
  // 用于比较同步文名标识: = 本地文件名: 格式规范 = (文件夹/文件名) = Aragami/Aragami_t1641735966693.zip
  comparsedName: string
}
