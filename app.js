'use strict'

let utils = require('./utils');
let config = require('./config');
let routes = require('./route');
let mongo = require('./mongo');
let Express = require('express');
let handler = require('./handler');

let app = new Express();

app.use(Express.json())

app.use('/', async (req, res, next) => {
  await mongo.prepare();
  next();
})

app.use('/', async (req, res, next) => {
  // 消息处理
  if (req.body.post_type === 'message') {
    // 数据预处理，剔除奇怪的符号
    req.body.message = req.body.message.split(/[ \n\t,，:：;；]/g).filter(el => el);
    for (let routeName of Object.keys(routes)) {
      let route = routes[routeName]
      if (RegExp(`^\.${routeName}$`).test(req.body.message[0])) {
        req.body.message = req.body.message.join(' ')
        console.log(`${req.body.sender.nickname}: ${req.body.message}`);
        let message = req.body.message.split(' ');
        message.shift();
        message = message.join(' ')

        let sender = req.body.sender;

        let output;
        try {
          output = await route.handler(message, sender);
          if (output === undefined) break;;
        } catch (err) {
          output = `Error: ${err.message}`;
          console.error(err);
        }
        if (req.body.message_type === 'group') {
          await utils.sendMessage({
            group_id: req.body.group_id,
            message: sender.nickname + ': ' + output
          });
          break;
        }
        if (req.body.message_type === 'private') {
          await utils.sendMessage({
            user_id: req.body.user_id,
            message: sender.nickname + ': ' + output
          });
          break;
        }
      }
    };
  }
  // 请求处理
  if (req.body.post_type === 'request') {
    if (req.body.request_type === 'group' && req.body.sub_type === 'invite') {
      return await handler.acceptGroupInvite(req, res);
    }
    
    if (req.body.request_type === 'friend') {
      return await handler.acceptFriendInvite(req, res);
    }
  }
  return res.send({ status: 'ok' });
})

app.listen(config.listenPort, function () {
  console.log(`Listening on port ${config.listenPort} now!`);
});