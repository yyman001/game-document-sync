import { db } from '../utils/DexieDB'
import { useObservable } from '@vueuse/rxjs'
import { liveQuery } from 'dexie'

export default function useGames () {
  const addGame = async (object) => {
    try {
      return await db.gamesTable.add(object)
    } catch (error) {
      return null
    }
  }

  const updateGame = async (object) => {
    try {
      // return await db.gamesTable.update(object)
    } catch (error) {
      return null
    }
  }

  const delGame = async (gameName) => {
    try {
      return await db.gamesTable.delete(gameName)
    } catch (error) {
      return null
    }
  }

  return {
    addGame,
    updateGame,
    delGame,
    gameList: useObservable(
      liveQuery(() => {
        return db.gamesTable.toArray()
      })
    )
  }
}
