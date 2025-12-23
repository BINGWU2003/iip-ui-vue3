# genComponentsSidebar 函数详解

## 📖 功能说明

这个函数自动扫描 `components` 目录下的所有 `.md` 文件，提取标题，生成 VitePress 侧边栏配置。

---

## 🔄 数据流程图

```
components 目录
    │
    ├─ date-range.md
    ├─ dialog-select.md
    ├─ dialog-select-function.md
    ├─ dropdown-list.md
    └─ pagination-select.md
         │
         ▼
    读取所有文件名
         │
         ▼
   ['date-range.md', 'dialog-select.md', ...]
         │
         ▼
    过滤 .md 文件 + 排序
         │
         ▼
    遍历每个文件
         │
         ├─ 读取文件内容
         ├─ 提取第一行标题
         ├─ 生成链接路径
         └─ 构建对象
         │
         ▼
最终生成侧边栏数组
```

---

## 📝 逐步数据演示

### 步骤 1: 读取目录

```typescript
const files = fs.readdirSync(componentsDir)
```

**输入**: `E:/cdoe2/iip-ui-vue3/apps/docs/components`

**输出**:

```javascript
;[
  'date-range.md',
  'dialog-select.md',
  'dialog-select-function.md',
  'dropdown-list.md',
  'pagination-select.md'
]
```

---

### 步骤 2: 过滤和排序

```typescript
const mdFiles = files.filter(file => file.endsWith('.md')).sort()
```

**输出** (已按字母排序):

```javascript
;[
  'date-range.md',
  'dialog-select-function.md',
  'dialog-select.md',
  'dropdown-list.md',
  'pagination-select.md'
]
```

---

### 步骤 3: 处理每个文件

#### 示例 1: `dropdown-list.md`

```typescript
const file = 'dropdown-list.md'
const filePath = path.join(componentsDir, file)
// E:/cdoe2/iip-ui-vue3/apps/docs/components/dropdown-list.md

const fileName = file.replace('.md', '')
// 'dropdown-list'

const content = fs.readFileSync(filePath, 'utf-8')
// '# DropdownList 下拉列表\n\n基于 Element Plus...'

const firstLine = content.split('\n')[0]
// '# DropdownList 下拉列表'

let text = firstLine.replace(/^#+\s*/, '').trim()
// 'DropdownList 下拉列表'

const link = `/components/${fileName}`
// '/components/dropdown-list'
```

**生成对象**:

```javascript
{
  text: 'DropdownList 下拉列表',
  link: '/components/dropdown-list'
}
```

#### 示例 2: `date-range.md`

**文件第一行**: `# DateRange 日期范围`

**生成对象**:

```javascript
{
  text: 'DateRange 日期范围',
  link: '/components/date-range'
}
```

---

### 步骤 4: 最终输出

```javascript
;[
  {
    text: 'DateRange 日期范围选择器',
    link: '/components/date-range'
  },
  {
    text: 'openDialogSelect 函数式调用',
    link: '/components/dialog-select-function'
  },
  {
    text: 'DialogSelect 弹窗选择器',
    link: '/components/dialog-select'
  },
  {
    text: 'DropdownList 下拉列表',
    link: '/components/dropdown-list'
  },
  {
    text: 'PaginationSelect 分页选择器',
    link: '/components/pagination-select'
  }
]
```

---

## 🔧 Node.js API 详解

### 1. `fs.readdirSync(path)`

**作用**: 同步读取目录，返回文件名数组

```typescript
// 示例
const files = fs.readdirSync('./components')
// 返回: ['file1.md', 'file2.md', 'subfolder']
```

**特点**:

- 只返回文件名，不包含完整路径
- 包含文件和子目录
- 不递归读取子目录

---

### 2. `fs.readFileSync(path, encoding)`

**作用**: 同步读取文件内容

```typescript
// 示例 1: 读取为字符串
const content = fs.readFileSync('file.txt', 'utf-8')
// 返回: "这是文件内容..."

// 示例 2: 读取为 Buffer
const buffer = fs.readFileSync('file.txt')
// 返回: <Buffer 89 50 4e 47...>
```

**编码选项**:

- `'utf-8'`: 返回字符串（推荐用于文本文件）
- 不指定: 返回 Buffer（用于二进制文件）

---

### 3. `path.join(...paths)`

**作用**: 拼接路径片段

```typescript
// Windows 示例
path.join('E:', 'project', 'src', 'app.ts')
// 返回: 'E:\project\src\app.ts'

// Unix 示例
path.join('/home', 'user', 'docs', 'file.md')
// 返回: '/home/user/docs/file.md'

// 自动处理多余的分隔符
path.join('a/', '/b/', '/c')
// 返回: 'a/b/c'
```

---

### 4. `path.resolve(...paths)`

**作用**: 将相对路径转换为绝对路径

```typescript
// 假设当前目录是 /home/user/project

path.resolve('src/app.ts')
// 返回: '/home/user/project/src/app.ts'

path.resolve('..', 'components')
// 返回: '/home/user/components'

path.resolve('/absolute', 'path')
// 返回: '/absolute/path' (遇到绝对路径会重置)
```

---

### 5. `path.dirname(path)`

**作用**: 获取路径的目录部分

```typescript
path.dirname('/home/user/project/src/app.ts')
// 返回: '/home/user/project/src'

path.dirname('C:\\project\\src\\app.ts')
// 返回: 'C:\project\src'
```

---

### 6. `fileURLToPath(url)`

**作用**: 将 file:// URL 转换为文件系统路径

```typescript
// Windows
fileURLToPath('file:///C:/project/app.ts')
// 返回: 'C:\project\app.ts'

// Unix
fileURLToPath('file:///home/user/app.ts')
// 返回: '/home/user/app.ts'

// 常用于 ES Module 中获取 __dirname
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
```

---

## 🎯 实际应用示例

### 完整函数带注释

```typescript
export function genComponentsSidebar(componentsDir: string) {
  const items = []

  // 1️⃣ 读取目录下所有文件
  //    返回: ['date-range.md', 'dropdown-list.md', ...]
  const files = fs.readdirSync(componentsDir)

  // 2️⃣ 过滤出 .md 文件并排序
  //    file.endsWith('.md') → 只保留 Markdown 文件
  //    .sort() → 按字母顺序排序
  const mdFiles = files.filter(file => file.endsWith('.md')).sort()

  // 3️⃣ 遍历每个 Markdown 文件
  for (const file of mdFiles) {
    // 构建完整路径
    // 例: 'E:/project/components' + 'dropdown-list.md'
    //  → 'E:/project/components/dropdown-list.md'
    const filePath = path.join(componentsDir, file)

    // 去掉 .md 扩展名
    // 例: 'dropdown-list.md' → 'dropdown-list'
    const fileName = file.replace('.md', '')

    // 读取文件内容为字符串
    // 例: '# DropdownList 下拉列表\n\n基于 Element Plus...'
    const content = fs.readFileSync(filePath, 'utf-8')

    // 提取第一行
    // 例: '# DropdownList 下拉列表'
    const firstLine = content.split('\n')[0]

    // 提取标题文本（默认用文件名）
    let text = fileName

    // 如果第一行是标题格式
    if (firstLine && firstLine.startsWith('#')) {
      // 去掉开头的 # 号和空格
      // 例: '# DropdownList 下拉列表' → 'DropdownList 下拉列表'
      text = firstLine.replace(/^#+\s*/, '').trim()
    }

    // 添加到结果数组
    items.push({
      text, // 'DropdownList 下拉列表'
      link: `/components/${fileName}` // '/components/dropdown-list'
    })
  }

  return items
}
```

---

### getComponentsDir 函数详解

`getComponentsDir` 函数用于获取组件文档目录的绝对路径，它是 `genComponentsSidebar` 的辅助函数。

#### 函数源码

```typescript
export function getComponentsDir(): string {
  // 获取当前文件的目录
  const __dirname = path.dirname(fileURLToPath(import.meta.url))

  // 返回 components 目录的路径
  return path.resolve(__dirname, '../../components')
}
```

#### 执行过程详解

```typescript
// 步骤 1: 获取当前文件的 URL
import.meta.url
// 输出: 'file:///E:/cdoe2/iip-ui-vue3/apps/docs/.vitepress/utils/genComponentsSidebar.ts'

// 步骤 2: 将 URL 转换为文件系统路径
fileURLToPath(import.meta.url)
// 输出: 'E:\cdoe2\iip-ui-vue3\apps\docs\.vitepress\utils\genComponentsSidebar.ts'

// 步骤 3: 获取文件所在目录（去掉文件名）
const __dirname = path.dirname(fileURLToPath(import.meta.url))
// 输出: 'E:\cdoe2\iip-ui-vue3\apps\docs\.vitepress\utils'

// 步骤 4: 从当前目录向上两级，进入 components 目录
path.resolve(__dirname, '../../components')
// 输出: 'E:\cdoe2\iip-ui-vue3\apps\docs\components'
```

#### 路径计算可视化

```
当前文件位置:
E:\cdoe2\iip-ui-vue3\apps\docs\.vitepress\utils\genComponentsSidebar.ts
                                    └─────┬──────┘
                                      __dirname

相对路径计算:
.vitepress/utils/  (当前位置)
    └→ ../         (上一级: .vitepress/)
        └→ ../     (上二级: docs/)
            └→ components/  (目标: docs/components/)

最终路径:
E:\cdoe2\iip-ui-vue3\apps\docs\components
```

#### 为什么需要这个函数？

**问题**: 在 ES Module 中没有 `__dirname` 变量

```typescript
// ❌ 在 ES Module 中不能直接使用
const componentsDir = path.resolve(__dirname, '../../components')
// ReferenceError: __dirname is not defined

// ✅ 必须先通过 import.meta.url 获取
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const componentsDir = path.resolve(__dirname, '../../components')
```

**解决方案**: `getComponentsDir` 函数封装了这个过程

```typescript
// 配置文件中简单调用
import { getComponentsDir } from './utils/genComponentsSidebar'

const componentsDir = getComponentsDir()
// 自动获取正确的绝对路径，无需关心当前文件位置
```

#### CommonJS vs ES Module 对比

```typescript
// CommonJS 模块 (旧方式)
// 有内置的 __dirname 和 __filename
const path = require('path')
const componentsDir = path.resolve(__dirname, '../../components')

// ES Module (新方式)
// 需要通过 import.meta.url 获取
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const componentsDir = path.resolve(__dirname, '../../components')
```

#### 实际使用示例

```typescript
// .vitepress/config.ts
import { defineConfig } from 'vitepress'
import { genComponentsSidebar, getComponentsDir } from './utils/genComponentsSidebar'

// 1️⃣ 获取组件目录的绝对路径
const componentsDir = getComponentsDir()
console.log('组件目录:', componentsDir)
// 打印: E:\cdoe2\iip-ui-vue3\apps\docs\components

// 2️⃣ 生成侧边栏配置
const componentItems = genComponentsSidebar(componentsDir)
console.log('生成配置项:', componentItems.length, '个')
// 打印: 生成配置项: 5 个

// 3️⃣ 在配置中使用
export default defineConfig({
  themeConfig: {
    sidebar: {
      '/components/': [
        {
          text: '数据录入',
          items: componentItems
        }
      ]
    }
  }
})
```

#### 跨平台兼容性

```typescript
// Windows 路径
getComponentsDir()
// → 'E:\cdoe2\iip-ui-vue3\apps\docs\components'

// macOS/Linux 路径
getComponentsDir()
// → '/Users/username/projects/iip-ui-vue3/apps/docs/components'

// 使用 path 模块自动处理路径分隔符差异
// Windows: \
// Unix:    /
```

#### 常见错误及解决

**错误 1**: 忘记导入 `fileURLToPath`

```typescript
// ❌ 错误
const __dirname = path.dirname(import.meta.url)
// TypeError: The "path" argument must be of type string

// ✅ 正确
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
```

**错误 2**: 相对路径层级错误

```typescript
// ❌ 错误：路径层级不对
path.resolve(__dirname, '../components')
// → E:\cdoe2\iip-ui-vue3\apps\docs\.vitepress\components (不存在)

// ✅ 正确：需要向上两级
path.resolve(__dirname, '../../components')
// → E:\cdoe2\iip-ui-vue3\apps\docs\components (正确)
```

**错误 3**: 使用相对路径而不是绝对路径

```typescript
// ❌ 不推荐：相对路径可能在不同环境下出问题
const componentsDir = '../../components'
fs.readdirSync(componentsDir) // 可能失败

// ✅ 推荐：使用绝对路径
const componentsDir = getComponentsDir()
fs.readdirSync(componentsDir) // 始终有效
```

#### 扩展：自定义其他目录

```typescript
// 获取 guide 目录
export function getGuideDir(): string {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  return path.resolve(__dirname, '../../guide')
}

// 获取 utils 文档目录
export function getUtilsDir(): string {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  return path.resolve(__dirname, '../../utils')
}

// 通用版本：获取任意目录
export function getDocsDir(subDir: string): string {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  return path.resolve(__dirname, '../..', subDir)
}

// 使用通用版本
const componentsDir = getDocsDir('components')
const guideDir = getDocsDir('guide')
const utilsDir = getDocsDir('utils')
```

---

## 📊 实际运行数据示例

基于当前项目的实际运行结果：

```javascript
// 读取到的文件
;[
  'date-range.md',
  'dialog-select-function.md',
  'dialog-select.md',
  'dropdown-list.md',
  'pagination-select.md'
][
  // 生成的完整配置
  ({
    text: 'DateRange 日期范围选择器',
    link: '/components/date-range'
  },
  {
    text: 'openDialogSelect 函数式调用',
    link: '/components/dialog-select-function'
  },
  {
    text: 'DialogSelect 弹窗选择器',
    link: '/components/dialog-select'
  },
  {
    text: 'DropdownList 下拉列表',
    link: '/components/dropdown-list'
  },
  {
    text: 'PaginationSelect 分页选择器',
    link: '/components/pagination-select'
  })
]
```

**渲染效果（侧边栏）**:

```
数据录入
  ├─ DateRange 日期范围选择器
  ├─ openDialogSelect 函数式调用
  ├─ DialogSelect 弹窗选择器
  ├─ DropdownList 下拉列表
  └─ PaginationSelect 分页选择器
```

---

## 🎨 在配置中使用

### 基础用法

```typescript
// .vitepress/config.ts
import { defineConfig } from 'vitepress'
import { genComponentsSidebar, getComponentsDir } from './utils/genComponentsSidebar'

// 自动生成组件文档侧边栏
const componentsDir = getComponentsDir()
const componentItems = genComponentsSidebar(componentsDir)

export default defineConfig({
  themeConfig: {
    sidebar: {
      '/components/': [
        {
          text: '数据录入',
          items: componentItems // ← 使用自动生成的配置
        }
      ]
    }
  }
})
```

### 高级用法 - 多分类

```typescript
// 按文件名前缀分组
function groupComponents(items) {
  return {
    form: items.filter(item => item.link.includes('select') || item.link.includes('date')),
    display: items.filter(item => item.link.includes('list') || item.link.includes('table'))
  }
}

const componentItems = genComponentsSidebar(componentsDir)
const { form, display } = groupComponents(componentItems)

export default defineConfig({
  themeConfig: {
    sidebar: {
      '/components/': [
        { text: '数据录入', items: form },
        { text: '数据展示', items: display }
      ]
    }
  }
})
```

---

## 🔤 字符串处理方法详解

### `String.split()` - 分割字符串

```typescript
const content = '# Title\n\nContent line 1\nContent line 2'

// 按换行符分割
const lines = content.split('\n')
// 返回: ['# Title', '', 'Content line 1', 'Content line 2']

// 获取第一行
const firstLine = lines[0]
// 返回: '# Title'

// 一步到位
const firstLine = content.split('\n')[0]
// 返回: '# Title'

// 限制分割次数
const parts = 'a:b:c:d'.split(':', 2)
// 返回: ['a', 'b']
```

### `String.replace()` - 替换字符串

```typescript
// 简单替换（只替换第一个匹配）
'file.md.md'.replace('.md', '')
// 返回: 'file.md'

// 正则替换 - 去掉开头的 # 号
'# Title'.replace(/^#+\s*/, '')
// 返回: 'Title'

'## Title'.replace(/^#+\s*/, '')
// 返回: 'Title'

'###  Title'.replace(/^#+\s*/, '')
// 返回: 'Title'

// 全局替换
'a-b-c'.replace(/-/g, '_')
// 返回: 'a_b_c'
```

**正则表达式说明**:

- `^` - 匹配字符串开头
- `#+` - 一个或多个 `#` 字符
- `\s*` - 零个或多个空白字符（空格、制表符等）
- `g` - 全局匹配标志

### `String.trim()` - 去除空白

```typescript
// 去除首尾空格
'  hello world  '.trim()
// 返回: 'hello world'

// 只去除开头空格
'  hello'.trimStart()
// 返回: 'hello'

// 只去除结尾空格
'hello  '.trimEnd()
// 返回: 'hello'
```

### 字符串判断方法

```typescript
// 检查开头
'# Title'.startsWith('#')     // true
'Title'.startsWith('#')       // false

// 检查结尾
'file.md'.endsWith('.md')     // true
'file.txt'.endsWith('.md')    // false

// 包含检查
'hello world'.includes('world')  // true
'hello world'.includes('foo')    // false

// 正则匹配
/\.md$/.test('file.md')       // true
/^#+/.test('# Title')         // true
```

---

## 📋 API 速查表

| API                              | 作用         | 输入示例             | 输出示例                 | 返回类型   |
| -------------------------------- | ------------ | -------------------- | ------------------------ | ---------- |
| `fs.existsSync(path)`            | 检查是否存在 | `'./file.md'`        | `true` / `false`         | `boolean`  |
| `fs.readdirSync(path)`           | 读取目录     | `'./components'`     | `['a.md', 'b.md']`       | `string[]` |
| `fs.readFileSync(path, 'utf-8')` | 读取文件     | `'file.txt'`         | `'内容...'`              | `string`   |
| `fs.statSync(path)`              | 获取文件信息 | `'file.txt'`         | `{ size: 1024, ... }`    | `Stats`    |
| `path.join(...paths)`            | 拼接路径     | `'a', 'b.md'`        | `'a/b.md'`               | `string`   |
| `path.resolve(...paths)`         | 转绝对路径   | `'..', 'components'` | `'/abs/path/components'` | `string`   |
| `path.dirname(path)`             | 获取目录     | `'/a/b/c.txt'`       | `'/a/b'`                 | `string`   |
| `path.basename(path)`            | 获取文件名   | `'/a/b/c.txt'`       | `'c.txt'`                | `string`   |
| `path.extname(path)`             | 获取扩展名   | `'file.txt'`         | `'.txt'`                 | `string`   |
| `fileURLToPath(url)`             | URL→路径     | `'file:///C:/a'`     | `'C:\\a'`                | `string`   |

---

## 💡 实用场景示例

### 场景 1: 添加新组件文档

```bash
# 1. 创建新文档
echo "# NewComponent 新组件" > apps/docs/components/new-component.md

# 2. 重启开发服务器
pnpm docs:dev

# ✅ 自动出现在侧边栏！
```

### 场景 2: 修改组件显示名称

```markdown
<!-- 只需修改文档第一行 -->

# DropdownList 高级下拉列表组件

<!-- 重启后侧边栏自动更新 -->
```

### 场景 3: 递归读取子目录

```typescript
function getAllMdFiles(dir: string): string[] {
  const result: string[] = []
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      // 递归处理子目录
      result.push(...getAllMdFiles(fullPath))
    } else if (file.endsWith('.md')) {
      result.push(fullPath)
    }
  }

  return result
}

// 获取所有 .md 文件（包括子目录）
const allMdFiles = getAllMdFiles('./components')
```

### 场景 4: 按分类生成侧边栏

```typescript
function genCategorizedSidebar(componentsDir: string) {
  const files = fs.readdirSync(componentsDir)
  const mdFiles = files.filter(file => file.endsWith('.md')).sort()

  const categories = {
    input: [],
    display: [],
    other: []
  }

  for (const file of mdFiles) {
    const filePath = path.join(componentsDir, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    const firstLine = content.split('\n')[0]
    const text = firstLine.replace(/^#+\s*/, '').trim()
    const link = `/components/${file.replace('.md', '')}`

    // 根据文件名分类
    if (file.includes('select') || file.includes('date')) {
      categories.input.push({ text, link })
    } else if (file.includes('list') || file.includes('table')) {
      categories.display.push({ text, link })
    } else {
      categories.other.push({ text, link })
    }
  }

  return categories
}
```

### 场景 5: 提取更多元数据

```typescript
interface ComponentInfo {
  text: string
  link: string
  description: string
  size: number
  lastModified: Date
}

function genDetailedSidebar(componentsDir: string): ComponentInfo[] {
  const files = fs.readdirSync(componentsDir)
  const mdFiles = files.filter(file => file.endsWith('.md')).sort()

  return mdFiles.map(file => {
    const filePath = path.join(componentsDir, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    const lines = content.split('\n')

    // 提取标题（第一行）
    const text = lines[0].replace(/^#+\s*/, '').trim()

    // 提取描述（第三行通常是描述）
    const description = lines[2] || ''

    // 获取文件信息
    const stats = fs.statSync(filePath)

    return {
      text,
      link: `/components/${file.replace('.md', '')}`,
      description,
      size: stats.size,
      lastModified: stats.mtime
    }
  })
}
```

---

## ⚡ 性能与最佳实践

### 同步 vs 异步

```typescript
// ❌ 同步（阻塞）- 仅用于配置文件或启动时
const content = fs.readFileSync('file.txt', 'utf-8')

// ✅ 异步（非阻塞）- 用于运行时
fs.readFile('file.txt', 'utf-8', (err, content) => {
  if (err) throw err
  console.log(content)
})

// ✅ Promise 版本（推荐用于异步场景）
import { promises as fs } from 'fs'
const content = await fs.readFile('file.txt', 'utf-8')
```

**何时用同步？**

- ✅ 读取配置文件（启动时）
- ✅ VitePress 配置文件
- ✅ 构建脚本
- ✅ CLI 工具

**何时用异步？**

- ✅ Web 服务器处理请求
- ✅ 实时数据处理
- ✅ 任何可能阻塞主线程的操作

### 错误处理

```typescript
// 方法 1: 使用 existsSync（推荐用于配置）
if (fs.existsSync('file.txt')) {
  const content = fs.readFileSync('file.txt', 'utf-8')
}

// 方法 2: try-catch（推荐用于一般场景）
try {
  const content = fs.readFileSync('file.txt', 'utf-8')
} catch (err) {
  if (err.code === 'ENOENT') {
    console.log('文件不存在')
  } else {
    throw err
  }
}

// 方法 3: 异步版本
import { promises as fs } from 'fs'

try {
  const content = await fs.readFile('file.txt', 'utf-8')
} catch (err) {
  console.error('读取失败:', err.message)
}
```

### 缓存优化

```typescript
// 缓存读取结果，避免重复读取
let cachedComponents = null

function getComponentsSidebar(componentsDir: string) {
  if (cachedComponents) {
    return cachedComponents
  }

  cachedComponents = genComponentsSidebar(componentsDir)
  return cachedComponents
}
```

---

## ❓ 常见问题

### Q1: 为什么要用 `fileURLToPath`？

在 ES Module 中，没有 `__dirname` 变量。必须通过 `import.meta.url` 获取当前文件的 URL，然后转换为路径。

```typescript
// ❌ CommonJS 中可以直接用
const __dirname = __dirname

// ✅ ES Module 中需要转换
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
```

**详细说明**:

```typescript
// import.meta.url 的值
'file:///E:/cdoe2/iip-ui-vue3/apps/docs/.vitepress/utils/genComponentsSidebar.ts'

// fileURLToPath() 转换后
'E:\cdoe2\iip-ui-vue3\apps\docs\.vitepress\utils\genComponentsSidebar.ts'

// path.dirname() 获取目录
'E:\cdoe2\iip-ui-vue3\apps\docs\.vitepress\utils'

// path.resolve() 计算相对路径
'E:\cdoe2\iip-ui-vue3\apps\docs\components'
```

### Q2: `readdirSync` 和 `readdir` 的区别？

- `readdirSync`: 同步版本，会阻塞代码执行
- `readdir`: 异步版本，使用回调或 Promise

```typescript
// 同步（配置文件中推荐）
const files = fs.readdirSync('./dir')

// 异步 - 回调方式
fs.readdir('./dir', (err, files) => {
  if (err) throw err
  console.log(files)
})

// 异步 - Promise 方式（推荐）
import { promises as fs } from 'fs'
const files = await fs.readdir('./dir')
```

### Q3: 正则表达式 `/^#+\s*/` 是什么意思？

- `^`: 匹配字符串开头
- `#+`: 匹配一个或多个 `#` 号
- `\s*`: 匹配零个或多个空白字符（空格、制表符等）

```typescript
'# Title'.replace(/^#+\s*/, '') // 'Title'
'## Title'.replace(/^#+\s*/, '') // 'Title'
'###  Title'.replace(/^#+\s*/, '') // 'Title'
'#### Title   '.replace(/^#+\s*/, '').trim() // 'Title'
```

### Q4: 如何处理特殊文件名？

```typescript
// 忽略以 . 开头的文件
const files = fs.readdirSync(dir).filter(f => !f.startsWith('.'))

// 忽略特定文件
const files = fs.readdirSync(dir).filter(f => f !== 'README.md' && f !== 'index.md')

// 使用正则过滤
const files = fs.readdirSync(dir).filter(
  f => /^[a-z-]+\.md$/.test(f) // 只要小写字母和连字符的 .md 文件
)
```

### Q5: 如何自定义排序？

```typescript
// 按文件名排序（默认）
const mdFiles = files.filter(f => f.endsWith('.md')).sort()

// 按修改时间排序
const mdFiles = files
  .filter(f => f.endsWith('.md'))
  .sort((a, b) => {
    const statA = fs.statSync(path.join(dir, a))
    const statB = fs.statSync(path.join(dir, b))
    return statB.mtime - statA.mtime // 最新的在前
  })

// 自定义顺序（配置文件定义）
const order = ['pagination-select', 'date-range', 'dialog-select']
const mdFiles = files
  .filter(f => f.endsWith('.md'))
  .sort((a, b) => {
    const aName = a.replace('.md', '')
    const bName = b.replace('.md', '')
    const aIndex = order.indexOf(aName)
    const bIndex = order.indexOf(bName)

    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b)
    if (aIndex === -1) return 1
    if (bIndex === -1) return -1
    return aIndex - bIndex
  })
```

### Q6: 如何处理多语言文档？

```typescript
interface LocaleSidebarItem {
  text: string
  link: string
  locale: string
}

function genMultiLangSidebar(componentsDir: string) {
  const files = fs.readdirSync(componentsDir)
  const items: Record<string, LocaleSidebarItem[]> = {
    'zh-CN': [],
    'en-US': []
  }

  for (const file of files) {
    // 文件命名: component-name.zh-CN.md, component-name.en-US.md
    const match = file.match(/(.+)\.(zh-CN|en-US)\.md$/)
    if (!match) continue

    const [, name, locale] = match
    const filePath = path.join(componentsDir, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    const text = content
      .split('\n')[0]
      .replace(/^#+\s*/, '')
      .trim()

    items[locale].push({
      text,
      link: `/components/${name}`,
      locale
    })
  }

  return items
}
```

---

## 🛠️ 调试技巧

### 输出调试信息

```typescript
export function genComponentsSidebar(componentsDir: string) {
  console.log('📂 扫描目录:', componentsDir)

  const files = fs.readdirSync(componentsDir)
  console.log('📄 找到文件:', files.length, '个')

  const mdFiles = files.filter(file => file.endsWith('.md')).sort()
  console.log('📝 Markdown 文件:', mdFiles.length, '个')

  const items = []
  for (const file of mdFiles) {
    const filePath = path.join(componentsDir, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    const firstLine = content.split('\n')[0]
    const text = firstLine.replace(/^#+\s*/, '').trim()

    console.log(`  ✓ ${file} → ${text}`)

    items.push({
      text,
      link: `/components/${file.replace('.md', '')}`
    })
  }

  console.log('✅ 生成配置项:', items.length, '个\n')
  return items
}
```

### 验证生成结果

```typescript
// 添加验证逻辑
export function genComponentsSidebar(componentsDir: string) {
  if (!fs.existsSync(componentsDir)) {
    throw new Error(`目录不存在: ${componentsDir}`)
  }

  const items = []
  const files = fs.readdirSync(componentsDir)
  const mdFiles = files.filter(file => file.endsWith('.md')).sort()

  if (mdFiles.length === 0) {
    console.warn('⚠️  警告: 未找到任何 .md 文件')
    return items
  }

  for (const file of mdFiles) {
    const filePath = path.join(componentsDir, file)
    const content = fs.readFileSync(filePath, 'utf-8')

    if (!content.trim()) {
      console.warn(`⚠️  警告: 文件为空 ${file}`)
      continue
    }

    const firstLine = content.split('\n')[0]
    if (!firstLine.startsWith('#')) {
      console.warn(`⚠️  警告: 第一行不是标题 ${file}`)
    }

    const text = firstLine.replace(/^#+\s*/, '').trim() || file.replace('.md', '')
    items.push({
      text,
      link: `/components/${file.replace('.md', '')}`
    })
  }

  return items
}
```

---

## 🎓 学习路径

### 新手入门

1. **了解基础概念**
   - 文件系统（File System）
   - 路径操作（Path）
   - 同步 vs 异步

2. **掌握核心 API**
   - `fs.readdirSync()` - 读目录
   - `fs.readFileSync()` - 读文件
   - `path.join()` - 拼接路径

3. **理解字符串处理**
   - `split()` - 分割
   - `replace()` - 替换
   - `trim()` - 去空格

### 进阶学习

1. **错误处理**
   - try-catch 捕获
   - 文件不存在处理
   - 权限错误处理

2. **性能优化**
   - 缓存机制
   - 异步操作
   - 批量处理

3. **扩展功能**
   - 递归读取
   - 自定义排序
   - 多语言支持

---

## 📚 扩展学习资源

### 官方文档

- [Node.js fs 模块文档](https://nodejs.org/docs/latest/api/fs.html)
- [Node.js path 模块文档](https://nodejs.org/docs/latest/api/path.html)
- [ES Modules 指南](https://nodejs.org/docs/latest/api/esm.html)
- [VitePress 配置文档](https://vitepress.dev/reference/site-config)

### 相关资源

- [JavaScript 正则表达式教程](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions)
- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
- [Node.js 异步编程指南](https://nodejs.org/en/docs/guides/blocking-vs-non-blocking/)

---

## 📌 总结

### 核心流程

1. **读目录** → 获取所有文件名
2. **过滤** → 只要 `.md` 文件
3. **排序** → 按字母顺序
4. **遍历** → 处理每个文件
5. **提取** → 读取标题
6. **生成** → 构建配置对象

### 关键技术

- `fs.readdirSync()` - 读取目录
- `fs.readFileSync()` - 读取文件
- `path.join()` - 拼接路径
- `String.split()` - 分割字符串
- `String.replace()` - 正则替换

### 实际价值

- ✅ **自动化**: 无需手动维护侧边栏配置
- ✅ **一致性**: 统一从文档标题提取
- ✅ **可维护**: 添加新文档自动生效
- ✅ **易扩展**: 可轻松添加分类、排序等逻辑
- ✅ **类型安全**: TypeScript 完整类型支持
