import type { App, Component } from 'vue'

// 导入所有组件
import { IipInput, IipSelect, IipTable, IipForm, IipDateRange } from './components'

// 注意：样式需要用户手动引入
// import '@iip-ui/theme/dist/index.css'

// 所有组件列表
const components: Component[] = [IipInput, IipSelect, IipTable, IipForm, IipDateRange]

// 定义 install 方法
const install = (app: App): void => {
  // 注册所有组件
  components.forEach(component => {
    if (component.name) {
      app.component(component.name, component)
    }
  })
}

// 版本号
const version = '1.0.0'

export {
  // 导出所有组件
  IipInput,
  IipSelect,
  IipTable,
  IipForm,
  IipDateRange,

  // 导出 install 方法和版本号
  install,
  version
}

// 默认导出
export default {
  install,
  version
}

// 导出类型
export * from './types'
