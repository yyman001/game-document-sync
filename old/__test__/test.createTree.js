/* eslint-disable */
/* 创建多选用的树结构 */
const rd = require('rd')
const path = require('path')
const fs = require('fs-extra')

const game_dir = 'Terraria'
const bad_path = 'C:\\Users\\yyman001_cp\\Documents\\My Games\\'

function getTreeItem (filePath) {
  let fileDetailedList = []

  return new Promise((resolve) => {
    rd.each(filePath, function (fileFullPath, stats, next) {
      const p = path.parse(fileFullPath)
      const relativeParentPath = p.dir.replace(bad_path, '')
      const relativePath = fileFullPath.replace(bad_path, '')
      const depth = relativePath.split('\\').length - 1

      const pathObjct = {
        depth,
        children: stats.isFile() ? null : [],
        path: fileFullPath,
        relative_path: relativePath,
        relative_parent_path: relativeParentPath,
        parent_dir: relativeParentPath ? relativeParentPath.split('\\').pop() : null,
        type: stats.isFile() ? 'file' : 'directory',
        dirname: p.dirname || null,
        basename: p.name,
        filename: stats.isFile() ? p.name + p.ext : null,
        size: stats.size,
        timeStamp: stats.ctimeMs,
        ext: p.ext
      }

      fileDetailedList.push(pathObjct)
      next()
    }, function () {
      // 完成
      resolve(fileDetailedList)
    })
  })
}

async function test () {
  const file_path = 'C:\\Users\\yyman001_cp\\Documents\\My Games\\Terraria'
  const fileDetailedList = await getTreeItem(file_path)
  const all_dir = fileDetailedList.filter(f => f.type === 'directory')
  all_dir.forEach(dir_item => {
    // find children item
    const children = fileDetailedList.filter( f => f.relative_parent_path === dir_item.relative_path)
    dir_item.children = children
  })

  const tree = all_dir.find(f => f.depth === 0)
  const out_file = path.join(__dirname, 'tree.json')
  await fs.outputJSON(out_file,tree)
}

test()
