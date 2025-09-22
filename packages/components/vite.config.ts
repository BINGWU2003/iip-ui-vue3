import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

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
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: ['vue'],
      dts: true
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: true
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
      formats: ['es', 'umd']
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue', 'element-plus', '@bingwu/iip-ui-utils', '@bingwu/iip-ui-theme'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
          'element-plus': 'ElementPlus',
          '@bingwu/iip-ui-utils': 'IipUIUtils'
        },
        // 导出模块声明
        exports: 'named'
      }
    },
    // 生成源码映射
    sourcemap: true,
    // 清空输出目录
    emptyOutDir: true
  }
})
