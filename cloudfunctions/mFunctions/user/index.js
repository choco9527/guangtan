const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

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

  const managerList = ["oiLOL5THpcMk1GydSJlz5pejV9nw"]

  return {
    OPENID,
    APPID,
    UNIONID,
    ENV,
    IS_MANAGER: true
    // IS_MANAGER: managerList.includes(OPENID)
  };
};
