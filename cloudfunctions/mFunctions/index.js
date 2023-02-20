const createCollection = require('./createCollection/index');
const test = require('./test/index');

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'createCollection':
      return await createCollection.main(event, context);
    case 'test':
      return await test.main(event, context);
  }
};
