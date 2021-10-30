import Vue from 'vue'
import docsDB from '../renderer/utils/docsDB'
import gamesDB from '../renderer/utils/gamesDB'
import backupDB from '../renderer/utils/backupDB'

Vue.prototype.$docs = docsDB
Vue.prototype.$games = gamesDB
Vue.prototype.$backup = backupDB
