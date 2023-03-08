import {$req} from "../../js/request";
import Toast from '@vant/weapp/toast/toast';

Page({
  data: {
    active: 1,
    hasUserInfo: false,
    userInfo: {},
    avatarUrl: '',
    nickname: ''
  },
  onLoad(query) {
    const {globalData} = getApp()
    globalData.userInfo.then(({INFO}) => {
      if (INFO.avatar) {
        this.setData({avatarUrl: INFO.avatar})
      }
      if (INFO.nickname) {
        this.setData({nickname: INFO.nickname})
      }
    })
  },
  onChange(event) {
    wx.showToast({
      title: `切换到标签 ${event.detail.name}`,
      icon: 'none',
    });
  },
  onGetNickname() { // 获取微信昵称

  },
  onChooseAvatar(e) { // 设置头像
    const {avatarUrl} = e.detail
    this.setData({avatarUrl})
    $req('updateUserInfo', {
      params: {avatar: avatarUrl}
    })
  },
  onLogin() {
  },
  formsubmit(e) {
    const nickname = e.detail.value.nickname
    this.setData({nickname})
    $req('updateUserInfo', {
      params: {nickname}
    })
  }
})
