import Nedb from './nedbClass'
export default new Nedb({filename: './games.db', ensureIndex: ['gameDocDir']})
