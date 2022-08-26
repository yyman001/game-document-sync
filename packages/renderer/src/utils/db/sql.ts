
// https://github.com/sql-js/sql.js/
// https://sql.js.org/documentation/index.html

const fs = require('fs')
const fse = require('fs-extra')
const initSqlJs = require('sql.js')
const databaseName = './docs.sqlite'
const filebuffer = fse.createFileSync(databaseName)

initSqlJs().then(function (SQL:any) {
  // Create the database
  const db = new SQL.Database(filebuffer)

  const sql = `CREATE TABLE docs (
    game_doc_dir TEXT NOT NULL,
    game_doc_path TEXT NOT NULL,
    game_name TEXT,
    nick_name TEXT,
    steam_id TEXT
  );`

  db.run(sql)
  db.run('INSERT INTO docs VALUES (?,?,?,?,?)', ['20XX', '\\Documents\\20XX', '20XX', '20XX-洛克人', '322110'])
  const stmt = db.prepare('SELECT * FROM docs')
  while (stmt.step()) {
    const row = stmt.getAsObject()
    console.log('Here is a row: ' + JSON.stringify(row))
  }

  const binaryArray = db.export()
  const buffer = Buffer.from(binaryArray)
  fs.writeFileSync(databaseName, buffer)
})
