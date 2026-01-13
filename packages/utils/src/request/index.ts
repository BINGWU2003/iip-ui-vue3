import { RequestIdentifier, RequestManager, RequestOptions, RequestResult } from './types'

/**
 * 创建一个请求管理器，用于处理请求竞态问题
 * @returns 请求管理器对象
 */
export function createRequestManager(): RequestManager {
  // 最新请求的ID
  let latestRequestId = 0

  /**
   * 创建一个新的请求，并返回请求ID和检查函数
   * @returns 包含请求ID和检查函数的对象
   */
  function createRequest(): RequestIdentifier {
    const requestId = ++latestRequestId

    /**
     * 检查当前请求是否是最新的请求
     * @returns 是否是最新请求
     */
    function isLatestRequest(): boolean {
      return requestId === latestRequestId
    }

    return {
      requestId,
      isLatestRequest
    }
  }

  /**
   * 通用请求方法，同时支持 async/await 和 then/catch 写法
   *
   * @example
   * // async/await 写法
   * const { data, isLatest } = await requestManager.request(
   *   () => api.getData(),
   *   {
   *     onSuccess: (data) => console.log('成功:', data),
   *     onError: (error) => console.error('失败:', error),
   *     onFinally: () => console.log('完成')
   *   }
   * )
   * if (isLatest) {
   *   // 处理数据
   * }
   *
   * @example
   * // then/catch 写法
   * requestManager.request(() => api.getData())
   *   .then(({ data, isLatest }) => {
   *     if (isLatest) {
   *       console.log('最新数据:', data)
   *     }
   *   })
   *   .catch(error => console.error('错误:', error))
   *   .finally(() => console.log('完成'))
   *
   * @example
   * // 使用回调的 then 写法（更简洁）
   * requestManager.request(
   *   () => api.getData(),
   *   {
   *     onSuccess: (data) => {
   *       // 只有最新请求才会执行
   *       tableData.value = data
   *     },
   *     onError: (error) => {
   *       ElMessage.error(error.message)
   *     },
   *     onFinally: () => {
   *       loading.value = false
   *     }
   *   }
   * )
   *
   * @param asyncFn 异步请求函数
   * @param options 可选的配置选项
   * @returns 返回 Promise<RequestResult<T>>
   */
  async function request<T = any, R = any>(
    asyncFn: (requestId: number) => Promise<T>,
    options?: RequestOptions<T, R>
  ): Promise<RequestResult<T>> {
    const { onSuccess, onError, onOutdated, onFinally } = options || {}
    const { requestId, isLatestRequest } = createRequest()

    try {
      // 执行异步请求
      const data = await asyncFn(requestId)

      // 检查是否是最新请求
      if (isLatestRequest()) {
        // 只处理最新请求的响应
        const result = onSuccess?.(data)
        return { data, requestId, isLatest: true, result } as RequestResult<T>
      } else if (onOutdated) {
        // 处理过期请求的响应（可选）
        onOutdated(data, requestId)
      }

      return { data, requestId, isLatest: false } as RequestResult<T>
    } catch (error) {
      const err = error as Error

      if (isLatestRequest()) {
        // 只处理最新请求的错误
        if (onError) {
          onError(err)
          // 如果有 onError 回调，返回包含错误信息的结果而不是抛出
          return { error: err, requestId, isLatest: true } as RequestResult<T>
        } else {
          // 没有 onError 回调时，抛出错误以便外部 catch
          throw err
        }
      }

      // 非最新请求的错误，静默处理
      return { error: err, requestId, isLatest: false } as RequestResult<T>
    } finally {
      // 只对最新请求执行 finally 回调
      if (isLatestRequest() && onFinally) {
        onFinally()
      }
    }
  }

  return {
    createRequest,
    request,
    getCurrentId: () => latestRequestId
  }
}

export * from './types'

// 默认导出
export default createRequestManager
