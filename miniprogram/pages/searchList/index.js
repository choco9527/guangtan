import {$req} from "../../js/request";
// const dayjs = require("dayjs")

Page({
  data: {
    search: '', // 搜索
    loading: false,
    pageNum: 1,
    pulling: false,
    list: [],
    option1: [
      {text: '最新', value: 0},
      {text: '最近', value: 1},
    ],
    value1: 0,
    value2: 'a',
  },
  async onLoad(query) {
    await this.onFresh() // 刷新
  },

  onScrollToEnd() {
    if (!this.data.loading) {
      console.log('触底追加')
      this.setData({pageNum: this.data.pageNum + 1})
      this.getListData(this.data.pageNum).then(newList => {
        if (newList) {
          this.setData({list: this.data.list.concat(newList)})
        }
      })
    }
  },
  async onFresh() {
    const list = await this.getListData()
    if (list) {
        console.log(list);
        this.setData({list})
    }
    return list
  },
  onPullDown() {
    this.setData({pulling: true})
    this.onFresh().then(() => {
      this.setData({pulling: false})
    })
  },
  /**
   * 获取列表数据
   * @param pn pageNum
   * @returns {Promise<void>}
   */
  async getListData(pn = 1) {
    wx.showLoading();
    this.setData({loading: true})
    const {success, data} = await $req('getVideoList', {pn})
    wx.hideLoading();
    this.setData({loading: false})
    if (success) {
      return data
    }
  },
  onSearch({detail: search}) {
    this.setData({search})
  },
  toDetail({currentTarget}) {
    const {id} = currentTarget.dataset
    if (id) {
      wx.navigateTo({url: '/pages/detail/index?id=' + id})
    }
  },
  onCancel() {
    // Toast('cancel' + this.data.search);
  },
})
