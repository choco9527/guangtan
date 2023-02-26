const cloud = require('wx-server-sdk');
const axios = require('axios');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const bApiList = { // b站请求api
  /**
   * 获取b站某
   * @param mid 某up主id
   * @param pageSize
   * @param pageNum
   * @returns {string}
   */
  async getVideoList({mid = 0, pageSize = 50, pageNum = 1}) {
    try {
      if (mid) {
        let list = null, page = null
        const url = `https://api.bilibili.com/x/space/wbi/arc/search?mid=${mid}&ps=${pageSize}&tid=0&pn=${pageNum}&order=pubdate&order_avoided=true`
        const {data: biliRes} = await axios.get(url)
        if (biliRes && biliRes.code === 0) {
          list = biliRes.data.list.vlist
          page = biliRes.data.page
        }
        return {list, page}
      } else {
        throw new Error('no mid')
      }
    } catch (e) {
      console.warn('getVideoList Error', e)
      return null
    }
  },
}

const db = cloud.database();

// 获取并将列表信息存入videos表
exports.getList = async (event, context) => {
  try {
    const videoDb = db.collection('videos')
    let list = await bApiList.getVideoList({mid: 429582883, pageNum: 1})
    if (list) {
      for (const data of list) {
        videoDb.add({
          data // data 字段表示需新增的 JSON 数据
        }).then(res => {
          console.log('res', res);
        }).catch(err => {
          console.log('err', err)
        })
      }
    }

    return {
      success: true,
      msg: '添加成功',
      data: list
    };
  } catch (e) {
    return {
      success: false,
      msg: '添加失败',
    };
  }
};

exports.main = async (event, context) => {
  try {
    const videoDb = db.collection('videos')
    let list = await bApiList.getVideoList({mid: 429582883})
    if (list) {
      for (const data of list) {
        videoDb.add({
          data // data 字段表示需新增的 JSON 数据
        }).then(res => {
          console.log('res', res);
        }).catch(err => {
          console.log('err', err)
        })
      }
    }

    return {
      success: true,
      msg: '添加成功',
      data: list
    };
  } catch (e) {
    return {
      success: false,
      msg: '添加失败',
    };
  }
};

