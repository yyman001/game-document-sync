import { message } from 'ant-design-vue'
import { deleteDoc, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore'
import {
  firebaseDB,
  GAMES_TABLE,
  GAME_DOCS_TABLE
} from '@/utils/firebase/config'
import { GameDocItem, GameItem } from '@/model'

const addGamesDoc = async (data: GameDocItem) => {
  try {
    await setDoc(doc(firebaseDB, GAME_DOCS_TABLE, data.gameDocDir), data)
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}

const updateGamesDoc = async (data: GameDocItem) => {
  try {
    await updateDoc(doc(firebaseDB, GAME_DOCS_TABLE, data.gameDocDir), data as Record<string, any>)
  } catch (e) {
    console.error('Error updating document: ', e)
  }
}

const removeGamesDoc = async (gameDocDir: string) => {
  try {
    await deleteDoc(doc(firebaseDB, GAME_DOCS_TABLE, gameDocDir))
    message.success('删除成功!')
  } catch (error) {
    message.error('删除失败!')
  }
}

// 游戏表
const addGame = async (data: GameItem) => {
  try {
    return await setDoc(doc(firebaseDB, GAMES_TABLE, data.gameDocDir), data)
  } catch (e) {
    console.error('Error adding document: ', e)
    return null
  }
}

const updateGame = async (data: GameItem) => {
  try {
    await updateDoc(doc(firebaseDB, GAMES_TABLE, data.gameDocDir), data as Record<string, any>)
  } catch (e) {
    console.error('Error updating document: ', e)
  }
}

const updateGameFiled = async (gameDocDir: string, updateData:GameItem | Record<string, any>) => {
  try {
    await updateDoc(doc(firebaseDB, GAMES_TABLE, gameDocDir), updateData)
  } catch (e) {
    console.error('Error updating document: ', e)
  }
}

const removeGame = async (gameDocDir: string) => {
  try {
    await deleteDoc(doc(firebaseDB, GAMES_TABLE, gameDocDir))
    message.success('删除成功!')
  } catch (error) {
    message.error('删除失败!')
  }
}

const hasGame = async (gameDocDir: string) => {
  return (await getDoc(doc(firebaseDB, GAMES_TABLE, gameDocDir))).exists()
}

export {
  addGamesDoc,
  updateGamesDoc,
  removeGamesDoc,

  addGame,
  updateGame,
  updateGameFiled,
  removeGame,
  hasGame
}
