exports = module.exports = {};

let mongo = require('./mongo');
let config = require('./config');
let agent = require('superagent');

const getCommand = (text) => {
  let command = text.split(' ');
  command.shift();

  return command.join(' ');
}
exports.getCommand = getCommand;

const sendMessage = async (messageBody) => {
  let agentRes = await agent.post(`${config.coolq.host}:${config.coolq.port}/send_msg`).send(messageBody);
  if (agentRes.body.status !== 'ok') {
    console.error(agentRes.body);
  }
}
exports.sendMessage = sendMessage;

let randomSplit = (value, part) => {
  let pointList = [value];
  while (pointList.length < part) {
    let point = Math.floor(Math.random() * value)
    if (!pointList.includes(point) && point) pointList.push(point);
  }
  pointList.sort((a, b) => a - b);
  let optPoint = [pointList[0]];
  for (let i = 0; i < pointList.length - 1; i++) {
    optPoint.push(pointList[i + 1] - pointList[i]);
  }
  return optPoint;
}
exports.randomSplit = randomSplit;

let dice = (times, max) => {
  let opt = [];
  for (let i = 0; i < times; i++) {
    let value = Math.ceil(Math.random() * max);
    opt.push(value);
  }
  return opt;
}
exports.dice = dice;

let diceSum = (times, max) => {
  let opt = [];
  for (let i = 0; i < times; i++) {
    let value = Math.ceil(Math.random() * max);
    opt.push(value);
  }
  return opt.reduce((a, b) => a + b, 0);
}
exports.diceSum = diceSum;

let random = (from, to) => {
  let max = to - from + 1;
  return Math.floor(Math.random() * max) + from;
}
exports.random = random;
