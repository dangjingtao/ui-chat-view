# Changelog


## [0.0.42] - 2025-03-26

### Added

- 聊天界面支持Tavily网络搜索,对于不支持的模型，可以选择关闭

- Notion 聊天记录支持发送到Notion

### Changed

- UI微调

- 调整了UIChat 和 MicroChat的结构，现在能共用一套类似MCP的协议进行通信了

### Fixed

- webReader 删除了jina ,改为自己写的webURL加载器。现在不会报错了。（需要embedding模型）



## [0.0.41] - 2025-03-25

在更新20分钟后，让我怀着~~沮丧~~诚恳的心情，向你介绍UIChat 的0.41版本修复

### Fixed

- 请求github-api错误
- 请求主界面聊天错误



## [0.0.40] - 2025-03-25

埋头写了近一周后，让我怀着~~毫不负责~~激动的心情，向你介绍UIChat 的0.40版本：

### Added

- 聊天界面支持网络搜索

- 上线插件功能。新增4个插件
  - 慌译（any language to any language）
  - Comfy UI （随便把远程电脑搞炸）
  - webReader (搭配自研的反人类在web请求服务)
  - Notion 支持
- 内部支持token计算（没显示）

### Changed

- UI微调

### Fixed

- 其它UI Bug

## [0.0.27] - 2025-03-18

### Added

- 用Hono重构了Open-proxy-api-deno（部署飞快）， 现在邀请码会过期（1小时）
- 新增微应用中心设置（拥抱MCP吧！）

### Changed

- PC界面改版，侧边栏被纳入，删除menu,更像一个“轻量级”
- 报错界面决定取消拦截，只做提示作用，给用户一个知错不改的机会。
- UI更好的匹配暗色模式

### Fixed

- 修复confirm弹窗错误
- 其它UI Bug



## [0.0.26] - 2025-03-16

### Added

- 多模态大模型支持（可以在每次聊天中发送至多一张图片），测试gemma3
- 支持自定义服务商域名，这对ollama之类的服务来说相当有用。
- XComponent 支持ImageViewer
- 上传图片解析器支持：基于大图片太费token，上传前会有损压缩到实际的10%左右。

### Changed

- 调整了输入框样式

### Fixed

- 手机端体验优化
- 其它UI Bug




## [0.0.25] - 2025-03-15

### Added

- 接口缓存（10分钟后自动清理垃圾）

### Changed


### Fixed

- 手机端体验优化
- 其它UI Bug


## [0.0.24] - 2025-03-14

用户设置支持，初步提示词工程。看了一篇文章，获益不少

https://mp.weixin.qq.com/s?__biz=MzU4OTY4MDU4MQ==&mid=2247487639&idx=1&sn=118ecf6274c6174dfe5ca4462e0cfa20&chksm=fc6cc07952f43b778e3d3b3b1589ecca1bd83e3464e2fba423e8302ba2952be483ac8410883c#rd

### Added

- 配置任务LLM和embedding模型支持
- 代理github api支持
- 主题色支持
- 暗黑模式支持
- 国际化支持（含语言对话）
- 裁剪上下文支持


### Changed

- 重写了设置界面
- 部分暗黑模式下调整了部分组件（XSelect）
- 移除一些不支持的高级设置，研究过大量聊天软件，大量的配置是令人困惑的

### Fixed

- 高级配置在初始对话不生效问题
- 其它UI Bug



## [0.0.22] - 2025-03-12

前端体验调整。通读了[Learn PWA](https://web.dev/learn/pwa/)。获益良多。

### Added

- “构建渐进式webAPP的新秩序”（增加pwa支持），现在可以离线访问应用了。（可能又有一些难以解决的bug）
- 重写了欢迎页，增加Lottie动画
- 重写了一个丑陋的登陆界面，写完依然丑陋

### Changed

- 删除XEmpty。全部改用XResult
- 替换掉部分丑陋的插画
- XSpin 重写，没那么丑陋
- 换了头像，更年轻，更..漂亮

### Fixed

- 首次登录时又被提回登录页的问题
- **彻底解决** 对话界面model require问题。
- 其它UI Bug



## [0.0.21] - 2025-03-11

### Added

- 重构了数据表设计。近乎残忍的去修复typo和不合理的方法调用,**因此此次更新需要到设置那里点击《解决更新bug》**
- 新增高级设置侧边栏，现在可以手动调整系统提示词和温度了。（ollama可以调整另外几个）
- 新增打断发送功能
- 新增一个丑陋的登录界面，需要邀请码才能使用。服务重构于`open-proxy-api-deno`
- 支持切换**更多**模型提供商（ollama/groq/deepseek(要钱)/cohere/gemini/kimi(要钱)），对话将从全局尽可能集成更新后的配置，但你仍需要手动更新新的模型
- XComponent 增加 XSpin / XSlider

### Changed

- 当没有对话时，需要手动创建一个对话
- XComponent 逻辑调整 XMarkdown


### Fixed

- **小心修复了几个可耻的typo**
- 其它重构带来的bugs

## [0.0.18] - 2025-03-07（本次更新由咖啡因和彩虹糖共同赞助）

### 新增功能：像给AI喂食一样快乐！
- **知识库大升级**：现在支持在知识库里上传/操作文件，终于能让AI吃上你珍藏的PDF文档了！（请勿投喂表情包，AI会哭的）
- **Changelog页面上线**：再也不用靠记忆力装模作样说"上次改了啥"，现在能优雅地甩锅给历史记录
- **模型提供商自由切换系统**："ollama还是groq？就像选择美式还是拿铁！对话配置已自动升级——但新模型需要手动教它说话（别怪AI口音奇怪啊）"
- **XComponent家族再添奇葩**：
  - XCheckbox：让勾选框学会挑食
  - XResult："结果展示师"已就位，负责把计算结果拍成微电影
  - XTable & XTableCellRender：表格组件终于不再装哑巴了！
  - XUpload：你的文档投喂器2.0（支持酸黄瓜味和薯片味主题）

### 改版优化：设计师的复仇计划
- **XCard组件整容成功**："把颜值从'社畜模式'切换到了'甲方满意模式'"
- **XEllipsis防尴尬系统升级**：当文字太长时，现在会优雅地变成"......（此处省略N千字狗血剧情）"
- **XSelect逻辑重构**："终于把玄学选择器改成了科学计算器级别的精准度！"
- **XDrawer抽屉组件**：现在开合动作比你的起床气还要丝滑

### 修复与优化：程序员的救赎之旅
- **消灭拼写幽灵大行动**："用debugger光剑刺穿了几个可耻的typo（它们在代码里喊妈妈了）"
- **重构后BUG清理**："像扫雷游戏一样排除了其他地方乱动引发的各种尴尬现场"（程序员：这不怪我！）

> 开发者悄悄话：本版本包含37%的咖啡因、20%的彩虹糖以及53%的对AI的无尽爱。建议搭配《如何让AI不翻车》使用效果更佳。

---

> 以上是用qwq帮我生成的。正经内容如下👇

### Added

- 完善**知识库功能**，现在可以在知识库里上传/操作文件
- 集成changelog页面
- 支持切换模型提供商（ollama/groq），对话将从全局尽可能集成更新后的配置，但你仍需要手动更新新的模型
- XComponent 增加 XCheckbox, XResult, XTable, XTableCellRender, XUpload

### Changed

- XComponent 样式调整 XCard 组件样式
- XComponent 逻辑调整 XEllipsis / XSelect / XDrawer / 


### Fixed

- **小心修复了几个可耻的typo**
- 其它重构带来的bugs

## [0.0.15] - 2025-03-05

### Added

- 支持界面直接打开角色卡
- 新增**知识库界面**
- XComponent 增加 XClickableTag / XForm / XDialog / XTooltip / XTextarea

### Changed

- **显著**减少打包体积（hljs:940k->160k）。
- **重构了模型层代码，小心修了几个bug**
- 优化XSelect / XButton 
- 调整了页面结构

### Fixed

- 根据依赖打chunks, 减少打包体积 60%
- 修复XMenu，路由跳转返回后不显示问题
- 其它重构带来的bugs

## [0.0.14] - 2025-03-01

### Added

- **一键角色卡** 增加角色卡持久化，支持指令优先
- 对Chat系列方法增加全部错误的ui提示模块。
- XComponent 增加 XSender / XSubpageWrapper 
- 路由跳转更加丝滑一点

### Changed

- **重构了聊天界面代码，基于pinia进行状态行为分离。**并进行测试，增加新的类型推断。
- 角色卡从设置分离，PC从侧边栏呼出，移动端单独界面
- 优化 message 弹出层
- 侧边栏界面跳转更加紧凑

### Fixed

- 根据依赖打chunks, 减少打包体积 60%
- 修复XMenu，路由跳转返回后不显示问题
- 其它重构带来的bugs

## [0.0.12] - 2025-02-27

### Added

- 加入聊天常用操作
- 集成基于 Capacitor 的 Android 平台

### Changed

- 优化 UI 结构
- 重构了聊天气泡markdown渲染

### Fixed

- 修复角色指令失效的问题
- 修复滚动失效问题