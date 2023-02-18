Page({
  data: {
    active: 0,
  },
  onChange(event) {
    // event.detail 的值为当前选中项的索引
    const active = event.detail
    this.setData({active});
    const list = [
      "/pages/index/index",
      "/pages/searchList/index",
      '/pages/userPage/index'
    ]
    console.log(list[active]);
    wx.switchTab({
      url: list[active]
    })
  },
});
