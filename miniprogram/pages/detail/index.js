// pages/detail/index.js
import {$req, getSearchMap} from "../../js/request";
import Dialog from '@vant/weapp/dialog/dialog';
import Notify from '@vant/weapp/notify/notify';
import {locMapFn, goBilibili} from "../../js/util";

let markerList = []
let curMarker = {}
const UPDATE = '更新'
const GO = '前往'

let id = ''
let from = ''

Page({
  data: {
    detail: {},
    replies: [],
    markers: [],
    showAction: false,
    actions: [],
    sDesc: false,
    latitude: 23.12463,
    longitude: 113.36199,
  },

  onLoad({id: _id, lat, lng, title, from: f = ''}) {
    id = _id
    from = f
    if (lat || lng) {
      this.showOnMarker([{
        title,
        location: {lat, lng}
      }], true)
    }
  },
  onShow() {
    this.getData(id).then(detail => {
      this.getDetailLocation(detail)
    })
    let actions = [{name: GO}, {name: UPDATE}]
    this.setData({actions})
  },

  getDetailLocation(detail) { // 获取当前位置
    const {location} = detail
    if (detail.locInfo && location) {
      const {title} = detail.locInfo
      const [lng, lat] = location.coordinates
      this.showOnMarker([{
        title,
        location: {lat, lng}
      }], true)
    } else {
      Notify({type: 'warning', message: '暂无位置信息 请更新位置信息。'});
    }
  },

  async placeSearch() {
    if (!this.data.searchVal) return
    const {data} = await getSearchMap({
      word: this.data.searchVal,
      lat: this.data.latitude,
      lng: this.data.longitude
    })
    this.showOnMarker(data)
  },
  onSuggestionSel({detail: item}) {
    markerList = [item]
    this.showOnMarker([item], true)
  },
  showOnMarker(pois = [], rePlace = false) { // 将地址展示到marker
    if (!pois.length) return
    const allMarkers = pois.map(locMapFn)

    if (allMarkers.length) {
      const [f] = allMarkers
      this.setData({markers: allMarkers})
      if (rePlace) {
        const t = setTimeout(() => {
          this.setData({
            latitude: f.latitude,
            longitude: f.longitude,
          })
          clearTimeout(t)
        }, 0)
      }
    }
  },
  async getData(id) {
    if (!id) return
    const {success, data} = await $req('getVideo', {id})
    if (success) {
      this.setData({detail: data})
      if (data.reply) {
        this.setData({replies: [...data.reply.top_replies, ...data.reply.replies]})
      }
    }
    return data
  },
  onMarkerTap({detail}) {
    if (from !== 'audit') {
      const {markerId} = detail
      const marker = this.data.markers[markerId]
      const item = markerList[markerId]
      curMarker = {...marker, item}
      this.setData({showAction: true});
    }
  },
  goBilibili() {
    const aid = this.data.detail.aid
    goBilibili(aid)
  },
  onActionSelect(e) {
    const {name} = e.detail
    const {latitude, longitude, callout, item} = curMarker
    switch (name) {
      case UPDATE:
        Dialog.confirm({
          title: '确认更新地址？',
        })
          .then(() => {
            const {_id} = this.data.detail
            $req('updateVideoLocation', {id: _id, latitude, longitude, item}).then(updateRes => {
              Notify({type: 'success', message: updateRes.msg});
            })
          })
          .catch(() => {
            // on cancel
          });
        break
      case GO:
        wx.openLocation({
          latitude, longitude
        })
        break
    }
  },
  onActionClose() {
    this.setData({showAction: false});
  },
  showDesc() {
    this.setData({sDesc: !this.data.sDesc})
  },
  onShareAppMessage: function () {
    return {
      title: this.data.detail.title,
      path: '/pages/detail/index?id=' + this.data.detail._id,
    }
  }
})
