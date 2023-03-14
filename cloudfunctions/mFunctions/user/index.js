const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const USERS = db.collection('users')

// 获取openId云函数入口函数
exports.main = async (event, context) => {
  try {
    // 获取基础信息
    const {OPENID, APPID, UNIONID, ENV} = cloud.getWXContext()

    const {data} = await USERS.where({_openid: OPENID}).get()
    const [userInfo] = data

    let INFO = {_openid: OPENID, avatar: '', nickname: ''}
    if (userInfo) { // 已注册
      INFO = userInfo
    } else { // 自动注册
      await USERS.add({
        data: {
          _openid: OPENID,
          _unionid: UNIONID,
          avatar: '',
          nickname: '',
          appid: APPID,
          env: ENV,
          isManager: false
        }
      })
    }

    const d = {
      OPENID,
      IS_MANAGER: INFO.isManager || false,
      INFO
    };
    return {success: true, data: d};
  } catch (e) {
    console.log(e);
    return {success: true, msg: '获取基础信息失败'};
  }
};

exports.update = async (event, context) => {
  try {
    // 更新基础信息
    const {params} = event
    const reqData = {}
    Reflect.ownKeys(params).forEach(key => {
      if (['avatar', 'nickname'].includes(key)) {
        reqData[key] = params[key]
      }
    })
    if (reqData.nickname) { // 用户名不可重复
      const {data: hasUser} = await USERS.where({
        nickname: reqData.nickname
      }).get()
      if (hasUser.length) {
        throw new Error('该昵称已被人使用，请换一个吧')
      }
    }
    if (JSON.stringify(reqData) !== '{}') {
      const {OPENID} = cloud.getWXContext()

      const data = await USERS.where({
        _openid: OPENID
      }).update({
        data: reqData
      })

      return {success: true, msg: '更新成功', data};
    }
    return {success: false, msg: '更新失败'};
  } catch (e) {
    console.log(e);
    return {success: false, msg: e.message || '更新失败'};
  }
};
