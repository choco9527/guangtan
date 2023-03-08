// app.js
import {$req} from "./js/request";

App({
  onLaunch: function () {
    this.globalData = {};

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'gt-prod',
        traceUser: true,
      });
    }
    Reflect.set(this.globalData, 'userInfo',
      $req('getUserInfo').then(({data})=>Promise.resolve(data))
    ) // 存为Promise
  }
});
