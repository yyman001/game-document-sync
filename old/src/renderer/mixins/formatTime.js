import * as dayjs from 'dayjs'

export default {
  methods: {
    formatTimestamp (time) {
      return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
