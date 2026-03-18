# Vitest 面试准备文档

> 基于项目真实测试代码整理，从「能用」到「能说清楚」。

---

## 一、Vitest 是什么，和 Jest 有什么区别

**能回答的一句话版本：**

> Vitest 是基于 Vite 的单元测试框架，和 Jest API 基本兼容，但天然支持 ESM、TypeScript、无需额外 Babel 配置，在 Vite 项目里配置成本极低。

**核心差异：**

| 对比项     | Jest                    | Vitest                  |
| ---------- | ----------------------- | ----------------------- |
| 模块系统   | 默认 CJS，ESM 需要配置  | 原生支持 ESM            |
| TypeScript | 需要 `ts-jest` 或 Babel | 开箱即用                |
| 配置共享   | 独立配置文件            | 可复用 `vite.config.ts` |
| 速度       | 较慢（冷启动）          | 快（Vite 的 HMR 机制）  |
| Watch 模式 | 支持                    | 支持，更快              |

**项目里的配置（`vitest.config.ts`）：**

```ts
export default defineConfig({
  test: {
    environment: 'node', // 运行环境，纯逻辑用 node，DOM 操作用 jsdom
    globals: true, // 不需要手动 import describe/it/expect
    coverage: {
      provider: 'v8', // 覆盖率引擎，v8 比 istanbul 更快
      reporter: ['text', 'json', 'html']
    }
  }
})
```

---

## 二、核心 API — 你已经用过的

### 1. 测试结构

```ts
describe('模块名', () => {
  // 分组，可以嵌套
  describe('子功能', () => {
    it('应该...', () => {
      // 单个测试用例，it = test
      // 断言
    })
  })
})
```

**项目里的嵌套示例**（`request.test.ts`）：

```ts
describe('请求管理工具', () => {
  describe('基础功能', () => { ... })
  describe('竞态处理', () => { ... })
  describe('回调函数', () => { ... })
})
```

> **面试点：** `describe` 本身不执行测试，只是组织结构。嵌套 `describe` 方便按功能分类，测试报告也更清晰。

---

### 2. 断言 `expect`

```ts
// 基础
expect(value).toBe(42) // 严格相等（===），不能比较对象
expect(value).toEqual({ a: 1 }) // 深度相等，比较对象/数组用这个
expect(value).not.toBe(original) // 取反

// 类型/存在
expect(value).toBeDefined()
expect(value).toBeNull()
expect(value).toBeTruthy()

// 字符串
expect(id).toMatch(/^id-[a-z0-9]+$/) // 正则匹配

// 数组/对象
expect(arr).toContain('abc')
expect(obj).toHaveProperty('key')

// 函数调用次数
expect(fn).toHaveBeenCalledTimes(1)
expect(fn).toHaveBeenCalledWith('arg') // 参数断言

// 异步错误
await expect(promise).rejects.toThrow('message')
```

**项目里的真实例子（`common.test.ts`）：**

```ts
// toBe vs toEqual 的区别在 deepClone 测试里体现得很清楚
const cloned = deepClone(original)
expect(cloned).toEqual(original) // 值相同 ✓
expect(cloned).not.toBe(original) // 引用不同 ✓
```

---

### 3. Mock — `vi.fn()` 和 `vi.mock()`

**`vi.fn()` — 创建模拟函数：**

```ts
const onSuccess = vi.fn()

// 调用被测函数
await manager.request(async () => data, { onSuccess })

// 断言 mock 函数的行为
expect(onSuccess).toHaveBeenCalledWith(data)
expect(onSuccess).toHaveBeenCalledTimes(1)
expect(onSuccess).not.toHaveBeenCalled()
```

**`vi.fn()` 还可以设置返回值：**

```ts
const fetch = vi.fn().mockResolvedValue({ data: 'ok' }) // 模拟异步返回
const fn = vi.fn().mockReturnValue(42) // 模拟同步返回
const fn = vi.fn().mockImplementation(x => x * 2) // 自定义实现
```

> **面试点：** `vi.fn()` 的核心价值是**隔离依赖**。测 A 模块时不想真正调用 B 模块（网络请求、数据库），就用 mock 替换。

---

### 4. 假定时器 `vi.useFakeTimers()`

这是你项目里测试防抖、节流、竞态的核心工具：

```ts
beforeEach(() => {
  vi.useFakeTimers() // 接管 setTimeout/setInterval/Date
})

it('防抖测试', () => {
  const fn = vi.fn()
  const debouncedFn = debounce(fn, 100)

  debouncedFn()
  debouncedFn()
  debouncedFn()

  expect(fn).not.toHaveBeenCalled() // 100ms 还没到

  vi.advanceTimersByTime(100) // 手动推进 100ms

  expect(fn).toHaveBeenCalledTimes(1)

  vi.useRealTimers() // 恢复真实定时器（重要！）
})
```

**为什么要用假定时器？**

- 防抖 100ms 如果真等 100ms，测试会很慢
- `vi.advanceTimersByTime(n)` 可以瞬间跳过时间
- 测试行为完全可控、不依赖机器性能

**项目里竞态测试的关键技巧：**

```ts
// request.test.ts 里，用假定时器控制多个 Promise 的完成顺序
const promise1 = manager.request(async () => {
  await new Promise(resolve => setTimeout(resolve, 100))
  return 'request1'
})
const promise3 = manager.request(async () => {
  await new Promise(resolve => setTimeout(resolve, 50))
  return 'request3' // 最后发起，但最快完成
})

vi.advanceTimersByTime(50)
const result3 = await promise3 // promise3 先完成

vi.advanceTimersByTime(50)
const result1 = await promise1 // promise1 后完成

expect(result3.isLatest).toBe(true) // 最后一次请求是 promise3
expect(result1.isLatest).toBe(false)
```

---

### 5. 生命周期钩子

```ts
beforeAll(() => {}) // 当前 describe 所有测试前执行一次
afterAll(() => {}) // 当前 describe 所有测试后执行一次
beforeEach(() => {}) // 每个 it 执行前
afterEach(() => {}) // 每个 it 执行后
```

**项目里的用法：**

```ts
beforeEach(() => {
  vi.useFakeTimers() // 每个测试前重置定时器，保证用例隔离
})
```

> **面试点：** `beforeEach` 最常用，保证每个测试用例都是干净的初始状态，避免上一个测试影响下一个。

---

## 三、你项目测试的亮点 — 重点准备

### 亮点 1：测试了竞态场景

面试官最感兴趣的是**"你怎么测试异步竞态"**，答案就在 `request.test.ts` 里：

```
思路：用 vi.useFakeTimers() 精确控制多个 Promise 的完成时序，
验证只有最后一次请求的 isLatest 为 true，且只有最新请求触发 onSuccess 回调。
```

**能展开说的点：**

- 为什么不用真实定时器：不稳定，机器性能影响测试结果
- 为什么用 `requestId` 递增而不是 `AbortController`：requestManager 不取消请求本身，只是丢弃过期结果，这样旧请求的错误也能被优雅处理

---

### 亮点 2：边界条件覆盖（`omitObject` / `pickObject`）

`common.test.ts` 里的测试案例很规范，覆盖了：

- 正常场景
- 边界：空数组 `[]`、不存在的 key、`undefined/null/false/0` 值
- 不修改原对象（副作用测试）
- 浅拷贝语义（嵌套对象引用）
- `omit + pick 互补` 的组合验证

> **面试点：** 边界测试体现测试思维的严谨性。面试官问「你怎么保证测试质量」时，可以说这些。

---

### 亮点 3：使用 `@ts-expect-error` 测试类型边界

```ts
// @ts-expect-error 故意传入不存在的 key 以测试运行时行为
const result = omitObject(obj, ['z'])
```

这说明：

1. 你的函数有完整的 TypeScript 类型约束
2. 用 `@ts-expect-error` 绕过类型检查来测试运行时的容错行为
3. 如果 TypeScript 没有报错，这一行本身会报错（双重验证）

---

## 四、覆盖率 — 能说清楚就行

```ts
coverage: {
  provider: 'v8',                            // 使用 V8 引擎统计
  reporter: ['text', 'json', 'html'],        // 输出格式
}
```

**四个覆盖率指标：**

| 指标       | 含义                        | 目标     |
| ---------- | --------------------------- | -------- |
| Statements | 每条语句是否执行到          | 80%+     |
| Branches   | 每个 if/else 分支是否都走过 | 重点关注 |
| Functions  | 每个函数是否调用过          | 80%+     |
| Lines      | 每行代码是否执行过          | 参考     |

> **面试点：** 100% 覆盖率不是目标，关键是覆盖核心业务逻辑的分支。你项目里 request 和 common 的测试覆盖了主要分支，这就够了。

---

## 五、常见面试题 & 回答思路

**Q1: 单元测试和集成测试的区别？**

> 单元测试测一个函数/模块的独立行为，依赖全部 mock 掉；集成测试测多个模块协作是否正常，mock 较少。你项目里测 `requestManager` 是单元测试，测整个搜索+请求+UI渲染流程是集成测试。

**Q2: 什么时候该写测试？**

> 纯函数（工具函数、数据转换）优先写，投入产出比最高；UI 组件测行为不测样式；业务逻辑复杂（如竞态）必须写，否则回归很难保证。

**Q3: `toBe` 和 `toEqual` 的区别？**

> `toBe` 用 `===` 比较，适合基本类型和引用同一对象；`toEqual` 递归比较值，适合对象和数组。项目里 `deepClone` 测试里两个都用了，正好举例。

**Q4: 如何测试异步函数？**

> 两种方式：① `async/await` + `await expect(promise).resolves/rejects`；② 假定时器 `vi.useFakeTimers()` 控制时序。项目里 `requestManager` 的竞态测试用了第二种，更可控。

**Q5: `vi.fn()` 和 `vi.spyOn()` 的区别？**

> `vi.fn()` 创建一个全新的空函数；`vi.spyOn(obj, 'method')` 包装现有方法，保留原始实现同时能追踪调用。项目里用 `vi.fn()` 因为回调函数是外部传入的，本来就没有实现。

**Q6: 为什么要用 `vi.useFakeTimers()`？**

> 真实定时器让测试依赖时间流逝，慢且不稳定。假定时器让时间完全可控，可以瞬间跳过任意时长，使测试确定性强、执行快。项目里防抖、节流、竞态测试都用了这个。

---

## 六、一分钟介绍测试工作

> 「项目里用 Vitest 给 utils 包的核心工具函数写了单元测试，
> 主要覆盖了防抖节流的时序行为、deepClone 的引用语义、以及 requestManager 的竞态场景。
> 竞态测试里用了假定时器精确控制多个异步请求的完成顺序，验证只有最后一次请求才触发业务回调。
> 边界用例上也做了覆盖，比如空参数、falsy 值、不修改原对象等。」
