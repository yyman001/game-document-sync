import * as dayjs from 'dayjs'

export default function () {
  function formatTimestamp (timestamp, format = 'YYYY-MM-DD HH:mm:ss') {
    if (Number.isNaN(timestamp) || !/GMT/.test(timestamp)) return ''
    return dayjs(timestamp).format(format)
  }

  function formatFileSize (fileSize, fixed = 2) {
    if (typeof fileSize !== 'number') return ''

    const B = 1024
    const KB = B * B // 1024 * 1024
    const MB = KB * B // 1024 * 1024 * 1024
    const GB = MB * B // 1024 * 1024 * 1024 * 1024

    if (fileSize < B) {
      return `${fileSize}B`
    } else if (fileSize < KB) {
      return `${(fileSize / B).toFixed(fixed)}KB`
    } else if (fileSize < MB) {
      return `${(fileSize / KB).toFixed(fixed)}MB`
    } else if (fileSize < GB) {
      return `${(fileSize / MB).toFixed(fixed)}GB`
    } else {
      return '请新增单位~'
    }
  }

  return {
    formatTimestamp,
    formatFileSize
  }
}
