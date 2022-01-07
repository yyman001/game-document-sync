import * as dayjs from 'dayjs'

export default function () {
  function formatTimestamp (timestamp, format = 'YYYY-MM-DD HH:mm:ss') {
    if (Number.isNaN(timestamp)) return ''
    return dayjs(timestamp).format(format)
  }

  return {
    formatTimestamp
  }
}
