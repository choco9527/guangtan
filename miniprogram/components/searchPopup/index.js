import {debounce} from 'xe-utils'
import {getSuggestion} from "../../js/request";

Component({
  data: {
    searchVal: '',
    searchList: [], // 推荐词
    latitude: 0,
    longitude: 0,
  },
  properties: {
    placeholder: {
      type: String,
      value: '搜索地址'
    }
  },
  attached() {
    const _t = this
    const {globalData} = getApp()
    globalData.userLocation.then(data => {
      console.log('pop getLocation', data);
      const {latitude, longitude} = data
      _t.setData({latitude, longitude})
    })
  },
  methods: {
    onSearch: debounce(function ({detail: search}) {
      if (search) {
        wx.showLoading()
        getSuggestion({word: search}).then(({data}) => {
          this.setSearchList(data)
        }).finally(() => {
          wx.hideLoading()
        })
      } else {
        this.setSearchList([])
      }
    }, 800),
    onS({target}) {
      const item = target.dataset.item
      this.setSearchList([])
      this.triggerEvent('onSelect', item)
    },
    onClose() {
      this.setSearchList([])
    },
    setSearchList(list) {
      this.setData({searchList: list})
    },
  }

});
