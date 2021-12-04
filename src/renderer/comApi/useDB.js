import 'dexie-export-import'
import { db } from '../utils/DexieDB'
import { readJson } from '../../utils/FileClass'
import { ref } from '@vue/composition-api'
const fs = require('fs-extra')
const toBuffer = require('blob-to-buffer')

function toBufferPromise (blob) {
  return new Promise((resolve, reject) => {
    toBuffer(blob, (err, buffer) => {
      if (err) {
        reject(err)
        return
      }
      resolve(buffer)
    })
  })
}

export function useDB () {
  let progress = ref(0)
  let isLoading = ref(false)
  const fileName = 'backupDatabase.json'

  function progressCallback ({ totalRows, completedRows }) {
    console.log(`Progress: ${completedRows} of ${totalRows} rows completed`)
  }

  async function saveDatabaseToJson () {
    if (isLoading.value) return
    isLoading.value = true

    try {
      const blob = await db.export({ prettyJson: true, progressCallback })
      const buffer = await toBufferPromise(blob)
      await fs.outputFile(fileName, buffer)
    } catch (error) {
      console.error(error)
    }

    isLoading.value = false
  }

  async function improtDatabaseByJson () {
    try {
      const file = await readJson(fileName)
      await db.import(file, { progressCallback })
    } catch (error) {
      console.error(error)
    }
  }

  return {
    progress,
    isLoading,
    saveDatabaseToJson,
    improtDatabaseByJson
  }
}
