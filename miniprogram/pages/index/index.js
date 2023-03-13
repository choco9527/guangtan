const {envList} = require('../../envList.js');
import {GetDistance, mapScale, locMapFn, goBilibili} from "../../js/util";
import {$req} from "../../js/request";
import Notify from '@vant/weapp/notify/notify';
import {debounce} from 'xe-utils'

const defaultScale = 13
const defaultRadius = 3000
let markerList = []

Page({
  data: {
    latitude: 23.12463,
    longitude: 113.36199,
    markers: [],
    circles: [],
    setting: {},
    showPop: false,
    popDetail: {},
    mapCtx: {}
  },
  onLoad(query) {
    this.setData({
      setting: {
        scale: defaultScale, // 默认搜索2km内
        showLocation: true,
        enable3D: true,
        minScale: 10,
        showScale: true,
        enableTraffic: true
      }
    })
  },
  onShow(e) {
    this.getUserLocation()
    this.mapCtx = wx.createMapContext('homeMap')
  },
  getUserLocation() { // 设置当前位置
    const _t = this
    const {globalData} = getApp()
    globalData.userLocation.then(data => {
      console.log('HomePage get location:', data);
      const {latitude, longitude} = data
      _t.setLocation(latitude, longitude) // 设置用户位置
      _t.getNearBy(latitude, longitude, defaultRadius)
    })
  },
  moveToLocation() { // 回到用户位置
    // this.setUserLocation()
    const _t = this
    const {latitude, longitude} = _t.data
    this.mapCtx.moveToLocation({
      success() {
        _t.setLocation(latitude, longitude)
        _t.getNearBy(latitude, longitude, defaultRadius)
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
    this.setCircle(latitude, longitude, radius) // 画出圆

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
  regionChange: debounce(function (params) { // 移动map
    const {detail, causedBy, type} = params
    const {centerLocation, region} = detail
    let gesture = true
    if (causedBy) {
      gesture = ['drag', 'scale', 'gesture'].includes(causedBy)
    }
    if (type === 'end' && gesture) { // 保证为手势触发
      const {northeast, southwest} = region
      // 获取短边半径
      const km = GetDistance(northeast.latitude, northeast.longitude, northeast.latitude, southwest.longitude)
      const radius = km * 1000 / 2

      const {latitude, longitude} = centerLocation
      this.getNearBy(latitude, longitude, radius)
    }
  }, 300),
  onMarkerTap({detail}) {
    const {markerId: index} = detail
    this.setData({showPop: true, popDetail: markerList[index]})
  },
  onClosePopup() {
    this.setData({showPop: false})
  },
  toDetailPage({currentTarget}) {
    const id = currentTarget.dataset.id
    if (id) {
      wx.navigateTo({url: '/pages/detail/index?id=' + id})
    }
  },
  toLocation() {
    const [longitude, latitude] = this.data.popDetail.location.coordinates
    wx.openLocation({
      latitude, longitude
    })
  },
  onShareAppMessage: function () {
    return {
      title: '廣探',
      path: '/pages/index/index',
    }
  }
});
