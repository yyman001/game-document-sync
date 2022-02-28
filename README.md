# 游戏存档管理器

## 项目简介
> 一款用于管理游戏存档备份软件,主要针对无云备份游戏或云备份不可靠的游戏.




## 功能列表

 - ❌ 多语言
 - 存档备份
    - 备份方式
      - ✔️ 全量, 全文件备份
      - ❌ 变动, 只备份变动文件
      - ❌ 备份比较MD5
    - ❌ 过滤指定类型文件or路径目录
    - ✔️ 备份当前软件目录下backup
    - ❌ 自定义备份路径
    - ❌ 备份文件带版本号
    - ❌ 备份文件列表清单 + MD5
    - ❌ 文件筛选
    - 🚧 备份信息
      - ✔️ 游戏名
      - ✔️ 文件名
      - ✔️ 存档文件夹名
      - ❌ 版本号
      - ✔️ 时间
      - ✔️ 平台
      - ❌ 备份次数
      - ❌ 机器码
      - ✔️ 文件类型
      - ✔️ 文件路径
      - ❌ 备注
 - 存档还原
    - ✔️ 备份列表选中还原
    - ✔️ 指定文件or路径进行还原(只限制于压缩包)
    - ❌ 支持多路径还原
    - ✔️ 删除备份存档
    - ✔️ 打开存档位置
    - ✔️ 打开存档
    - ❌ 文件筛选
 - 云操作   
   - ✔️ 云备份(压缩包)
   - ✔️ 云下载(压缩包)
   - ❌ 云还原(压缩包)
   - ❌ 云备份(散文件)
   - ❌ 云下载(散文件)
   - ❌ 云还原(散文件)
 - 支持云备份的方式
   - ❌ 私有网络服务器
   - ❌ oss
   - ❌ github
   - ❌ 谷歌网盘
   - ✔️ 坚果云网盘
   - ❌ OneDrive (微软网盘)
 - 启动游戏
   - ❌ 学习版
   - ❌ steam
   - ❌ epic  

 - 创建存档游戏
    - ✔️ 配置存档管理中选择创建
    - ❌ 扫描游戏存档
    - ❌ 选中/拖拽游戏存档文件夹方式创建

 - 游戏存档列表
     - ✔️ 大图
     - ❌ 缩略图
     - ❌ 分类排列
     - ✔️ 搜索
     - ✔️ 删除

  - 🚧 UI重构
  - ❌ 日志
  - ❌ 在线更新
  - ❌ 任务栏图标
  - ❌ 软件图标logo


## 数据结构设计
 #### 文档扫描配置 `scan.json`
    这个文件暂时需要用户手动配置, 暂时没找到对应数据能识别游戏的存档,以后找到这个扫描就可以全自动了
```js
[
  {
    // [游戏名] 自动裁剪文件夹名
    "gameName": 'Hollow Knight',
    // [游戏译名,根据语言版本翻译]
    "nickName": '空洞骑士',
    // 游戏存档目录名 自动裁剪文件夹名
    "gameDocDir": 'Team Cherry|Hollow Knight',
    // [游戏开发公司/团队]
    "gameCompany": 'Team Cherry',
    // 完整路径 = 游戏存档完整路径
    "gameDocFullPath": "",
    // [游戏存档路径] 自动计算,由 game_absolute_path 获取
    "gameDocPath": '/Team Cherry/Hollow Knight',
    // 系统类型,  window = 1, mac = 2, linux = 3
    "systemType": "" 
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
      // [游戏译名,根据语言版本翻译]
  "nickName": '空洞骑士',
  // 游戏存档目录名
  "gameDocDir": 'Team Cherry|Hollow Knight',
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

### 游戏存档位置

 - 游戏存在位置,不同游戏厂商的游戏存档位置是不一样的
   - `C:\Users\${用户名}\Saved Games\${游戏名}`
   - `C:\Users\${用户名}\AppData\Local\${游戏名}`
   - `C:\Users\${用户名}\AppData\LocalLow\${游戏名}`
   - `C:\Users\${用户名}\AppData\LocalLow\${游戏厂商}\${游戏名}`
     - Team Cherry (空洞骑士)
     - Southpaw Games
     - Rebuilt Games
     - Ninja Kiwi
   - `C:\Users\${用户名}\AppData\Roaming\${游戏名}`
     - StardewValley => Stardew Valley(星谷物语), 这个单词中间是没有空格的
   - `C:\Users\${用户名}\Documents\${游戏名}`
   - `X:\Steam\userdata\steam_id\app_id\remote` steam部分类型游戏存档位置
  - 扫描配置文件, 记录游戏存档相关信息

## 关于云同步数据库设计
 跟平时的同步数据库不一样, 本软件云同步只会拉取云同步存档(存在跳过),不进行本地多余存档进行删除(因为游戏存档是非常重要的,所有不加自动删除功能,不要的存档请自己手动删除),也就是说数据不一样跟云上面的一样,本地拉取云同步只做(增加数据,不进行删除配对)
 如果备份存档路径指定为能同步的网盘(`OneDirie`),删除存档会由对应的网盘自动同步,可以关闭云同步功能
## 如何运行项目

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

## 依赖资源
 - [Bootstrap Vue](https://bootstrap-vue.org/)
 - [dexie](https://github.com/dfahlander/Dexie.js)
 - [localForage](https://github.com/localForage/localForage)
 - [导出和导入数据库](https://dexie.org/docs/ExportImport/dexie-export-import)
 - [export/import for IndexedDB](https://github.com/Polarisation/indexeddb-export-import)
 - [新版UI 设计稿](https://dribbble.com/shots/16271760-Sidebar-navigation-for-Dashboard)
 - [box-shadow-demo](https://getcssscan.com/css-box-shadow-examples)
 - [electron-vue](https://github.com/SimulatedGREG/electron-vue)
 - [electron-vue Documentation](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html)
 - [vue-cli](https://github.com/vuejs/vue-cli)
 - [webdav](https://www.npmjs.com/package/webdav)
 - [坚果云](https://www.jianguoyun.com/)
 - [onedrive-api](https://github.com/dkatavic/onedrive-api)
 - [onedrive 官方开发文件](https://docs.microsoft.com/zh-cn/onedrive/developer/rest-api/api/driveitem_get?view=odsp-graph-online)
 - [生成 OneDrive API 令牌](https://github.com/spencerwooo/onedrive-cf-index/blob/main/README-CN.md)
 - [electron-log 日志](https://github.com/megahertz/electron-log)
 - [PandaDB 简单得json 数据库](https://github.com/PandaDriver156/panda-db/blob/master/docs/api.md)
 
### steam 相关
steam 游戏预览图
https://cdn.cloudflare.steamstatic.com/steam/apps/457140/capsule_184x69.jpg
大图
https://cdn.cloudflare.steamstatic.com/steam/apps/294100/header.jpg?t=1594308831

获取全部steam 游戏列表(app-id,app-name)
https://api.steampowered.com/ISteamApps/GetAppList/v2/

获取详细游戏资料
https://store.steampowered.com/api/appdetails?appids=1030300


## 参考资料
 - [游戏名称列表](https://www.gamesave-manager.com/?s=support&c=supported_games)
 - [获取游戏平台安装游戏列表](https://indienova.com/u/hangacs/blogread/27792)
 - [steam 云同步](https://partner.steamgames.com/doc/features/cloud)
 - [electron-api-demos](https://github.com/electron/electron-api-demos)
### 注册表分析
 steam
 该注册表路径 包含当前用户账号下的 `HKEY_CURRENT_USER\SOFTWARE\Valve\Steam\Apps` 的游戏列表(运行过的), 有4个关键值, `Installed`,`Name`,`Running`,`Updating`
 
 卸载信息
 HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\Steam App 413150

 读取注册表工具
 https://github.com/fresc81/node-winreg
 https://github.com/ironSource/node-regedit

 获取进程
 https://www.npmjs.com/package/ps-list
 

 #### 参考资料
 查询到存档位置: https://www.pcgamingwiki.com/wiki/Stardew_Valley

查询预览图: https://steamdb.info/app/413150/info/

## 协议
MIT © Richard Littauer

