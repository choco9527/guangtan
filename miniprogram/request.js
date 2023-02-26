/* 统一请求request */
const {envList} = require('./envList.js');
const [selectedEnv] = envList

export function $q(type) {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      config: {env: selectedEnv.envId},
      data: {type}
    }).then(res => {
      console.log('$q: ' + type, res.result)
      resolve(res.result)
    }).catch(e => {
      reject(e)
    })
  })
}

export function $req(type, params = {}) {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'mFunctions',
      config: {env: selectedEnv.envId},
      data: {type, ...params}
    }).then(res => {
      console.log('$req: ' + type, res.result)
      resolve(res.result)
    }).catch(e => {
      reject(e)
    })
  })
}
