const {envList} = require('../../envList.js');
import {locMapFn} from "../../js/util";

Page({
  data:{
    latitude: 23.099994,
    longitude: 113.324520,
    markers: [],
  },
  onLoad(query) {
    this.setUserLocation()
  },
  setUserLocation() { // 设置当前位置
    const _t = this
    wx.getLocation({
      success: ({latitude, longitude}) => {
        _t.showOnMarker([{
          title: '',
          location: {lat: latitude, lng: longitude}
        }], true)
      },
      fail(err) {
        console.log(err);
      }
    })
  },
  showOnMarker(pois = [], rePlace = false) { // 将地址展示到marker
    if (!pois.length) return
    const allMarkers = pois.map(locMapFn)

    if (allMarkers.length) {
      const [f] = allMarkers
      this.setData({markers: allMarkers})
      if (rePlace) {
        this.setData({
          latitude: f.latitude,
          longitude: f.longitude,
        })
      }
    }
  },
});
