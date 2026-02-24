import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { codeInspectorPlugin } from 'code-inspector-plugin'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
export default defineConfig({
  plugins: [
    vue(),
    codeInspectorPlugin({ bundler: 'vite' }),
    // --- API 自动导入配置 ---
    AutoImport({
      // 自动导入的库
      imports: ['vue'],

      // 生成类型声明文件路径
      dts: resolve(__dirname, 'auto-imports.d.ts'),

      // 自动导入 UI 库的 API
      resolvers: [ElementPlusResolver()]
    }),
    // --- 组件自动导入配置 ---
    Components({
      // 生成类型声明文件路径
      dts: resolve(__dirname, 'components.d.ts'),

      // 自动导入 UI 库组件 (例如 <el-button>)
      resolvers: [ElementPlusResolver()]
    })
  ],
  root: resolve(__dirname, 'dev'),
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@bingwu/iip-ui-utils': resolve(__dirname, '../../packages/utils/src/index.ts')
    }
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    open: true
  }
})
