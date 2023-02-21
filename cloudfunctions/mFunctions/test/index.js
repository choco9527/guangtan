const cloud = require('wx-server-sdk');
const axios = require('axios');
import {bApiList} from "../utils";

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

// 创建集合云函数入口函数
exports.main = async (event, context) => {
  try {
    console.log('获取b站列表信息');
    // 获取b站列表信息

    const biliRes = await axios.get(bApiList)
    let list = []
    if (biliRes.data && biliRes.data.code===0){
      list = biliRes.data.list.vList
    }
    console.log(list);

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
