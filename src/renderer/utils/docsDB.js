import Nedb from './nedbClass'
export default new Nedb({filename: './docs.db', ensureIndex: ['gameDocDir']})
