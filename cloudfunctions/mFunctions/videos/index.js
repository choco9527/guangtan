const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const VIDEO = db.collection('videos')

// 获取搜索页视频列表
exports.getVideoList = async (event, context) => {
  try {
    const {pn = 1} = event
    const ps = 20
    const offset = (pn - 1) * ps
    const {data} = await VIDEO.where({
      // aid: 525048109,
    })
      .orderBy('created', 'desc')
      .skip(offset).limit(ps)
      .field({
        title: true,
        play: true,
        comment: true,
        video_review: true,
        created: true,
        pic: true,
        v_stat: true,
        locInfo: true,
        reply: true,
      })
      .get()

    return {
      success: true,
      msg: '',
      data,
      pn
    };
  } catch (e) {
    return {
      success: false,
      msg: e.message || '失败',
    };
  }
};


// 获取单个视频信息
exports.getVideo = async (event, context) => {
  try {
    const {id} = event
    if (!id) throw new Error('no id')
    const {data} = await VIDEO.doc(id).get()

    return {
      success: true,
      msg: '',
      data,
    };
  } catch (e) {
    return {
      success: false,
      msg: e.message || '失败',
    };
  }
};

// 更新视频位置信息
exports.updateVideoLocation = async (event, context) => {
  try {
    const {id, latitude, longitude, content} = event
    if (!id || !latitude || !longitude) throw new Error('no id')
    const res = await VIDEO.doc(id).update({
      data: {
        locInfo: {
          content,
          location: db.Geo.Point(longitude, latitude)
        }
      }
    })

    return {
      success: true,
      msg: '更新成功',
      data: res
    };
  } catch (e) {
    return {
      success: false,
      msg: e.message || '失败',
    };
  }
};
