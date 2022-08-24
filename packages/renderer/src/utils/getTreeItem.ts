/* 创建多选用的树结构 */
const rd = require('rd')
const path = require('path')

export interface TreeItem {
  // '引燃的大坑.wld'
  basename: string
  children: TreeItem[] | null
  depth: number
  dirname: string | null
  // '.bak'
  ext: string
  // '引燃的大坑.wld.bak'
  filename: string
  isLeaf: boolean
  // 'C:\\Users\\yyman001_cp\\Documents\\My Games\\Terraria\\Worlds\\引燃的大坑.wld.bak'
  key: string
  // 'Worlds'
  parent_dir: string
  // 'C:\\Users\\yyman001_cp\\Documents\\My Games\\Terraria\\Worlds\\引燃的大坑.wld.bak'
  path: string
  // '\\Worlds'
  relative_parent_path: string
  // '\\Worlds\\引燃的大坑.wld.bak'
  relative_path: string
  // 2990329
  size: number
  timeStamp: number
  // '引燃的大坑.wld'
  title: string
  type: 'file' | 'directory'
}

export function getTreeItem (filePath: string, rootDir: string) {
  const fileDetailedList: TreeItem[] = []
  return new Promise(resolve => {
    rd.each(
      filePath,
      function (fileFullPath: string, stats: any, next: any) {
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
        } as TreeItem

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

export async function createTree (filePath: string, gameDocDir: string) {
  // const filePath = 'C:\\Users\\yyman001_cp\\Documents\\My Games\\Terraria'
  const rootDir = filePath.replace(gameDocDir, '')
  const fileDetailedList = await getTreeItem(filePath, rootDir) as TreeItem[]
  const filesPath = fileDetailedList.map(({ path }) => path)
  const allDir = fileDetailedList.filter(f => f.type === 'directory')
  allDir.forEach(dirItem => {
    const children = fileDetailedList.filter(f => f.relative_parent_path === dirItem.relative_path)
    dirItem.children = children
  })

  const tree = allDir.find(f => f.depth === 0)
  return { tree, filesPath }
}
