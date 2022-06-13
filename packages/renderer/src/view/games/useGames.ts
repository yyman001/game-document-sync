import { db } from '@/utils/DexieDB'
import { useObservable } from '@vueuse/rxjs'
import { liveQuery } from 'dexie'

export default function useGames () {
  const addGame = async (object:any) => {
    try {
      return await db.gamesTable.add(object)
    } catch (error) {
      return null
    }
  }

  const updateGame = async (object:any) => {
    try {
      // return await db.gamesTable.update(object)
    } catch (error) {
      return null
    }
  }

  const delGame = async (gameName:string) => {
    try {
      return await db.gamesTable.delete(gameName)
    } catch (error) {
      return null
    }
  }

  const searchGame = (gameDocDir:string) => {
    return db.gamesTable.get(gameDocDir)
  }

  return {
    addGame,
    updateGame,
    delGame,
    searchGame,
    gameList: useObservable(
      liveQuery(() => {
        return db.gamesTable.toArray()
      })
    )
  }
}
