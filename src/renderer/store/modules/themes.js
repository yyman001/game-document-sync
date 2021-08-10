const state = {
  themeName: ''
}

const getters = {
  getThemeName (state) {
    return state.themeName
  }
}

const mutations = {
  SET_THEME_NAME (state, theme) {
    state.themeName = theme
  }
}

const actions = {
  setThemeName ({ commit }, theme = '') {
    commit('SET_THEME_NAME', theme)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
