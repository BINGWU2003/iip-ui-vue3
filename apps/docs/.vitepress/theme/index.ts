import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 导入组件库 - 使用 install 方法一次性注册所有组件
import IipUI from '@bingwu/iip-ui-components'
// 必须：vxe-table 相关插件
import VxeUITable from 'vxe-table'
import 'vxe-table/lib/style.css'
import VxePCUI from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册 Element Plus
    app.use(ElementPlus)
    app.use(VxeUITable)
    app.use(VxePCUI)

    // 一次性注册组件库的所有组件
    app.use(IipUI)
  }
} satisfies Theme
