import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      cleanVueFileName: true
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'IipUIUtils',
      fileName: format => `index.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      output: {
        exports: 'named'
      }
    },
    sourcemap: true,
    emptyOutDir: true,
    // 打包压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        // 删除console
        drop_console: true,
        // 删除debugger
        drop_debugger: true
      }
    }
  }
})
