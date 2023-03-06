const cloud = require('wx-server-sdk');
const axios = require('axios');
const PINCHENGJI = 429582883

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
  async getVideoList({mid = 0, pageSize = 25, pageNum = 1}) {
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

  /**
   * 获取一个视频的前几个评论信息
   * @param aid
   * @returns {Promise<{data: null | Object}>}
   */
  async getVideoReply({aid = 0}) {
    let data = null
    try {
      if (aid) {
        const url = `https://api.bilibili.com/x/v2/reply/main?mode=3&next=0&oid=${aid}&plat=1&seek_rpid=&type=1`
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
 * 添加最新的视频数据 (取最新发布的10条)
 * @returns {Promise<void>}
 */
async function addNewListData(mid, pageSize = 10) {
  try {
    let {list, page} = await bApiList.getVideoList({mid, pageSize})
    if (list) {
      await $addTheList(list)
    }
  } catch (e) {
    console.warn('addNewData Error:', e)
    throw e
  }
}

/**
 * 更新列表最新x条的视频的关键信息
 * @param mid
 * @param x
 * @returns {Promise<void>}
 */
async function updateListData(mid, x = 20) {

  try {
    const {data: videoList} = await VIDEO
      .where({mid})
      .field({
        _id: true,
        aid: true,
        v_up_time: true,
        v_stat: true
      })
      .limit(x)
      .orderBy('created', 'desc').get()

    console.log(videoList);
    await $updateTheList(videoList)
  } catch (e) {
    console.warn('updateAllListData Error:', e)
    throw e
  }
}

/**
 * 更新列表最新x条的视频的关键信息
 * @param mid
 * @param x
 * @param skip
 * @returns {Promise<void>}
 */
async function updateListReply(mid, x = 20, skip = 0) {
  try {
    const {data: videoList} = await VIDEO
      .where({mid})
      .skip(skip)
      .limit(x)
      .orderBy('created', 'desc')
      .field({_id: true, aid: true}).get()

    console.log(videoList);
    await $updateTheListReply(videoList)
    console.log(x, skip, 'ok')
  } catch (e) {
    console.warn('updateAllListData Error:', e)
    throw e
  }
}

/**
 * 将list入库（仅对新数据）
 * @param list
 * @returns {Promise<void>}
 */
async function $addTheList(list = []) {
  for (const data of list) { // 逐条添加到数据库
    const hasData = await VIDEO.where({aid: data.aid}).limit(1).get()
    if (hasData && !hasData.data.length) { // 不操作旧数据
      let {data: vData} = await bApiList.getVideoData({aid: data.aid}); // 获取视频详情数据
      ;['meta'].forEach(key => { // 删除一些不需要的属性
        Reflect.deleteProperty(data, key)
      })
      Reflect.set(data, 'v_stat', vData.stat)
      Reflect.set(data, 'v_up_time', new Date().getTime())
      await VIDEO.add({data})
      console.log('添加一条新视频内容！', data.aid);
    }
  }
}

/**
 * 更新list的stat属性
 * @param list
 * @returns {Promise<void>}
 */
async function $updateTheList(list = []) {
  const cur = new Date().getTime()
  for (const item of list) {
    let {data: vData} = await bApiList.getVideoData({aid: item.aid})
    await VIDEO.doc(item._id)
      .update({data: {v_stat: vData.stat, v_up_time: cur}})
    console.log('更新一条新视频数据！', vData.aid);
  }
}


/**
 * 更新list的reply评论区
 * @param list
 * @returns {Promise<void>}
 */
async function $updateTheListReply(list = []) {
  for (const key in list) {
    const item = list[key]
    let {data} = await bApiList.getVideoReply({aid: item.aid})
    const {replies, top_replies} = data

    await VIDEO.doc(item._id).update({
      data: {
        reply: {
          replies, top_replies
        }
      }
    })
    console.log('更新一条新视频评论！', item.aid, key);
  }
}

/**
 * 获取一个up主并将所有视频信息存入videos表 （手动触发！）
 * @param mid
 * @returns {Promise<{msg: string, success: boolean}|{msg: string, data: *, success: boolean}>}
 */
async function addAllList(mid) {
  try {
    const _add = async pageNum => {
      let {list, page} = await bApiList.getVideoList({mid, pageSize: 25, pageNum})
      console.log(list);
      const {count, pn, ps} = page
      if (list) {
        await $addTheList(list)
        console.log(`page${pageNum}完成`)
        if ((pn * ps) < count) { // 1*50<51
          await _add(pn + 1)
        }
      }
    }
    const data = await _add(2)

    return {success: true, msg: '添加成功', data};
  } catch (e) {
    return {success: false, msg: '添加失败'};
  }
}


exports.fetchTask = async (event, context) => { // 定时触发的task 每天5点
  try {
    await addNewListData(PINCHENGJI) // 新增
    await updateListData(PINCHENGJI) // 更新
  } catch (e) {
    console.log('定时任务Error：', e);
  }
};


exports.main = async (event, context) => {
  try {
    console.log('main')

    return {success: true, msg: '执行成功', data: null};
  } catch (e) {
    return {success: false, msg: '执行失败'};
  }
};

exports.manual = async (event, context) => {
  try {
    // await addNewListData(PINCHENGJI) // 新增
    await updateListReply(PINCHENGJI, 100, 700) // 更新

    return {success: true, msg: '执行成功', data: null};
  } catch (e) {
    return {success: false, msg: '执行失败'};
  }
};

