// 数据库关系图: https://dbdiagram.io/d/60c7496c0c1ff875fcd4bb3c
import Dexie from 'dexie'
export const db = new Dexie('electronGames')

db.version(1).stores({
  backup: '++id, steam_id, game_name, nick_name, game_doc_dir',
  docs: 'game_doc_dir, steam_id, game_name, nick_name, game_doc_dir',
  gamesInfo: 'game_doc_dir, steam_id, game_name, nick_name, game_doc_dir, system_type',
  steamApp: 'steam_id, game_name'
})
