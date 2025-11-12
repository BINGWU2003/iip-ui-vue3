# Monorepo 项目中新增包的完整教程

本教程将指导你在现有的 monorepo 项目中新增一个与 `components` 组件库同级别的新包（如工具库、主题库等）。

## 目录结构概览

当前项目结构：

```
iip-ui-vue3/
├── packages/
│   ├── components/     # 组件库
│   ├── utils/         # 工具函数库
│   ├── theme/         # 主题样式库
│   ├── docs/          # 文档站点
│   └── [新包名]/      # 你要创建的新包
├── pnpm-workspace.yaml
├── package.json
└── ...
```

## 步骤 1: 创建新包目录结构

假设你要创建一个名为 `hooks` 的工具库，创建以下目录结构：

```bash
packages/hooks/
├── src/
│   ├── __tests__/          # 测试文件目录
│   ├── index.ts           # 主入口文件
│   └── [功能模块]/         # 具体功能模块
├── dist/                  # 构建输出目录（构建后生成）
├── package.json          # 包配置文件
├── tsconfig.json         # TypeScript 配置
├── vite.config.ts        # Vite 构建配置
└── README.md             # 包说明文档
```

## 步骤 2: 创建 package.json

在 `packages/hooks/package.json` 中添加以下内容：

```json
{
  "name": "@bingwu/iip-ui-hooks",
  "version": "1.0.0",
  "description": "iip-ui-vue3 Vue3 Hooks 工具库",
  "type": "module",
  "main": "./dist/index.umd.js",
  "module": "./dist/index.es.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.es.js",
      "require": "./dist/index.umd.js",
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "vite build",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "vue": "^3.3.8"
  },
  "peerDependencies": {
    "vue": "^3.3.0"
  },
  "devDependencies": {
    "@types/node": "^20.9.0",
    "typescript": "^5.3.2",
    "vite": "^5.0.0",
    "vite-plugin-dts": "^3.6.3",
    "vitest": "^0.34.6"
  },
  "keywords": ["hooks", "vue3", "typescript", "composition-api", "utilities"],
  "author": "iip-ui-vue3 Team",
  "license": "MIT",
  "homepage": "https://github.com/BINGWU2003/iip-ui-vue3#readme",
  "repository": {
    "type": "git",
    "url": "https://github.com/BINGWU2003/iip-ui-vue3.git",
    "directory": "packages/hooks"
  },
  "bugs": {
    "url": "https://github.com/BINGWU2003/iip-ui-vue3/issues"
  },
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  }
}
```

### package.json 配置详解

#### 基础信息配置

- **`name`**: 包的唯一标识符
  - 使用 `@bingwu/` 作为作用域，避免与其他包冲突
  - 遵循 `@作用域/项目名-功能名` 的命名规范
- **`version`**: 语义化版本号
  - 遵循 `主版本号.次版本号.修订版本号` 格式
  - 新包从 `1.0.0` 开始，表示稳定的首个版本

- **`description`**: 包的简短描述
  - 帮助用户快速了解包的用途
  - 在 npm 搜索中显示

#### 模块系统配置

- **`type: "module"`**: 声明为 ES 模块包
  - 支持现代 JavaScript 的 `import/export` 语法
  - 与 Vue 3 和现代构建工具保持一致

- **`main`**: CommonJS 模块入口
  - 为支持旧版本 Node.js 和构建工具提供 UMD 格式
  - 保证向后兼容性

- **`module`**: ES 模块入口
  - 现代打包工具（如 Webpack、Vite）优先使用
  - 支持 Tree Shaking 优化

- **`types`**: TypeScript 类型声明文件
  - 为 TypeScript 项目提供类型支持
  - 提升开发体验和代码安全性

#### 现代模块解析配置

- **`exports`**: 新的模块导出标准
  - 替代传统的 `main`、`module` 字段
  - 更精确地控制包的导出内容
  - 支持条件导出（import/require/types）

#### 发布配置

- **`files`**: 指定发布到 npm 的文件
  - 只包含 `dist` 目录，避免发布源码和开发文件
  - 减小包体积，提升安装速度

#### 脚本配置

- **`scripts`**: 定义常用命令
  - `build`: 构建生产版本
  - `test`: 运行单元测试
  - `test:ui`: 运行测试并启动 UI 界面
  - `clean`: 清理构建产物

#### 依赖管理

- **`dependencies`**: 生产环境依赖
  - 包含包运行时必需的依赖
  - 会被自动安装到使用者的项目中

- **`peerDependencies`**: 同版本依赖
  - 要求使用者项目中必须有对应版本的依赖
  - 避免重复安装，减少包体积
  - Vue 作为 peer dependency，因为通常项目中已有

- **`devDependencies`**: 开发环境依赖
  - 只在开发和构建时需要
  - 不会被安装到使用者的项目中

#### 元数据配置

- **`keywords`**: 搜索关键词
  - 帮助用户在 npm 上搜索到包
  - 描述包的主要功能和技术栈

- **`author`**: 作者信息
  - 标识包的维护者
  - 建立品牌认知

- **`license`**: 开源许可证
  - MIT 许可证允许商业和非商业使用
  - 提供法律保护和使用指导

#### 项目链接配置

- **`homepage`**: 项目主页
  - 通常指向 GitHub 仓库或文档站点
  - 方便用户了解更多信息

- **`repository`**: 源码仓库信息
  - 指向 Git 仓库地址
  - `directory` 字段指定 monorepo 中的包路径

- **`bugs`**: 问题反馈地址
  - 用户可以在此提交 bug 报告
  - 便于维护者收集反馈

#### 发布配置

- **`publishConfig`**: 发布设置
  - `access: "public"`: 公开发布包
  - `registry`: 指定发布到的 npm 仓库地址

## 步骤 3: 创建 TypeScript 配置

在 `packages/hooks/tsconfig.json` 中添加：

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts", "**/*.spec.ts"]
}
```

### tsconfig.json 配置详解

#### 继承配置

- **`extends`**: 继承根目录的 TypeScript 配置
  - 保持项目内配置的一致性
  - 减少重复配置，便于统一管理
  - 子包可以覆盖特定配置项

#### 编译输出配置

- **`outDir`**: 编译输出目录
  - 指定为 `dist`，与构建工具保持一致
  - 将所有编译产物集中管理

- **`rootDir`**: 源码根目录
  - 指定为 `src`，确保输出目录结构正确
  - 避免编译时创建不必要的嵌套目录

#### 类型声明配置

- **`declaration`**: 生成类型声明文件（.d.ts）
  - 为 TypeScript 项目提供类型支持
  - 必须开启，否则其他包无法获得类型提示

- **`declarationMap`**: 生成声明文件的源映射
  - 便于在 IDE 中跳转到源码定义
  - 提升开发体验

- **`sourceMap`**: 生成源码映射文件
  - 便于调试时定位到原始源码
  - 在开发环境中非常有用

#### 库支持配置

- **`lib`**: 指定可用的库文件
  - `ES2020`: 支持现代 JavaScript 特性
  - `DOM`: 支持浏览器 DOM API（如果包需要在浏览器中使用）
  - `DOM.Iterable`: 支持 DOM 的迭代器接口

#### 编译优化配置

- **`skipLibCheck`**: 跳过库文件的类型检查
  - 加快编译速度
  - 避免第三方库的类型错误影响编译

#### 文件包含配置

- **`include`**: 指定要编译的文件
  - `src/**/*` 包含 src 目录下的所有文件
  - 确保所有源码都被编译

- **`exclude`**: 排除不需要编译的文件
  - `node_modules`: 排除依赖包
  - `dist`: 排除构建产物
  - `**/*.test.ts` 和 `**/*.spec.ts`: 排除测试文件
  - 避免编译不必要的文件，提升性能

## 步骤 4: 创建 Vite 构建配置

在 `packages/hooks/vite.config.ts` 中添加：

```typescript
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      cleanVueFileName: true,
      skipDiagnostics: false,
      tsConfigFilePath: './tsconfig.json'
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'IipUIHooks',
      fileName: format => `index.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        },
        exports: 'named'
      }
    },
    sourcemap: true,
    emptyOutDir: true
  },
  test: {
    environment: 'jsdom',
    globals: true
  }
})
```

### vite.config.ts 配置详解

#### 插件配置

- **`dts` 插件**: 生成 TypeScript 声明文件
  - `insertTypesEntry: true`: 在 package.json 中自动插入 types 字段
  - `cleanVueFileName: true`: 清理 Vue 文件名，生成更清晰的类型文件
  - `skipDiagnostics: false`: 不跳过类型检查，确保类型正确性
  - `tsConfigFilePath`: 指定 TypeScript 配置文件路径

#### 路径解析配置

- **`resolve.alias`**: 设置路径别名
  - `@` 指向 `src` 目录，简化导入路径
  - 提升开发体验，避免相对路径的复杂性

#### 库构建配置

- **`build.lib`**: 库模式构建配置
  - `entry`: 指定库的入口文件
  - `name`: 全局变量名（用于 UMD 格式）
  - `fileName`: 输出文件名格式化函数
  - `formats`: 输出格式，包含 ES 模块和 UMD 格式

##### 为什么选择这些格式？

- **ES 模块 (`es`)**:
  - 现代打包工具的首选格式
  - 支持 Tree Shaking，减少最终包体积
  - 静态分析友好，便于优化

- **UMD 格式 (`umd`)**:
  - 通用模块定义，兼容多种模块系统
  - 支持直接在浏览器中使用 `<script>` 标签引入
  - 向后兼容性好

#### Rollup 配置

- **`rollupOptions.external`**: 外部依赖配置
  - `vue`: 不打包 Vue，作为外部依赖
  - 避免重复打包，减少包体积
  - 用户项目中的 Vue 版本优先

- **`rollupOptions.output`**: 输出配置
  - `globals`: 为外部依赖提供全局变量名
  - `exports: 'named'`: 使用命名导出，支持按需引入

#### 构建优化配置

- **`sourcemap: true`**: 生成源码映射
  - 便于调试和错误定位
  - 在开发环境中查看原始源码

- **`emptyOutDir: true`**: 构建前清空输出目录
  - 确保每次构建都是干净的
  - 避免旧文件残留

#### 测试配置

- **`test.environment: 'jsdom'`**: 测试环境配置
  - 模拟浏览器环境，支持 DOM 操作
  - 适合测试 Vue 组合式 API 和 DOM 相关功能

- **`test.globals: true`**: 全局测试 API
  - 无需在每个测试文件中导入 `describe`、`it`、`expect`
  - 简化测试代码编写

## 步骤 5: 创建主入口文件

在 `packages/hooks/src/index.ts` 中添加：

```typescript
// 导出所有 hooks
export * from './useExample'

// 如果有类型定义，也要导出
export type * from './types'

// 版本信息
export const version = '1.0.0'
```

## 步骤 6: 创建示例功能模块

在 `packages/hooks/src/useExample.ts` 中添加示例：

```typescript
import { ref, computed } from 'vue'

/**
 * 示例 Hook：计数器
 */
export function useCounter(initialValue = 0) {
  const count = ref(initialValue)

  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => (count.value = initialValue)

  const isPositive = computed(() => count.value > 0)
  const isNegative = computed(() => count.value < 0)
  const isZero = computed(() => count.value === 0)

  return {
    count,
    increment,
    decrement,
    reset,
    isPositive,
    isNegative,
    isZero
  }
}
```

## 步骤 7: 创建类型定义文件

在 `packages/hooks/src/types.ts` 中添加：

```typescript
// 导出公共类型定义
export interface CounterOptions {
  min?: number
  max?: number
  step?: number
}

export interface UseCounterReturn {
  count: Ref<number>
  increment: () => void
  decrement: () => void
  reset: () => void
  isPositive: ComputedRef<boolean>
  isNegative: ComputedRef<boolean>
  isZero: ComputedRef<boolean>
}
```

## 步骤 8: 添加测试文件

在 `packages/hooks/src/__tests__/useExample.test.ts` 中添加：

```typescript
import { describe, it, expect } from 'vitest'
import { useCounter } from '../useExample'

describe('useCounter', () => {
  it('should initialize with default value', () => {
    const { count } = useCounter()
    expect(count.value).toBe(0)
  })

  it('should initialize with custom value', () => {
    const { count } = useCounter(10)
    expect(count.value).toBe(10)
  })

  it('should increment correctly', () => {
    const { count, increment } = useCounter(0)
    increment()
    expect(count.value).toBe(1)
  })

  it('should decrement correctly', () => {
    const { count, decrement } = useCounter(1)
    decrement()
    expect(count.value).toBe(0)
  })

  it('should reset to initial value', () => {
    const { count, increment, reset } = useCounter(5)
    increment()
    increment()
    expect(count.value).toBe(7)
    reset()
    expect(count.value).toBe(5)
  })
})
```

## 步骤 9: 更新根目录配置

### 9.1 确认 pnpm-workspace.yaml

确保 `pnpm-workspace.yaml` 包含：

```yaml
packages:
  - 'packages/*'
```

#### pnpm-workspace.yaml 配置详解

- **`packages`**: 定义工作空间包的位置
  - `'packages/*'`: 包含 packages 目录下的所有子目录
  - 通配符模式，自动识别新增的包
  - 支持 pnpm 的 monorepo 功能

#### 为什么使用 pnpm 工作空间？

1. **依赖共享**: 相同的依赖只安装一次，节省磁盘空间
2. **链接管理**: 自动处理包之间的符号链接
3. **版本一致性**: 确保所有包使用相同版本的共享依赖
4. **构建效率**: 支持并行构建和增量构建
5. **开发体验**: 修改一个包后，依赖它的包可以立即看到变化

### 9.2 更新根目录 package.json

在根目录的 `package.json` 中添加新包的脚本：

```json
{
  "scripts": {
    "build:hooks": "pnpm --filter @bingwu/iip-ui-hooks build",
    "test:hooks": "pnpm --filter @bingwu/iip-ui-hooks test",
    "build:all": "pnpm -r --filter=!@iip-ui/docs build"
  }
}
```

#### 脚本配置详解

- **`--filter` 参数**: 指定要操作的包
  - 使用包名精确匹配特定包
  - 避免在不相关的包中执行命令

- **`-r` 参数**: 递归执行命令
  - 在所有工作空间包中执行命令
  - 自动处理包之间的依赖顺序

- **`--filter=!@iip-ui/docs`**: 排除特定包
  - `!` 表示排除
  - 文档包通常不需要构建，只需要运行开发服务器

#### 为什么需要这些脚本？

1. **开发便利性**: 在根目录就能操作所有包
2. **CI/CD 集成**: 自动化流程中统一执行
3. **依赖管理**: 确保按正确顺序构建包
4. **团队协作**: 统一的命令接口，降低学习成本

## 步骤 10: 安装依赖并构建

```bash
# 安装所有依赖
pnpm install

# 构建新包
pnpm build:hooks

# 运行测试
pnpm test:hooks
```

## 步骤 11: 在其他包中使用新包

### 11.1 在 components 包中使用

在 `packages/components/package.json` 中添加依赖：

```json
{
  "dependencies": {
    "@bingwu/iip-ui-hooks": "workspace:*"
  }
}
```

#### 依赖配置详解

- **`workspace:*` 协议**: pnpm 工作空间协议
  - 自动链接到本地包，无需发布到 npm
  - `*` 表示使用工作空间中的任何版本
  - 开发时实时反映代码变更

#### 为什么使用 workspace 协议？

1. **开发效率**: 修改源码立即生效，无需重新安装
2. **版本一致性**: 始终使用最新的本地版本
3. **构建优化**: 避免重复打包相同的代码
4. **调试便利**: 可以直接调试源码

### 11.2 在组件中使用

```typescript
// packages/components/src/components/example/example.vue
<script setup lang="ts">
import { useCounter } from '@bingwu/iip-ui-hooks'

const { count, increment, decrement, reset } = useCounter(0)
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
    <button @click="reset">Reset</button>
  </div>
</template>
```

#### 使用方式详解

- **按需导入**: 只导入需要的 hooks，支持 Tree Shaking
- **类型支持**: TypeScript 自动推断类型，提供完整的类型提示
- **组合式 API**: 符合 Vue 3 的开发模式
- **响应式数据**: 返回的数据自动具有响应式特性

## 步骤 12: 发布配置

### 12.1 更新发布脚本

在 `scripts/publish.cjs` 中添加新包的发布逻辑。

### 12.2 添加到 CI/CD

如果有自动化部署，确保新包也被包含在构建和发布流程中。

## 常见问题解决

### 问题 1: 类型声明找不到

**现象**: 在使用包时，TypeScript 报错找不到类型声明

**原因分析**:

- `vite-plugin-dts` 配置不正确
- `tsconfig.json` 中的 `declaration` 设置为 `false`
- 构建过程中类型文件生成失败

**解决方案**:

1. 确保 `vite-plugin-dts` 正确配置，并且 `tsconfig.json` 中的路径设置正确
2. 检查 `package.json` 中的 `types` 字段是否指向正确的声明文件
3. 运行 `pnpm build` 确保类型文件正确生成

### 问题 2: 包之间的依赖解析失败

**现象**: 导入其他工作空间包时出现模块找不到的错误

**原因分析**:

- 没有使用 `workspace:*` 协议
- 依赖包没有构建
- pnpm 工作空间配置错误

**解决方案**:

1. 使用 `workspace:*` 协议引用本地包
2. 确保依赖包已经构建（运行 `pnpm build`）
3. 检查 `pnpm-workspace.yaml` 配置是否正确
4. 运行 `pnpm install` 重新安装依赖

### 问题 3: 构建时外部依赖打包进了产物

**现象**: 构建后的包体积过大，包含了不应该打包的依赖

**原因分析**:

- `rollupOptions.external` 配置不完整
- 依赖声明位置错误（应该在 `peerDependencies` 中）

**解决方案**:

1. 在 `vite.config.ts` 的 `rollupOptions.external` 中正确配置外部依赖
2. 将运行时依赖移动到 `peerDependencies` 中
3. 检查构建产物，确认外部依赖没有被打包

### 问题 4: 热更新不生效

**现象**: 修改源码后，使用该包的项目没有自动更新

**原因分析**:

- 没有使用 `workspace:*` 协议
- 构建工具缓存问题
- 开发服务器配置问题

**解决方案**:

1. 确保使用 `workspace:*` 协议引用本地包
2. 重启开发服务器
3. 清理构建缓存：`pnpm clean`

### 问题 5: 测试环境配置错误

**现象**: 运行测试时出现环境相关错误

**原因分析**:

- 测试环境配置不正确
- 缺少必要的测试依赖
- DOM API 在 Node.js 环境中不可用

**解决方案**:

1. 确保 `vite.config.ts` 中配置了 `test.environment: 'jsdom'`
2. 安装必要的测试依赖：`jsdom`、`vitest`
3. 在测试文件中正确导入和使用 API

## 最佳实践

### 1. 命名规范

- **包名格式**: 使用 `@bingwu/iip-ui-[功能名]` 格式
  - 保持品牌一致性
  - 避免命名冲突
  - 便于搜索和识别

### 2. 版本管理

- **独立版本**: 新包版本从 `1.0.0` 开始，与其他包保持独立版本
  - 每个包有自己的发布周期
  - 避免不必要的版本耦合
  - 遵循语义化版本规范

### 3. 文档完善

- **README.md**: 每个包都应该有完整的 README.md
  - 包含安装、使用、API 文档
  - 提供示例代码
  - 说明依赖和兼容性

- **API 文档**: 提供详细的 API 文档
  - 使用 TypeScript 注释
  - 提供使用示例
  - 说明参数和返回值

### 4. 测试覆盖

- **单元测试**: 确保有足够的单元测试覆盖率
  - 覆盖主要功能和边界情况
  - 使用描述性的测试名称
  - 保持测试代码的可维护性

- **集成测试**: 测试包之间的集成
  - 验证包的对外接口
  - 测试与其他包的兼容性

### 5. 类型支持

- **完整类型定义**: 提供完整的 TypeScript 类型定义
  - 导出所有公共类型
  - 提供泛型支持
  - 确保类型推断正确

- **类型文档**: 为复杂类型提供文档
  - 使用 TSDoc 注释
  - 提供使用示例

### 6. 构建优化

- **外部依赖**: 合理配置外部依赖，避免重复打包
  - 将框架依赖设为 `peerDependencies`
  - 只打包必要的代码
  - 支持 Tree Shaking

- **多格式支持**: 提供多种模块格式
  - ES 模块（现代打包工具）
  - UMD 格式（浏览器直接使用）
  - CommonJS（Node.js 环境）

### 7. 开发体验

- **热更新**: 支持开发时热更新
  - 使用 `workspace:*` 协议
  - 配置正确的构建流程

- **调试支持**: 提供良好的调试体验
  - 生成 source map
  - 提供清晰的错误信息

### 8. 性能考虑

- **按需加载**: 支持按需导入
  - 使用命名导出
  - 避免副作用导入

- **包体积**: 控制包的体积
  - 移除不必要的依赖
  - 使用更轻量的替代方案

### 9. 兼容性

- **浏览器兼容**: 考虑目标浏览器的兼容性
  - 配置合适的编译目标
  - 提供必要的 polyfill

- **Node.js 兼容**: 确保在 Node.js 环境中可用
  - 避免使用浏览器专有 API
  - 提供服务端渲染支持

### 10. 安全性

- **依赖安全**: 定期检查依赖的安全漏洞
  - 使用 `npm audit` 检查
  - 及时更新有漏洞的依赖

- **代码安全**: 避免不安全的编码实践
  - 输入验证
  - 避免代码注入

## 总结

通过以上步骤，你就可以在 monorepo 项目中成功添加一个新的包。关键点包括：

### 核心配置要点

1. **正确的目录结构和配置文件**
   - 标准化的文件组织方式
   - 一致的配置文件格式
   - 清晰的职责分离

2. **合理的依赖管理和版本控制**
   - 使用 `workspace:*` 协议管理内部依赖
   - 正确区分 `dependencies`、`peerDependencies` 和 `devDependencies`
   - 遵循语义化版本规范

3. **完善的构建和测试配置**
   - 支持多种模块格式输出
   - 完整的 TypeScript 类型支持
   - 全面的测试覆盖

4. **规范的包命名和发布配置**
   - 统一的命名规范
   - 正确的发布配置
   - 完整的元数据信息

### 配置文件的核心作用

- **`package.json`**: 定义包的基本信息、依赖关系和构建脚本
- **`tsconfig.json`**: 配置 TypeScript 编译选项和类型生成
- **`vite.config.ts`**: 配置构建流程、输出格式和测试环境
- **`pnpm-workspace.yaml`**: 定义 monorepo 工作空间结构

### 开发流程要点

1. **开发阶段**: 使用 workspace 协议实现热更新
2. **构建阶段**: 生成多格式产物和类型声明
3. **测试阶段**: 确保功能正确性和类型安全
4. **发布阶段**: 自动化发布流程

### 维护建议

- 定期更新依赖版本
- 保持文档同步更新
- 监控包的使用情况
- 收集用户反馈并持续改进

新包创建完成后，记得：

1. 更新项目文档，让团队成员了解新包的用途和使用方法
2. 在团队内部分享新包的设计思路和最佳实践
3. 建立代码审查流程，确保代码质量
4. 设置持续集成，自动化测试和发布流程

通过遵循这个教程，你可以确保新包与现有项目保持一致的架构和开发体验，同时为项目的可扩展性和可维护性奠定良好基础。
