const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const USERS = db.collection('users')

// 获取openId云函数入口函数
exports.main = async (event, context) => {
  // 获取基础信息
  const wxContext = cloud.getWXContext();
  const {
    OPENID,
    APPID,
    UNIONID,
    ENV,
  } = cloud.getWXContext()

  const {data} = await USERS.where({
    _openid: OPENID
  }).get()
  const [userInfo] = data

  let INFO = {}

  if (userInfo) {
    INFO = userInfo
  } else {
    await USERS.add({
      data: {
        _openid: OPENID,
        _unionid: UNIONID,
        avatar: '',
        nickname: ''
      }
    })
    INFO = {
      _openid: OPENID,
      avatar: '',
      nickname: ''
    }
  }

  const managerList = ["oiLOL5THpcMk1GydSJlz5pejV9nw"]

  return {
    OPENID,
    // APPID,
    UNIONID,
    // ENV,
    IS_MANAGER: true,
    // IS_MANAGER: managerList.includes(OPENID)
    INFO
  };
};

exports.update = async (event, context) => {
  try {
    // 获取基础信息
    const {params} = event
    const reqData = {}
    Reflect.ownKeys(params).forEach(key => {
      if (['avatar', 'nickname'].includes(key)) {
        reqData[key] = params[key]
      }
    })
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
    return {success: false, msg: '更新失败'};
  }
};
