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

    // 获取用户信息存为Promise
    Reflect.set(this.globalData, 'userInfo',
      $req('getUserInfo').then(({data})=>Promise.resolve(data))
    )

    // 全局获取用户位置存为Promise
    Reflect.set(this.globalData, 'userLocation',
      new Promise((r,j)=>[
        wx.getLocation({
          success: (data) => {
            r(data)
          },
          fail(err) {
            console.log(err);
            j(err)
          }
        })
      ])
    )
  }
});
