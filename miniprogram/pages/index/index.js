const {envList} = require('../../envList.js');
import {deepClone, mapSetting, locMapFn} from "../../js/util";
import {$req} from "../../js/request";
import Notify from '@vant/weapp/notify/notify';


Page({
  data: {
    latitude: 23.099994,
    longitude: 113.324520,
    markers: [],
    setting: mapSetting
  },
  onLoad(query) {
    this.setUserLocation()
    this.setData({
      // 仅设置的属性会生效，其它的不受影响
      setting: {
        enable3D: true,
        enableTraffic: true
      }
    })
  },
  onShow() {
  },
  setUserLocation() { // 设置当前位置
    const _t = this
    wx.getLocation({
      success: ({latitude, longitude}) => {
        _t.setLocation(latitude, longitude)
        _t.getNearBy(latitude, longitude)
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
  getNearBy(latitude, longitude) { // 获取附近店
    $req('getNearVideos', {latitude, longitude})
      .then(({success, data}) => {
        if (success) {
          Notify({type: 'success', message: `附近有${data.length}家地址`});

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
      const [f] = allMarkers
      this.setData({markers: allMarkers})
    }
  },
  regionChange(type, causedBy) {
    console.log('缩放', type, causedBy)
    if (type === 'end'){

    }
  },
  onMarkerTap({detail}) {
    const {markerId} = detail
    const marker = this.data.markers[markerId]
    const {latitude, longitude, callout} = marker
    wx.openLocation({
      latitude, longitude
    })
  },
});
