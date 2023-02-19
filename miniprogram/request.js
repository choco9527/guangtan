const {envList} = require('./envList.js');
const [selectedEnv] = envList

export function $q() {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      config: {
        env: selectedEnv.envId
      },
      data: {
        type: 'createCollection'
      }
    })
  })
}
