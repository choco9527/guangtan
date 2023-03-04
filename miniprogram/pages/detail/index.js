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
    covers: [{
      latitude: 23.099994,
      longitude: 113.344520,
      iconPath: '/image/location.png'
    }, {
      latitude: 23.099994,
      longitude: 113.304520,
      iconPath: '/image/location.png'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad({id}) {
    await this.getData(id)
    const that = this
    wx.getLocation({
      success(res){
        console.log(res)
        that.showOnMarker([{
          id: 1,
          latitude: res.latitude,
          longitude: res.longitude
        }])
      },
      fail(err){
        console.log(err);
      }
    })
  },
  onSearch({detail: search}) {
    this.setData({searchVal: search})
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
  setSearchList(list){
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
  showOnMarker(pois = []) { // 将地址展示到marker
    if (!pois.length) return
    const allMarkers = pois.map((poi, i) => {
      let title = poi.title
      let lat = poi.location.lat
      let lng = poi.location.lng
      return {
        id: i,
        latitude: lat,
        longitude: lng,
        callout: {
          content: title  // 点击marker展示title
        }
      }
    })

    if (allMarkers.length) {
      const [f] = allMarkers
      this.setData({
        latitude: f.latitude,
        longitude: f.longitude,
        markers: allMarkers
      })
    }
  },
  async getData(id) {
    if (!id) return
    const {success, data} = await $req('getVideo', {id})
    if (success) this.setData({detail: data})
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})
