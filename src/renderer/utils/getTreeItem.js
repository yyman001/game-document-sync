/* 创建多选用的树结构 */
const rd = require('rd')
const path = require('path')

export function getTreeItem (filePath, rootDir) {
  let fileDetailedList = []
  return new Promise(resolve => {
    rd.each(
      filePath,
      function (fileFullPath, stats, next) {
        const p = path.parse(fileFullPath)
        const relativeParentPath = p.dir.replace(rootDir, '')
        const relativePath = fileFullPath.replace(rootDir, '')
        const depth = relativePath.split('\\').length - 1

        const pathObjct = {
          depth,
          children: stats.isFile() ? null : [],
          isLeaf: stats.isFile(),
          key: fileFullPath,
          path: fileFullPath,
          title: p.name,
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
      },
      function () {
        // 完成
        resolve(fileDetailedList)
      }
    )
  })
}

export async function createTree (filePath, gameDocDir) {
  // const filePath = 'C:\\Users\\yyman001_cp\\Documents\\My Games\\Terraria'
  let rootDir = filePath.replace(gameDocDir, '')
  const fileDetailedList = await getTreeItem(filePath, rootDir)
  const allDir = fileDetailedList.filter(f => f.type === 'directory')
  allDir.forEach(dirItem => {
    const children = fileDetailedList.filter(f => f.relative_parent_path === dirItem.relative_path)
    dirItem.children = children
  })

  const tree = allDir.find(f => f.depth === 0)
  return tree
}
