const {envList} = require('../../envList.js');
import {locMapFn} from "../../js/util";
import {$req} from "../../js/request";

Page({
  data: {
    latitude: 23.099994,
    longitude: 113.324520,
    markers: [],
  },
  onLoad(query) {
    this.setUserLocation()
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
    $req('getLocVideos', {latitude, longitude})
      .then(res => {
        console.log('near', res);
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
});
