import {debounce} from 'xe-utils'
import { getSuggestion} from "../../js/request";

Component({
  data: {
    searchVal: '',
    searching: false,
    searchList: [], // 推荐词
  },
  properties: {
    onSuggestionSel: {
      type: Function,
      value: null,
    }
  },
  methods: {
    onSearch({detail: search}) {
      this.setData({searchVal: search})
    },
    onSearChange: debounce(function ({detail: search}) {
      if (search) {
        this.setData({searching: true})
        getSuggestion({word: search}).then(({data}) => {
          this.setSearchList(data)
        }).finally(() => {
          this.setData({searching: false})
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
    setSearchList(list) {
      this.setData({searchList: list})
    },
  }

});
