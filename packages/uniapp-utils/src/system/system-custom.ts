/**
 * 自定义系统 UI 尺寸（导航栏、状态栏、TabBar 等）
 * 基于 uni.getMenuButtonBoundingClientRect() 与 uni.getSystemInfoSync() 在模块加载时计算
 */
import { menuButtonInfo, systemInfo } from './system-info'

/** 状态栏高度（px），如 47 */
const statusBarHeight = systemInfo.statusBarHeight // 47px

/** 胶囊按钮与状态栏的间距（px），如 4 */
const menuButtonInfoAndStatusBarHeightGap = menuButtonInfo.top - statusBarHeight
// 51 - 47 = 4px

/** 导航栏内容区高度（px）= 胶囊上下间距的 2 倍 + 胶囊高度，如 40 */
const navBarHeight = menuButtonInfoAndStatusBarHeightGap * 2 + menuButtonInfo.height
// 4 * 2 + 32 = 40px

/** 导航栏总高度（px）= 状态栏高度 + 导航栏内容区高度，如 87 */
const customBarHeight = statusBarHeight + navBarHeight
// 47 + 40 = 87px

/**
 * TabBar 本身高度（px），微信小程序固定 50
 * @see https://uniapp.dcloud.net.cn/collocation/pages.html#tabbar
 */
const tabBarBaseHeight = 50 // 50px

/** 底部安全区域高度（px），如 iPhone X 及以上为 34，其他为 0 */
const safeAreaInsetsBottom = systemInfo.safeAreaInsets ? systemInfo.safeAreaInsets.bottom : 0 // 34px (iPhone X 及以上) 或 0px (其他设备)

/** TabBar 总高度（px）= tabBarBaseHeight + safeAreaInsetsBottom，如 84 或 50 */
const tabBarHeight = tabBarBaseHeight + safeAreaInsetsBottom
// 50 + 34 = 84px (iPhone X 及以上) 或 50px (其他设备)

export {
  statusBarHeight,
  menuButtonInfoAndStatusBarHeightGap,
  navBarHeight,
  customBarHeight,
  tabBarHeight,
  tabBarBaseHeight
}
