import {clone} from 'xe-utils'

export const deepClone = (obj) => {
  return clone(obj, true)
}

export const mapSetting = { // 地图设置
  skew: 0,
  rotate: 0,
  showLocation: true,
  showScale: true,
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

const km = 1e3
export const mapScale = { // 比例尺 单位 m
  3: 1000 * km,
  4: 500 * km,
  5: 200 * km,
  6: 100 * km,
  7: 50 * km,
  8: 50 * km,
  9: 20 * km,
  10: 10 * km,
  11: 5 * km,
  12: 2 * km,
  13: 1 * km,
  14: 500,
  15: 200,
  16: 100,
  17: 50,
  18: 50,
  19: 20,
  20: 10,
}

// 方法定义 lat,lng  计算两个经纬度之间距离
export function GetDistance(lat1, lng1, lat2, lng2) {
  const radLat1 = lat1 * Math.PI / 180.0;
  const radLat2 = lat2 * Math.PI / 180.0;
  const a = radLat1 - radLat2;
  const b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
  let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137;// EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000;
  return s;
}

// // 调用 return的距离单位为km
// GetDistance(10.0,113.0,12.0,114.0)

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
