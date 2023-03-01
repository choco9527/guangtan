// pages/detail/index.js
import {$req} from "../../request";

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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad({id}) {
    console.log('onload', id)
    await this.getData(id)
  },
  onReady(e) {
    this.mapCtx = wx.createMapContext('myMap')
  },
  async getData(id) {
    if (!id) return
    const {success, data} = await $req('getVideo', {id})
    console.log(data);
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
