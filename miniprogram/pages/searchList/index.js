import {$req} from "../../js/request";
// const dayjs = require("dayjs")

Page({
  data: {
    search: '', // 搜索
    loading: false,
    pageNum: 1,
    pulling: false,
    list: [],
    orderOptions: [
      {text: '最新', value: 'created'},
      {text: '收藏最多', value: 'v_stat.favorite'},
      {text: '播放最多', value: 'v_stat.view'},
      {text: '投币最多', value: 'v_stat.coin'},
      {text: '点赞最多', value: 'v_stat.like'}
    ],
    orderBy: 'created'
  },
  async onLoad(query) {
    await this._fresh() // 刷新
  },
  onScrollToEnd() {
    if (!this.data.loading) {
      // console.log('触底追加')
      this.setData({pageNum: this.data.pageNum + 1})
      this.getListData(this.data.pageNum).then(newList => {
        if (newList) {
          this.setData({list: this.data.list.concat(newList)})
        }
      })
    }
  },
  async _fresh() {
    this.setData({pageNum: 1})
    const list = await this.getListData(1, this.data.search, this.data.orderBy)
    if (list) {
      this.setData({list})
    }
    return list
  },
  onPullDown() {
    this.setData({pulling: true})
    this._fresh().then(() => {
      this.setData({pulling: false})
    })
  },
  /**
   * 获取列表数据
   * @param pn pageNum
   * @param search
   * @returns {Promise<void>}
   */
  async getListData(pn = 1, search = '', orderBy = '') {
    wx.showLoading();
    this.setData({loading: true})
    const {success, data} = await $req('getVideoList', {pn, search, orderBy})
    wx.hideLoading();
    this.setData({loading: false})
    if (success) {
      return data
    }
  },
  async onOrder({detail: orderBy}) {
    this.setData({pageNum: 1})
    this.setData({orderBy})
    const list = await this.getListData(1, this.data.search, orderBy)
    if (list) {
      this.setData({list})
    }
  },
  async onSearch({detail: search}) {
    this.setData({search})
    this.setData({pageNum: 1})
    const list = await this.getListData(1, search)
    if (list) {
      this.setData({list})
    }
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
