import {$req} from "../../js/request";

Page({
  data: {
    active: 1,
    hasUserInfo: false,
    userInfo: {},
    avatarUrl: '',
    nickname: '',
    show: false
  },
  onLoad() {
    const {globalData} = getApp()
    globalData.userInfo.then(({INFO}) => {
      if (INFO) {
        const {avatar, nickname} = INFO
        if (avatar) {
          this.setData({avatarUrl: INFO.avatar})
        }
        if (nickname) {
          this.setData({nickname: INFO.nickname})
        }
      }
    })
  },
  showDialog(show = true) {
    this.setData({
      show
    })
  },
  onChange(event) {
    wx.showToast({
      title: `切换到标签 ${event.detail.name}`,
      icon: 'none',
    });
  },

  onChooseAvatar(e) { // 设置头像
    const {avatarUrl} = e.detail
    this.setData({avatarUrl})
    $req('updateUserInfo', {
      params: {avatar: avatarUrl}
    }).then(({success, msg}) => {
      if (success) {
        wx.showToast({title: msg})
      }
    })
  },
  formsubmit(e) {
    const nickname = e.detail.value.nickname
    if (!/[`~!#$%^&*()_\+=<>?:"{}|~！#￥%……&*（）={}|《》？：“”【】、；‘’，。、\s+]/g.test(nickname)) {
      this.setData({nickname})
      $req('updateUserInfo', {
        params: {nickname}
      }).then(({success, msg}) => {
        if (success) {
          wx.showToast({title: msg})
          this.showDialog(false)
        }
      })
    } else {
      wx.showToast({title: '昵称不合法️', icon: 'error'})
    }
  }
})
