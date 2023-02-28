import {$req} from "../../request";

Page({
  data: {
    search: '', // 搜索
    loading: false,
    pageNum: 1,
    pulling: false,
    list: [],
    option1: [
      {text: '全部商品', value: 0},
      {text: '新款商品', value: 1},
      {text: '活动商品', value: 2},
    ],
    option2: [
      {text: '默认排序', value: 'a'},
      {text: '好评排序', value: 'b'},
      {text: '销量排序', value: 'c'},
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
    console.log('刷新')
    const list = await this.getListData()
    if (list) {
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
    console.log(search)
    this.setData({search})
  },
  toDetail({target}) {
    const {id} = target.dataset
    if (id) {
      wx.navigateTo({url: '/pages/detail/index?id=' + id})
    }
  },
  onCancel() {
    // Toast('cancel' + this.data.search);
  },
})
