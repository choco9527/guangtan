import {$req} from "../../js/request";

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
  onGetNickname(){ // 获取微信昵称

  },
  onChooseAvatar(e) { // 设置头像
    const {avatarUrl} = e.detail
    this.setData({
      avatarUrl,
    })
    $req('updateUserInfo', {
      params: {
        avatar: avatarUrl
      }
    }).then(res=>{
      console.log(res);

    })
  },
  onLogin() {
  },
  formsubmit(e){
    const nickName = e.detail.value.nickname
    console.log("nickName", nickName)
    // do something
  }
})
