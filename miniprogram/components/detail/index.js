import {goBilibili} from "../../js/util";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    detail: {}
  },

  /**
   * 组件的初始数据
   */
  data: {
    detail: {},
    sDesc: false
  },
  attached() {
    this.setData({detail: this.properties.detail})
  },
  /**
   * 组件的方法列表
   */
  methods: {
    goBilibili() {
      const aid = this.data.detail.aid
      goBilibili(aid)
    },
    showDesc() {
      this.setData({sDesc: !this.data.sDesc})
    }
  }
})
