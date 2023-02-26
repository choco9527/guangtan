const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 获取搜索页视频列表
exports.getVideoList = async (event, context) => {
  try {
    const {pn = 1} = event
    const ps = 20
    const videoDb = db.collection('videos')
    const offset = (pn - 1) * ps
    const {data} = await videoDb.where({
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
        v_data: true
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
      msg: '获取失败',
    };
  }
};
