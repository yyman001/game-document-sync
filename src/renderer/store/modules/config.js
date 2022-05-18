const state = {
  // 备份目录
  backupPath: '',
  // 临时目录(文件拷贝,压缩,解压)
  tempPath: '',
  // 云账号配置对象
  cloudForm: {
    type: '',
    // 坚果云
    url: '',
    usearname: '',
    password: '',
    rootDirectoryName: 'games_doc_sync',
    // 阿里云
    accessKeyId: '',
    accessKeySecret: '',
    bucket: ''
  },
  // 云账号配置信息列表
  cloudList: [],
  cloudType: 'jianguoyun'
}

const getters = {
  targetCloudAccount (state) {
    return state.cloudList.find((x) => x.type === state.cloudType) || {}
  },
  getCloudList (state) {
    return state.cloudList
  },
  getCloudType (state) {
    return state.cloudType
  }
}

const mutations = {
  SET_BACKUP_PATH (state, path) {
    state.backupPath = path || '.\\backup'
  },
  SET_TEMP_PATH (state, path) {
    state.tempPath = path
  },
  UPDATE_CLOUD_CONFIG (state, data) {
    const cloudFormState = state.cloudForm
    Object.keys(data).forEach((key) => {
      cloudFormState[key] = data[key]
    })
  },
  SET_CLOUD_TYPE (state, type) {
    state.cloudType = type
  },
  SET_CLOUD_LIST (state, cloudList) {
    state.cloudList = cloudList
  }
}

const actions = {
  setCloudType ({commit}, type = '') {
    commit('SET_CLOUD_TYPE', type)
  },

  setCloudList ({commit}, cloudList = []) {
    commit('SET_CLOUD_LIST', cloudList)
  },

  updateCloudConfig ({commit}, data) {
    commit('UPDATE_CLOUD_CONFIG', data)
  },
  handleSetBackupPath ({commit}, path) {
    commit('SET_BACKUP_PATH', path)
  },

  handleRecoverBackupPath ({commit, dispatch}) {
    dispatch('handleSetBackupPath')
  },

  handleSetTempPath ({commit}, path) {
    commit('SET_TEMP_PATH', path)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
