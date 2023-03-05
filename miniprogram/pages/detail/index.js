// pages/detail/index.js
import {$req, getSearchMap, getSuggestion} from "../../js/request";
import {debounce} from 'xe-utils'
import Dialog from '@vant/weapp/dialog/dialog';
import Toast from '@vant/weapp/toast/toast';
import {locMapFn} from "../../js/util";


Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchVal: '',
    detail: {},
    latitude: 23.099994,
    longitude: 113.324520,
    markers: [],
    searchList: [], // 推荐词
    listLoading: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad({id}) {
    this.getData(id).then(detail => {
      this.getDetailLocation(detail)
    })
  },
  onSearch({detail: search}) {
    this.setData({searchVal: search})
  },
  getDetailLocation(detail) { // 获取当前位置
    if (detail.locInfo) {
      const {content, location} = detail.locInfo
      console.log(location);
      const [lng, lat] = location.coordinates
      this.showOnMarker([{
        title: content,
        location: {lat, lng}
      }], true)
    } else {
      Toast.fail('请添加位置')
    }
  },
  onSearChange: debounce(function ({detail: search}) {
    if (search) {
      this.setData({listLoading: true})
      getSuggestion({word: search}).then(({data}) => {
        this.setSearchList(data)
      }).finally(() => {
        this.setData({listLoading: false})
      })
    } else {
      this.setSearchList([])
    }
  }, 800),
  setSearchList(list) {
    this.setData({searchList: list})
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
  onSuggestionSel({target}) {
    const item = target.dataset.item
    this.showOnMarker([item], true)
    this.setSearchList([])
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
    if (success) this.setData({detail: data})
    return data
  },
  onMarkerTap({detail}) {
    const {markerId} = detail
    const marker = this.data.markers[markerId]
    const {latitude, longitude, callout} = marker

    wx.openLocation({
      latitude, longitude
    })


    // Dialog.confirm({
    //   title: '确认更新地址？',
    // })
    //   .then(() => {
    //     const {_id} = this.data.detail
    //     $req('updateVideoLocation', {id: _id, latitude, longitude, content: callout.content}).then(updateRes => {
    //       console.log(updateRes);
    //       Toast.success('更新成功');
    //     })
    //   })
    //   .catch(() => {
    //     // on cancel
    //   });
  },
  // 测试跳转小程序
  goBilibili() {
    const aid = this.data.detail.aid
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
})
