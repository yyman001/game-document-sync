
import { db } from '../utils/DexieDB'
import { useObservable } from '@vueuse/rxjs'
import { liveQuery } from 'dexie'

export default function () {
  // backupTable
  const addBackup = async (object) => {
    try {
      return await db.backupTable.add(object)
    } catch (error) {
      return null
    }
  }

  const updateBackup = async (object) => {
    try {
      // return await db.backupTable.update(object)
    } catch (error) {
      return null
    }
  }

  const delBackup = async (gameName) => {
    try {
      return await db.backupTable.delete(gameName)
    } catch (error) {
      console.error(error)
      return null
    }
  }

  return {
    addBackup,
    updateBackup,
    delBackup,
    result: useObservable(
      liveQuery(() => {
        return db.backupTable.toArray()
      })
    )
  }
}
