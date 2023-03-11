import {clone} from 'xe-utils'

export const deepClone = (obj) => {
  return clone(obj, true)
}

export const mapSetting = {
  skew: 0,
  rotate: 0,
  showLocation: false,
  showScale: false,
  subKey: '',
  layerStyle: 1,
  enableZoom: true,
  enableScroll: true,
  enableRotate: false,
  showCompass: false,
  enable3D: false,
  enableOverlooking: false,
  enableSatellite: false,
  enableTraffic: false
}

export const locMapFn = (poi, i) => {
  let content = poi.title || poi.content
  let lat = poi.location.lat // 纬度
  let lng = poi.location.lng // 经度
  return {
    id: i,
    latitude: lat,
    longitude: lng,
    alpha: 0.9,
    width: 20,
    height: 28,
    callout: {
      display: 'ALWAYS',
      padding: 4,
      color: '#333',
      borderWidth: 1,
      bgColor: '#fafafa',
      content  // 点击marker展示title
    }
  }
}

export const goBilibili = (aid) => {
  if (!aid) return
  const timestamp = new Date().getTime()
  const path = `pages/video/video?__preload_=${timestamp * 10 + 3}&__key_=${timestamp * 10 + 4}&avid=${aid}`

  wx.navigateToMiniProgram({
    appId: 'wx7564fd5313d24844',
    path,
    success: res => {
      console.log('跳转成功', path)
    }
  })
}
