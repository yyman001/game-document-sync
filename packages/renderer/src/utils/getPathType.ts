import path from 'path'
export const getPathType = (fullPath: string) => {
  /*
  !!!存档数据都是存在用户下的,非系统目录
| 名称               | 路径                                       |
| ------------------ | ------------------------------------------ |
| APPDATA            | "C:\\Users\\yyman001_cp\\AppData\\Roaming" |
| DOCUMENTS          | "\\Documents"                              |
| DOCUMENTS_MY_GAMES | "\\Documents\\My Games"                    |
| LOCALAPPDATA       | "C:\\Users\\yyman001_cp\\AppData\\Local"   |
| PUBLIC             | "C:\\Users\\Public"                        |
| USERNAME           | "yyman001_cp"                              |
| USERPROFILE        | "C:\\Users\\yyman001_cp"                   |
  */
  const types = [
    {
      key: 'APP_DATA',
      value: '\\AppData\\Roaming',
      parent: 'AppData',
      children: 'Roaming'
    },
    {
      key: 'LOCAL_APP_DATA',
      value: '\\AppData\\Local',
      parent: 'AppData',
      children: 'Local'
    },
    {
      key: 'DOCUMENTS_MY_GAMES',
      value: '\\Documents\\My Games',
      parent: 'Documents',
      children: 'My Games'
    },
    {
      key: 'DOCUMENTS',
      value: '\\Documents',
      parent: 'Documents',
      children: ''
    },
    {
      key: 'PUBLIC_DOCUMENTS',
      value: '\\Public\\Documents',
      parent: 'Public',
      children: 'Documents'
    },
    {
      key: 'PUBLIC',
      value: 'C:\\Users\\Public',
      parent: 'Users',
      children: 'Public'
    },
    {
      key: 'USER_PROFILE',
      value: 'C:\\Users\\%username%',
      parent: 'Users',
      children: '%username%'
    }
  ]

  const isFullPath = /\w+:/.test(fullPath)
  console.log('isFullPath:', isFullPath)
  fullPath = fullPath.replace(/\\/g, '#')
  console.log('fullPath:', fullPath)
  for (let index = 0; index < types.length; index++) {
    const { key, parent, children } = types[index]

    if (parent && children) {
      if (new RegExp(`#${parent}#${children}`).test(fullPath)) {
        return key
      }
    } else if (parent) {
      if (new RegExp(`#${parent}`).test(fullPath)) {
        return key
      }
    } else if (children !== 'Public') {
      // 可能是用户名
      return 'USERPROFILE'
    }
  }

  return 'UNKONOW'
}
