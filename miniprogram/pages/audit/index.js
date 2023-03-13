// pages/audit/index.js
import {$req} from "../../js/request";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    pageNum: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this._fresh()
  },
  async getListData(pn = 1, orderBy = '') {
    wx.showLoading();
    this.setData({loading: true})
    const {success, data} = await $req('getAuditList', {pn})
    wx.hideLoading();
    this.setData({loading: false})
    if (success) {
      return data
    }
  },
  async _fresh() {
    this.setData({pageNum: 1})
    const list = await this.getListData(1)
    if (list) {
      this.setData({list})
    }
    return list
  },
  onPullDown() {
    this.setData({pulling: true})
    this._fresh().then(() => {
      this.setData({pulling: false})
    })
  },
  onScrollToEnd() {
    if (!this.data.loading) {
      // console.log('触底追加')
      this.setData({pageNum: this.data.pageNum + 1})
      this.getListData(this.data.pageNum).then(newList => {
        if (newList) {
          this.setData({list: this.data.list.concat(newList)})
        }
      })
    }
  },
  async onAudit({currentTarget}){
    console.log(currentTarget);
    const {dataset} = currentTarget
    const {item, status} = dataset

    const {success, data} = await $req('auditVideo', {
      item,
      status
    })


  }
})
