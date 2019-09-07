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
}
