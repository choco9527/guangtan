// pages/detail/index.js
import {$req, getSearchMap} from "../../js/request";
import Dialog from '@vant/weapp/dialog/dialog';
import Notify from '@vant/weapp/notify/notify';
import {locMapFn, goBilibili, deepClone} from "../../js/util";

let curMarker = {}
const UPDATE = '更新'
const GO = '前往'

Page({
  data: {
    detail: {},
    replies: [],
    latitude: 23.099994,
    longitude: 113.324520,
    markers: [],
    showAction: false,
    actions: [],
    isManager: false, // 管理员
    sDesc: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad({id}) {
    this.getData(id).then(detail => {
      console.log(detail);
      this.getDetailLocation(detail)
    })
  },
  onShow() {
    const {globalData} = getApp()
    globalData.userInfo.then(({IS_MANAGER}) => {
      let actions = [{name: GO}]
      if (IS_MANAGER) {
        actions.push({name: UPDATE})
        this.setData({isManager: true})
      }
      this.setData({actions})
    })
  },

  getDetailLocation(detail) { // 获取当前位置
    const {location} = detail
    if (detail.locInfo && location) {
      const {content} = detail.locInfo
      const [lng, lat] = location.coordinates
      this.showOnMarker([{
        title: content,
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
    this.showOnMarker([item], true)
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
    const {markerId} = detail
    const marker = this.data.markers[markerId]
    curMarker = deepClone(marker)
    this.setData({showAction: true});
  },
  // 测试跳转小程序
  goBilibili() {
    const aid = this.data.detail.aid
    goBilibili(aid)
  },
  onActionSelect(e) {
    const {name} = e.detail
    const {latitude, longitude, callout} = curMarker
    switch (name) {
      case UPDATE:
        Dialog.confirm({
          title: '确认更新地址？',
        })
          .then(() => {
            const {_id} = this.data.detail
            $req('updateVideoLocation', {id: _id, latitude, longitude, content: callout.content}).then(updateRes => {
              Notify({ type: 'success', message: updateRes.msg });
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
  }
})
