import Dexie from 'dexie'

export interface IBackupTable {
  fileType: string
  fileName: string
  steamId?: string
  gameName: string
  nickName: string
  gameDocDir: string
}

export interface IDocsTable {
  gameDocDir: string
  steamId?: string
  gameName: string
  nickName: string
}

export interface IGamesTable {
  gameDocDir: string
  steamId?: string
  gameName: string
  nickName: string
  systemType: string
}

export class electronGames extends Dexie {
  backupTable!: Dexie.Table<IBackupTable>
  docsTable!: Dexie.Table<IDocsTable>
  gamesTable!: Dexie.Table<IGamesTable>

  constructor () {
    super('electronGames')
    //
    // Define tables and indexes
    // (Here's where the implicit table props are dynamically created)
    //
    this.version(1).stores({
      backupTable: 'fileName, steamId, gameName, nickName, gameDocDir, fileType',
      docsTable: 'gameDocDir, steamId, gameName, nickName',
      gamesTable: 'gameDocDir, steamId, gameName, nickName, systemType'
    })
  }
}
