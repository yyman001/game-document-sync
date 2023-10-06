import dayjs from 'dayjs'
import { isNumber } from './is'

export function formatTimestamp (timestamp: string|number, format = 'YYYY-MM-DD HH:mm:ss') {
  if (isNumber(timestamp) || /GMT/.test(timestamp)) return dayjs(timestamp).format(format)

  return ''
}

// 根据时间戳格式化时间, 小于1小时的用分钟显示,大于1小时的用小时显示
export function generateTimeSummary(timestamp:string|number) {
  const durationInSeconds = Number(timestamp) / 1000

  if (durationInSeconds < 1) {
    // 小于1秒，显示0分钟
    return '0分钟'
  } else if (durationInSeconds < 60) {
    // 少于1分钟，显示1分钟
    return '1分钟'
  } else if (durationInSeconds < 3600) {
    // 少于1小时，用分钟显示
    const minutes = Math.floor(durationInSeconds / 60)
    return `${minutes}分钟`
  } else {
    // 1小时以上，用1.x小时显示
    const hours = durationInSeconds / 3600
    return `${hours.toFixed(1)}小时`
  }
}
