// pages/detail/index.js
import {$req, getSearchMap, getSuggestion} from "../../request";
import {debounce} from 'xe-utils'

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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad({id}) {
    await this.getData(id)
    this.setUserLocation()
  },
  onSearch({detail: search}) {
    this.setData({searchVal: search})
  },
  setUserLocation() { // 设置当前位置
    const _t = this
    wx.getLocation({
      success: ({latitude, longitude}) => {
        _t.showOnMarker([{
          title: '我家',
          location: {lat: latitude, lng: longitude}
        }], true)
      },
      fail(err) {
        console.log(err);
      }
    })
  },
  onSearChange: debounce(function ({detail: search}) {
    if (search) {
      getSuggestion({word: search}).then(({data}) => {
        this.setSearchList(data)
      })
    } else {
      this.setSearchList([])
    }
  }, 1200),
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
    this.showOnMarker([item])
    this.setSearchList([])
  },
  showOnMarker(pois = [], rePlace = false) { // 将地址展示到marker
    if (!pois.length) return
    const allMarkers = pois.map((poi, i) => {
      let title = poi.title
      let lat = poi.location.lat
      let lng = poi.location.lng
      return {
        id: i,
        latitude: lat,
        longitude: lng,
        alpha: 0.8,
        callout: {
          display: 'ALWAYS',
          padding: 4,
          color: '#333',
          borderWidth: 1,
          bgColor: '#fafafa',
          content: title  // 点击marker展示title
        }
      }
    })

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
  },
  onMarkerTap({detail}) {
    const {markerId} = detail
    const marker = this.data.markers[markerId]
    console.log(marker);
  },
  // 测试跳转小程序
  goBilibili() {
    const aid=this.data.detail.aid
    const timestamp=new Date().getTime()
    const path=`pages/video/video?__preload_=${timestamp*10+3}&__key_=${timestamp*10+4}&avid=${aid}`
    // console.log(path);
    wx.navigateToMiniProgram({
      appId: 'wx7564fd5313d24844',
      path,
      success: res => {
        console.log('跳转成功',path)
      }
    })
  }
})
