import Nedb from './nedbClass'
export default new Nedb({filename: './backup.db', ensureIndex: ['fileName']})
