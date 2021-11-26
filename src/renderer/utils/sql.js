
/* const fs = require('fs')
const initSqlJs = require('sql.js')
const filebuffer = fs.readFileSync('test.sqlite')

initSqlJs().then(function (SQL) {
  // Load the db
  const db = new SQL.Database(filebuffer)
  // Run a query without reading the results
  db.run('CREATE TABLE test (col1, col2);')
  // Insert two rows: (1,111) and (2,222)
  db.run('INSERT INTO test VALUES (?,?), (?,?)', [1, 111, 2, 222])

  // Prepare a statement
  const stmt = db.prepare('SELECT * FROM test WHERE col1 BETWEEN $start AND $end')
  stmt.getAsObject({$start: 1, $end: 1}) // {col1:1, col2:111}

  // Bind new values
  stmt.bind({$start: 1, $end: 2})
  while (stmt.step()) { //
    const row = stmt.getAsObject()
    console.log('Here is a row: ' + JSON.stringify(row))
  }
})
 */
const fs = require('fs')
const initSqlJs = window.initSqlJs
const config = {
  locateFile: filename => `./${filename}.sqlite`
}
console.log('config:', config)

// The `initSqlJs` function is globally provided by all of the main dist files if loaded in the browser.
// We must specify this locateFile function if we are loading a wasm file from anywhere other than the current html page's folder.
initSqlJs(config).then(function (SQL) {
  // Create the database
  const db = new SQL.Database()
  // Run a query without reading the results
  db.run('CREATE TABLE test (col1, col2);')
  // Insert two rows: (1,111) and (2,222)
  db.run('INSERT INTO test VALUES (?,?), (?,?)', [1, 111, 2, 222])

  // Prepare a statement
  const stmt = db.prepare('SELECT * FROM test WHERE col1 BETWEEN $start AND $end')
  stmt.getAsObject({$start: 1, $end: 1}) // {col1:1, col2:111}

  // Bind new values
  stmt.bind({$start: 1, $end: 2})
  while (stmt.step()) { //
    const row = stmt.getAsObject()
    console.log('Here is a row: ' + JSON.stringify(row))
  }

  const binaryArray = db.export()
  // eslint-disable-next-line node/no-deprecated-api
  const buffer = new Buffer(binaryArray)
  fs.writeFileSync('./filename.sqlite', buffer)
})
