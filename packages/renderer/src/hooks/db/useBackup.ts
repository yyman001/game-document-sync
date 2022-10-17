
import { db } from '@/utils/DexieDB'
import { useObservable, from } from '@vueuse/rxjs'
import { liveQuery } from 'dexie'

export default function () {
  // backupTable
  const addBackup = async (object:any) => {
    try {
      return await db.backupTable.add(object)
    } catch (error) {
      return null
    }
  }

  const updateBackup = async (object:any) => {
    try {
      // return await db.backupTable.update(object)
    } catch (error) {
      return null
    }
  }

  const delBackup = async (id:any) => {
    try {
      return await db.backupTable.delete(id)
    } catch (error) {
      console.error(error)
      return null
    }
  }

  const addBackupList = async (list:any) => {
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
      from(
        liveQuery(() => {
          return db.backupTable.toArray()
        })
      )
    )
  }
}
