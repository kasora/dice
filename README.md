# COC7 骰子 QQ 机器人
该项目基于 [coolq-http-api](https://github.com/richardchien/coolq-http-api) 实现，请事先搭建 coolq-http-api 的环境

# 功能
- `.get`: 获取一个或多个属性或技能。使用方式为`.get xx xx`。例如`.get 力量 智力`。如果不加参数即为获取自身所有属性。例如`.get`。
- `.set`: 设置一个或多个属性或技能。使用方式为`.set xx vv xx vv`。例如`.set 力量 30 智力 80`。
- `.del`: 移除一个或多个属性或技能。使用方式为`.del xx xx`。例如`.del 力量 智力`。如果不加参数即为移除自身所有属性。例如`.del`。
- `.rc`: 针对一个属性或技能摇一个 coc 骰子。使用方式为`.rc xx`。例如`.rc 力量`。
- `.rd`: 针对一个属性或技能摇一个 dnd 骰子。使用方式为`.rd xx`。例如`.rd 力量`。
- `.dice`: 扔一个多面骰。使用方式为`.dice aDb`。例如`.dice 1D6`。
- `.coc7`: 生成一个随机的 coc7 角色，生成后会自动写入你的角色卡。你可以传入参数来控制年龄。例如`.coc7 年龄 40`。
- `.add`: 增减某个属性，用于回血或者增加理智等等。例如`.add 生命 2`。
- `.dec`: 增减某个属性，用于扣血或者减少理智等等。例如`.dec 生命 2`。
- `.save`: 存档当前的人物状态。指定参数为存档名称。例如`.save 间谍`。
- `.import`: 导入人物卡，覆盖当前的人物状态。指定参数为存档名称。例如`.import 间谍`
- `.listsave`: 列出当前存在的所有存档。不接受参数。例如`.listsave`。
- `.delsave`: 删除指定的存档，可多选。例如`.delsave 间谍 狂战士`。
- `.arknights`: 夹带私货。明日方舟公开招募筛选，给入公开招募标签，给出最优选择。例如`.arknights 男性干员 防护 重装干员 医疗干员 生存`。
- `.help`: 获取某条命令的帮助。使用方式为`.help xx`。例如`.help get`。如果不加参数即为获取全部帮助。例如`.help`。

# 搭建
- 搭建 coolq-http-api 的环境。推荐使用 Docker。参照[这里](https://cqhttp.cc/docs/4.10/#/Docker)
- 根据你在 Docker 中传入的参数，对应的修改 `config.sample.js`，并将其改名为 `config.js`
- 安装 MongoDB，请自行查询安装方式。并将 MongoDB 的参数给入 `config.js`
- `npm install`
- `npm start`
- 将你的 bot 拉入群，输入 `.help` 查看是否正常运行
