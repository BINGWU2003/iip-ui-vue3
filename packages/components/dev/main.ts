import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 必须：vxe-table 相关插件
import VxeUITable from 'vxe-table'
import 'vxe-table/lib/style.css'
import VxePCUI from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'
import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)
app.use(VxeUITable)
app.use(VxePCUI)
app.mount('#app')
