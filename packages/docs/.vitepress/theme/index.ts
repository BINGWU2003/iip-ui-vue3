import DefaultTheme from 'vitepress/theme'
import { App } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@bingwu/iip-ui-theme/dist/index.css'
import IipUI from '@bingwu/iip-ui-components'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }: { app: App }) {
    // 注册 Element Plus
    app.use(ElementPlus)

    // 注册 IIP UI 组件
    app.use(IipUI)
  }
}
