/* 统一请求request */
const {envList} = require('./envList.js');
const [selectedEnv] = envList
import Toast from '@vant/weapp/toast/toast';


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
      // console.log('$req: ' + type, res.result)
      if (!res.result.success) {
        Toast.fail(res.result.msg);
      }
      resolve(res.result)
    }).catch(e => {
      reject(e)
    })
  })
}

/**
 *
 * @param word 🔍
 * @param lat 经度
 * @param lng 纬度
 * @returns {Promise<unknown>}
 */
export function getSearchMap({word = '', lat, lng}) {
  const keyword = encodeURI(word)
  return new Promise((resolve, reject) => {
    wx.request({
      url: `https://apis.map.qq.com/ws/place/v1/search?boundary=nearby(${lat},${lng},1000,1)&keyword=${keyword}&page_size=10&page_index=1&key=ZNGBZ-JSPYU-SLIV3-B3ZIJ-V3EG6-UNBJI`,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        resolve(res.data)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}
