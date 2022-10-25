import { BackupItem, GameDocItem, GameItem } from '@/model'
import Dexie from 'dexie'
export class electronGames extends Dexie {
  backupTable!: Dexie.Table<BackupItem>
  docsTable!: Dexie.Table<GameDocItem>
  gamesTable!: Dexie.Table<GameItem>

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
