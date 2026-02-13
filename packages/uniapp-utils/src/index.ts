// UniApp 工具函数库入口文件

/**
 * 校验当前是否处于 uni-app 小程序运行环境。
 * 如果不在小程序环境中使用该库，会在调用时直接抛出异常。
 */
export function assertMiniProgramEnv(): void {
  // 非小程序 / 非 uni-app 运行时通常没有全局 uni 对象
  // 这里做一个宽松判断，只要没有 uni 或缺少核心 API 即认为不支持
  if (typeof uni === 'undefined' || typeof uni.getSystemInfoSync !== 'function') {
    throw new Error(
      '[uniapp-utils] 当前运行环境不是 uni-app 小程序环境，请勿在非小程序环境中使用该工具库。'
    )
  }

  // 进一步校验平台是否为微信小程序
  const { uniPlatform } = uni.getSystemInfoSync()

  if (uniPlatform !== 'mp-weixin') {
    console.warn(
      `[uniapp-utils] 当前工具库推荐在微信小程序环境(mp-weixin)中使用，当前平台为：${uniPlatform ?? '未知'}。`
    )
  }
}

assertMiniProgramEnv()
export * from './storage'
export * from './system'
// 类型导出
export * from './types'
