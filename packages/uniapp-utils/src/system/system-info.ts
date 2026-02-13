/**
 * 系统/窗口信息模块
 * 提供窗口信息、安全区域边距、胶囊按钮位置等，基于 uni.getWindowInfo() 与 uni.getMenuButtonBoundingClientRect()
 */

import { isFunction } from '@bingwu/iip-ui-utils'

/** 当前窗口与系统信息（uni.getWindowInfo 返回值） */
const systemInfo = uni.getWindowInfo()

/**
 * 安全区域边距（相对屏幕四边的距离）
 * 由 safeArea 换算为 top/right/bottom/left 的 insets；无 safeArea 时为 null
 * @type {{ top: number; right: number; bottom: number; left: number } | null}
 */
const safeAreaInsets = systemInfo.safeArea
  ? {
      top: systemInfo.safeArea.top,
      right: systemInfo.windowWidth - systemInfo.safeArea.right,
      bottom: systemInfo.windowHeight - systemInfo.safeArea.bottom,
      left: systemInfo.safeArea.left
    }
  : null

/** 胶囊按钮在页面内的位置信息（uni.getMenuButtonBoundingClientRect 返回值） */
const menuButtonInfo = isFunction(uni.getMenuButtonBoundingClientRect)
  ? uni.getMenuButtonBoundingClientRect()
  : {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      width: 0,
      height: 0
    }
export { safeAreaInsets, systemInfo, menuButtonInfo }
