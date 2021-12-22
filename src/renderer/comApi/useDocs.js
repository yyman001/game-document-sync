import { db } from '../utils/DexieDB'
import { useObservable } from '@vueuse/rxjs'
import { liveQuery } from 'dexie'

export default function () {
  const onAddDoc = async (object) => {
    try {
      return await db.docsTable.add(object)
    } catch (error) {
      console.log('onAddDoc', error)
    }

    return null
  }

  const onUpdateDoc = async (object) => {
    try {
      // await db.docsTable.update(object)
    } catch (error) {
      console.log('onUpdateDoc', error)
    }

    return null
  }

  const onDelDoc = async (gameDocDir) => {
    try {
      // del success return undefined
      return await db.docsTable.delete(gameDocDir)
    } catch (error) {
      console.log('onDelDoc', error)
    }

    return null
  }

  return {
    onAddDoc,
    onDelDoc,
    onUpdateDoc,
    result: useObservable(liveQuery(() => {
      return db.docsTable.toArray()
    }))
  }
}
