const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const VIDEO = db.collection('videos')
const USERS = db.collection('users')
const AUDITS = db.collection('audits')
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

    const isManager = await _isManager()

    const saveData = {
      location: db.Geo.Point(longitude, latitude),
      locInfo: {
        content: item.title,
        ...item
      }
    }

    if (isManager) {
      const r = await VIDEO.doc(id).update({
        data: saveData
      })
      return {success: true, msg: '更新成功', data: r};
    } else {
      const r = await AUDITS.add({
        data: {
          ...saveData, videoId: id, status: 0,
          byOpenId: OPENID,
          created: new Date().getTime()
        }
      })
      return {success: true, msg: '已提交，审核后将更新位置', data: r};
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

exports.getAuditList = async (event, content) => {
  try {
    const isManager = await _isManager()
    if (!isManager) throw new Error('非管理员')

    const {status = 0, pn = 0, ps = 20} = event
    const offset = (pn - 1) * ps

    const {data} = await AUDITS.where({
      status // 待审核
    })
      .skip(offset)
      .limit(ps)
      .orderBy('created', 'asc')
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

// 审核视频
exports.auditVideo = async (event, content) => {
  try {
    const isManager = await _isManager()
    if (!isManager) throw new Error('非管理员')

    const {item, status} = event

    const {locInfo, _id, videoId} = item

    if (!locInfo || !_id || !videoId) throw new Error('参数缺失')
    const aR = await AUDITS.doc(item._id).update({
      data: {status: parseInt(status)}
    })
    const {lng: longitude, lat: latitude} = locInfo.location

    if (parseInt(status) === 1) {
      const saveData = {
        location: db.Geo.Point(longitude, latitude),
        locInfo
      }
      const r = await VIDEO.doc(videoId).update({
        data: saveData
      })
      return {success: true, msg: '审核通过', data: r};
    }
    return {success: true, msg: '已拒绝', data: aR};
  } catch (e) {
    console.log(e);
    return {
      success: false,
      msg: e.message || '失败',
    };
  }
}

async function _isManager() {
  try {
    const {OPENID} = cloud.getWXContext()
    const {data: [userInfo]} = await USERS.where({_openid: OPENID}).get()
    return userInfo.isManager || false
  } catch (e) {
    return false
  }
}

