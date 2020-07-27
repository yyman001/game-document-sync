# game-document-sync

> 一款游戏存档备份软件,支持steam游戏


## 开发需要
 - 需要用户平台信息(用户名)
 - 游戏默认存档路径
 - 支持自定义路径
 - 支持steam游戏列表
 - 机器码
 - 游戏存在位置,不同游戏厂商的游戏存档位置是不一样的
   - `C:\Users\${用户名}\Saved Games\${游戏名}`
   - `C:\Users\${用户名}\AppData\Local\${游戏名}`
   - `C:\Users\${用户名}\AppData\LocalLow\${游戏名}`
   - `C:\Users\${用户名}\AppData\LocalLow\${游戏厂商}\${游戏名}`
     - Team Cherry
     - Southpaw Games
     - Rebuilt Games
     - Ninja Kiwi
   - `C:\Users\${用户名}\AppData\Roaming\${游戏名}`
   - `C:\Users\${用户名}\Documents\${游戏名}`
   - `X:\Steam\userdata\steam_id\app_id\remote` steam部分类型游戏存档位置
  - 扫描配置文件, 记录游戏存档相关信息


## 功能
 - 语言
   - 中文
   - 英文
   - 自定义配置语言
 - 存档备份
    - 备份方式
      - 全量, 全文件备份
      - 变动, 只备份变动文件
      - 不判断重复,备份文件数 + 1 ?
      - 备份比较MD5 ?
    - 过滤指定类型文件or路径目录
    - 指定`路径目录`or`文件`进行备份
    - 备份到多个指定位置(默认点为当前软件目录下)
    - 备份文件带版本号? 只支持能获取游戏版本的游戏
    - 备份文件列表清单 + MD5
    - 备份文件名
      - 游戏名
      - 版本号
      - 时间
      - 平台
      - 备份次数
      - 机器码
 - 存档还原
    - 指定文件or路径进行还原
    - 支持多路径还原
 - 云操作   
   - 云备份
   - 云还原
 - 支持云备份的方式
   - 私有网络服务器
   - oss
   - github ?
   - 谷歌网盘?
 - 启动游戏
   - 某种单机
   - steam
   - epic  
 - 备份文档列表展示
   - 扫描游戏存档
   - 以游戏为基准(主) + 游戏文档数据(副) 
   - ~~以存档为基准(主) + 游戏信息(副)~~ 
 - 创建游戏


## 数据结构
 #### 文档扫描配置 `scan.json`
    这个文件暂时需要用户手动配置, 暂时没找到对应数据能识别游戏的存档,以后找到这个扫描就可以全自动了
```js
[
  {
    // [游戏名]
    "gameName": '空洞骑士',
    // 游戏存档目录名
    "gameDocDir": 'Hollow Knight',
    // [游戏开发公司/团队]
    "gameCompany": 'Team Cherry',
    // [游戏存档路径] 自动计算?后面跟进大数据尝试识别
    "gameDocPath": '/Team Cherry/Hollow Knight'
  }
]

```

### 游戏存档配置信息/存档清单文件
每次备份会生成一份
`file_detailed_json`, 不记录目录(除主目录外), 只记录目录下的文件路径, 并打成压缩包(在临时区域操作)
```js
{
  // [游戏名]
  "gameName": '空洞骑士',
  // 游戏存档目录名
  "gameDocDir": 'Hollow Knight',
  // [游戏开发公司/团队]
  "gameCompany": 'Team Cherry',
  // [游戏存档路径] 自动计算?后面跟进大数据尝试识别
  "gameDocPath": '/Team Cherry/Hollow Knight'
  // 存档备份id
  "id": "",
  // 备份的游戏
  "game": "",
  // 游戏版本
  "version": ""
  // 创建时间
  "time": "",
  // 备份文件清单
 "file_detailed": [
    {
      // 文件名
      "name": '',
      // 文件路径
      "path": '',
      // md5码
      "md5": '',
      // 文件大小
      "size": '',
      // 文件类型 dir or file
      "type": ''
    }
  ]
}

```

### 列表展示
   多个游戏版本?
```js
{
    // [游戏名]
    "gameName": '空洞骑士',
    // 游戏存档目录名
    "gameDocDir": 'Hollow Knight',
    // [游戏开发公司/团队]
    "gameCompany": 'Team Cherry',
    // [游戏存档路径] 自动计算?后面跟进大数据尝试识别
    "gameDocPath": '/Team Cherry/Hollow Knight',
    // 游戏存档路径
    "fullPath": '',
    // 游戏主程序路径
    "mainProgram": '',
    // 游戏目录
    "gameDir": '',
    // 启动方式
    "startMode": '',
    // 游戏平台
    "gamePlatform": [
      {
       id: '',
       name: 'steam',
       link: 'steam://rungameid/game-id'
      },
      {
        id: '',
        name: 'epic',
        link: ''
      }
    ],
    // 游戏版本
    "version": ""
    // 最后备份时间
    "lastBackTime": ''
    // 备份路径(多路径,因为支持多路径的)
    "backPath": []
  }
```

### 备份记录
  本地备份和云备份
```js

[
  {
    // 备份记录与游戏挂钩(暂时未确定使用什么标识进行关联)
    id: 'xxx',
    name: "压缩包名称",
    time: "备份时间"
  }
]


```
### 还原记录
  本地还原和云还原,数据跟上面一致

### 操作流程
 扫描配置 --> 生成存档配置 --> ?[创建游戏配置] --> 合并为 <列表展示> --> 生成备份记录

#### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build


# lint all JS/Vue component files in `src/`
npm run lint

```

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
