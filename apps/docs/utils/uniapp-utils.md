# UniApp Utils 工具函数

UniApp 工具函数库，专为 uni-app 小程序环境设计，提供系统信息获取等常用功能。

## 安装和引入

```bash
# 安装工具包
pnpm add @bingwu/iip-ui-uniapp-utils
```

```typescript
// 全量引入
import * as UniappUtils from '@bingwu/iip-ui-uniapp-utils'

// 按需引入
import {
  systemInfo,
  safeAreaInsets,
  menuButtonInfo,
  statusBarHeight,
  navBarHeight,
  customBarHeight,
  tabBarHeight
} from '@bingwu/iip-ui-uniapp-utils'
```

## 环境要求

- 必须在 uni-app 小程序环境中使用
- 推荐在微信小程序（mp-weixin）环境中使用
- 非小程序环境会在导入时抛出异常

## 系统信息

提供窗口信息、安全区域、胶囊按钮位置等系统相关数据。

### systemInfo

当前窗口与系统信息，基于 `uni.getWindowInfo()` 获取。

```typescript
import { systemInfo } from '@bingwu/iip-ui-uniapp-utils'

console.log(systemInfo.windowWidth) // 窗口宽度，如 375
console.log(systemInfo.windowHeight) // 窗口高度，如 667
console.log(systemInfo.statusBarHeight) // 状态栏高度，如 47
console.log(systemInfo.pixelRatio) // 设备像素比，如 2
console.log(systemInfo.screenWidth) // 屏幕宽度，如 375
console.log(systemInfo.screenHeight) // 屏幕高度，如 667
```

### safeAreaInsets

安全区域边距，表示相对屏幕四边的距离。在有刘海屏、圆角屏幕的设备上特别有用。

```typescript
import { safeAreaInsets } from '@bingwu/iip-ui-uniapp-utils'

if (safeAreaInsets) {
  console.log(safeAreaInsets.top) // 顶部安全区域，如 47
  console.log(safeAreaInsets.right) // 右侧安全区域，如 0
  console.log(safeAreaInsets.bottom) // 底部安全区域，如 34（iPhone X）
  console.log(safeAreaInsets.left) // 左侧安全区域，如 0
}
```

### menuButtonInfo

胶囊按钮在页面内的位置信息，基于 `uni.getMenuButtonBoundingClientRect()` 获取。

```typescript
import { menuButtonInfo } from '@bingwu/iip-ui-uniapp-utils'

console.log(menuButtonInfo.top) // 胶囊按钮上边界坐标，如 51
console.log(menuButtonInfo.right) // 胶囊按钮右边界坐标，如 365
console.log(menuButtonInfo.bottom) // 胶囊按钮下边界坐标，如 83
console.log(menuButtonInfo.left) // 胶囊按钮左边界坐标，如 278
console.log(menuButtonInfo.width) // 胶囊按钮宽度，如 87
console.log(menuButtonInfo.height) // 胶囊按钮高度，如 32
```

## 自定义系统 UI 尺寸

提供导航栏、状态栏、TabBar 等常用 UI 组件的尺寸计算，所有尺寸单位均为 px。

### statusBarHeight

状态栏高度。

```typescript
import { statusBarHeight } from '@bingwu/iip-ui-uniapp-utils'

console.log(statusBarHeight) // 例如：47
```

### navBarHeight

导航栏内容区高度，计算公式：`胶囊上下间距 × 2 + 胶囊高度`。

```typescript
import { navBarHeight } from '@bingwu/iip-ui-uniapp-utils'

console.log(navBarHeight) // 例如：40
```

### customBarHeight

导航栏总高度，计算公式：`状态栏高度 + 导航栏内容区高度`。

```typescript
import { customBarHeight } from '@bingwu/iip-ui-uniapp-utils'

console.log(customBarHeight) // 例如：87
```

### tabBarHeight

TabBar 总高度，计算公式：`TabBar 基础高度 + 底部安全区域高度`。

```typescript
import { tabBarHeight } from '@bingwu/iip-ui-uniapp-utils'

console.log(tabBarHeight) // 例如：84（iPhone X）或 50（其他设备）
```

### tabBarBaseHeight

TabBar 基础高度，微信小程序固定为 50px。

```typescript
import { tabBarBaseHeight } from '@bingwu/iip-ui-uniapp-utils'

console.log(tabBarBaseHeight) // 50
```

### menuButtonInfoAndStatusBarHeightGap

胶囊按钮与状态栏的间距。

```typescript
import { menuButtonInfoAndStatusBarHeightGap } from '@bingwu/iip-ui-uniapp-utils'

console.log(menuButtonInfoAndStatusBarHeightGap) // 例如：4
```

## 使用示例

### 自定义导航栏

```vue
<template>
  <view class="page">
    <!-- 自定义导航栏 -->
    <view class="custom-navbar" :style="{ height: customBarHeight + 'px' }">
      <!-- 状态栏占位 -->
      <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

      <!-- 导航栏内容 -->
      <view class="nav-content" :style="{ height: navBarHeight + 'px' }">
        <view class="nav-left">
          <text class="nav-back" @click="goBack">返回</text>
        </view>
        <view class="nav-title">
          <text>页面标题</text>
        </view>
        <view class="nav-right" :style="{ width: menuButtonInfo.width + 'px' }"></view>
      </view>
    </view>

    <!-- 页面内容 -->
    <view class="page-content">
      <!-- 内容区域 -->
    </view>
  </view>
</template>

<script setup lang="ts">
import {
  customBarHeight,
  statusBarHeight,
  navBarHeight,
  menuButtonInfo
} from '@bingwu/iip-ui-uniapp-utils'

const goBack = () => {
  uni.navigateBack()
}
</script>

<style scoped>
.page {
  width: 100%;
  height: 100vh;
}

.custom-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background: #fff;
  border-bottom: 1px solid #eee;
}

.status-bar {
  width: 100%;
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
}

.nav-left,
.nav-right {
  flex-shrink: 0;
}

.nav-title {
  flex: 1;
  text-align: center;
  font-size: 17px;
  font-weight: 500;
}

.nav-back {
  color: #007aff;
  font-size: 16px;
}

.page-content {
  padding-top: calc(v-bind(customBarHeight) * 1px);
}
</style>
```

### 适配底部安全区域

```vue
<template>
  <view class="page-container">
    <!-- 页面内容 -->
    <view class="content">
      <!-- 内容区域 -->
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
      <button class="action-btn">确定</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { safeAreaInsets } from '@bingwu/iip-ui-uniapp-utils'
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.content {
  flex: 1;
  overflow-y: auto;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 1px solid #eee;
  padding: 10px 15px;
}

.action-btn {
  width: 100%;
  height: 44px;
  background: #07c160;
  color: #fff;
  border: none;
  border-radius: 4px;
}
</style>
```

### 响应式布局适配

```vue
<template>
  <view class="responsive-page">
    <!-- 顶部导航栏 -->
    <view class="navbar" :style="navbarStyle">
      <text>响应式页面</text>
    </view>

    <!-- 内容区域 -->
    <view class="content" :style="contentStyle">
      <view class="card" v-for="item in list" :key="item.id">
        {{ item.title }}
      </view>
    </view>

    <!-- 底部 TabBar 占位 -->
    <view class="tabbar-placeholder" :style="tabbarStyle"></view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  customBarHeight,
  tabBarHeight,
  systemInfo,
  safeAreaInsets
} from '@bingwu/iip-ui-uniapp-utils'

const list = [
  { id: 1, title: '项目 1' },
  { id: 2, title: '项目 2' },
  { id: 3, title: '项目 3' }
]

// 导航栏样式
const navbarStyle = computed(() => ({
  height: `${customBarHeight}px`,
  paddingTop: `${systemInfo.statusBarHeight}px`
}))

// 内容区域样式
const contentStyle = computed(() => ({
  paddingTop: `${customBarHeight}px`,
  paddingBottom: `${tabBarHeight}px`,
  minHeight: `${systemInfo.windowHeight}px`
}))

// TabBar 占位样式
const tabbarStyle = computed(() => ({
  height: `${tabBarHeight}px`,
  paddingBottom: `${safeAreaInsets?.bottom || 0}px`
}))
</script>

<style scoped>
.responsive-page {
  width: 100%;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background: #fff;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.content {
  padding: 15px;
}

.card {
  background: #fff;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tabbar-placeholder {
  height: 50px;
}
</style>
```

## API 参考

### 系统信息常量

| 常量名                                | 类型                                                                                          | 描述                                  |
| ------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------- |
| `systemInfo`                          | `UniNamespace.GetWindowInfoResult`                                                            | 窗口与系统信息                        |
| `safeAreaInsets`                      | `{ top: number; right: number; bottom: number; left: number } \| null`                        | 安全区域边距                          |
| `menuButtonInfo`                      | `{ top: number; right: number; bottom: number; left: number; width: number; height: number }` | 胶囊按钮位置信息                      |
| `statusBarHeight`                     | `number`                                                                                      | 状态栏高度（px）                      |
| `menuButtonInfoAndStatusBarHeightGap` | `number`                                                                                      | 胶囊按钮与状态栏间距（px）            |
| `navBarHeight`                        | `number`                                                                                      | 导航栏内容区高度（px）                |
| `customBarHeight`                     | `number`                                                                                      | 导航栏总高度（px）                    |
| `tabBarBaseHeight`                    | `number`                                                                                      | TabBar 基础高度（px），固定为 50      |
| `tabBarHeight`                        | `number`                                                                                      | TabBar 总高度（px），包含底部安全区域 |

## 注意事项

1. **环境检测**：工具库会在导入时自动检测运行环境，如果不在 uni-app 小程序环境中会抛出异常
2. **平台兼容性**：推荐在微信小程序环境中使用，其他平台会输出警告信息
3. **类型安全**：使用 TypeScript 编写，提供完整的类型定义
4. **尺寸单位**：所有尺寸相关的值单位均为 px，在使用时需要添加单位
5. **安全区域**：在适配刘海屏、圆角屏幕时，务必使用 `safeAreaInsets` 进行适配

## 相关链接

- [uni-app 官方文档](https://uniapp.dcloud.net.cn/)
- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [GitHub 仓库](https://github.com/BINGWU2003/iip-ui-vue3)
- [问题反馈](https://github.com/BINGWU2003/iip-ui-vue3/issues)
