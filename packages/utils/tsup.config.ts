import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: false,
  minify: 'terser',
  // 移除 console.log 和 debugger 语句
  esbuildOptions(options) {
    options.pure = ['console.log']
    options.drop = ['debugger']
  }
})
