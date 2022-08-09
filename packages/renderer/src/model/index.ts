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

export interface FileItem {
  basename: string
  dirname: string
  fileType: string
  path: string
  size: number
  timeStamp: number
  type: 'directory' | 'file'
  comparsedName?: string
}

export interface WebDavFile {
  basename: string
  comparsedName: string
  etag: string
  filename: string
  lastmod: string
  mime: string
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
  type: string;
  url: string;
  usearname: string;
  password: string;
  rootDirectoryName?: string;
  accessKeyId?: string;
  accessKeySecret?: string;
  bucket?: string;
}
