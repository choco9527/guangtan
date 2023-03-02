// pages/detail/index.js
import {$req,getSearchMap} from "../../request";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    latitude: 23.099994,
    longitude: 113.324520,
    markers: [{
      id: 1,
      latitude: 23.099994,
      longitude: 113.324520,
      name: 'T.I.T 创意园'
    }],
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
    console.log('onload', id)
    await this.getData(id)

    // var myAmapFun = new amapFile.AMapWX({key: '7f439b90999fb60f1f1238a2c0325481'});
    // myAmapFun.getPoiAround({
    //   success: function (data) {
    //     //成功回调
    //   },
    //   fail: function (info) {
    //     //失败回调
    //     console.log(info)
    //   }
    // })
  },
  onReady(e) {
    this.mapCtx = wx.createMapContext('myMap')
    getSearchMap().then(res=>{
      console.log(res);
    })


  },
  async getData(id) {
    if (!id) return
    const {success, data} = await $req('getVideo', {id})
    if (success) {
      this.setData({detail: data})
    }
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
