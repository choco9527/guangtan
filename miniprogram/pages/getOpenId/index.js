import {$q} from '../../request'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    showUploadTip: false,
    haveGetOpenId: false,
    envId: '',
    openId: ''
  },

  onLoad(options) {
    this.setData({
      envId: options.envId
    });
  },

  getOpenId() {
    wx.showLoading({
      title: '',
    });
    console.log(this.data.envId);
    $q('getOpenId').then(resp => {
      console.log(resp);

      this.setData({
        haveGetOpenId: true,
        openId: resp.result.userInfo.openId
      });
     wx.hideLoading();
   }).catch((e) => {
      this.setData({
        showUploadTip: true
      });
     wx.hideLoading();
    });
  },

  clearOpenId() {
    this.setData({
      haveGetOpenId: false,
      openId: ''
    });
  }

});
