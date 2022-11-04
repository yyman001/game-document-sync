import { ExportOptions, ImportOptions, exportDB, importInto } from 'dexie-export-import'
import { db } from '@/utils/DexieDB'
import { ref, unref } from 'vue'
import { storeToRefs } from 'pinia'
import { ExportProgress } from 'dexie-export-import/dist/export'
import { useConfigStoreWhitOut } from '@/store/config'
import { getPath } from '@/utils'

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
  const useConfigStore = useConfigStoreWhitOut()
  const { databseInputPath, databaseExportPath } = storeToRefs(useConfigStore)

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

  function progressCallback ({ totalRows = 0, completedRows }:ExportProgress) {
    progress.value = parseFloat((completedRows / totalRows).toFixed(2)) * 100
    console.log(`Progress: ${completedRows} of ${totalRows} rows completed`, progress.value)
  }

  function filterExportTable (table: string, value: any, key?: any) {
    return exportTableName.value.includes(table)
  }

  async function saveDatabaseToJson () {
    if (isLoading.value) return
    isLoading.value = true
    try {
      const outPath = getPath(unref(databaseExportPath), fileName)
      const blob = await exportDB(db, { prettyJson: true, progressCallback, filter: filterExportTable } as ExportOptions)
      const buffer = await toBufferPromise(blob)
      await fs.outputFile(outPath, buffer)
    } catch (error) {
      console.error(error)
    }

    isLoading.value = false
  }

  async function improtDatabaseByJson () {
    try {
      // if delete database, must run open function to open database
      /* if (unref(isDeleteOldDatabse)) {
        await db.delete()
        await db.open()
      } */
      const stream = fileSystem.createReadStream(unref(databseInputPath))
      const blob = await toBlob(stream)
      await importInto(db, blob, {
        clearTablesBeforeImport: unref(isDeleteOldDatabse),
        overwriteValues: !unref(isDeleteOldDatabse),
        progressCallback
      } as ImportOptions)
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
