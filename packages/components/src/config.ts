export interface IipGlobalConfig {
  /** 文件预览的基础地址 */
  website?: string
}

export const globalConfig: IipGlobalConfig = {
  website: ''
}

export const setGlobalConfig = (options: IipGlobalConfig) => {
  Object.assign(globalConfig, options)
}
