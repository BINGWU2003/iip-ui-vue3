# 主题（基础版）

当前主题包仅提供「基础样式框架」：一组全局 CSS 变量与最小化的全局样式重置。尚未内置暗色主题、主题切换组件或组件级主题文件。

## 安装与引入

- 使用方式一（推荐，直接引入构建后的 CSS）

```ts
// main.ts / entry
import '@bingwu/iip-ui-theme/dist/index.css'
```

- 使用方式二（需要 Sass 工具链，可按需二次构建）

```scss
// 你的全局样式入口
@use '@bingwu/iip-ui-theme/src/index.scss';
```

## 当前可用的 CSS 变量

以下变量来自 `:root`，可在你项目中覆盖以实现品牌定制。

```css
:root {
  /* 主题色 */
  --iip-color-primary: #409eff;
  --iip-color-success: #67c23a;
  --iip-color-warning: #e6a23c;
  --iip-color-danger: #f56c6c;
  --iip-color-info: #909399;

  /* 字体 */
  --iip-font-family:
    'Helvetica Neue', helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑',
    arial, sans-serif;
  --iip-font-size-base: 14px;
  --iip-font-size-small: 12px;
  --iip-font-size-large: 16px;

  /* 间距 */
  --iip-spacing-xs: 4px;
  --iip-spacing-sm: 8px;
  --iip-spacing-md: 16px;
  --iip-spacing-lg: 24px;
  --iip-spacing-xl: 32px;

  /* 圆角 */
  --iip-border-radius-base: 4px;
  --iip-border-radius-small: 2px;
  --iip-border-radius-large: 6px;
}
```

全局还包含最小重置：

```css
* {
  box-sizing: border-box;
}
```

## 覆盖与扩展

- 在你的项目全局样式中重写变量（建议在主题 CSS 之后引入你自己的样式）：

```css
:root {
  --iip-color-primary: #1890ff;
  --iip-font-size-base: 15px;
  --iip-border-radius-base: 6px;
}
```

- 组件样式中使用变量：

```scss
.my-component {
  color: var(--iip-color-info);
  border-radius: var(--iip-border-radius-base);
  padding: var(--iip-spacing-md);
}
```

## 现状与计划

- 现状：仅提供基础变量与重置；未提供暗色主题、主题切换、预设配色等。
- 计划：
  - 暗色主题变量与 `html.dark` 适配
  - 主题预设与一键应用工具方法
  - 更丰富的设计令牌（文本/边框/填充/阴影等）
  - 与组件库更紧密的变量对齐

当上述能力完善后，本页将追加相关用法与示例。
