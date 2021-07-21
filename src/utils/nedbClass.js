const nedbDatastore = require('nedb-promises')

export default class Nedb {
  constructor ({ filename = './demo.db', autoload = true, ensureIndex = [] }) {
    this.db = nedbDatastore.create({
      filename,
      autoload
    })

    if (ensureIndex.length) {
      ensureIndex.forEach((fieldName) => {
        this.ensureIndex(fieldName)
      })
    }

    this.db.on('__error__', this.error)
  }

  ensureIndex (fieldName) {
    // 设置唯一约束(游戏存档文件夹名,一般情况都是英文)
    this.db.ensureIndex({ fieldName, unique: true })
      .then(() => {
        console.log('db约束设置成功!', fieldName)
      })
      .catch((error) => {
        console.error('约束设置失败', error)
      })
  }

  async add (doc) {
    try {
      return await this.db.insert(doc)
    } catch (error) {
      console.error('add::', error)
    }

    return null
  }

  async remove (removeData, options = {}) {
    try {
      return await this.db.remove(removeData, options)
    } catch (error) {
      console.error('removeGame::', error)
    }

    return null
  }

  async removeAll (keyname) {
    return this.remove(keyname, { multi: true })
  }

  async find (options = {}) {
    const { seachParams = {}, sort = {} } = options
    try {
      return await this.db.find(seachParams).sort(sort)
    } catch (error) {
      console.error('select::', error)
    }

    return null
  }

  async searchGames (keywords) {
    const seachParams = {}

    if (keywords) {
      seachParams.$where = function () {
        const {gameName, nickName} = this
        const regExp = new RegExp(keywords, 'i')
        return regExp.test(gameName) || regExp.test(nickName)
      }
    }

    return this.find({seachParams, sort: {gameName: -1}})
  }

  async update (updatefields, updateData, options = {}) {
    if (!updatefields) return null

    try {
      return await this.db.update(updatefields, updateData, options)
    } catch (error) {
      console.error('updateDocRecord::', error)
    }

    return null
  }

  async updateGameName (gameName) {
    return this.update({gameName}, {$set: {gameName}})
  }

  error (a, b, c, d) {
    console.error(`a`, a)
    console.error(`b`, b)
    console.error(`c`, c)
    console.error(`d`, d)
  }
}
