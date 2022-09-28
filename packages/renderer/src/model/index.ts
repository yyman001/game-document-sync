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
