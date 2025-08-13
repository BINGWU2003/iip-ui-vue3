import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],

  // 开发服务器配置
  server: {
    port: 3000,
    open: true,
    host: true
  },

  // 入口文件 - 设置为 dev 目录
  root: resolve(__dirname, 'dev'),

  // 构建配置
  build: {
    outDir: '../dev-dist',
    rollupOptions: {
      input: resolve(__dirname, 'dev/index.html')
    }
  },

  // 路径解析
  resolve: {
    alias: {
      '@': resolve(__dirname, '../src'),
      '@components': resolve(__dirname, '../src/components'),
      '@utils': resolve(__dirname, '../../utils/src'),
      '@theme': resolve(__dirname, '../../theme/src')
    }
  },

  // CSS 预处理器 - 简化配置
  css: {
    preprocessorOptions: {
      scss: {
        // 移除有问题的 additionalData，让组件自己处理样式导入
      }
    }
  },

  // 优化依赖
  optimizeDeps: {
    include: ['vue', 'element-plus', 'vxe-table', 'xe-utils']
  }
})
