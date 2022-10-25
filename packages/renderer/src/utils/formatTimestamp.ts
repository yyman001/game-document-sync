import dayjs from 'dayjs'
import { isNumber } from './is'

export function formatTimestamp (timestamp: string|number, format = 'YYYY-MM-DD HH:mm:ss') {
  if (isNumber(timestamp) || /GMT/.test(timestamp)) return dayjs(timestamp).format(format)

  return ''
}
