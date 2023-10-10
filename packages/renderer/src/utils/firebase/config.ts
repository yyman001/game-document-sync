// api doc: https://firebase.google.com/docs/firestore/
import { initializeApp } from 'firebase/app'
import {
  collection,
  initializeFirestore, persistentLocalCache
} from 'firebase/firestore'

const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyB14w-ylNI_RCW0-jp9crYfaC3TZs9ap2E',
  authDomain: 'game-docs-93e1c.firebaseapp.com',
  projectId: 'game-docs-93e1c',
  storageBucket: 'game-docs-93e1c.appspot.com',
  messagingSenderId: '161289537907',
  appId: '1:161289537907:web:9b6ca4c144aa9696fb5d06',
  measurementId: 'G-ZGCQMZW7GJ'
}

const firebaseApp = initializeApp(FIREBASE_CONFIG)
const firebaseDB = initializeFirestore(firebaseApp, {
  localCache: persistentLocalCache()
})

const GAME_DOCS_TABLE = 'gamesDocTable'
const GAMES_TABLE = 'gamesTable'
const GAME_PLAYTIME_TABLE = 'gamePlayTimeTable'

export {
  GAMES_TABLE,
  GAME_DOCS_TABLE,
  GAME_PLAYTIME_TABLE,
  FIREBASE_CONFIG,
  firebaseApp,
  firebaseDB
}
