import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

// 导入组件库
import IipUI from '../src/index'
// 使用编译后的 CSS 文件
import '../../theme/dist/index.css'

// 导入开发应用
import App from './App.vue'

const app = createApp(App)

// 注册 Element Plus
app.use(ElementPlus)

// 注册 VXE Table
app.use(VXETable)

// 注册组件库
app.use(IipUI)

app.mount('#app')
