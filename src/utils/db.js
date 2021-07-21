import Vue from 'vue'
import Nedb from './nedbClass'

Vue.prototype.$docs = new Nedb({filename: './docs.db', ensureIndex: ['gameDocDir']})
Vue.prototype.$games = new Nedb({filename: './games.db', ensureIndex: ['gameDocDir']})
Vue.prototype.$backup = new Nedb({filename: './backup.db', ensureIndex: ['fileName']})
