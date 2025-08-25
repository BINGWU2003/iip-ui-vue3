# 从零开始创建 Monorepo 项目完整教程

本教程将指导你从零开始创建一个完整的 monorepo 项目，包含组件库、工具库、主题库和文档站点。适合作为企业级项目的起始模板。

## 目录

- [项目概述](#项目概述)
- [环境准备](#环境准备)
- [项目初始化](#项目初始化)
- [工作空间配置](#工作空间配置)
- [创建包结构](#创建包结构)
- [配置构建工具](#配置构建工具)
- [配置开发工具](#配置开发工具)
- [创建组件库包](#创建组件库包)
- [创建工具库包](#创建工具库包)
- [创建主题库包](#创建主题库包)
- [创建文档站点](#创建文档站点)
- [配置脚本命令](#配置脚本命令)
- [版本管理与发布](#版本管理与发布)
- [开发流程优化](#开发流程优化)
- [最佳实践](#最佳实践)

## 项目概述

### 项目架构

```
my-ui-library/
├── packages/
│   ├── components/      # 组件库
│   ├── utils/          # 工具函数库
│   ├── theme/          # 主题样式库
│   └── docs/           # 文档站点
├── scripts/            # 构建和发布脚本
├── docs/               # 项目文档
├── .github/            # GitHub Actions 配置
├── package.json        # 根配置文件
├── pnpm-workspace.yaml # 工作空间配置
├── tsconfig.json       # TypeScript 根配置
├── .gitignore          # Git 忽略文件
└── README.md           # 项目说明
```

### 技术栈选择

- **包管理器**: pnpm（支持工作空间，性能优秀）
- **构建工具**: Vite（快速构建，现代化）
- **类型检查**: TypeScript（类型安全）
- **测试框架**: Vitest（与 Vite 集成良好）
- **代码规范**: ESLint + Prettier（代码质量保证）
- **提交规范**: Commitizen + Commitlint（规范提交信息）
- **文档工具**: VitePress（基于 Vite 的文档生成器）

## 环境准备

### 1. 安装必要工具

```bash
# 安装 Node.js (推荐 18+ 版本)
# 从 https://nodejs.org 下载安装

# 安装 pnpm
npm install -g pnpm

# 验证安装
node --version    # 应该显示 v18.0.0 或更高
pnpm --version    # 应该显示 8.0.0 或更高
```

#### 为什么选择这些工具？

- **Node.js 18+**: 支持最新的 JavaScript 特性，性能更好
- **pnpm**: 相比 npm/yarn，节省磁盘空间，安装速度更快，天然支持 monorepo

### 2. 创建项目目录

```bash
# 创建项目根目录
mkdir my-ui-library
cd my-ui-library

# 初始化 Git 仓库
git init
```

## 项目初始化

### 1. 创建根目录 package.json

```bash
pnpm init
```

编辑 `package.json`：

```json
{
  "name": "my-ui-library",
  "version": "1.0.0",
  "description": "基于 Vue 3 和 TypeScript 的企业级组件库",
  "type": "module",
  "private": true,
  "workspaces": ["packages/*"],
  "scripts": {
    "dev": "pnpm --filter @my-ui/components dev",
    "build": "pnpm --filter @my-ui/components build",
    "build:all": "pnpm -r --filter=!@my-ui/docs build",
    "docs:dev": "pnpm --filter @my-ui/docs dev",
    "docs:build": "pnpm --filter @my-ui/docs build",
    "test": "pnpm -r test",
    "lint": "eslint . --ext .vue,.js,.ts,.jsx,.tsx --fix",
    "format": "prettier --write .",
    "prepare": "husky install",
    "clean": "pnpm -r clean && rm -rf node_modules",
    "preinstall": "npx only-allow pnpm"
  },
  "keywords": ["vue3", "typescript", "component-library", "ui", "monorepo"],
  "author": "Your Name",
  "license": "MIT",
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  },
  "packageManager": "pnpm@8.10.5"
}
```

#### 配置详解

- **`type: "module"`**: 启用 ES 模块，支持现代 JavaScript
- **`private: true`**: 根包不发布到 npm
- **`workspaces`**: 定义工作空间包的位置
- **`engines`**: 限制 Node.js 和 pnpm 版本，确保环境一致性
- **`packageManager`**: 指定包管理器版本，提升团队协作一致性

### 2. 创建 pnpm-workspace.yaml

```yaml
packages:
  - 'packages/*'
```

#### 配置作用

- 定义 pnpm 工作空间的包位置
- 自动识别 packages 目录下的所有子包
- 启用包之间的符号链接和依赖共享

### 3. 创建 TypeScript 根配置

创建 `tsconfig.json`：

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "useDefineForClassFields": true,
    "jsx": "preserve"
  },
  "include": ["packages/*/src/**/*", "packages/*/test/**/*", "scripts/**/*"],
  "exclude": ["node_modules", "**/dist", "**/node_modules"],
  "references": [
    { "path": "./packages/components" },
    { "path": "./packages/utils" },
    { "path": "./packages/theme" }
  ]
}
```

#### 配置详解

- **编译目标配置**:
  - `target: "ES2020"`: 编译到 ES2020，支持现代特性
  - `module: "ESNext"`: 使用最新的模块系统
  - `moduleResolution: "bundler"`: 适配现代打包工具

- **类型检查配置**:
  - `strict: true`: 启用严格模式，提高代码质量
  - `noUnusedLocals/Parameters`: 检查未使用的变量和参数
  - `skipLibCheck: true`: 跳过库文件检查，提升性能

- **项目引用配置**:
  - `references`: 定义项目间的依赖关系，支持增量编译

## 工作空间配置

### 1. 创建包目录结构

```bash
# 创建各个包的目录
mkdir -p packages/{components,utils,theme,docs}
mkdir -p scripts
mkdir -p .github/workflows
```

### 2. 创建 .gitignore

```gitignore
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
dist/
build/
*.tsbuildinfo

# Environment files
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
pnpm-debug.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

## 配置构建工具

### 1. 安装开发依赖

```bash
pnpm add -D -w \
  typescript \
  vite \
  @vitejs/plugin-vue \
  vite-plugin-dts \
  vitest \
  @vue/test-utils \
  jsdom \
  eslint \
  @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin \
  eslint-plugin-vue \
  eslint-config-prettier \
  eslint-plugin-prettier \
  prettier \
  husky \
  lint-staged \
  @commitlint/cli \
  @commitlint/config-conventional \
  commitizen \
  cz-conventional-changelog \
  only-allow
```

#### 依赖说明

- **构建工具**: vite, @vitejs/plugin-vue, vite-plugin-dts
- **测试工具**: vitest, @vue/test-utils, jsdom
- **代码规范**: eslint 相关包, prettier
- **Git 钩子**: husky, lint-staged
- **提交规范**: commitlint, commitizen
- **包管理**: only-allow（强制使用 pnpm）

### 2. 配置 ESLint

创建 `.eslintrc.cjs`：

```javascript
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:vue/vue3-essential',
    'plugin:vue/vue3-strongly-recommended',
    'plugin:vue/vue3-recommended',
    'prettier'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'vue', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'off'
  },
  ignorePatterns: ['dist', 'node_modules', '*.d.ts']
}
```

#### 配置详解

- **环境配置**: 支持浏览器、ES2021 和 Node.js 环境
- **扩展配置**: 使用推荐的规则集，包括 Vue 3 和 TypeScript
- **解析器配置**: 使用 vue-eslint-parser 解析 Vue 文件
- **规则配置**: 自定义规则，平衡代码质量和开发效率

### 3. 配置 Prettier

创建 `.prettierrc`：

```json
{
  "semi": false,
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "trailingComma": "none",
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "vueIndentScriptAndStyle": false
}
```

创建 `.prettierignore`：

```
dist
node_modules
*.md
pnpm-lock.yaml
.github
```

#### 配置详解

- **代码风格**: 不使用分号，单引号，行宽 100
- **缩进**: 2 个空格，不使用 Tab
- **其他**: 统一换行符，Vue 文件不缩进 script 和 style

### 4. 配置 Git 钩子

初始化 husky：

```bash
pnpm prepare
```

创建提交前钩子：

```bash
npx husky add .husky/pre-commit "npx lint-staged"
npx husky add .husky/commit-msg "npx --no -- commitlint --edit $1"
```

创建 `lint-staged` 配置，在 `package.json` 中添加：

```json
{
  "lint-staged": {
    "*.{vue,js,ts,jsx,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,yml,yaml}": ["prettier --write"]
  }
}
```

### 5. 配置 Commitlint

创建 `commitlint.config.cjs`：

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修复
        'docs', // 文档
        'style', // 格式
        'refactor', // 重构
        'perf', // 性能优化
        'test', // 测试
        'chore', // 构建过程或辅助工具的变动
        'revert', // 回退
        'build' // 构建系统或外部依赖项的更改
      ]
    ],
    'subject-max-length': [2, 'always', 100],
    'subject-case': [0]
  }
}
```

配置 Commitizen，在 `package.json` 中添加：

```json
{
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog"
    }
  }
}
```

#### Git 钩子配置详解

- **pre-commit**: 提交前自动格式化和检查代码
- **commit-msg**: 检查提交信息格式
- **lint-staged**: 只对暂存的文件执行检查
- **commitlint**: 强制使用规范的提交信息格式

## 创建组件库包

### 1. 创建 components 包结构

```bash
cd packages/components
pnpm init
```

创建目录结构：

```bash
mkdir -p src/{components,composables,directives,types}
mkdir -p src/components/{button,input,form}
mkdir -p test
mkdir -p examples
```

### 2. 配置 components/package.json

```json
{
  "name": "@my-ui/components",
  "version": "1.0.0",
  "description": "Vue 3 组件库",
  "type": "module",
  "main": "./dist/index.umd.js",
  "module": "./dist/index.es.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.es.js",
      "require": "./dist/index.umd.js",
      "types": "./dist/index.d.ts"
    },
    "./dist/style.css": "./dist/style.css"
  },
  "files": ["dist"],
  "scripts": {
    "dev": "vite --config vite.dev.config.ts",
    "build": "vite build",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@my-ui/utils": "workspace:*",
    "@my-ui/theme": "workspace:*"
  },
  "peerDependencies": {
    "vue": "^3.3.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@vitejs/plugin-vue": "^4.0.0",
    "sass": "^1.60.0",
    "unplugin-auto-import": "^0.16.0",
    "unplugin-vue-components": "^0.25.0",
    "vite": "^5.0.0",
    "vite-plugin-dts": "^3.0.0",
    "vitest": "^1.0.0",
    "vue": "^3.3.0",
    "vue-tsc": "^2.0.0"
  },
  "keywords": ["vue3", "typescript", "components", "ui"],
  "author": "Your Name",
  "license": "MIT"
}
```

### 3. 配置构建文件

创建 `vite.config.ts`：

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      cleanVueFileName: true,
      skipDiagnostics: false,
      tsConfigFilePath: './tsconfig.json'
    }),
    AutoImport({
      imports: ['vue'],
      dts: true
    }),
    Components({
      dts: true
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
      name: 'MyUI',
      fileName: format => `index.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['vue', '@my-ui/utils', '@my-ui/theme'],
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
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@my-ui/theme/src/index.scss";'
      }
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts']
  }
})
```

创建开发配置 `vite.dev.config.ts`：

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  root: resolve(__dirname, 'examples'),
  server: {
    port: 3000,
    open: true
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@my-ui/theme/src/index.scss";'
      }
    }
  }
})
```

### 4. 创建组件库入口文件

创建 `src/index.ts`：

```typescript
import type { App } from 'vue'

// 导入组件
import Button from './components/button'
import Input from './components/input'
import Form from './components/form'

// 导入类型
export * from './types'

// 导入工具函数
export * from '@my-ui/utils'

// 组件列表
const components = [Button, Input, Form]

// 定义 install 方法
const install = (app: App): void => {
  components.forEach(component => {
    app.component(component.name || component.__name, component)
  })
}

// 导出单个组件
export { Button, Input, Form }

// 导出插件
export default {
  install
}

// 版本信息
export const version = '1.0.0'
```

### 5. 创建示例组件

创建 `src/components/button/index.ts`：

```typescript
import Button from './button.vue'
import type { App } from 'vue'

Button.install = (app: App) => {
  app.component(Button.name || Button.__name, Button)
}

export default Button
export type { ButtonProps, ButtonType, ButtonSize } from './types'
```

创建 `src/components/button/button.vue`：

```vue
<template>
  <button :class="buttonClass" :disabled="disabled" @click="handleClick">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ButtonProps } from './types'

defineOptions({
  name: 'MyButton'
})

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'default',
  size: 'medium',
  disabled: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClass = computed(() => [
  'my-button',
  `my-button--${props.type}`,
  `my-button--${props.size}`,
  {
    'my-button--disabled': props.disabled
  }
])

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<style lang="scss" scoped>
.my-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;

  &--default {
    background-color: var(--my-color-white);
    border-color: var(--my-color-border);
    color: var(--my-color-text);

    &:hover {
      border-color: var(--my-color-primary);
      color: var(--my-color-primary);
    }
  }

  &--primary {
    background-color: var(--my-color-primary);
    border-color: var(--my-color-primary);
    color: var(--my-color-white);

    &:hover {
      background-color: var(--my-color-primary-light);
      border-color: var(--my-color-primary-light);
    }
  }

  &--small {
    padding: 4px 12px;
    font-size: 12px;
    height: 24px;
  }

  &--medium {
    padding: 8px 16px;
    font-size: 14px;
    height: 32px;
  }

  &--large {
    padding: 12px 20px;
    font-size: 16px;
    height: 40px;
  }

  &--disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}
</style>
```

创建 `src/components/button/types.ts`：

```typescript
export type ButtonType = 'default' | 'primary' | 'success' | 'warning' | 'danger'
export type ButtonSize = 'small' | 'medium' | 'large'

export interface ButtonProps {
  type?: ButtonType
  size?: ButtonSize
  disabled?: boolean
}
```

### 6. 创建测试文件

创建 `test/setup.ts`：

```typescript
import { vi } from 'vitest'

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))
```

创建 `src/components/button/__tests__/button.test.ts`：

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '../button.vue'

describe('Button', () => {
  it('should render correctly', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Click me'
      }
    })

    expect(wrapper.text()).toBe('Click me')
    expect(wrapper.classes()).toContain('my-button')
  })

  it('should emit click event', async () => {
    const wrapper = mount(Button)

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('should not emit click when disabled', async () => {
    const wrapper = mount(Button, {
      props: {
        disabled: true
      }
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeFalsy()
  })

  it('should have correct type class', () => {
    const wrapper = mount(Button, {
      props: {
        type: 'primary'
      }
    })

    expect(wrapper.classes()).toContain('my-button--primary')
  })
})
```

### 7. 创建示例页面

创建 `examples/index.html`：

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>组件库开发预览</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="./main.ts"></script>
  </body>
</html>
```

创建 `examples/main.ts`：

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import MyUI from '../src/index'

const app = createApp(App)
app.use(MyUI)
app.mount('#app')
```

创建 `examples/App.vue`：

```vue
<template>
  <div class="demo-container">
    <h1>组件库开发预览</h1>

    <section class="demo-section">
      <h2>Button 按钮</h2>
      <div class="demo-row">
        <MyButton>默认按钮</MyButton>
        <MyButton type="primary">主要按钮</MyButton>
        <MyButton disabled>禁用按钮</MyButton>
      </div>

      <div class="demo-row">
        <MyButton size="small">小按钮</MyButton>
        <MyButton size="medium">中按钮</MyButton>
        <MyButton size="large">大按钮</MyButton>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// 组件会通过插件自动注册
</script>

<style lang="scss">
.demo-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.demo-section {
  margin-bottom: 40px;
}

.demo-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  align-items: center;
}
</style>
```

## 创建工具库包

### 1. 创建 utils 包结构

```bash
cd packages/utils
pnpm init
```

创建目录结构：

```bash
mkdir -p src/{__tests__}
```

### 2. 配置 utils/package.json

```json
{
  "name": "@my-ui/utils",
  "version": "1.0.0",
  "description": "工具函数库",
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
    "clean": "rm -rf dist"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "vite-plugin-dts": "^3.0.0",
    "vitest": "^1.0.0"
  },
  "keywords": ["utils", "typescript", "tools"],
  "author": "Your Name",
  "license": "MIT"
}
```

### 3. 创建构建配置

创建 `vite.config.ts`：

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
      name: 'MyUIUtils',
      fileName: format => `index.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      output: {
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

### 4. 创建工具函数

创建 `src/index.ts`：

```typescript
// 导出所有工具函数
export * from './common'
export * from './dom'
export * from './validate'
export * from './types'

// 版本信息
export const version = '1.0.0'
```

创建 `src/common.ts`：

```typescript
/**
 * 判断是否为空值
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) {
    return true
  }

  if (typeof value === 'string') {
    return value.trim() === ''
  }

  if (Array.isArray(value)) {
    return value.length === 0
  }

  if (typeof value === 'object') {
    return Object.keys(value).length === 0
  }

  return false
}

/**
 * 深拷贝对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T
  }

  if (typeof obj === 'object') {
    const cloned = {} as T
    Object.keys(obj).forEach(key => {
      cloned[key as keyof T] = deepClone((obj as any)[key])
    })
    return cloned
  }

  return obj
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastTime = 0

  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastTime >= delay) {
      lastTime = now
      func(...args)
    }
  }
}
```

创建 `src/dom.ts`：

```typescript
/**
 * 判断是否为浏览器环境
 */
export const isBrowser = typeof window !== 'undefined'

/**
 * 添加类名
 */
export function addClass(element: Element, className: string): void {
  if (!element || !className) return
  element.classList.add(className)
}

/**
 * 移除类名
 */
export function removeClass(element: Element, className: string): void {
  if (!element || !className) return
  element.classList.remove(className)
}

/**
 * 切换类名
 */
export function toggleClass(element: Element, className: string): void {
  if (!element || !className) return
  element.classList.toggle(className)
}

/**
 * 检查是否包含类名
 */
export function hasClass(element: Element, className: string): boolean {
  if (!element || !className) return false
  return element.classList.contains(className)
}

/**
 * 获取元素样式
 */
export function getStyle(element: Element, property: string): string {
  if (!isBrowser || !element) return ''
  return window.getComputedStyle(element).getPropertyValue(property)
}

/**
 * 设置元素样式
 */
export function setStyle(element: HTMLElement, property: string, value: string): void {
  if (!element || !property) return
  element.style.setProperty(property, value)
}
```

创建 `src/validate.ts`：

```typescript
/**
 * 邮箱验证
 */
export function isEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 手机号验证（中国大陆）
 */
export function isPhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

/**
 * URL 验证
 */
export function isUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 身份证号验证（中国大陆）
 */
export function isIdCard(idCard: string): boolean {
  const idCardRegex =
    /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  return idCardRegex.test(idCard)
}

/**
 * 密码强度检查
 */
export function checkPasswordStrength(password: string): {
  score: number
  level: 'weak' | 'medium' | 'strong' | 'very-strong'
} {
  let score = 0

  // 长度检查
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1

  // 字符类型检查
  if (/[a-z]/.test(password)) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1

  let level: 'weak' | 'medium' | 'strong' | 'very-strong'
  if (score <= 2) level = 'weak'
  else if (score <= 4) level = 'medium'
  else if (score <= 5) level = 'strong'
  else level = 'very-strong'

  return { score, level }
}
```

创建 `src/types.ts`：

```typescript
// 通用类型定义
export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type MaybeRef<T> = T | Ref<T>

// 对象类型
export type PlainObject = Record<string, any>
export type StringObject = Record<string, string>
export type NumberObject = Record<string, number>

// 函数类型
export type AnyFunction = (...args: any[]) => any
export type VoidFunction = () => void

// 事件类型
export type EventHandler<T = Event> = (event: T) => void

// 组件 props 类型
export interface BaseProps {
  id?: string
  class?: string
  style?: string | PlainObject
}

// 尺寸类型
export type Size = 'small' | 'medium' | 'large'

// 状态类型
export type Status = 'default' | 'primary' | 'success' | 'warning' | 'danger'
```

### 5. 创建测试文件

创建 `src/__tests__/common.test.ts`：

```typescript
import { describe, it, expect } from 'vitest'
import { isEmpty, deepClone, debounce, throttle } from '../common'

describe('common utils', () => {
  describe('isEmpty', () => {
    it('should return true for empty values', () => {
      expect(isEmpty(null)).toBe(true)
      expect(isEmpty(undefined)).toBe(true)
      expect(isEmpty('')).toBe(true)
      expect(isEmpty('   ')).toBe(true)
      expect(isEmpty([])).toBe(true)
      expect(isEmpty({})).toBe(true)
    })

    it('should return false for non-empty values', () => {
      expect(isEmpty('hello')).toBe(false)
      expect(isEmpty([1, 2, 3])).toBe(false)
      expect(isEmpty({ a: 1 })).toBe(false)
      expect(isEmpty(0)).toBe(false)
      expect(isEmpty(false)).toBe(false)
    })
  })

  describe('deepClone', () => {
    it('should deep clone objects', () => {
      const original = { a: 1, b: { c: 2 } }
      const cloned = deepClone(original)

      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
      expect(cloned.b).not.toBe(original.b)
    })

    it('should deep clone arrays', () => {
      const original = [1, [2, 3]]
      const cloned = deepClone(original)

      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
      expect(cloned[1]).not.toBe(original[1])
    })
  })

  describe('debounce', () => {
    it('should debounce function calls', async () => {
      let count = 0
      const increment = debounce(() => count++, 100)

      increment()
      increment()
      increment()

      expect(count).toBe(0)

      await new Promise(resolve => setTimeout(resolve, 150))
      expect(count).toBe(1)
    })
  })
})
```

## 创建主题库包

### 1. 创建 theme 包结构

```bash
cd packages/theme
pnpm init
```

创建目录结构：

```bash
mkdir -p src/{themes,components}
```

### 2. 配置 theme/package.json

```json
{
  "name": "@my-ui/theme",
  "version": "1.0.0",
  "description": "主题样式库",
  "type": "module",
  "main": "./dist/index.css",
  "exports": {
    ".": "./dist/index.css",
    "./src/*": "./src/*"
  },
  "files": ["dist", "src"],
  "scripts": {
    "build": "sass src/index.scss dist/index.css --style compressed --source-map",
    "dev": "sass src/index.scss dist/index.css --watch --source-map",
    "clean": "rm -rf dist"
  },
  "devDependencies": {
    "sass": "^1.60.0"
  },
  "keywords": ["theme", "css", "scss", "style"],
  "author": "Your Name",
  "license": "MIT"
}
```

### 3. 创建主题样式

创建 `src/index.scss`：

```scss
// 导入变量
@import './themes/default';

// 导入基础样式
@import './base';

// 导入组件样式
@import './components/button';
@import './components/input';
@import './components/form';
```

创建 `src/themes/default.scss`：

```scss
// CSS 变量定义
:root {
  // 主色调
  --my-color-primary: #409eff;
  --my-color-primary-light: #79bbff;
  --my-color-primary-dark: #337ecc;

  // 辅助色
  --my-color-success: #67c23a;
  --my-color-warning: #e6a23c;
  --my-color-danger: #f56c6c;
  --my-color-info: #909399;

  // 中性色
  --my-color-white: #ffffff;
  --my-color-black: #000000;
  --my-color-text: #303133;
  --my-color-text-regular: #606266;
  --my-color-text-secondary: #909399;
  --my-color-text-placeholder: #c0c4cc;

  // 边框色
  --my-color-border: #dcdfe6;
  --my-color-border-light: #e4e7ed;
  --my-color-border-lighter: #ebeef5;
  --my-color-border-extra-light: #f2f6fc;

  // 背景色
  --my-color-bg: #f5f7fa;
  --my-color-bg-light: #fafafa;

  // 字体
  --my-font-family:
    'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑',
    Arial, sans-serif;
  --my-font-size-extra-large: 20px;
  --my-font-size-large: 18px;
  --my-font-size-medium: 16px;
  --my-font-size-base: 14px;
  --my-font-size-small: 13px;
  --my-font-size-extra-small: 12px;

  // 行高
  --my-line-height-base: 1.5;

  // 圆角
  --my-border-radius-base: 4px;
  --my-border-radius-small: 2px;
  --my-border-radius-large: 6px;
  --my-border-radius-round: 20px;
  --my-border-radius-circle: 50%;

  // 阴影
  --my-box-shadow-base: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  --my-box-shadow-light: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  // 间距
  --my-spacing-xs: 4px;
  --my-spacing-sm: 8px;
  --my-spacing-md: 16px;
  --my-spacing-lg: 24px;
  --my-spacing-xl: 32px;

  // 动画
  --my-transition-duration: 0.3s;
  --my-transition-function: ease;
}

// 暗色主题
[data-theme='dark'] {
  --my-color-text: #e5eaf3;
  --my-color-text-regular: #cfd3dc;
  --my-color-text-secondary: #a3a6ad;
  --my-color-text-placeholder: #6c6e72;

  --my-color-border: #4c4d4f;
  --my-color-border-light: #414243;
  --my-color-border-lighter: #363637;
  --my-color-border-extra-light: #2b2b2c;

  --my-color-bg: #141414;
  --my-color-bg-light: #1d1d1d;
  --my-color-white: #1d1d1d;
}
```

创建 `src/base.scss`：

```scss
// 重置样式
* {
  box-sizing: border-box;
}

html {
  font-family: var(--my-font-family);
  font-size: var(--my-font-size-base);
  line-height: var(--my-line-height-base);
  color: var(--my-color-text);
  background-color: var(--my-color-white);
}

body {
  margin: 0;
  padding: 0;
}

// 通用类
.my-clearfix {
  &::after {
    content: '';
    display: table;
    clear: both;
  }
}

.my-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

// 文本类
.my-text-primary {
  color: var(--my-color-primary);
}
.my-text-success {
  color: var(--my-color-success);
}
.my-text-warning {
  color: var(--my-color-warning);
}
.my-text-danger {
  color: var(--my-color-danger);
}
.my-text-info {
  color: var(--my-color-info);
}

// 背景类
.my-bg-primary {
  background-color: var(--my-color-primary);
}
.my-bg-success {
  background-color: var(--my-color-success);
}
.my-bg-warning {
  background-color: var(--my-color-warning);
}
.my-bg-danger {
  background-color: var(--my-color-danger);
}
.my-bg-info {
  background-color: var(--my-color-info);
}
```

创建 `src/components/button.scss`：

```scss
.my-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  position: relative;
  border: 1px solid transparent;
  border-radius: var(--my-border-radius-base);
  cursor: pointer;
  transition: all var(--my-transition-duration) var(--my-transition-function);
  font-weight: 500;
  white-space: nowrap;
  user-select: none;
  outline: none;
  text-decoration: none;

  &:focus-visible {
    outline: 2px solid var(--my-color-primary);
    outline-offset: 2px;
  }

  // 类型样式
  &--default {
    background-color: var(--my-color-white);
    border-color: var(--my-color-border);
    color: var(--my-color-text);

    &:hover,
    &:focus {
      border-color: var(--my-color-primary);
      color: var(--my-color-primary);
    }

    &:active {
      border-color: var(--my-color-primary-dark);
      color: var(--my-color-primary-dark);
    }
  }

  &--primary {
    background-color: var(--my-color-primary);
    border-color: var(--my-color-primary);
    color: var(--my-color-white);

    &:hover,
    &:focus {
      background-color: var(--my-color-primary-light);
      border-color: var(--my-color-primary-light);
    }

    &:active {
      background-color: var(--my-color-primary-dark);
      border-color: var(--my-color-primary-dark);
    }
  }

  &--success {
    background-color: var(--my-color-success);
    border-color: var(--my-color-success);
    color: var(--my-color-white);
  }

  &--warning {
    background-color: var(--my-color-warning);
    border-color: var(--my-color-warning);
    color: var(--my-color-white);
  }

  &--danger {
    background-color: var(--my-color-danger);
    border-color: var(--my-color-danger);
    color: var(--my-color-white);
  }

  // 尺寸样式
  &--small {
    padding: 4px 12px;
    font-size: var(--my-font-size-small);
    height: 24px;
  }

  &--medium {
    padding: 8px 16px;
    font-size: var(--my-font-size-base);
    height: 32px;
  }

  &--large {
    padding: 12px 20px;
    font-size: var(--my-font-size-medium);
    height: 40px;
  }

  // 状态样式
  &--disabled,
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;

    &:hover,
    &:focus,
    &:active {
      background-color: initial;
      border-color: initial;
      color: initial;
    }
  }

  &--loading {
    cursor: default;
    pointer-events: none;
  }

  // 图标
  &__icon {
    margin-right: 6px;

    &:last-child {
      margin-right: 0;
      margin-left: 6px;
    }

    &--loading {
      animation: my-rotating 2s linear infinite;
    }
  }
}

// 动画
@keyframes my-rotating {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
```

## 创建文档站点

### 1. 创建 docs 包结构

```bash
cd packages/docs
pnpm init
```

### 2. 配置 docs/package.json

```json
{
  "name": "@my-ui/docs",
  "version": "1.0.0",
  "description": "组件库文档站点",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "vitepress dev",
    "build": "vitepress build",
    "preview": "vitepress preview",
    "clean": "rm -rf .vitepress/dist"
  },
  "devDependencies": {
    "@my-ui/components": "workspace:*",
    "@my-ui/theme": "workspace:*",
    "vitepress": "^1.0.0",
    "vue": "^3.3.0"
  },
  "keywords": ["docs", "vitepress", "documentation"],
  "author": "Your Name",
  "license": "MIT"
}
```

### 3. 配置 VitePress

创建 `.vitepress/config.ts`：

```typescript
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'My UI',
  description: '基于 Vue 3 和 TypeScript 的企业级组件库',
  lang: 'zh-CN',

  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/introduction' },
      { text: '组件', link: '/components/button' },
      { text: 'GitHub', link: 'https://github.com/your-username/my-ui-library' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '开始',
          items: [
            { text: '介绍', link: '/guide/introduction' },
            { text: '安装', link: '/guide/installation' },
            { text: '快速开始', link: '/guide/quickstart' }
          ]
        },
        {
          text: '进阶',
          items: [
            { text: '主题定制', link: '/guide/theme' },
            { text: '国际化', link: '/guide/i18n' }
          ]
        }
      ],
      '/components/': [
        {
          text: '基础组件',
          items: [
            { text: 'Button 按钮', link: '/components/button' },
            { text: 'Input 输入框', link: '/components/input' }
          ]
        },
        {
          text: '表单组件',
          items: [{ text: 'Form 表单', link: '/components/form' }]
        }
      ]
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/your-username/my-ui-library' }],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present Your Name'
    },

    search: {
      provider: 'local'
    }
  },

  vite: {
    ssr: {
      noExternal: ['@my-ui/components', '@my-ui/theme']
    }
  }
})
```

创建 `.vitepress/theme/index.ts`：

```typescript
import DefaultTheme from 'vitepress/theme'
import MyUI from '@my-ui/components'
import '@my-ui/theme/dist/index.css'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(MyUI)
  }
}
```

创建 `.vitepress/theme/custom.css`：

```css
/* 自定义样式 */
.vp-doc .demo-container {
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  padding: 20px;
  margin: 20px 0;
}

.vp-doc .demo-container + .language-vue {
  margin-top: -20px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
```

### 4. 创建文档内容

创建 `index.md`：

```markdown
---
layout: home

hero:
  name: 'My UI'
  text: '企业级 Vue 3 组件库'
  tagline: '基于 Vue 3 和 TypeScript，提供丰富的组件和优秀的开发体验'
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/quickstart
    - theme: alt
      text: 组件预览
      link: /components/button

features:
  - title: 🚀 Vue 3 支持
    details: 基于 Vue 3 Composition API，提供更好的 TypeScript 支持和性能表现
  - title: 📦 开箱即用
    details: 提供丰富的组件库，满足大部分业务场景需求
  - title: 🎨 主题定制
    details: 支持主题定制，轻松适配不同的设计需求
  - title: 📱 响应式设计
    details: 组件支持响应式设计，适配不同屏幕尺寸
  - title: ⚡ 按需引入
    details: 支持按需引入，减小打包体积
  - title: 🛠️ TypeScript
    details: 完整的 TypeScript 支持，提供良好的开发体验
---
```

创建 `guide/introduction.md`：

```markdown
# 介绍

My UI 是一个基于 Vue 3 和 TypeScript 的企业级组件库，提供了丰富的组件和优秀的开发体验。

## 特性

- 🚀 **Vue 3 支持**: 基于 Vue 3 Composition API
- 📦 **开箱即用**: 提供丰富的组件库
- 🎨 **主题定制**: 支持主题定制
- 📱 **响应式设计**: 适配不同屏幕尺寸
- ⚡ **按需引入**: 支持按需引入
- 🛠️ **TypeScript**: 完整的 TypeScript 支持

## 兼容性

- Vue 3.3+
- Node.js 18+
- 现代浏览器

## 版本

当前版本：v1.0.0

查看 [更新日志](https://github.com/your-username/my-ui-library/releases) 了解更多版本信息。

## 贡献

欢迎提交 Issue 和 Pull Request 来改进项目。

## 许可证

[MIT License](https://github.com/your-username/my-ui-library/blob/main/LICENSE)
```

创建 `guide/installation.md`：

````markdown
# 安装

## 环境要求

- Node.js 18+
- Vue 3.3+

## 包管理器

推荐使用 `pnpm` 进行安装：

```bash
pnpm add @my-ui/components
```
````

也可以使用 `npm` 或 `yarn`：

```bash
npm install @my-ui/components
# 或
yarn add @my-ui/components
```

## CDN

你也可以通过 CDN 的方式使用：

```html
<!-- 引入样式 -->
<link rel="stylesheet" href="https://unpkg.com/@my-ui/components/dist/style.css" />

<!-- 引入组件库 -->
<script src="https://unpkg.com/vue@3"></script>
<script src="https://unpkg.com/@my-ui/components"></script>
```

## 开发版本

如果你想使用最新的开发版本，可以克隆仓库并构建：

```bash
git clone https://github.com/your-username/my-ui-library.git
cd my-ui-library
pnpm install
pnpm build
```

````

创建 `components/button.md`：

```markdown
# Button 按钮

常用的操作按钮。

## 基础用法

基础的按钮用法。

<div class="demo-container">
  <MyButton>默认按钮</MyButton>
  <MyButton type="primary">主要按钮</MyButton>
  <MyButton type="success">成功按钮</MyButton>
  <MyButton type="warning">警告按钮</MyButton>
  <MyButton type="danger">危险按钮</MyButton>
</div>

```vue
<template>
  <MyButton>默认按钮</MyButton>
  <MyButton type="primary">主要按钮</MyButton>
  <MyButton type="success">成功按钮</MyButton>
  <MyButton type="warning">警告按钮</MyButton>
  <MyButton type="danger">危险按钮</MyButton>
</template>
````

## 禁用状态

按钮不可用状态。

<div class="demo-container">
  <MyButton disabled>默认按钮</MyButton>
  <MyButton type="primary" disabled>主要按钮</MyButton>
</div>

```vue
<template>
  <MyButton disabled>默认按钮</MyButton>
  <MyButton type="primary" disabled>主要按钮</MyButton>
</template>
```

## 不同尺寸

Button 组件提供除了默认值以外的三种尺寸，可以在不同场景下选择合适的按钮尺寸。

<div class="demo-container">
  <MyButton size="large">大型按钮</MyButton>
  <MyButton size="medium">中等按钮</MyButton>
  <MyButton size="small">小型按钮</MyButton>
</div>

```vue
<template>
  <MyButton size="large">大型按钮</MyButton>
  <MyButton size="medium">中等按钮</MyButton>
  <MyButton size="small">小型按钮</MyButton>
</template>
```

## API

### Props

| 属性     | 说明     | 类型    | 可选值                                         | 默认值  |
| -------- | -------- | ------- | ---------------------------------------------- | ------- |
| type     | 类型     | string  | default / primary / success / warning / danger | default |
| size     | 尺寸     | string  | large / medium / small                         | medium  |
| disabled | 是否禁用 | boolean | —                                              | false   |

### Events

| 事件名 | 说明     | 回调参数            |
| ------ | -------- | ------------------- |
| click  | 点击事件 | (event: MouseEvent) |

### Slots

| 插槽名  | 说明     |
| ------- | -------- |
| default | 按钮内容 |

````

## 配置脚本命令

回到根目录，更新根目录的 `package.json` 脚本：

```json
{
  "scripts": {
    "dev": "pnpm --filter @my-ui/components dev",
    "dev:docs": "pnpm --filter @my-ui/docs dev",
    "build": "pnpm --filter @my-ui/components build",
    "build:all": "pnpm -r --filter=!@my-ui/docs build",
    "build:docs": "pnpm --filter @my-ui/docs build",
    "test": "pnpm -r test",
    "test:components": "pnpm --filter @my-ui/components test",
    "test:utils": "pnpm --filter @my-ui/utils test",
    "lint": "eslint . --ext .vue,.js,.ts,.jsx,.tsx --fix",
    "lint:check": "eslint . --ext .vue,.js,.ts,.jsx,.tsx",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "type-check": "vue-tsc --noEmit --composite false",
    "prepare": "husky install",
    "clean": "pnpm -r clean && rm -rf node_modules",
    "clean:deps": "pnpm -r exec rm -rf node_modules && rm -rf node_modules",
    "reinstall": "pnpm clean:deps && pnpm install",
    "preinstall": "npx only-allow pnpm",
    "changeset": "changeset",
    "version": "changeset version",
    "release": "pnpm build:all && changeset publish"
  }
}
````

### 脚本说明

- **开发脚本**: `dev`, `dev:docs` - 启动开发服务器
- **构建脚本**: `build`, `build:all`, `build:docs` - 构建项目
- **测试脚本**: `test`, `test:components`, `test:utils` - 运行测试
- **代码质量**: `lint`, `format`, `type-check` - 代码检查和格式化
- **清理脚本**: `clean`, `clean:deps`, `reinstall` - 清理和重装依赖
- **发布脚本**: `changeset`, `version`, `release` - 版本管理和发布

## 版本管理与发布

### 1. 安装 Changeset

```bash
pnpm add -D -w @changesets/cli
pnpm changeset init
```

### 2. 配置 Changeset

编辑 `.changeset/config.json`：

```json
{
  "$schema": "https://unpkg.com/@changesets/config@2.3.1/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": ["@my-ui/docs"]
}
```

### 3. 创建发布脚本

创建 `scripts/release.js`：

```javascript
#!/usr/bin/env node

import { execSync } from 'child_process'
import { readFileSync } from 'fs'

/**
 * 发布脚本
 */
async function release() {
  console.log('🚀 开始发布流程...')

  try {
    // 检查工作区是否干净
    console.log('📋 检查工作区状态...')
    const status = execSync('git status --porcelain', { encoding: 'utf-8' })
    if (status.trim()) {
      console.error('❌ 工作区不干净，请先提交或暂存更改')
      process.exit(1)
    }

    // 安装依赖
    console.log('📦 安装依赖...')
    execSync('pnpm install', { stdio: 'inherit' })

    // 运行测试
    console.log('🧪 运行测试...')
    execSync('pnpm test', { stdio: 'inherit' })

    // 类型检查
    console.log('🔍 类型检查...')
    execSync('pnpm type-check', { stdio: 'inherit' })

    // 代码检查
    console.log('🔧 代码检查...')
    execSync('pnpm lint:check', { stdio: 'inherit' })

    // 构建所有包
    console.log('🏗️  构建所有包...')
    execSync('pnpm build:all', { stdio: 'inherit' })

    // 生成版本和更新日志
    console.log('📝 生成版本和更新日志...')
    execSync('pnpm changeset version', { stdio: 'inherit' })

    // 发布到 npm
    console.log('🚢 发布到 npm...')
    execSync('pnpm changeset publish', { stdio: 'inherit' })

    // 推送到 git
    console.log('📤 推送到 git...')
    execSync('git push --follow-tags', { stdio: 'inherit' })

    console.log('✅ 发布完成！')
  } catch (error) {
    console.error('❌ 发布失败:', error.message)
    process.exit(1)
  }
}

release()
```

### 4. 创建 GitHub Actions

创建 `.github/workflows/ci.yml`：

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18, 20]

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint:check

      - name: Type check
        run: pnpm type-check

      - name: Test
        run: pnpm test

      - name: Build
        run: pnpm build:all
```

创建 `.github/workflows/release.yml`：

```yaml
name: Release

on:
  push:
    branches:
      - main

concurrency: ${{ github.workflow }}-${{ github.ref }}

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build packages
        run: pnpm build:all

      - name: Create Release Pull Request or Publish
        id: changesets
        uses: changesets/action@v1
        with:
          publish: pnpm release
          commit: 'chore: release packages'
          title: 'chore: release packages'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 开发流程优化

### 1. 创建开发辅助脚本

创建 `scripts/dev.js`：

```javascript
#!/usr/bin/env node

import { spawn } from 'child_process'
import { program } from 'commander'

program
  .option('-p, --package <package>', '指定要开发的包')
  .option('-d, --docs', '启动文档开发服务器')
  .parse()

const options = program.opts()

if (options.docs) {
  console.log('🚀 启动文档开发服务器...')
  spawn('pnpm', ['--filter', '@my-ui/docs', 'dev'], {
    stdio: 'inherit'
  })
} else if (options.package) {
  console.log(`🚀 启动 ${options.package} 开发服务器...`)
  spawn('pnpm', ['--filter', options.package, 'dev'], {
    stdio: 'inherit'
  })
} else {
  console.log('🚀 启动组件库开发服务器...')
  spawn('pnpm', ['--filter', '@my-ui/components', 'dev'], {
    stdio: 'inherit'
  })
}
```

### 2. 添加代码生成脚本

创建 `scripts/generate-component.js`：

```javascript
#!/usr/bin/env node

import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'
import { program } from 'commander'

program.argument('<name>', '组件名称').option('-t, --type <type>', '组件类型', 'basic').parse()

const componentName = program.args[0]
const options = program.opts()

if (!componentName) {
  console.error('请提供组件名称')
  process.exit(1)
}

const pascalCase = componentName.charAt(0).toUpperCase() + componentName.slice(1)
const kebabCase = componentName.replace(/([A-Z])/g, '-$1').toLowerCase()

const componentDir = join(process.cwd(), 'packages/components/src/components', kebabCase)

if (existsSync(componentDir)) {
  console.error(`组件 ${componentName} 已存在`)
  process.exit(1)
}

// 创建组件目录
mkdirSync(componentDir, { recursive: true })
mkdirSync(join(componentDir, '__tests__'), { recursive: true })

// 生成组件文件
const vueTemplate = `<template>
  <div class="my-${kebabCase}">
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { ${pascalCase}Props } from './types'

defineOptions({
  name: 'My${pascalCase}'
})

const props = withDefaults(defineProps<${pascalCase}Props>(), {
  // 默认值
})

const emit = defineEmits<{
  // 事件定义
}>()
</script>

<style lang="scss" scoped>
.my-${kebabCase} {
  // 样式定义
}
</style>
`

const indexTemplate = `import ${pascalCase} from './${kebabCase}.vue'
import type { App } from 'vue'

${pascalCase}.install = (app: App) => {
  app.component(${pascalCase}.name || ${pascalCase}.__name, ${pascalCase})
}

export default ${pascalCase}
export type { ${pascalCase}Props } from './types'
`

const typesTemplate = `export interface ${pascalCase}Props {
  // 属性定义
}
`

const testTemplate = `import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ${pascalCase} from '../${kebabCase}.vue'

describe('${pascalCase}', () => {
  it('should render correctly', () => {
    const wrapper = mount(${pascalCase})
    expect(wrapper.classes()).toContain('my-${kebabCase}')
  })
})
`

// 写入文件
writeFileSync(join(componentDir, `${kebabCase}.vue`), vueTemplate)
writeFileSync(join(componentDir, 'index.ts'), indexTemplate)
writeFileSync(join(componentDir, 'types.ts'), typesTemplate)
writeFileSync(join(componentDir, '__tests__', `${kebabCase}.test.ts`), testTemplate)

console.log(`✅ 组件 ${componentName} 创建成功！`)
console.log(`📁 位置: ${componentDir}`)
console.log(`📝 请记得在 src/index.ts 中导出新组件`)
```

### 3. 添加包管理脚本

在根目录 `package.json` 中添加：

```json
{
  "scripts": {
    "new:component": "node scripts/generate-component.js",
    "dev:select": "node scripts/dev.js",
    "deps:check": "pnpm -r outdated",
    "deps:update": "pnpm -r update",
    "size:analyze": "pnpm --filter @my-ui/components build && npx vite-bundle-analyzer packages/components/dist"
  }
}
```

## 最佳实践

### 1. 项目结构规范

```
my-ui-library/
├── packages/           # 所有包的源码
│   ├── components/    # 组件库
│   ├── utils/        # 工具函数
│   ├── theme/        # 主题样式
│   └── docs/         # 文档站点
├── scripts/          # 构建和发布脚本
├── .github/          # GitHub Actions 配置
├── docs/            # 项目文档
└── tools/           # 开发工具
```

### 2. 命名规范

- **包名**: `@scope/package-name`
- **组件名**: PascalCase (如 `MyButton`)
- **文件名**: kebab-case (如 `my-button.vue`)
- **CSS 类名**: BEM 命名 (如 `my-button__icon`)

### 3. 提交信息规范

```
<type>(<scope>): <subject>

<body>

<footer>
```

类型：

- `feat`: 新功能
- `fix`: 修复
- `docs`: 文档
- `style`: 格式
- `refactor`: 重构
- `test`: 测试
- `chore`: 构建过程或辅助工具的变动

### 4. 版本发布规范

1. 使用 Changeset 管理版本
2. 遵循语义化版本
3. 自动生成更新日志
4. CI/CD 自动发布

### 5. 测试策略

- **单元测试**: 每个组件和工具函数
- **集成测试**: 组件间的交互
- **E2E 测试**: 关键用户流程
- **视觉回归测试**: UI 变更检测

### 6. 性能优化

- **Tree Shaking**: 支持按需引入
- **Bundle 分析**: 定期分析包大小
- **懒加载**: 大组件支持懒加载
- **CDN**: 提供 CDN 版本

## 总结

通过以上步骤，你已经成功创建了一个完整的 monorepo 项目，包含：

### 🎯 项目特点

1. **现代化技术栈**: Vue 3 + TypeScript + Vite
2. **完整的工程化**: 代码规范、测试、CI/CD
3. **优秀的开发体验**: 热更新、类型提示、自动化工具
4. **规范的项目结构**: 清晰的目录组织和命名规范

### 🛠️ 核心功能

- ✅ 组件库开发和构建
- ✅ 工具函数库
- ✅ 主题系统
- ✅ 文档站点
- ✅ 自动化测试
- ✅ 版本管理和发布
- ✅ 代码质量保证

### 📈 后续扩展

1. **更多组件**: 根据需要添加更多组件
2. **国际化**: 支持多语言
3. **无障碍**: 提升可访问性
4. **移动端**: 适配移动设备
5. **可视化**: 添加图表组件
6. **插件系统**: 支持插件扩展

这个项目模板为你提供了一个坚实的基础，你可以根据具体需求进行定制和扩展。记住保持代码质量、完善文档、持续测试，这样你的组件库就能为团队和社区提供优秀的开发体验。
