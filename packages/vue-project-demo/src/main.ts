import './assets/main.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 必须：vxe-table 相关插件
import VxeUITable from 'vxe-table'
import 'vxe-table/lib/style.css'
import VxePCUI from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'
// IIP UI 组件库
import IipUI from '@bingwu/iip-ui-components'
import '@bingwu/iip-ui-theme/dist/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(IipUI)
app.use(VxeUITable)
app.use(VxePCUI)
app.use(router)
app.use(ElementPlus)

app.mount('#app')
