# 介绍

IIP UI Vue3 是一个基于 Element Plus、Vue 3 和 TypeScript 技术栈构建的二次封装组件库，旨在为企业级中后台管理系统提供统一的视觉与交互风格。

## 设计理念

### 🎯 企业级优先

专为企业级应用设计，提供稳定可靠的组件和完善的功能支持。

### 🛠️ 开发者友好

提供完整的 TypeScript 类型定义，优秀的开发体验和详细的文档。

### 🎨 高度可定制

支持主题定制、组件配置，满足不同项目的个性化需求。

### 📦 按需引入

支持 Tree Shaking，可以按需引入组件，优化打包体积。

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - JavaScript 的超集，提供静态类型检查
- **Element Plus** - 基于 Vue 3 的组件库
- **Vite** - 下一代前端构建工具
- **Vitest** - 基于 Vite 的单元测试框架
- **VitePress** - 基于 Vite 和 Vue 的静态站点生成器

## 特性

### 🚀 现代化

- 基于 Vue 3 Composition API
- 完整的 TypeScript 支持
- 使用最新的构建工具 Vite

### 📦 组件丰富

- 基于 Element Plus 二次封装
- 增强的功能和更好的用户体验
- 统一的 API 设计
- 完整的类型定义

### 🔧 开发工具

- 完善的开发环境
- 热更新支持
- 代码质量检查
- 自动化测试

## 浏览器支持

现代浏览器和 IE11+。

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IE11, Edge                                                                                                                                                                                                      | last 2 versions                                                                                                                                                                                                   | last 2 versions                                                                                                                                                                                               | last 2 versions                                                                                                                                                                                               |

## 核心组件

### 🚀 Table 表格组件

基于 vxe-table 4.15+ 构建的高性能企业级表格组件：

- **智能插槽渲染**: v1.2.0+ 版本优化，只渲染实际使用的插槽
- **虚拟滚动**: 支持大数据量展示，流畅的滚动体验
- **丰富功能**: 编辑、筛选、排序、分页、树形结构等
- **类型安全**: 完整的 TypeScript 类型定义

### 📝 Form 表单组件

基于 Element Plus 二次封装的配置化表单组件：

- **配置化驱动**: 通过 JSON 配置快速生成表单
- **丰富组件**: 支持 20+ 种表单项类型
- **数据验证**: 内置验证规则，支持自定义验证
- **动态显示**: 支持条件显示/隐藏表单项
- **响应式布局**: 支持栅格布局，适配不同屏幕

### 🛠️ 工具函数

- **通用工具**: 类型检查、对象操作、数组处理等

查看 [更新日志](/guide/changelog) 了解版本变更详情。

## 许可证

[MIT](https://github.com/BINGWU2003/iip-ui-vue3/blob/main/LICENSE)
