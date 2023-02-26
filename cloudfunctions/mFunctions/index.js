const createCollection = require('./createCollection/index');
const fetchData = require('./fetchData/index');

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'createCollection':
      return await createCollection.main(event, context);
    case 'getList':
      return await fetchData.getList(event, context);
  }
};
