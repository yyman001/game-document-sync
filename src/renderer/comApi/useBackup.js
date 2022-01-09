
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

  const delBackup = async (id) => {
    try {
      return await db.backupTable.delete(id)
    } catch (error) {
      console.error(error)
      return null
    }
  }

  const addBackupList = async (list) => {
    try {
      return await db.backupTable.bulkPut(list)
    } catch (error) {
      return null
    }
  }

  return {
    addBackup,
    updateBackup,
    delBackup,
    addBackupList,
    result: useObservable(
      liveQuery(() => {
        return db.backupTable.toArray()
      })
    )
  }
}
