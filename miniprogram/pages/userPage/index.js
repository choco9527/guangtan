Page({
  data: {
    active: 1,
    hasUserInfo: false,
    userInfo: {},
    avatarUrl: ''

  },

  onChange(event) {
    wx.showToast({
      title: `切换到标签 ${event.detail.name}`,
      icon: 'none',
    });
  },
  onChooseAvatar(e) {
    const {avatarUrl} = e.detail
    this.setData({
      avatarUrl,
    })
  },
  onLogin() {
    console.log(1)
    // wx.login({
    //   success(res){
    //     console.log(res);
    //   },
    //   fail(err){
    //     console.log(err);
    //
    //   }
    // })
    wx.getUserProfile({
      success(res) {
        console.log(res);
      }
    })
  },
  getUserProfile(e) {
    wx.getUserProfile({
      desc: '用于完善你的菜单',
      success: (res) => {
        console.log(res);
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
})
