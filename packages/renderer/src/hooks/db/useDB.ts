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
  // 导出表
  const exportTableName = ref(['gamesTable', 'docsTable'])
  const exportTableOptions = ref([
    { label: '游戏存档', value: 'gamesTable' },
    { label: '备份文件', value: 'backupTable' },
    { label: '配置存档', value: 'docsTable' }
  ])

  const fileName:string = 'backupDatabase.json'

  function handleDeleteDatabse () {
    isDeleteOldDatabse.value = !isDeleteOldDatabse.value
  }

  function progressCallback ({ totalRows, completedRows }) {
    progress.value = parseFloat(completedRows / totalRows).toFixed(2) * 100
    console.log(`Progress: ${completedRows} of ${totalRows} rows completed`, progress.value)
  }

  function filterTable (table: string, value: any, key?: any) {
    console.log('table:', table, value, key)
    return exportTableName.value.includes(table)
  }

  async function saveDatabaseToJson () {
    if (isLoading.value) return
    isLoading.value = true

    try {
      const blob = await db.export({ prettyJson: true, progressCallback, filter: filterTable })
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
    improtDatabaseByJson,

    exportTableOptions,
    exportTableName
  }
}

export default useDB
