'use strict';

exports = module.exports = {};

let mongo = require('./mongo');
let utils = require('./utils');
let routes = require('./route');
let arknightsMemberData = require('./data/arknights_member.json');
let defaultSkill = require('./data/default_skill.json');


exports.set = async function (message, sender) {
  let messageArray = message.split(/[ \.\n\t:;；]/g).filter(el => el);
  let userBody = {};
  let successMessage = [];
  for (let i = 0; i < messageArray.length; i += 2) {
    if (messageArray[i] === undefined || messageArray[i + 1] === undefined) continue;
    userBody[messageArray[i]] = messageArray[i + 1];
    successMessage.push(`${messageArray[i]}: ${messageArray[i + 1]}`);
  }
  if (!successMessage.length) return '你什么都没有设置哦。请使用 .help set 查看使用方式'
  await mongo.User.updateOne(
    { id: sender.user_id },
    { $set: userBody },
    { upsert: true }
  );
  return '属性设置成功。你设置的属性为：\n' + successMessage.join('\n');
}

exports.get = async function (message, sender) {
  let messageArray = message.split(/[ \.\n\t:;；]/g).filter(el => el);

  let userInfo = await mongo.User.findOne({ id: sender.user_id });
  if (!userInfo) return '你目前还没有录入任何属性';
  delete userInfo._id;
  delete userInfo.id;
  let opt = [];
  if (!messageArray.length) {
    Object.keys(userInfo).forEach(key => opt.push(`${key}: ${userInfo[key]}`));
    return '\n' + opt.join('\n');
  } else {
    messageArray.forEach(key => opt.push(`${key}: ${userInfo[key]}`));
    return '\n' + opt.join('\n');
  }
}

exports.del = async function (message, sender) {
  let messageArray = message.split(/[ \.\n\t:;；]/g).filter(el => el);
  if (!messageArray.length) {
    await mongo.User.deleteOne({ id: sender.user_id });
  } else {
    let deleteBody = { $unset: {} };
    messageArray.forEach(param => deleteBody.$unset[param] = 1);
    await mongo.User.updateOne(
      { id: sender.user_id },
      deleteBody,
    );
  }
  return '属性删除成功~'
}

exports.rc = async function (message, sender) {
  let userInfo = await mongo.User.findOne({ id: sender.user_id });
  let messageArray = message.split(/[ \.\n\t:;；]/g).filter(el => el);
  let params = messageArray[0];
  let opt = ''
  if (!userInfo[params]) {
    if (defaultSkill[params] === undefined) return '不存在这个技能，请检查技能名称是否正确。\n请细化到次级分类，例如射击:弓术，你只需要输入.rc 弓术即可。\n如果武器为步枪/霰弹枪。你只需要输入.rc 步枪或.rc 霰弹枪。'
    opt += '你没有这个技能/属性。采用默认值进行判定。\n';
    userInfo[params] = defaultSkill[params];
  }
  let randomNumber = Math.ceil(Math.random() * 100);
  if (randomNumber <= userInfo[params] && randomNumber <= 1) return opt + `${params}大成功: ${randomNumber} / ${userInfo[params]}`
  if (randomNumber <= userInfo[params] / 5) return opt + `${params}极限成功: ${randomNumber} / ${userInfo[params]}`
  if (randomNumber <= userInfo[params] / 2) return opt + `${params}艰难成功: ${randomNumber} / ${userInfo[params]}`
  if (randomNumber <= userInfo[params]) return opt + `${params}成功: ${randomNumber} / ${userInfo[params]}`

  if (randomNumber > userInfo[params] && randomNumber >= 95) return opt + `${params}大失败: ${randomNumber} / ${userInfo[params]}`
  if (randomNumber > userInfo[params]) return opt + `${params}失败: ${randomNumber} / ${userInfo[params]}`
}

exports.rd = async function (message, sender) {
  let userInfo = await mongo.User.findOne({ id: sender.user_id });
  let messageArray = message.split(/[ \.\n\t:;；]/g).filter(el => el);
  let params = messageArray[0];
  if (!userInfo[params]) return '你没有这个技能/属性。';
  let randomNumber = Math.ceil(Math.random() * 20);
  if (randomNumber <= userInfo[params] && randomNumber <= 1) return `${params}大成功: ${randomNumber} / ${userInfo[params]}`
  if (randomNumber <= userInfo[params] / 5) return `${params}极限成功: ${randomNumber} / ${userInfo[params]}`
  if (randomNumber <= userInfo[params] / 2) return `${params}艰难成功: ${randomNumber} / ${userInfo[params]}`
  if (randomNumber <= userInfo[params]) return `${params}成功: ${randomNumber} / ${userInfo[params]}`

  if (randomNumber > userInfo[params] && randomNumber >= 20) return `${params}大失败: ${randomNumber} / ${userInfo[params]}`
  if (randomNumber > userInfo[params]) return `${params}失败: ${randomNumber} / ${userInfo[params]}`
}

exports.dice = async function (message, sender) {
  let messageArray = message.split(/[ \.\n\t:;；]/g).filter(el => el);
  let params = messageArray[0];
  let dice = params.split(/[Dd]/g).filter(el => el);
  let times = dice[0];
  let max = dice[1];
  let dicePoint = utils.dice(times, max);
  let opt = [];
  for (let i = 0; i < dicePoint.length; i++) {
    opt.push(`第${i + 1}个骰子的值为: ${dicePoint[i]}`);
  }
  opt.push(`共计: ${dicePoint.reduce((a, b) => a + b, 0)}`);
  return '\n' + opt.join('\n');
}

exports.coc7 = async function (message, sender) {
  // let userinfo = await userParams.findOne({ id: sender.user_id });
  let messageArray = message.split(/[ \.\n\t:;；]/g).filter(el => el);
  let userBody = {};
  for (let i = 0; i < messageArray.length; i += 2) {
    userBody[messageArray[i]] = messageArray[i + 1];
  }
  let params1 = ['力量', '敏捷', '意志', '体质', '外貌', '幸运'];
  let params2 = ['教育', '体型', '智力'];

  // 随机基础属性
  let buildObj = {};
  for (let param of params1) {
    buildObj[param] = (utils.diceSum(3, 6)) * 5;
  }
  for (let param of params2) {
    buildObj[param] = (utils.diceSum(2, 6) + 6) * 5;
  }
  buildObj.灵感 = buildObj.智力;

  //#region 计算年龄 buff 以及 debuff
  let ageBuff = 0;
  let moveBuff = 0;
  buildObj.年龄 = userBody.年龄 || utils.random(15, 89);
  if (buildObj.年龄 <= 19) {
    buildObj.力量 -= 5;
    buildObj.体型 -= 5;
    buildObj.幸运 = Math.max(buildObj.幸运, (utils.diceSum(3, 6)) * 5);
  }
  if (buildObj.年龄 >= 20 && buildObj.年龄 <= 39) {
    ageBuff = 1;
  }
  if (buildObj.年龄 >= 40 && buildObj.年龄 <= 49) {
    ageBuff = 2;
    moveBuff = -1;
    buildObj.外貌 -= 5;
    let deBuff = utils.randomSplit(5, 3);
    buildObj.力量 -= deBuff[0];
    buildObj.体质 -= deBuff[1];
    buildObj.敏捷 -= deBuff[2];
  }
  if (buildObj.年龄 >= 50 && buildObj.年龄 <= 59) {
    ageBuff = 3;
    moveBuff = -2;
    buildObj.外貌 -= 5;
    let deBuff = utils.randomSplit(10, 3);
    buildObj.力量 -= deBuff[0];
    buildObj.体质 -= deBuff[1];
    buildObj.敏捷 -= deBuff[2];
  }
  if (buildObj.年龄 >= 60 && buildObj.年龄 <= 69) {
    ageBuff = 4;
    moveBuff = -3
    buildObj.外貌 -= 10;
    let deBuff = utils.randomSplit(20, 3);
    buildObj.力量 -= deBuff[0];
    buildObj.体质 -= deBuff[1];
    buildObj.敏捷 -= deBuff[2];
  }
  if (buildObj.年龄 >= 70 && buildObj.年龄 <= 79) {
    ageBuff = 4;
    moveBuff = -4
    buildObj.外貌 -= 15;
    let deBuff = utils.randomSplit(40, 3);
    buildObj.力量 -= deBuff[0];
    buildObj.体质 -= deBuff[1];
    buildObj.敏捷 -= deBuff[2];
  }
  if (buildObj.年龄 >= 80) {
    ageBuff = 4;
    moveBuff = -5
    buildObj.外貌 -= 20;
    let deBuff = utils.randomSplit(80, 3);
    buildObj.力量 -= deBuff[0];
    buildObj.体质 -= deBuff[1];
    buildObj.敏捷 -= deBuff[2];
  }

  // 如果把角色车死了那就重新车。。
  if (buildObj.力量 < 15
    || buildObj.体质 < 15
    || buildObj.敏捷 < 15) {
    return exports.coc7(message, sender);
  }

  while (ageBuff--) {
    if (Math.ceil(Math.random() * 100) > buildObj.教育) {
      let buff = utils.diceSum(1, 10);
      buildObj.教育 += buff;
    }
  }
  // #endregion

  if (buildObj.敏捷 < buildObj.体型 && buildObj.力量 < buildObj.体型) buildObj.移动力 = 7;
  if (buildObj.敏捷 > buildObj.体型 && buildObj.力量 > buildObj.体型) buildObj.移动力 = 9;
  buildObj.移动力 = 8;

  buildObj.移动力 += moveBuff;

  buildObj.生命 = Math.floor((buildObj.体质 + buildObj.体型) / 10);
  buildObj.魔法 = Math.floor(buildObj.意志 / 10);
  buildObj.理智 = buildObj.意志;

  let doom = buildObj.力量 + buildObj.体型;
  if (doom <= 64) {
    buildObj.伤害加深 = -2;
    buildObj.体格 = -2
  } else if (doom <= 84) {
    buildObj.伤害加深 = -1;
    buildObj.体格 = -1
  } else if (doom <= 124) {
    buildObj.伤害加深 = 0;
    buildObj.体格 = 0
  } else if (doom <= 164) {
    buildObj.伤害加深 = '1d4';
    buildObj.体格 = 1
  } else if (doom <= 204) {
    buildObj.伤害加深 = '1d6';
    buildObj.体格 = 2
  }

  let buildStr = [];
  for (let key of Object.keys(buildObj)) {
    buildStr.push(key);
    buildStr.push(buildObj[key]);
  }
  return exports.set(buildStr.join(' '), sender);
}

exports.add = async function (message, sender) {
  let userInfo = await mongo.User.findOne({ id: sender.user_id });
  let messageArray = message.split(/[ \.\n\t:;；]/g).filter(el => el);

  for (let i = 0; i < messageArray.length; i += 2) {
    if (!userInfo || userInfo[messageArray[i]] === undefined) return `${messageArray[i]}还没有初始值。`
  }

  let userBody = {};
  for (let i = 0; i < messageArray.length; i += 2) {
    userBody[messageArray[i]] = Math.floor(userInfo[messageArray[i]]) + Math.floor(messageArray[i + 1]);
  }
  await mongo.User.updateOne(
    { id: sender.user_id },
    { $set: userBody },
    { upsert: true }
  );
  let opt = [];
  Object.keys(userBody).forEach(key => opt.push(`${key}: ${userBody[key]}`));
  return `恢复成功，当前数值为\n${opt.join('\n')}`
}

exports.dec = async function (message, sender) {
  let userInfo = await mongo.User.findOne({ id: sender.user_id });
  let messageArray = message.split(/[ \.\n\t:;；]/g).filter(el => el);

  for (let i = 0; i < messageArray.length; i += 2) {
    if (!userInfo || userInfo[messageArray[i]] === undefined) return `${messageArray[i]}还没有初始值。`
  }

  let userBody = {};
  for (let i = 0; i < messageArray.length; i += 2) {
    userBody[messageArray[i]] = Math.floor(userInfo[messageArray[i]]) - Math.floor(messageArray[i + 1]);
  }
  await mongo.User.updateOne(
    { id: sender.user_id },
    { $set: userBody },
    { upsert: true }
  );

  let opt = [];
  Object.keys(userBody).forEach(key => opt.push(`${key}: ${userBody[key]}`));
  return `扣除成功，当前数值为\n${opt.join('\n')}`
}

exports.save = async function (message, sender) {
  let userInfo = await mongo.User.findOne({ id: sender.user_id });
  let messageArray = message.split(/[ \.\n\t:;；]/g).filter(el => el);
  delete userInfo._id;
  userInfo.saveName = messageArray[0];
  if (!userInfo.saveName) return '存档一定要有名称哦。'
  await mongo.Save.deleteMany({
    id: sender.user_id,
    saveName: messageArray[0],
  })
  await mongo.Save.updateOne(
    {
      id: sender.user_id,
      saveName: messageArray[0],
    },
    { $set: userInfo },
    { upsert: true }
  );

  return `存档成功，你随时可以通过.import ${messageArray[0]}取出这份存档。`
}

exports.listSave = async function (message, sender) {
  let saveList = await mongo.Save.find({ id: sender.user_id }, { saveName: 1 }).toArray();
  return saveList.length ? `你目前存在如下存档: \n${saveList.map(el => el.saveName).join('\n')}` : '你还没有任何存档'
}

exports.delSave = async function (message, sender) {
  let messageArray = message.split(/[ \.\n\t:;；]/g).filter(el => el);
  await mongo.Save.deleteMany({ saveName: { $in: messageArray } });
  return `指定存档已删除，` + await exports.listSave('', sender);
}

exports.import = async function (message, sender) {
  let messageArray = message.split(/[ \.\n\t:;；]/g).filter(el => el);
  await mongo.User.deleteOne({
    id: sender.user_id,
  })
  let userInfo = await mongo.Save.findOne(
    {
      id: sender.user_id,
      saveName: messageArray[0],
    }
  );
  if (!userInfo) return '没有找到指定存档。' + await exports.listSave('', sender);
  delete userInfo.saveName;
  delete userInfo._id;
  await mongo.User.updateOne(
    {
      id: sender.user_id,
    },
    { $set: userInfo },
    { upsert: true }
  );

  return `取出成功，你的人物卡已被覆盖。` + await exports.get('', sender);
}

exports.allowGroup = async function (message, sender) {
  if (!utils.isAdmin(sender.user_id)) {
    return '你在想🍑。'
  }
  let messageArray = message.split(/[ \.\n\t:;；]/g).filter(el => el);
  try {
    messageArray = messageArray.map((groupId) => parseInt(groupId, 10));
  } catch (err) {
    return '传入的群号不合规哦';
  }
  mongo.WhiteList.insertMany(messageArray.map(groupId => ({
    id: groupId,
    type: 'group',
    operatorId: sender.user_id,
    createdAt: new Date()
  })));

  return '添加成功';
}

exports.removeGroup = async function (message, sender) {
  if (!utils.isAdmin(sender.user_id)) {
    return '你在想🍑。'
  }
  let messageArray = message.split(/[ \.\n\t:;；]/g).filter(el => el);
  try {
    messageArray = messageArray.map((groupId) => parseInt(groupId, 10));
  } catch (err) {
    return '传入的群号不合规哦';
  }
  await mongo.WhiteList.deleteMany({ groupId: { $in: messageArray }, type: 'group' });
  let groupList = await utils.getGroupList();
  messageArray = messageArray.filter(groupId => groupList.map(groupInfo => groupInfo.group_id).includes(groupId));
  await Promise.all(messageArray.map(groupId => utils.leaveGroup(groupId)));

  return '移除成功。'
}

exports.allowFriend = async function (message, sender) {
  if (!utils.isAdmin(sender.user_id)) {
    return '你在想🍑。'
  }
  let messageArray = message.split(/[ \.\n\t:;；]/g).filter(el => el);
  try {
    messageArray = messageArray.map((groupId) => parseInt(groupId, 10));
  } catch (err) {
    return '传入的QQ号不合规哦';
  }
  mongo.WhiteList.insertMany(messageArray.map(groupId => ({
    id: groupId,
    type: 'friend',
    operatorId: sender.user_id,
    createdAt: new Date()
  })));

  return '添加成功';
}

exports.removeFriend = async function (message, sender) {
  if (!utils.isAdmin(sender.user_id)) {
    return '你在想🍑。'
  }
  let messageArray = message.split(/[ \.\n\t:;；]/g).filter(el => el);
  try {
    messageArray = messageArray.map((groupId) => parseInt(groupId, 10));
  } catch (err) {
    return '传入的QQ号不合规哦';
  }
  await mongo.WhiteList.deleteMany({ groupId: { $in: messageArray }, type: 'friend' });

  return '移除成功。'
}

exports.arknights = async function (message, sender) {
  let tagList = message.split(' ');
  if (tagList.length > 6) return '标签太多了啊，朋友'

  let getMap = (tagList) => {
    let tagMap = [[]];
    for (let tag of tagList) {
      let tempMap = Array.from(tagMap);
      tempMap = tempMap.map(el => Array.from(el));
      tempMap.forEach(el => el.push(tag));
      tagMap = tagMap.concat(tempMap);
    }
    tagMap.shift()
    return tagMap;
  }

  let getMember = (tagList) => {
    let memberSet = new Set();
    let minStar = 6;
    for (let memberInfo of arknightsMemberData) {
      let flag = true;
      for (let tag of tagList) {
        if (!memberInfo.tags.includes(tag)) {
          flag = false;
          break;
        }
      }
      if (flag) {
        if (memberInfo.star < minStar) {
          minStar = memberInfo.star;
        }
        memberSet.add(memberInfo);
      }
    }
    let memberList = Array.from(memberSet);
    memberList.sort((a, b) => b.star - a.star);
    if (!tagList.includes('高级资深干员')) {
      memberList = memberList.filter(el => el.star < 6);
    }
    return {
      minStar: minStar,
      tagList: tagList,
      percent: memberList.length ? memberList.filter(el => el.star >= 4).length / memberList.length : 0,
      memberList: memberList.map(el => `${el.star}星 ${el.name}`),
    };
  }

  let tagMap = getMap(tagList);
  let memberList = tagMap.map(el => getMember(el));
  let output = memberList.filter(el => el.minStar > 3 && el.memberList.length !== 0);
  if (output.length === 0) {
    memberList.sort((a, b) => {
      if (b.percent - a.percent === 0) return a.tagList.length - b.tagList.length;
      return b.percent - a.percent;
    });
    if (memberList.length) {
      memberList = memberList.filter(el => Math.abs(el.percent - memberList[0].percent) < 0.000001)
    }
    let optStr = `当前的标签没法组合出纯4星+的干员`;
    if (memberList.length) {
      optStr += '，但是可以尝试下列组合\n';
    }
    let opt = memberList.map(el => `最低${el.minStar}星 - ${el.tagList.join(' + ')}: ${el.memberList.join(' / ')}`)
    opt = opt.join('\n');
    return optStr + opt;
  }
  output.sort((a, b) => {
    if (b.minStar - a.minStar === 0) return a.tagList.length - b.tagList.length;
    return b.minStar - a.minStar
  });
  output = output.map(el => `最低${el.minStar}星 - ${el.tagList.join(' + ')}: ${el.memberList.join(' / ')}`)
  output = output.join('\n');
  return output;
}

exports.help = async function (message, sender) {
  let messageArray = message.split(/[ \.\n\t:;；]/g).filter(el => el);
  let opt = Object.keys(routes)
    .filter(routeName => {
      // 给入参数则强行按参数查询
      if (messageArray.length) {
        return messageArray.includes(routeName);
      }
      // 无参数则默认显示全部（除了管理员命令）
      return !routes[routeName].invisible
    })
    .map(routeName => {
      return `.${routeName}: ${routes[routeName].label}`;
    });

  return '\n' + opt.join('\n');
}
