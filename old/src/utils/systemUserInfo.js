const os = require('os')

/**
 * 获取系统用户名, 用户名目录
 *
 * @returns {Object} - 用户信息
 * @eg
  {
    uid: -1,
    gid: -1,
    username: 'XF',
    homedir: 'C:\\Users\\XF',
    shell: null
  }
 */
function getSystemUserInfo () {
  return os.userInfo()
}

module.exports = {
  getSystemUserInfo
}
