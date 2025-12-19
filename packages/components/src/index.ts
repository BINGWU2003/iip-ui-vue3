import type { App, Component } from 'vue'

// 导入所有组件和函数
import { IipDateRange, IipPaginationSelect, IipDialogSelect, openDialogSelect } from './components'

// 所有组件列表
const components: Component[] = [IipDateRange, IipPaginationSelect, IipDialogSelect]

// 定义 install 方法
const install = (app: App): void => {
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
  // 导出 openDialogSelect 函数
  openDialogSelect,
  // 导出 install 方法和版本号
  install
}

// 默认导出
export default {
  install
}

// 导出类型
export * from './types'
