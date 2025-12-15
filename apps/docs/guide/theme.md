# 主题定制

本文档介绍如何使用 `@bingwu/iip-ui-theme` 主题样式包。**注意**：组件库本身不使用 CSS 变量，样式是固定的。`@bingwu/iip-ui-theme` 主要用于封装内置样式类（工具类），供公司内部项目使用。

## 关于 @bingwu/iip-ui-theme

`@bingwu/iip-ui-theme` 是一个**可选**的主题样式包，主要用于**封装内置样式类（工具类）**，供公司内部项目使用。它**不是组件库的必需依赖**，组件库的样式已经包含在 `@bingwu/iip-ui-components` 中。

### 主要用途

`@bingwu/iip-ui-theme` 主要用于提供**内置样式工具类**，例如：

- **颜色类**：`.grey`、`.blue`、`.red` 等，每个类对应特定的颜色值
- **工具类**：提供常用的样式工具类，方便快速开发
- **公司内部规范**：封装公司内部的设计规范和样式标准

### 何时使用 @bingwu/iip-ui-theme

- ✅ **公司内部项目**：需要在项目中使用公司统一的内置样式类
- ✅ **快速开发**：需要使用预定义的样式工具类，如 `.grey` 代表某个颜色值
- ✅ **样式规范统一**：需要遵循公司内部的设计规范和样式标准

### 何时不需要

- ❌ **基础使用组件库**：如果只是使用组件库，不需要安装，组件库已包含所有样式
- ❌ **外部项目**：如果是外部项目，不需要安装此包

### 安装 @bingwu/iip-ui-theme（可选）

```bash
# pnpm
pnpm add @bingwu/iip-ui-theme

# npm
npm install @bingwu/iip-ui-theme

# yarn
yarn add @bingwu/iip-ui-theme
```

### 使用方式

```typescript
// main.ts
import '@bingwu/iip-ui-theme/dist/index.css'
```

### 使用示例

```vue
<template>
  <div>
    <!-- 使用内置样式类 -->
    <div class="grey">灰色文本</div>
    <div class="blue">蓝色文本</div>

    <!-- 组合使用 -->
    <div class="grey bg-light">灰色文本，浅色背景</div>
  </div>
</template>
```

### 说明

- **组件库不使用 CSS 变量**：组件库本身不依赖 CSS 变量，样式是固定的
- **主题包独立**：`@bingwu/iip-ui-theme` 是独立的样式包，主要用于提供工具类
- **公司内部使用**：主要用于公司内部项目，提供统一的样式规范和工具类

## 内置样式类

`@bingwu/iip-ui-theme` 提供了一系列内置样式类（工具类），方便在项目中使用。这些样式类封装了公司内部的设计规范和常用样式。

### 颜色类

```vue
<template>
  <div>
    <!-- 使用颜色类 -->
    <div class="grey">灰色文本（对应某个 16 进制颜色值）</div>
    <div class="blue">蓝色文本</div>
    <div class="red">红色文本</div>
    <div class="green">绿色文本</div>

    <!-- 背景颜色类 -->
    <div class="bg-grey">灰色背景</div>
    <div class="bg-blue">蓝色背景</div>
  </div>
</template>
```

### 工具类示例

```vue
<template>
  <div>
    <!-- 文本颜色 -->
    <p class="grey">灰色文本</p>
    <p class="text-primary">主色文本</p>

    <!-- 背景颜色 -->
    <div class="bg-grey">灰色背景</div>
    <div class="bg-light">浅色背景</div>

    <!-- 间距 -->
    <div class="p-md">中等内边距</div>
    <div class="m-lg">大外边距</div>

    <!-- 组合使用 -->
    <div class="grey bg-light p-md m-lg">组合样式</div>
  </div>
</template>
```

## 扩展内置样式类

如果你需要在 `@bingwu/iip-ui-theme` 中添加自定义样式类，可以通过 Sass 进行扩展：

```scss
// custom-utilities.scss
// 添加到 @bingwu/iip-ui-theme 中

// 颜色类示例
.grey {
  color: #808080; // 某个 16 进制颜色值
}

.blue {
  color: #409eff;
}

.red {
  color: #f56c6c;
}

// 背景颜色类
.bg-grey {
  background-color: #808080;
}

.bg-light {
  background-color: #f5f7fa;
}

// 间距类
.p-md {
  padding: 16px;
}

.m-lg {
  margin: 24px;
}
```

### 使用 Sass 扩展（需要 @bingwu/iip-ui-theme）

如果你的项目使用 Sass 并安装了 `@bingwu/iip-ui-theme`，可以通过扩展主题包：

```scss
// 你的项目样式文件
@use '@bingwu/iip-ui-theme/src/index.scss';

// 扩展自定义样式类
.grey {
  color: #808080;
}

.bg-grey {
  background-color: #808080;
}
```

## 最佳实践

### 1. 使用内置样式类

```vue
<template>
  <!-- ✅ 推荐：使用内置样式类 -->
  <div class="grey">灰色文本</div>
  <div class="bg-light p-md">浅色背景，中等内边距</div>

  <!-- ❌ 避免：硬编码样式 -->
  <div style="color: #808080;">灰色文本</div>
</template>
```

### 2. 组合使用

```vue
<template>
  <!-- 组合多个样式类 -->
  <div class="grey bg-light p-md m-lg border-radius-base">组合使用多个样式类</div>
</template>
```

### 3. 公司内部规范

`@bingwu/iip-ui-theme` 主要用于公司内部项目，提供统一的样式规范：

- **颜色规范**：`.grey`、`.blue` 等类对应公司统一设计的颜色值
- **间距规范**：`.p-md`、`.m-lg` 等类对应公司统一设计的间距值
- **样式规范**：所有样式类都遵循公司内部的设计规范

通过这些内置样式类，可以快速开发符合公司设计规范的项目。
