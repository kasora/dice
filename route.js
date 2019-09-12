exports = module.exports = {};

let service = require('./service');

exports.get = {
  label: '获取一个或多个属性或技能。使用方式为.get xx xx。例如.get 力量 智力。如果不加参数即为获取自身所有属性。例如.get',
  handler: service.get,
};

exports.set = {
  label: '设置一个或多个属性或技能。使用方式为.set xx vv xx vv。例如.set 力量 30 智力 80',
  handler: service.set,
};

exports.del = {
  label: '移除一个或多个属性或技能。使用方式为.del xx xx。例如.del 力量 智力。如果不加参数即为获取自身所有属性。例如.del',
  handler: service.del,
};

exports.rc = {
  label: '针对一个属性或技能摇一个 coc 骰子。使用方式为.rc xx。例如.rc 力量',
  handler: service.rc,
};

exports.rd = {
  label: '针对一个属性或技能摇一个 dnd 骰子。使用方式为.rd xx。例如.rd 力量',
  handler: service.rd,
};

exports.dice = {
  label: '扔一个多面骰。使用方式为.dice aDb。例如.dice 1D6',
  handler: service.dice,
}

exports.coc7 = {
  label: '生成一个随机的 coc7 角色，生成后会自动写入你的角色卡。你可以传入参数来控制年龄。例如.coc7 年龄 40',
  handler: service.coc7,
}

exports.add = {
  label: '增减某个属性，用于回血或者增加理智等等。例如.add 生命 2',
  handler: service.add,
}

exports.dec = {
  label: '增减某个属性，用于扣血或者减少理智等等。例如.dec 生命 2',
  handler: service.dec,
}

exports.save = {
  label: '存档当前的人物状态。指定参数为存档名称。例如.save 间谍',
  handler: service.save,
}

exports.listsave = {
  label: '列出当前存在的所有存档。不接受参数。例如.listsave',
  handler: service.listSave,
}

exports.delsave = {
  label: '删除指定的存档，可多选。例如.delsave 间谍 狂战士',
  handler: service.delSave,
}

exports.import = {
  label: '导入人物卡，覆盖当前的人物状态。指定参数为存档名称。例如.import 间谍',
  handler: service.import,
}

exports.allowgroup = {
  label: 'bot 管理员限定 - 允许某些群添加这个 bot。例如.allowgroup 12345678',
  handler: service.allowGroup,
  invisible: true,
};

exports.removegroup = {
  label: 'bot 管理员限定 - 让 bot 退出某些群，同时不再允许该群添加本 bot。例如.removegroup 12345678',
  handler: service.removeGroup,
  invisible: true,
};

exports.allowfriend = {
  label: 'bot 管理员限定 - 允许某些人添加这个 bot 为好友。例如.allowfriend 12345678',
  handler: service.allowFriend,
  invisible: true,
};

exports.removefriend = {
  label: 'bot 管理员限定 - 不再允许某些人添加这个 bot 为好友。例如.removefriend 12345678',
  handler: service.removeFriend,
  invisible: true,
};

exports.arknights = {
  label: '夹带私货。给入公开招募标签，给出最优选择。例如.arknights 男性干员 防护 重装干员 医疗干员 生存',
  handler: service.arknights,
};

exports.help = {
  label: '获取某条命令的帮助。使用方式为.help xx。例如.help get。如果不加参数即为获取全部帮助。例如.help',
  handler: service.help,
};
