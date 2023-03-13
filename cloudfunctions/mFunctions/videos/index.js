const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const VIDEO = db.collection('videos')
const USERS = db.collection('users')
const _ = db.command

// 获取搜索页视频列表
exports.getVideoList = async (event, context) => {
  try {
    const {pn = 1, search = '', orderBy = ''} = event
    const ps = 20
    const offset = (pn - 1) * ps
    let wObj = {}

    if (search) {
      const regSear = db.RegExp({regexp: search, options: 'i'})
      wObj = _.or([
        {title: regSear},
        {description: regSear}
      ])
    }

    const {data} = await VIDEO
      .where(wObj)
      .orderBy(orderBy || 'created', 'desc')
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
    const {OPENID} = cloud.getWXContext()

    const {id, latitude, longitude, item} = event
    if (!id || !latitude || !longitude) throw new Error('no id')


    const {data} = await USERS.where({_openid: OPENID}).get()
    const [userInfo] = data
    const isManager = userInfo.isManager // 普通用户更新位置需要管理员审核

    if (isManager) {
      await VIDEO.doc(id).update({
        data: {
          location: db.Geo.Point(longitude, latitude),
          locInfo: {
            content: item.title,
            ...item
          }
        }
      })
      return {success: true, msg: '更新成功', data: null};
    } else {
      return {success: true, msg: '已提交，审核后将更新位置', data: null};
    }
  } catch (e) {
    return {
      success: false,
      msg: e.message || '失败',
    };
  }
};

exports.getNearVideos = async (event, content) => {
  try {
    const _ = db.command
    const {latitude, longitude, radius = 2000} = event
    if (!latitude || !longitude || !radius) throw new Error('lack of params')

    const {data} = await VIDEO.where({
      location: _.geoNear({
        geometry: db.Geo.Point(longitude, latitude),
        minDistance: 1,
        maxDistance: radius
      })
    })
      .field({
        _id: true,
        aid: true,
        location: true,
        locInfo: true,
        v_stat: true,
        title: true,
        description: true,
      })
      .limit(100)
      .get()
    return {success: true, data};
  } catch (e) {
    console.log(e);
    return {
      success: false,
      msg: e.message || '失败',
    };
  }
}
