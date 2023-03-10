const videos = require('./videos/index');
const user = require('./user/index');
const fetchData = require('./fetchData/index');

// 云函数入口函数
exports.main = async (event, context) => {

  if (event.Type === 'timer' && event.TriggerName === 'myTrigger') { // 定时器函数
    return await fetchData.fetchTask(event, context);
  }

  switch (event.type) {
    case 'getUserInfo':
      return await user.main(event, context); // 获取用户信息
    case 'updateUserInfo':
      return await user.update(event, context); // 获取用户信息
    case 'getVideo':
      return await videos.getVideo(event, context); // 获取用户信息
    case 'getVideoList':
      return await videos.getVideoList(event, context);
    case 'updateVideoLocation': // 更新视频内地址
      return await videos.updateVideoLocation(event, context);
    case 'getLocVideos': // 获取标记点范围内的坐标
      return await videos.getLocVideos(event, context);

    case 'main': // 主
      return await fetchData.main(event, context);
    case 'manual': // 手动触发
      return await fetchData.manual(event, context);
  }
};
