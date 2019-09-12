exports = module.exports = {
  coolq: {
    host: 'http://xxxx.xxx', // 这里填的是 coolq-http-api 部署的机器 ip 或域名
    port: 5700, // 这里填的是 coolq-http-api 部署的端口
  },

  mongo: { // to save bot message
    host: 'localhost',
    databaseName: 'dice',
    username: '',
    password: '',
    port: '27017',
  },

  listenPort: 9129, // 本项目的监听端口，coolq-http-api 的事件推送端口
  adminIdList: [
    1234567890,
  ], // 这里填的是管理员的 qq 号，支持多个管理员，允许管理员使用管理命令。
}
