import { defineConfig } from 'tsdown'
import Vue from 'unplugin-vue/rolldown'

export default defineConfig({
  entry: ['./src/index.ts'], // 入口文件
  format: ['esm'], // 打包格式
  target: 'esnext', // 目标环境
  clean: true, // 每次构建清理 dist
  dts: true,
  tsconfig: './tsconfig.build.json',
  plugins: [
    Vue({
      isProduction: true
    })
  ]
})
