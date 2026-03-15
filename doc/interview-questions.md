# 企业级 UI 组件库项目 — 面试题目整理

> 技术栈：Vue3 · TypeScript · Monorepo (pnpm/Turborepo) · Vite/Tsup · Element Plus · Vitest

---

## 目录

1. [Monorepo 架构设计](#一-monorepo-架构设计)
2. [构建工具与模块化输出](#二-构建工具与模块化输出)
3. [工程规范与自动化流程](#三-工程规范与自动化流程)
4. [复杂业务组件封装](#四-复杂业务组件封装)
5. [Utils 工具包与类型系统](#五-utils-工具包与类型系统)
6. [请求竞态管理（RequestManager）](#六-请求竞态管理requestmanager)
7. [单元测试与文档](#七-单元测试与文档)
8. [性能优化](#八-性能优化)
9. [综合与项目管理](#九-综合与项目管理)

---

## 一、Monorepo 架构设计

### 基础理解

**Q1：你为什么选择 Monorepo 来组织这个项目？它相比多仓库（Polyrepo）有哪些优劣？**

> **参考答案：**
>
> 选型背景：项目需要同时维护 components 包、utils 包、theme 包、文档站、演示项目等多个相互依赖的子包。如果拆成多仓库，每次改动 utils 都要发布再升级，调试效率极低。
>
> **Monorepo 优势：**
>
> - 包间引用使用 `workspace:*` 协议，可以直接引用本地源码，联调无需发版
> - 统一的 lint、test、build 配置，降低维护成本
> - 原子化提交，一次 PR 可以同时修改多个包，保证变更的一致性
> - 依赖提升（hoist），公共依赖只安装一次，减少磁盘占用
>
> **劣势与应对：**
>
> - 仓库体积增大 → Turborepo 缓存加速构建
> - 包间边界容易模糊 → 通过 package.json 的 `exports` 字段明确公开 API
> - 权限控制粒度低 → 适合内部组件库，暂不是问题

---

**Q2：pnpm workspace 和 npm/yarn workspace 有什么区别？为什么选 pnpm？**

> **参考答案：**
>
> pnpm 通过**硬链接 + 虚拟存储（content-addressable store）**解决了 npm/yarn 的幽灵依赖问题：
>
> - **npm/yarn**：将所有依赖提升到根 `node_modules`，子包可以访问自己没有声明的依赖（幽灵依赖），生产构建可能出现找不到包的问题
> - **pnpm**：每个包只能访问自己 `package.json` 中声明的依赖，通过符号链接指向全局存储，安装速度更快，磁盘占用更低
>
> 项目里通过 `"preinstall": "npx only-allow pnpm"` 脚本强制团队使用 pnpm，避免混用包管理器导致的锁文件冲突。

---

**Q3：Turborepo 解决了什么问题？它的缓存机制是怎么工作的？**

> **参考答案：**
>
> **解决的问题：** 在 Monorepo 中，多个包的 build/test 任务存在依赖关系（如 components 依赖 utils 先构建完成）。手动管理执行顺序很繁琐，且每次全量构建很慢。
>
> **Turborepo 缓存机制：**
>
> 1. 对每个任务计算 hash（输入文件内容 + 环境变量 + 依赖的 hash），
> 2. 如果 hash 命中本地缓存（`.turbo/cache`），直接回放上次的输出，不重新执行，
> 3. 支持远程缓存（Remote Cache），团队共享缓存，CI 也能命中。
>
> **`turbo.json` 关键配置：**
>
> ```json
> "build": {
>   "dependsOn": ["^build"],  // ^ 表示先跑所有依赖包的 build
>   "outputs": ["dist/**"]    // 声明缓存产物目录
> }
> ```
>
> 这样 `pnpm build:packages` 时，Turborepo 会自动按依赖拓扑顺序执行，并行化无依赖的任务。

---

**Q4：workspace:\* 协议是什么？和具体版本号有什么区别？**

> **参考答案：**
>
> `workspace:*` 是 pnpm workspace 专用的版本协议，表示"引用本地工作区中对应名称的包"。
>
> - **开发阶段**：直接链接到本地源码的 `dist`，改了 utils 立刻能在 components 中看到效果（配合 `tsup --watch`）
> - **发布时**：pnpm 会自动将 `workspace:*` 替换为实际版本号（如 `^1.2.16`），发布的包是独立可安装的
>
> 这是 Monorepo 开发体验的核心，避免了"改个工具函数还要先发个小版本"的痛点。

---

### 深入追问

**Q5：你在 Turborepo 配置中，docs 包的 build 为什么单独配了一条规则？**

> **参考答案：**
>
> ```json
> "@bingwu/iip-ui-docs#build": {
>   "dependsOn": ["^build"],
>   "outputs": [".vitepress/dist/**"]
> }
> ```
>
> 原因：VitePress 的构建产物目录是 `.vitepress/dist`，而默认的 build 任务 outputs 是 `dist/**`。如果不单独声明，Turborepo 无法正确缓存文档站的构建产物，会导致每次都重新构建。通过包名精确匹配的方式覆盖默认配置。

---

## 二、构建工具与模块化输出

**Q6：组件库为什么用 Vite 构建，而 utils 包用 tsup？各自适合什么场景？**

> **参考答案：**
>
> |          | Vite (library mode)                        | tsup                                       |
> | -------- | ------------------------------------------ | ------------------------------------------ |
> | **适合** | 含 Vue SFC、CSS、资源文件的组件库          | 纯 TypeScript/JavaScript 工具库            |
> | **优势** | 开箱支持 .vue 解析、CSS 提取、Tree-shaking | 配置极简、自动生成 .d.ts、同时输出 esm/cjs |
> | **底层** | Rollup                                     | esbuild + Rollup                           |
>
> components 包含 Vue 组件（.vue 文件）和 SCSS 样式，必须用 Vite；utils 是纯 TS 函数，用 tsup 几行配置就能输出 ESM + CJS 双格式，并自动生成类型声明，更轻量。

---

**Q7：utils 包同时输出 ESM 和 CJS 两种格式，这样做的目的是什么？package.json 中怎么配置的？**

> **参考答案：**
>
> **目的：**
>
> - **ESM（.js）**：供 Vite/Webpack5 等现代打包工具使用，支持 Tree-shaking（静态分析 import/export），死代码不打入最终产物
> - **CJS（.cjs）**：供 Node.js 环境或旧版打包工具（uni-app 小程序编译器等）使用，`require()` 语法
>
> 这样 utils 既能在 PC 端 Vue 项目里用，也能在微信小程序（uni-app）里用，实现"一套工具代码两端复用"。
>
> **package.json 配置：**
>
> ```json
> {
>   "main": "./dist/index.cjs",
>   "module": "./dist/index.js",
>   "exports": {
>     ".": {
>       "types": "./dist/index.d.ts",
>       "import": "./dist/index.js", // ESM
>       "require": "./dist/index.cjs" // CJS
>     }
>   }
> }
> ```
>
> `exports` 字段（条件导出）是现代标准，打包工具会根据使用方式自动选择正确的格式。`main` 和 `module` 是对旧工具的兼容兜底。

---

**Q8：Vite 构建组件库时，externals 怎么配置的？为什么要做 externals？**

> **参考答案：**
>
> 组件库的 vite.config.ts 中需要将 `vue`、`element-plus`、`vxe-table` 等对等依赖（peerDependencies）声明为 external：
>
> ```ts
> build: {
>   lib: { entry: 'src/index.ts', formats: ['es'] },
>   rollupOptions: {
>     external: ['vue', 'element-plus', 'vxe-table', '@element-plus/icons-vue']
>   }
> }
> ```
>
> **原因：**
>
> - 消费方项目自己会安装 vue 和 element-plus，如果组件库把它们打包进去，会导致最终产物中出现两份 Vue 实例，造成 `inject/provide`、`ref` 响应性等功能异常
> - 同时大幅减小组件库的包体积

---

**Q9：什么是 Tree-shaking？你的组件库怎么保证支持 Tree-shaking？**

> **参考答案：**
>
> Tree-shaking 是打包工具（Rollup/Webpack）通过静态分析 ES Module 的 `import/export`，移除未被引用的代码的能力。
>
> 保证支持的措施：
>
> 1. **使用 ESM 格式输出**：CJS 是动态的（`require` 可以接变量），无法静态分析；ESM 的 `import` 是静态的
> 2. **`package.json` 声明 `"sideEffects": false`** 或精确列出有副作用的文件（如 CSS），告诉打包工具"除列出的文件外，其余文件没有副作用，可以安全删除未引用的导出"
> 3. **按需导出**：`index.ts` 中具名导出各个组件，消费方 `import { IipDateRange } from '@bingwu/iip-ui-components'` 只会打包用到的组件

---

## 三、工程规范与自动化流程

**Q10：你是怎么统一团队代码规范的？ESLint + Husky + Commitlint 各自负责什么？**

> **参考答案：**
>
> 三层防线：
>
> | 工具            | 触发时机                            | 职责                                                                                           |
> | --------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------- |
> | **ESLint**      | 编辑时（IDE 插件）/ `git commit` 前 | 代码质量检查、自动修复（`--fix`）                                                              |
> | **Prettier**    | 同上                                | 代码格式统一（缩进、引号、分号等）                                                             |
> | **Husky**       | git hooks 触发器                    | 在 `pre-commit` 时执行 lint-staged                                                             |
> | **lint-staged** | `pre-commit`                        | 只对 git 暂存区（staged）的文件跑 lint，不全量扫描，速度快                                     |
> | **Commitlint**  | `commit-msg` hook                   | 校验 commit message 是否符合 [Conventional Commits](https://www.conventionalcommits.org/) 规范 |
>
> 这样即使有人不装 IDE 插件，提交时也会强制检查，保证入库代码的质量和提交记录的可读性。

---

**Q11：Conventional Commits 规范是什么？它和 Changesets 的关系是什么？**

> **参考答案：**
>
> Conventional Commits 规定 commit message 格式为：
>
> ```
> <type>(<scope>): <subject>
>
> feat(components): 新增 IipFileListPreview 文件预览组件
> fix(utils): 修复 debounce immediate 模式不触发的问题
> docs: 更新 dialog-select 文档
> ```
>
> 常见 type：`feat`、`fix`、`docs`、`refactor`、`test`、`chore`
>
> **与 Changesets 的关系：**
>
> - Changesets 是版本管理工具，它不依赖 commit message，而是让开发者手动执行 `pnpm changeset`，在交互式界面中描述本次变更影响的包和 semver 类型（major/minor/patch）
> - 但 Conventional Commits 规范化的提交记录为后续生成 Changelog 提供了可读性，`changeset publish` 会自动生成 CHANGELOG.md

---

**Q12：Changesets 的完整发布流程是怎样的？**

> **参考答案：**
>
> ```
> 开发阶段
>   ↓
> pnpm changeset           # 交互式填写：哪些包变了？变更级别？变更说明
>   ↓ 生成 .changeset/*.md 文件（提交到 git）
>
> 发版阶段
>   ↓
> pnpm release
>   = pnpm build:packages  # 先构建所有包
>   + changeset publish    # 读取所有 .changeset/*.md，自动 bump 版本号，更新 CHANGELOG，发布到 npm
>   ↓ 删除已消费的 .changeset 文件，打 git tag
> ```
>
> 项目还配置了自定义 Node 脚本 `scripts/generate-git-tag.ts`（`pnpm tag`），在发版后自动生成语义化 git tag，方便版本回溯。

---

## 四、复杂业务组件封装

**Q13：DialogSelect（弹窗选择器）组件解决了什么问题？设计上有哪些难点？**

> **参考答案：**
>
> **业务背景：** 中后台系统中大量存在"点击输入框 → 弹出带搜索/分页的数据表格 → 选择后回填"的交互模式，但每个业务页面都在重复实现，样式和行为不统一。
>
> **核心 Props 设计：**
>
> - `fetchData`：异步数据获取函数（外部传入，组件不感知接口细节）
> - `dialogSelectOptions`：列配置与表单项配置合并的数组（`useForm: true` 的项同时渲染为搜索表单项和表格列）
> - `multiple`：支持单选/多选
> - `beforeClose`：关闭前回调，支持异步确认（如提示用户未保存）
>
> **难点：**
>
> 1. **泛型类型推导**：`DialogSelectProps<T>` 中 `fetchData` 参数类型、`modelValue` 类型均基于 `T` 推导，消费方有完整的 TypeScript 类型提示
> 2. **单选/多选统一**：单选时 `modelValue` 是单个对象，多选时是数组，内部状态用 `selectedRows: T[]` 统一管理，emit 时按 `multiple` 决定输出格式
> 3. **已选项回显**：打开弹窗时需要把 `modelValue` 对应的行标记为选中状态，需要通过 `keyGetter` 或 `valueKey` 匹配
> 4. **函数式调用**：封装 `openDialogSelect` 函数，通过 `createApp` + `mount` 动态挂载组件实例，用 Promise 包装，`resolve` 在用户点确认时触发

---

**Q14：FileListPreview 组件的预览逻辑是怎么设计的？为什么文档类型要走服务端？**

> **参考答案：**
>
> **预览策略分层：**
>
> ```
> 文件后缀判断
> ├── 图片（png/jpg/gif/webp/svg...）→ el-image（前端直接渲染，支持缩放）
> ├── 压缩包/可执行文件（zip/rar/exe...）→ 提示不支持，显示下载按钮
> └── 其他（docx/xlsx/pdf/txt...）→ iframe 加载服务端预览地址
>                                      URL = website + '?url=' + Base64(文件URL)
> ```
>
> **为什么文档类型要走服务端：**
>
> - 浏览器原生只能预览 PDF（部分情况）和图片，无法直接渲染 docx、xlsx
> - 服务端（如 LibreOffice、kkFileView 等）将文档转换为 HTML 或图片后通过 iframe 展示
> - 文件 URL 用 Base64 编码后传递，防止特殊字符（`&`, `=`, `+`）破坏 query string
>
> **用户体验细节：**
>
> - 切换文件时防抖 300ms（`debounce`），避免快速点击发出多余的加载
> - iframe 加载中显示 loading 遮罩，`@load` 触发后隐藏（`.iframe-hidden` class 控制 opacity）
> - 组件通过 `Proxy` 透传 `ElDialog` 实例方法，同时暴露自定义的 `open()` 方法

---

**Q15：你是怎么实现"函数式调用"组件的？（如 `openFileListPreview(options)`）**

> **参考答案：**
>
> 核心思路：用 `createApp` 动态创建一个 Vue 应用实例，挂载到临时 DOM 节点上，用 Promise 管理生命周期：
>
> ```ts
> export function openFileListPreview(options: OpenFileListPreviewOptions): Promise<void> {
>   return new Promise(resolve => {
>     const container = document.createElement('div')
>     document.body.appendChild(container)
>
>     const app = createApp(FileListPreview, {
>       ...options,
>       onHandleClose: () => {
>         // 关闭动画结束后销毁
>         setTimeout(() => {
>           app.unmount()
>           document.body.removeChild(container)
>           resolve()
>         }, options.animationDuration ?? 300)
>       }
>     })
>
>     const instance = app.mount(container)
>     // 打开弹窗
>     ;(instance as any).open()
>   })
> }
> ```
>
> **注意点：**
>
> - 需要在 `app.mount` 之前通过 `app.use` 安装 Element Plus 插件，否则组件内的 `el-dialog` 无法工作
> - 销毁时机：等关闭动画结束（默认 300ms）后再 `unmount`，避免动画被打断出现闪烁
> - 如果项目有全局状态（Pinia/Vuex），需要同步安装到这个临时 app 上

---

**Q16：PaginationSelect 下拉分页选择的核心难点是什么？**

> **参考答案：**
>
> 基于 Element Plus `el-select` 的 `v-infinite-scroll` 或自定义下拉 slot 实现分页加载，核心难点：
>
> 1. **远程搜索与分页的协同**：用户输入关键词时需要重置到第1页重新查询，滚动到底时追加下一页数据
> 2. **已选值回显**：初始值可能不在第一页数据中，需要额外查询接口或在 `fetchData` 中支持按 id 查询
> 3. **防抖处理**：输入事件需要 debounce，避免每次按键都触发接口请求
> 4. **loading 状态管理**：首次加载、搜索加载、分页追加三种场景的 loading 状态互不干扰

---

## 五、Utils 工具包与类型系统

**Q17：utils 包里的 TypeScript 类型声明（.d.ts）是怎么自动生成的？**

> **参考答案：**
>
> tsup 通过配置 `dts: true`（或 `declaration: true`）调用 TypeScript 编译器的 `tsc --declaration --emitDeclarationOnly`，自动将所有 `.ts` 源文件的类型提取并生成对应的 `.d.ts` 文件。
>
> **tsup.config.ts 关键配置：**
>
> ```ts
> export default defineConfig({
>   entry: ['src/index.ts'],
>   format: ['esm', 'cjs'],
>   dts: true, // 生成 .d.ts
>   clean: true, // 构建前清空 dist
>   sourcemap: false
> })
> ```
>
> 消费方安装包后，IDE 能直接读取 `dist/index.d.ts`，获得完整的类型提示和跳转定义，不需要额外安装 `@types/xxx`。

---

**Q18：omitObject 和 generateId 这些工具函数在组件库内部有什么作用？**

> **参考答案：**
>
> - **`omitObject(obj, keys)`**：从对象中剔除指定 key，在 `FileListPreview` 中用于从 props 里去掉组件自己处理的字段（`files`、`modelValue`），将剩余的 `DialogProps` 透传给 `el-dialog`，避免手动枚举所有 ElDialog 的 props
> - **`generateId()`**：生成唯一 ID，在 `FileListPreview` 中给每个文件项附加 `_id`，用于精确匹配当前激活项（`activeItem?._id === item._id`）。不用 `index` 的原因：文件列表可能动态变化，index 会漂移
> - **`getFileSuffix(url)`**：从文件 URL 中解析后缀名，兼容带 query 参数的 URL（如 `xxx.docx?token=abc`），用于判断文件类型走哪种预览策略

---

## 六、请求竞态管理（RequestManager）

**Q19：什么是请求竞态（Race Condition）？你是怎么解决的？**

> **参考答案：**
>
> **场景：** 用户在搜索框快速修改查询条件，先后发出请求 R1、R2、R3。由于网络延迟不确定，R3 先返回、R1 最后返回，结果页面显示的是 R1 的过期数据，而非最新查询 R3 的结果。
>
> **`createRequestManager` 方案：**
>
> ```ts
> // 核心原理：用递增 ID 标记请求，只处理最新 ID 对应的响应
> let latestRequestId = 0
>
> function createRequest() {
>   const requestId = ++latestRequestId // 每次创建新请求，ID 递增
>   return {
>     requestId,
>     isLatestRequest: () => requestId === latestRequestId // 闭包检查
>   }
> }
>
> async function request(asyncFn, options) {
>   const { requestId, isLatestRequest } = createRequest()
>   try {
>     const data = await asyncFn(requestId)
>     if (isLatestRequest()) {
>       options?.onSuccess?.(data) // 只有最新请求才更新 UI
>     }
>     // 过期请求的响应静默丢弃
>   } catch (error) {
>     if (isLatestRequest()) options?.onError?.(error)
>   } finally {
>     if (isLatestRequest()) options?.onFinally?.()
>   }
> }
> ```
>
> **与 AbortController 方案的对比：**
>
> - `AbortController` 会主动取消 HTTP 请求（节省网络资源），适合大文件上传等场景
> - `requestManager` 不取消请求，只忽略过期响应，实现更简单，对旧接口友好
> - 实际项目中常配合使用：`requestManager` 保证 UI 正确，`AbortController` 减少无效请求

---

**Q20：requestManager 的回调设计中，`onOutdated` 有什么用？**

> **参考答案：**
>
> `onOutdated` 是处理过期请求响应的可选钩子，在响应已返回但不是最新请求时触发：
>
> ```ts
> requestManager.request(() => api.getData(), {
>   onSuccess: data => {
>     tableData.value = data
>   },
>   onOutdated: (data, requestId) => {
>     // 比如：做日志记录，或将过期数据缓存备用
>     console.log(`请求 ${requestId} 已过期，数据不展示`)
>   }
> })
> ```
>
> 大部分场景不需要，但提供这个钩子让消费方有处理过期数据的能力（如缓存、埋点），体现了开放/封闭原则。

---

## 七、单元测试与文档

**Q21：你是如何给组件库配置 Vitest 的？测试重点是什么？**

> **参考答案：**
>
> Vitest 基于 Vite，复用相同的配置，几乎无需额外配置就能测试 Vue 3 组件和 TypeScript 代码。
>
> **vitest.config.ts 关键点：**
>
> ```ts
> export default defineConfig({
>   test: {
>     environment: 'jsdom', // 模拟浏览器 DOM 环境
>     globals: true, // 不用每个文件 import describe/it/expect
>     coverage: { provider: 'v8' }
>   }
> })
> ```
>
> **测试重点：**
>
> - **utils 包**：纯函数最适合单测，`debounce`、`throttle`、`getFileSuffix`、`createRequestManager` 等每个函数都有对应测试用例，覆盖边界条件
> - **组件**：用 `@vue/test-utils` 测试 props 传入后的渲染结果、事件 emit 是否正确触发
> - **CI 中运行**：`pnpm test` 通过 Turborepo 并行执行各包的测试，`vitest run --coverage` 输出覆盖率报告

---

**Q22：VitePress 文档站中，你是怎么实现侧边栏自动生成的？**

> **参考答案：**
>
> 手动维护 VitePress 的 `sidebar` 配置很繁琐，每新增一个组件文档都要改配置文件。解决方案是写一个 Node.js 脚本：
>
> ```ts
> // 大致思路
> import { readdirSync } from 'fs'
> import { resolve } from 'path'
>
> function generateSidebar(docsDir: string) {
>   const items = readdirSync(docsDir)
>     .filter(file => file.endsWith('.md') && file !== 'index.md')
>     .map(file => ({
>       text: extractTitle(file), // 从 md 文件的 # 标题提取
>       link: `/components/${file.replace('.md', '')}`
>     }))
>   return [{ text: '组件', items }]
> }
> ```
>
> 将生成函数集成到 `.vitepress/config.ts` 中直接调用，或在 `build` 前作为预处理脚本执行，新增文档文件后无需手动更新配置。

---

## 八、性能优化

**Q23：你在项目中做了哪些性能优化？分别解决了什么问题？**

> **参考答案：**
>
> **1. 代码分割（Code Splitting）**
>
> - Vite 默认基于动态 `import()` 自动分割，路由级组件使用 `defineAsyncComponent` 懒加载
> - 将 element-plus、vxe-table 等第三方库拆分到独立 chunk（`manualChunks`），利用浏览器缓存，业务代码更新时不重新下载依赖 chunk
>
> **2. 懒加载**
>
> - 路由懒加载：`const Page = () => import('./views/Page.vue')`，首屏只加载当前路由的 JS
> - 图片懒加载：使用 `IntersectionObserver` 或 `el-image` 的 lazy 属性
> - 组件懒加载：低频使用的重型组件（如富文本编辑器）延迟加载
>
> **3. 骨架屏（Skeleton Screen）**
>
> - 在接口响应前显示骨架屏（模拟内容轮廓的灰色占位），相比 loading 转圈，用户感知的等待时间更短（心理优化）
> - 沉淀为可复用的 `IipSkeleton` 组件，接受 rows/avatar 等配置
>
> **4. 用户感知优化**
>
> - **乐观更新**：操作后立即更新 UI，后台同步接口，失败时回滚
> - **防抖/节流**：搜索输入防抖 300ms，滚动事件节流，减少无效计算和接口调用
> - **虚拟滚动**：长列表（万条数据）使用 vxe-table 自带的虚拟滚动，只渲染可视区域 DOM

---

**Q24：代码分割后如何处理公共依赖，避免重复打包？**

> **参考答案：**
>
> Vite 的 `build.rollupOptions.output.manualChunks` 可以手动控制分包策略：
>
> ```ts
> manualChunks(id) {
>   if (id.includes('node_modules')) {
>     if (id.includes('element-plus')) return 'element-plus'
>     if (id.includes('vxe-table') || id.includes('xe-utils')) return 'vxe-table'
>     return 'vendor'   // 其他第三方依赖合并到 vendor chunk
>   }
> }
> ```
>
> 这样第三方依赖单独打包，用户首次访问后浏览器会缓存这些 chunk，后续只要依赖版本不变，即使业务代码发布更新也不需要重新下载，显著减少重复访问的加载量。

---

## 九、综合与项目管理

**Q25：这个项目从零开始，你是如何推动落地的？遇到了哪些阻力？**

> **参考答案（思路示例）：**
>
> **推动策略：**
>
> 1. **识别痛点**：统计各业务项目中重复代码的比例，发现弹窗选择、分页查询等场景在3个以上项目中重复实现
> 2. **MVP 优先**：先封装1-2个最高频组件快速验证收益，让业务团队感受到价值
> 3. **配套文档**：VitePress 文档站 + 在线 Demo，降低消费方的上手成本
> 4. **渐进接入**：不强制迁移，新功能优先使用组件库，存量代码逐步替换
>
> **遇到的挑战：**
>
> - 组件泛型 API 设计初期过于复杂，消费方反馈使用门槛高 → 优化为更直观的配置式 API
> - 各项目 Element Plus 版本不一致导致样式冲突 → 通过 peerDependencies 约束版本范围并在文档中明确说明

---

**Q26：如果让你重新设计这个项目，你会做哪些改进？**

> **参考答案（思路示例）：**
>
> 1. **组件测试覆盖率**：补充更多组件级别的单测，尤其是复杂交互逻辑（多选状态、beforeClose 异步）
> 2. **按需引入优化**：配置 `unplugin-vue-components` 的解析器，让消费方项目实现组件自动按需导入，无需手动 `import`
> 3. **Storybook 集成**：为每个组件提供可交互的 Story，替代简单的 Demo 页，方便 QA 和设计师验收
> 4. **远程缓存**：配置 Turborepo Remote Cache（接入 Vercel 或自建），让 CI 也能命中本地缓存，加速流水线
> 5. **Bundle Size 监控**：集成 `bundlemon` 或 `size-limit`，在 CI 中对打包产物大小设置阈值，防止意外引入大依赖

---

## 快速问答（补充）

| 问题                                        | 核心关键词                                                                                               |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `defineExpose` 在组件库中怎么用？           | 通过 Proxy 同时暴露自定义方法和底层 Element 组件实例方法                                                 |
| 如何让组件支持 v-model？                    | props 声明 `modelValue`，emit `update:modelValue`                                                        |
| `withDefaults` 的作用是什么？               | 给 `defineProps` 的 TypeScript 类型声明提供默认值                                                        |
| Turborepo 的 `^build` 和 `build` 有何区别？ | `^build` 表示先跑所有依赖包的 build，`build` 只跑当前包                                                  |
| `changeset` 和 `npm version` 有什么区别？   | changeset 支持 Monorepo 多包独立版本管理；npm version 一次只管一个包                                     |
| 为什么需要 `destroyOnClose`？               | 关闭弹窗后销毁组件实例，避免上次的表单/选中状态被缓存到下次打开                                          |
| 如何处理 vxe-table 的 TypeScript 类型？     | 通过泛型 `VxeGridProps`、`VxeColumnProps` 约束列配置，再通过自定义类型 `DialogSelectOption` 做业务层封装 |

---

_整理于 2026-03，基于项目实际代码_
