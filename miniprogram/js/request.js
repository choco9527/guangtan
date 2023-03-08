/* 统一请求request */
const {envList} = require('../envList.js');
const [selectedEnv] = envList
const MapKey = 'ZNGBZ-JSPYU-SLIV3-B3ZIJ-V3EG6-UNBJI'


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
      data: {
        type,
        ...params,
        // weRunData: wx.cloud.CloudID('xxx'), // 这个 CloudID 值到云函数端会被替换
      }
    }).then(res => {
      // console.log('$req: ' + type, res.result)
      if (!res.result.success) {
        wx.showToast({
          title: res.result.msg,
          icon: 'error'
        })
      }
      resolve(res.result)
    }).catch(e => {
      reject(e)
    })
  })
}

/**
 * 关键字的补完与提示
 *  https://lbs.qq.com/service/webService/webServiceGuide/webServiceSuggestion
 * @param word
 * @returns {Promise<unknown>}
 */
export function getSuggestion({word = ''}) {
  if (word) {
    const keyword = encodeURI(word)
    return new Promise((r, j) => {
      wx.request({
        url: `https://apis.map.qq.com/ws/place/v1/suggestion?keyword=${keyword}&key=${MapKey}&region=广东`,
        header: {'content-type': 'application/json'}, // 默认值
        success(res) {
          r(res.data)
        },
        fail(err) {
          j(err)
        }
      })
    })
  }
}


/**
 * 地点搜索 https://lbs.qq.com/service/webService/webServiceGuide/webServiceSearch
 * @param word 🔍
 * @param lat 经度
 * @param lng 纬度
 * @returns {Promise<unknown>}
 */
export function getSearchMap({word = '', lat, lng}) {
  if (word && lat && lng) {
    const keyword = encodeURI(word)
    return new Promise((r, j) => {
      wx.request({
        url: `https://apis.map.qq.com/ws/place/v1/search?boundary=nearby(${lat},${lng},1000,1)&keyword=${keyword}&key=${MapKey}&region=广东`,
        header: {'content-type': 'application/json'}, // 默认值
        success(res) {
          r(res.data)
        },
        fail(err) {
          j(err)
        }
      })
    })
  }
}
