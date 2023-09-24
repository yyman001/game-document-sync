import { message } from 'ant-design-vue'
import { collection, getDocs, deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore'
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

const queryGamesDocs = async () => {
  await getDocs(collection(firebaseDB, GAME_DOCS_TABLE))
}

// 游戏表
const addGame = async (data: GameItem) => {
  try {
    await setDoc(doc(firebaseDB, GAMES_TABLE, data.gameDocDir), data)
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}

const updateGame = async (data: GameItem) => {
  try {
    await updateDoc(doc(firebaseDB, GAMES_TABLE, data.gameDocDir), data as Record<string, any>)
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

export {
  addGamesDoc,
  updateGamesDoc,
  removeGamesDoc,
  queryGamesDocs,

  addGame,
  updateGame,
  removeGame
}
