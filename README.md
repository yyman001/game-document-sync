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
   - `C:\Users\lenovo\AppData\LocalLow\${游戏名}`
   - `C:\Users\lenovo\AppData\LocalLow\${游戏厂商}\${游戏名}`
     - Team Cherry
     - Southpaw Games
     - Rebuilt Games
     - Ninja Kiwi


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
   - 以游戏为基准?
   - 以存档为基准(主) + 游戏信息(副) 
 - 创建游戏


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
