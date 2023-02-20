const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 创建集合云函数入口函数
exports.main = async (event, context) => {
  try {
    console.log('choco创建集合云函数入口函数');
    // 创建集合
    const res = await db.createCollection('videos');
    console.log('创建集合云函数入口函数choco videos', res)

    await db.collection('videos').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        "comment": 43,
        "typeid": 212,
        "play": 6563,
        "pic": "http://i0.hdslb.com/bfs/archive/95c8b1ac9d5496e26453cbed29ceb1f49085ad64.jpg",
        "subtitle": "",
        "description": "",
        "copyright": "1",
        "title": "【品城记】咸烧骨也能做出五道菜？从没想过烧骨也能如此惹味！",
        "review": 0,
        "author": "品城记本地版",
        "mid": 429582883,
        "created": 1676797200,
        "length": "05:23",
        "video_review": 72,
        "aid": 779687715,
        "bvid": "BV1Yy4y1Z7Cq",
        "hide_click": false,
        "is_pay": 0,
        "is_union_video": 0,
        "is_steins_gate": 0,
        "is_live_playback": 0,
        "meta": {
          "id": 3316,
          "title": "各地土特产合集",
          "cover": "https://i0.hdslb.com/bfs/archive/add6dab76c06746446eb67d42acae99b3edd2025.jpg",
          "mid": 429582883,
          "intro": "大秋、嘉昇推荐的美食都在这里~",
          "sign_state": 0,
          "attribute": 140,
          "stat": {
            "season_id": 3316,
            "view": 7004587,
            "danmaku": 59274,
            "reply": 22697,
            "favorite": 26167,
            "coin": 99948,
            "share": 22391,
            "like": 353033
          },
          "ep_count": 103,
          "first_aid": 716325024,
          "ptime": 1676797200,
          "ep_num": 0
        },
        "is_avoided": 0,
        "attribute": 0
      },
    });

    return {
      success: true
    };
  } catch (e) {
    // 这里catch到的是该collection已经存在，从业务逻辑上来说是运行成功的，所以catch返回success给前端，避免工具在前端抛出异常
    return {
      success: true,
      data: 'create collection success'
    };
  }
};
