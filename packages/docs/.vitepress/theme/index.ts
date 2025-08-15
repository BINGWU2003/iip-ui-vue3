import DefaultTheme from 'vitepress/theme'
import { App } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// vxe-table 相关
import VxeUITable from 'vxe-table'
import 'vxe-table/lib/style.css'
import VxePCUI from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'

// IIP UI 组件库
import IipUI from '@bingwu/iip-ui-components'
import '@bingwu/iip-ui-theme/dist/index.css'

// 自定义样式
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }: { app: App }) {
    // 注册插件（顺序很重要）
    app.use(VxeUITable) // 必须在 IipUI 之前注册
    app.use(VxePCUI) // 必须在 IipUI 之前注册
    app.use(ElementPlus) // Element Plus 支持
    app.use(IipUI) // 最后注册 IIP UI
  }
}
