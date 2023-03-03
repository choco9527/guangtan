// pages/detail/index.js
import {$req, getSearchMap} from "../../request";

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
    // this.mapCtx = wx.createMapContext('myMap')
    this.placeSearch()
  },
  onSearch({detail: search}){
    this.setData({searchVal: search})
    this.placeSearch()
  },
  placeSearch() {
    const allMarkers = []
    if (!this.data.searchVal) return
    console.log(this.data.searchVal)
    getSearchMap({word: this.data.searchVal, lat: this.data.latitude, lng: this.data.longitude}).then(result => {
      const pois = result.data
      for (let i = 0; i < pois.length; i++) {
        var title = pois[i].title
        var lat = pois[i].location.lat
        var lng = pois[i].location.lng
        console.log(title + "," + lat + "," + lng)
        let marker = {
          id: i,
          latitude: lat,
          longitude: lng,
          callout: {
            // 点击marker展示title
            content: title
          }
        }
        allMarkers.push(marker)
        marker = null
      }
      console.log(allMarkers);
      this.setData({
        latitude: allMarkers[0].latitude,
        longitude: allMarkers[0].longitude,
        markers: allMarkers
      })
    })
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
