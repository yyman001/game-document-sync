import {ipcMain} from 'electron'
import {eventMap} from '../utils/eventMap'
ipcMain.on('message', function (event, { eventType, data }) {
  if (typeof eventMap[eventType] === 'undefined') {
    console.error(`eventType:${eventType}, 未定义, 请在eventMap定义!`)
    return
  }
  console.log(eventType, data)
  eventMap[eventType](data)
})
