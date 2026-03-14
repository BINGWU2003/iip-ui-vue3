import type { App, Component } from 'vue'
import { setGlobalConfig, type IipGlobalConfig } from './config'

// 导入所有组件和函数
import {
  IipDateRange,
  IipPaginationSelect,
  IipDialogSelect,
  openDialogSelect,
  IipDropdownList,
  IipFileListPreview,
  openFileListPreview
} from './components'

// 所有组件列表
const components: Component[] = [
  IipDateRange,
  IipPaginationSelect,
  IipDialogSelect,
  IipDropdownList,
  IipFileListPreview
]

// 定义 install 方法
const install = (app: App, options?: IipGlobalConfig): void => {
  if (options) {
    setGlobalConfig(options)
  }

  // 注册所有组件
  components.forEach(component => {
    if (component.name) {
      app.component(component.name, component)
    }
  })
}

export {
  // 导出所有组件
  IipDateRange,
  IipPaginationSelect,
  IipDialogSelect,
  IipDropdownList,
  IipFileListPreview,
  // 导出函数
  openDialogSelect,
  openFileListPreview,
  // 导出 install 方法和版本号
  install
}

// 默认导出
export default {
  install
}

// 导出类型
export * from './types'
