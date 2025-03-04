# Changelog

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

## [0.0.14] - 2025-03-01

### Added

- **一键角色卡** 增加角色卡持久化，支持指令优先

- 对Chat系列方法增加全部错误的ui提示模块。

- XCompomnent 增加 XSender / XSubpageWraper 

- 路由跳转更加丝滑一点


### Changed

- **重构了聊天界面代码，基于pinia进行状态行为分离。**并进行测试，增加新的类型推断。

- **重构了模型层代码，小心修了几个bug**

- 角色卡从设置分离，PC从侧边栏呼出，移动端单独界面

- 优化 message 弹出层

- 侧边栏界面跳转更加紧凑

### Fixed

- 根据依赖打chunks, 减少打包体积 60%

- 修复XMenu，路由跳转返回后不显示问题

- 其它重构带来的bugs

## [0.0.15] - 2025-03-05

### Added

- 支持界面直接打开角色卡

- 新增**知识库界面**

- XCompomnent 增加 XClickableTag / XForm / XDialog / XTooltip / XTextarea

### Changed

- **显著**减少打包体积（hljs:940k->160k）。

- 优化XSelect / Xbutton 

- 调整了页面结构

### Fixed

- 根据依赖打chunks, 减少打包体积 60%

- 修复XMenu，路由跳转返回后不显示问题

- 其它重构带来的bugs