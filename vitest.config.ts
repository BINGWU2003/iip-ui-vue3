import { defineConfig } from 'vitest/config'

// 检测当前工作目录，判断是从根目录还是子包目录运行
const cwd = process.cwd()

const isInPackage = cwd.includes('packages')

export default defineConfig({
  test: {
    // 测试环境
    environment: 'node',
    // 测试文件匹配模式
    include: isInPackage
      ? ['src/**/*.{test,spec}.{js,ts}'] // 从子包目录运行
      : [
          // 从根目录运行
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
