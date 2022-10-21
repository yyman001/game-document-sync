export interface GameItem {
  createTime: number
  gameDocDir: string
  gameDocPath: string
  gameName: string
  gamePlatform: any[]
  lastBackTime: number
  nickName: string
  steamId: string
  systemType: string
  pathType: string
}

export interface GameDocItem {
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
  timeStamp: number
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
  // 创建
  getClient () :void
  // 销毁
  destroy () :void
  // 上传
  uploadFile () :boolean
  // 下载
  downloadFile () :boolean
}

export interface LocalFile {
  // 文件名
  // : "Aragami_t1641735966693.zip"
  basename: string;
  // 文件夹名称
  // Aragami
  dirname: string;
  // 文件绝对路径
  // "C:\\my_git_project\\game-document-sync\\backup\\Aragami\\Aragami_t1641735966693.zip",
  path: string;
  // 文件大小(字节)
  size: number;
  // 时间戳
  timeStamp: number;
  // 文件类型
  type: 'file' | 'directory';
}

export interface LocalFileFormat extends LocalFile {
  // 用于比较同步文名标识: = 本地文件名: 格式规范 = (文件夹/文件名) = Aragami/Aragami_t1641735966693.zip
  comparsedName: string;
}
