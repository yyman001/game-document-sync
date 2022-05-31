// 数据库关系图: https://dbdiagram.io/d/60c7496c0c1ff875fcd4bb3c
import Dexie from 'dexie'
export const db = new Dexie('electronGames')

db.version(1).stores({
  backupTable: 'fileName, steamId, gameName, nickName, gameDocDir, fileType',
  docsTable: 'gameDocDir, steamId, gameName, nickName',
  gamesTable: 'gameDocDir, steamId, gameName, nickName, systemType',
  steamApp: 'appid, name'
})

db.open().catch(function (err) {
  console.error(err.stack || err)
})
