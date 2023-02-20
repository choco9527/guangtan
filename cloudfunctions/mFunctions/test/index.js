const cloud = require('wx-server-sdk');
const rp = require('request-promise');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

// 创建集合云函数入口函数
exports.main = async (event, context) => {
  try {
    console.log('test');
    // 创建集合

    const biliRes = await rp('https://api.bilibili.com/x/space/wbi/arc/search?mid=429582883&ps=30&tid=0&pn=1&keyword=&order=pubdate&order_avoided=true&w_rid=d7d946e528c33357cbfa25b769f311f9&wts=1676807041c')
    console.log(biliRes);

    return {
      success: true
    };
  } catch (e) {
    console.warn(e);

    return {
      success: false,
      data: 'create collection success'
    };
  }
};
