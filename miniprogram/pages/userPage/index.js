import {$req} from "../../request";

Page({

  data: {

  },
  createBiliCollection() {
    wx.showLoading();
    // 创建bilibili数据库
    $req('main')
      .then(resp => {
        console.log(resp);
        wx.hideLoading();
      })
  },

})
