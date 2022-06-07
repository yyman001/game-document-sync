import dayjs from 'dayjs'

export function formatTimestamp (timestamp: string, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!Number.isNaN(timestamp) || /GMT/.test(timestamp)) return dayjs(timestamp).format(format)

  return ''
}