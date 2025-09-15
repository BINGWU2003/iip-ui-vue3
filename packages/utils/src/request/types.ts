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
 * 请求管理器接口
 */
export interface RequestManager {
  /**
   * 创建一个新的请求，并返回请求ID和检查函数
   * @returns 包含请求ID和检查函数的对象
   */
  createRequest: () => RequestIdentifier

  /**
   * 执行一个受控的异步请求，只处理最新请求的响应
   * @param asyncFn 异步请求函数，接收requestId作为参数
   * @param onSuccess 成功回调，仅当是最新请求时调用
   * @param onOutdated 过期请求回调，可选
   * @returns 返回Promise，可用于链式调用或await
   */
  managedRequest: <T = any, R = any>(
    asyncFn: (requestId: number) => Promise<T>,
    onSuccess?: (data: T) => R,
    onOutdated?: (data: T, requestId: number) => void
  ) => Promise<RequestResult<T>>

  /**
   * 使用async/await方式处理请求竞态
   * @param fetchFn 获取数据的异步函数
   * @returns 处理过竞态问题的Promise
   */
  managedFetch: <T = any>(fetchFn: (requestId: number) => Promise<T>) => Promise<RequestResult<T>>

  /**
   * 获取当前最新的请求ID
   * @returns 最新请求ID
   */
  getCurrentId: () => number
}
