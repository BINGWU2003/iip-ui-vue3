/**
 * 请求标识与检查函数对象
 */
export interface RequestIdentifier {
  /**
   * 唯一请求ID
   */
  requestId: number

  /**
   * 检查当前请求是否是最新的请求
   * @returns 是否是最新请求
   */
  isLatestRequest: () => boolean
}

/**
 * 请求结果对象
 */
export interface RequestResult<T = any> {
  /**
   * 请求返回的数据
   */
  data?: T

  /**
   * 请求ID
   */
  requestId: number

  /**
   * 是否是最新请求的结果
   */
  isLatest: boolean

  /**
   * 可选的处理结果，由onSuccess回调返回
   */
  result?: any

  /**
   * 如果请求失败，则包含错误信息
   */
  error?: Error
}

/**
 * 请求配置选项
 */
export interface RequestOptions<T = any, R = any> {
  /**
   * 成功回调，仅当是最新请求时调用
   */
  onSuccess?: (data: T) => R

  /**
   * 错误回调，仅当是最新请求时调用
   */
  onError?: (error: Error) => void

  /**
   * 过期请求回调，可选
   */
  onOutdated?: (data: T, requestId: number) => void

  /**
   * 无论成功失败都会执行的回调
   */
  onFinally?: () => void
}

/**
 * 请求管理器接口
 */
export interface RequestManager {
  /**
   * 创建一个新的请求，并返回请求ID和检查函数
   * @returns 包含请求ID和检查函数的对象
   */
  createRequest: () => RequestIdentifier

  /**
   * 通用请求方法，同时支持 async/await 和 then/catch 写法
   * @param asyncFn 异步请求函数
   * @param options 可选的配置选项，包含成功、失败、过期回调
   * @returns 返回 Promise，可链式调用
   */
  request: <T = any, R = any>(
    asyncFn: (requestId: number) => Promise<T>,
    options?: RequestOptions<T, R>
  ) => Promise<RequestResult<T>>

  /**
   * 获取当前最新的请求ID
   * @returns 最新请求ID
   */
  getCurrentId: () => number
}
