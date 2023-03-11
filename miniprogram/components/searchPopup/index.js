import {debounce} from 'xe-utils'
import {getSuggestion} from "../../js/request";

Component({
  data: {
    searchVal: '',
    searchList: [], // 推荐词
  },
  properties: {
    onSuggestionSel: {
      type: Function,
      value: null
    },
    placeholder: {
      type: String,
      value: '搜索地址'
    }
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
