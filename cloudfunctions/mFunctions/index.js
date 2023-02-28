const videos = require('./videos/index');
const fetchData = require('./fetchData/index');

// 云函数入口函数
exports.main = async (event, context) => {

  if (event.Type === 'timer' && event.TriggerName === 'myTrigger') { // 定时器函数
    return await fetchData.fetchTask(event, context);
  }

  switch (event.type) {
    case 'getVideoList':
      return await videos.getVideoList(event, context);
    case 'main':
      return await fetchData.main(event, context);
  }
};
