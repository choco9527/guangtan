const cloud = require('wx-server-sdk');
const axios = require('axios');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const VIDEO = db.collection('videos')

const bApiList = { // b站请求api
  /**
   * 获取b站某up下视频，按时间排序
   * @param mid 某up主id
   * @param pageSize
   * @param pageNum
   * @returns {string}
   */
  async getVideoList({mid = 0, pageSize = 40, pageNum = 1}) {
    let list = null, page = null
    try {
      if (mid) {
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
      return {list, page}
    }
  },
  /**
   * 获取一个视频的详细信息 aid 或bvid https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/video/info.md
   * @param aid
   * @param bvid
   * @returns {Promise<{data: null | Object}>}
   */
  async getVideoData({aid = 0, bvid = ''}) {
    let data = null
    try {
      if (aid || bvid) {
        const url = `https://api.bilibili.com/x/web-interface/view?aid=${aid}&bvid=${bvid}`
        const {data: biliRes} = await axios.get(url)
        if (biliRes && biliRes.code === 0) {
          data = biliRes.data
        }
        return {data}
      } else {
        throw new Error('no mid')
      }
    } catch (e) {
      console.warn('getVideoList Error', e)
      return {data}
    }
  },
}

/**
 * 更新最新的视频数据 取最新发布的10条
 * @returns {Promise<void>}
 */
async function addNewData(mid) {
  try {
    let {list, page} = await bApiList.getVideoList({mid, pageNum, pageSize: 10})
    if (list) {
      for (const data of list) { // 逐条添加到数据库
        const hasData = await VIDEO.where({aid: data.aid}).limit(1).get()
        if (hasData && !hasData.data.length) { // 不操作旧数据
          let {data: vData} = await bApiList.getVideoData({aid: data.aid})
          Reflect.set(data, 'stat', vData.stat)
          await VIDEO.add({data})
          console.log('添加新视频内容', data.aid);
        }
      }
    }
  } catch (e) {
    console.warn('addNewData Error:', e)
    throw e
  }
}

/**
 * 更新列表最新50条的视频的关键信息
 * @returns {Promise<void>}
 */
async function updateAllListData(mid) {
  const day7 = 1000 * 3600 * 24 * 7
  const _ = db.command

  try {
    const {data: videoList} = await VIDEO
      .where({
        mid,
        v_data: _.eq(null),
      })
      .field({
        _id: true,
        aid: true,
        v_up_time: true,
        v_data: true
      })
      .limit(20)
      .orderBy('created', 'desc').get()

    const cur = new Date().getTime()
    console.log(videoList);
    for (const item of videoList) {
      let {data: vData} = await bApiList.getVideoData({aid: item.aid})
      console.log(vData.aid, vData.stat);
      const upRes = await VIDEO
        .doc(item._id)
        .set({
          data: {
            v_data: vData.stat,
            v_up_time: cur
          }
        })
      console.log('更新成功', upRes);
    }
  } catch (e) {
    console.warn('updateAllListData Error:', e)
    throw e
  }
}

/**
 * 获取并将所有列表信息存入videos表 （手动触发）
 * @param mid
 * @returns {Promise<{msg: string, success: boolean}|{msg: string, data: *, success: boolean}>}
 */
async function getAllList(mid) {
  try {
    const VIDEO = db.collection('videos')
    const _add = async pageNum => {
      let {list, page} = await bApiList.getVideoList({mid, pageSize: 20})
      console.log(list);
      const {count, pn, ps} = page

      if (list) {
        for (const data of list) { // 逐条添加到数据库
          await VIDEO.add({
            data // data 字段表示需新增的 JSON 数据
          })
          console.log('添加成功', data.aid);
        }
        console.log(`page${pageNum}完成`)

        if ((pn * ps) < count) { // 1*50<51
          await _add(pn + 1)
        }
        return list
      }
    }
    const data = await _add(11)

    return {
      success: true,
      msg: '添加成功',
      data
    };
  } catch (e) {
    return {
      success: false,
      msg: '添加失败',
    };
  }
};

// 获取最新列表信息存入videos表
exports.updateList = async (event, context) => {
  try {
    await updateAllListData(429582883)
    return {success: true};
  } catch (e) {
    return {success: false};
  }
};


exports.fetchTask = async (event, context) => { // 定时触发的task 每天5点
  try {
    await addNewData(429582883) // 更新列表
  } catch (e) {
    console.log('定时任务Error：', e);
  }
};


exports.main = async (event, context) => {
  try {

    return {
      success: true,
      msg: '添加成功',
      data: null
    };
  } catch (e) {
    return {
      success: false,
      msg: '添加失败',
    };
  }
};

