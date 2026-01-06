import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      outDir: 'dist',
      rollupTypes: true,
      copyDtsFiles: true,
      staticImport: true,
      clearPureImport: true,
      include: ['src/**/*', 'index.ts']
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'IipUI',
      fileName: format => `index.${format}.js`,
      formats: ['es']
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: [
        'vue',
        'element-plus',
        '@bingwu/iip-ui-utils',
        'vxe-table',
        'vxe-pc-ui',
        'xe-utils',
        'dayjs',
        '@element-plus/icons-vue'
      ],
      output: {
        // 导出模块声明
        exports: 'named'
      }
    },
    // 生成源码映射
    sourcemap: false,
    // 清空输出目录
    emptyOutDir: true
  }
})
