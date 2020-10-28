import {ipcRenderer} from 'electron'
export default {
  data () {
    return {}
  },
  mixins: [],
  computed: {},
  created () {
  },
  mounted () {
  },
  methods: {
    $send ({eventType, data}) {
      ipcRenderer.send('message', {eventType, data})
    }
  },
  beforeDestroy () {
  }
}
