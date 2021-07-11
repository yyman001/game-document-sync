const nedbDatastore = require('nedb-promises')
// 游戏存档参数
const docDB = nedbDatastore.create({
  filename: './games-doc.db',
  autoload: true
})

// 游戏列表
const gamesDB = nedbDatastore.create({
  filename: './games-list.db',
  autoload: true
})

// 游戏存档
const backDB = nedbDatastore.create({
  filename: './games-back.db',
  autoload: true
})

// 设置唯一约束(游戏存档文件夹名,一般情况都是英文)
docDB.ensureIndex({ fieldName: 'gameDocDir', unique: true })
  .then((what) => {
    console.log('docDB约束设置成功!', what)
  })
  .catch((error) => {
    console.error('约束设置失败', error)
  })

// 存档游戏也是唯一的
gamesDB.ensureIndex({ fieldName: 'gameDocDir', unique: true })
  .then((what) => {
    console.log('gamesDB约束设置成功!', what)
  })
  .catch((error) => {
    console.error('约束设置失败', error)
  })

  // 插入文档数据
export async function insterDocRecord (doc) {
  try {
    return await docDB.insert(doc)
  } catch (error) {
    console.error('insterDocRecord::', error)
  }

  return null
}

// 更新插入数据
export async function updateDocRecord (gameDocDir, data) {
  try {
    return await docDB.update({gameDocDir}, data)
  } catch (error) {
    console.error('updateDocRecord::', error)
  }

  return null
}

// 查询列表
export async function getDocs (keywords) {
  const seachParams = {}
  if (keywords) {
    seachParams.$where = function () {
      const {gameName, nickName} = this
      const regExp = new RegExp(keywords, 'i')
      return regExp.test(gameName) || regExp.test(nickName)
    }
  }
  try {
    return await docDB.find(seachParams)
  } catch (error) {
    console.error('getGames::', error)
  }

  return null
}

export async function removeDocs (gameName) {
  try {
    return await docDB.remove({gameName})
  } catch (error) {
    console.error('removeGame::', error)
  }

  return null
}

// 添加游戏列表
export async function addGame (data) {
  try {
    return await gamesDB.insert(data)
  } catch (error) {
    console.error('addGame::', error)
  }

  return null
}

// 更新配置
export async function updateGame (gameDocDir, data) {
  try {
    return await gamesDB.update({gameDocDir}, data)
  } catch (error) {
    console.error('updateGame::', error)
  }

  return null
}

// 删除游戏
export async function removeGame (gameDocDir, data) {
  try {
    return await gamesDB.remove({gameDocDir}, data)
  } catch (error) {
    console.error('removeGame::', error)
  }

  return null
}

// 查询结果
export async function getGames (keywords) {
  const seachParams = {}
  if (keywords) {
    seachParams.$where = function () {
      const {gameName, nickName} = this
      const regExp = new RegExp(keywords, 'i')
      return regExp.test(gameName) || regExp.test(nickName)
    }
  }
  try {
    return await gamesDB.find(seachParams)
  } catch (error) {
    console.error('getGames::', error)
  }

  return null
}

// 插入备份存档记录信息
export {
  docDB,
  gamesDB,
  backDB
}
