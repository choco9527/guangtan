import {$req} from "../../js/request";
import Notify from '@vant/weapp/notify/notify';

Page({
  data: {
    active: 1,
    hasUserInfo: false,
    info: {},
    isManager: false,
    show: false
  },
  onLoad() {
    const {globalData} = getApp()
    globalData.userInfo.then(({INFO = {}, IS_MANAGER = false}) => {
      if (INFO) {
        this.setData({info: INFO})
      }
      this.setData({isManager: IS_MANAGER})
    })
  },
  showDialog(show = true) {
    this.setData({
      show
    })
  },

  onChooseAvatar(e) { // 设置头像
    const {avatarUrl} = e.detail
    this.setData({avatarUrl})
    $req('updateUserInfo', {
      params: {avatar: avatarUrl}
    }).then(({success, msg}) => {
      if (success) {
        Notify({type: 'success', message: msg});
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
          Notify({type: 'success', message: msg});
          this.showDialog(false)
        }
      })
    } else {
      Notify('昵称不合法️');
    }
  }
})
