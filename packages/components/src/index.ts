import type { App, Component } from 'vue'

// 导入所有组件
import { IipTable, IipForm, IipDateRange, IipPaginationSelect } from './components'

// 所有组件列表
const components: Component[] = [IipTable, IipForm, IipDateRange, IipPaginationSelect]

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
  IipTable,
  IipForm,
  IipDateRange,
  IipPaginationSelect,
  // 导出 install 方法和版本号
  install
}

// 默认导出
export default {
  install
}

// 导出类型
export * from './types'
