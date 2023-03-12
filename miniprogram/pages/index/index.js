const {envList} = require('../../envList.js');
import {mapScale, GetDistance, mapSetting, locMapFn} from "../../js/util";
import {$req} from "../../js/request";
import Notify from '@vant/weapp/notify/notify';
import {debounce} from 'xe-utils'

const defaultScale = 12
let markerList = []

Page({
  data: {
    latitude: 23.099994,
    longitude: 113.324520,
    markers: [],
    circles: [],
    setting: mapSetting
  },
  onLoad(query) {
    this.setUserLocation()
    this.setData({
      // 仅设置的属性会生效，其它的不受影响
      setting: {
        scale: defaultScale, // 默认搜索2km内
        enable3D: true,
        enableTraffic: true,
        minScale: 10
      }
    })
  },
  onShow() {
  },
  setUserLocation() { // 设置当前位置
    const _t = this
    wx.getLocation({
      success: ({latitude, longitude}) => {
        _t.setLocation(latitude, longitude) // 设置用户位置
      },
      fail(err) {
        console.log(err);
      }
    })
  },
  setLocation(latitude, longitude) { // 设置圆心
    if (latitude && longitude) {
      this.setData({latitude, longitude})
    }
  },
  setCircle(latitude, longitude, radius) {
    const circles = [{
      latitude,
      longitude,
      radius,
      fillColor: '#91caff50',
      color: '#00000000',
      strokeWidth: 0
    }]
    this.setData({circles})
  },
  getNearBy(latitude, longitude, radius) { // 获取附近店
    $req('getNearVideos', {latitude, longitude, radius})
      .then(({success, data}) => {
        if (success) {
          Notify({type: 'success', message: `附近有${data.length}家地址`});
          markerList = data
          const pois = data.map(v => {
            const {content} = v.locInfo
            const [lng, lat] = v.location.coordinates
            return {
              content, location: {lat, lng}
            }
          })
          this.showOnMarker(pois)
        }
      })
  },
  showOnMarker(pois = [], rePlace = false) { // 将地址展示到marker
    if (!pois.length) return
    const allMarkers = pois.map(locMapFn)
    if (allMarkers.length) {
      this.setData({markers: allMarkers})
    }
  },
  regionChange: debounce(function ({detail}) { // 移动map
    const {type, centerLocation, region} = detail
    if (type === 'end') {
      const {northeast, southwest} = region
      // 获取短边半径
      const km = GetDistance(northeast.latitude, northeast.longitude, northeast.latitude, southwest.longitude)
      const radius = km * 1000 / 2

      const {latitude, longitude} = centerLocation
      this.setCircle(latitude, longitude, radius) // 画出圆
      this.getNearBy(latitude, longitude, radius)
    }
  }, 300),
  onMarkerTap({detail}) {
    const {markerId: index} = detail
    const id = markerList[index]?._id
    if (id) {
      wx.navigateTo({url: '/pages/detail/index?id=' + id})
    }
  },
});
