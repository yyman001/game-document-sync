import { db } from '@/utils/DexieDB'
import { useObservable } from '@vueuse/rxjs'
import { liveQuery } from 'dexie'

export default function () {
  const onAddDoc = async (object: any) => {
    try {
      return await db.docsTable.add(object)
    } catch (error) {
      console.log('onAddDoc', error)
    }

    return null
  }

  const onUpdateDoc = async (object: any) => {
    try {
      // await db.docsTable.update(object)
    } catch (error) {
      console.log('onUpdateDoc', error)
    }

    return null
  }

  const onDelDoc = async (gameDocDir: string) => {
    try {
      // del success return undefined
      return await db.docsTable.delete(gameDocDir)
    } catch (error) {
      console.log('onDelDoc', error)
    }

    return null
  }

  const findGameDocs = async (gameDocDirList: any[]) => {
    return db.docsTable.filter((doc: any) => gameDocDirList.includes(doc.gameDocDir)).toArray()
  }

  const getGameDoc = async (gameDocDir: string) => {
    return db.docsTable.get(gameDocDir)
  }

  const hasGameDoc = async (keyword: string) => {
    // const regExp = new RegExp(keyword, 'i')
    const gameName = keyword.toLocaleLowerCase()
    return db.docsTable.filter((doc: any) => {
      return gameName === doc.gameName.toLocaleLowerCase() || gameName === doc.nickName.toLocaleLowerCase()
    }).toArray()
  }

  return {
    onAddDoc,
    onDelDoc,
    onUpdateDoc,
    getGameDoc,
    findGameDocs,
    hasGameDoc,
    result: useObservable(liveQuery(() => {
      return db.docsTable.toArray()
    }))
  }
}
