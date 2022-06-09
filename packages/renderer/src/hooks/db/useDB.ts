import 'dexie-export-import'
import { db } from '@/utils/DexieDB'
import { ref } from 'vue'

const fileSystem = require('fs')
const fs = require('fs-extra')
const toBuffer = require('blob-to-buffer')
const toBlob = require('stream-to-blob')

function toBufferPromise (blob: Blob) {
  return new Promise((resolve, reject) => {
    toBuffer(blob, (err: any, buffer: Buffer) => {
      if (err) {
        reject(err)
        return
      }
      resolve(buffer)
    })
  })
}

export function useDB () {
  const progress = ref(0)
  const isLoading = ref(false)
  const isDeleteOldDatabse = ref(false)

  const fileName:string = 'backupDatabase.json'

  function handleDeleteDatabse () {
    isDeleteOldDatabse.value = !isDeleteOldDatabse.value
  }

  function progressCallback ({ totalRows, completedRows }) {
    progress.value = parseFloat(completedRows / totalRows).toFixed(2) * 100
    console.log(`Progress: ${completedRows} of ${totalRows} rows completed`, progress.value)
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
      if (isDeleteOldDatabse.value) {
        // if delete database, must run open function to open database
        await db.delete()
        await db.open()
      }

      const stream = fileSystem.createReadStream(fileName)
      const blob = await toBlob(stream)
      await db.import(blob, { progressCallback })
    } catch (error) {
      console.error(error)
    }
  }

  return {
    progress,
    isLoading,
    isDeleteOldDatabse,
    handleDeleteDatabse,
    saveDatabaseToJson,
    improtDatabaseByJson
  }
}

export default useDB
