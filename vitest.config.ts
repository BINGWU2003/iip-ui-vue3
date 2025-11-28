import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    // 测试环境
    environment: 'node',
    // 测试文件匹配模式
    include: [
      'packages/components/src/**/*.{test,spec}.{js,ts}',
      'packages/utils/src/**/*.{test,spec}.{js,ts}'
    ],
    // 排除的文件
    exclude: ['node_modules', 'dist'],
    // 全局设置
    globals: true,
    // 覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/', '**/*.d.ts', '**/*.config.{js,ts}', 'coverage/**']
    }
  }
})
