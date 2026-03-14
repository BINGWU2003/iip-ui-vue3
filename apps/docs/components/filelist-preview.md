# FileListPreview 文件列表预览

`IipFileListPreview` 是一个文件列表预览组件，支持**组件式**和**函数式**两种调用方式，适用于附件管理、工单详情等需要在线预览多个文件的场景。

## 特性

- 📂 **文件列表**: 左侧文件列表 + 右侧预览区域的分栏布局
- 🖼️ **图片预览**: 图片文件使用 `el-image` 组件展示，支持点击放大
- 📄 **文档预览**: Word、Excel、PDF 等文档类型通过 kkFileView 服务端渲染预览
- ⬇️ **一键下载**: 每个文件均支持独立下载
- 🚫 **黑名单拦截**: 自动识别不支持预览的文件类型（zip、rar、exe 等），显示友好的下载提示
- ⏳ **加载状态**: 文档加载时显示 loading 动画，提升用户体验
- 🎯 **函数式调用**: `openFileListPreview` 支持命令式调用，无需在模板中声明组件
- 🛠️ **TypeScript**: 完整的 TypeScript 类型支持

## 全局配置

文档预览依赖 kkFileView 服务，需要在应用初始化时配置预览服务地址：

```typescript
import { createApp } from 'vue'
import IipUI from '@bingwu/iip-ui-components'

const app = createApp(App)
app.use(IipUI, {
  website: 'https://your-kkfileview-domain/onlinePreview' // kkFileView 预览地址
})
```

::: tip
未配置 `website` 时，点击文档类文件会抛出异常。图片、不支持预览的文件类型不受影响。
:::

<script setup>
import Base from '../examples/filelist-preview/base.vue'
import Component from '../examples/filelist-preview/component.vue'
</script>

## 函数式调用 `openFileListPreview`

`openFileListPreview` 是一个命令式函数，用于以编程方式打开文件预览弹窗，无需在模板中声明组件。适用于点击按钮、表格操作列等场景。

### 基础用法

<Base />

::: details 查看代码
<<< @/examples/filelist-preview/base.vue
:::

### 直接传入文件数组

支持直接传入 `FilePreviewItem[]`，此时弹窗标题使用默认值 `'文件列表'`：

```typescript
import { openFileListPreview } from '@bingwu/iip-ui-components'

openFileListPreview([
  { name: '合同.pdf', url: 'https://example.com/contract.pdf' },
  { name: '附图.jpg', url: 'https://example.com/image.jpg' }
])
```

### 表格操作列中调用

最常见的场景是在表格的操作列中点击按钮来预览该行的附件：

```vue
<template>
  <el-table :data="tableData" border>
    <el-table-column prop="ticketNo" label="工单号" width="120" />
    <el-table-column prop="title" label="标题" />
    <el-table-column label="操作" width="120">
      <template #default="{ row }">
        <el-button type="primary" link :disabled="!row.files?.length" @click="handlePreview(row)">
          查看附件({{ row.files?.length || 0 }})
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { openFileListPreview } from '@bingwu/iip-ui-components'
import type { FilePreviewItem } from '@bingwu/iip-ui-components'

interface TicketRow {
  id: number
  ticketNo: string
  title: string
  files: FilePreviewItem[]
}

const tableData = ref<TicketRow[]>([
  {
    id: 1,
    ticketNo: 'TK-001',
    title: '系统登录异常',
    files: [
      { name: '截图.png', url: 'https://example.com/screenshot.png' },
      { name: '日志.txt', url: 'https://example.com/log.txt' }
    ]
  },
  {
    id: 2,
    ticketNo: 'TK-002',
    title: '页面加载缓慢',
    files: [{ name: '性能分析报告.docx', url: 'https://example.com/report.docx' }]
  }
])

const handlePreview = (row: TicketRow) => {
  openFileListPreview({
    title: `${row.ticketNo} 附件列表`,
    files: row.files
  })
}
</script>
```

### 自定义弹窗属性

`openFileListPreview` 的选项继承了 `el-dialog` 的全部 Props，可以自定义弹窗的宽度、位置等：

```typescript
openFileListPreview({
  title: '合同附件',
  files: contractFiles,
  width: '80%', // 自定义宽度，默认 '90%'
  top: '5vh', // 自定义距顶部距离，默认 '10vh'
  modal: true, // 是否显示遮罩层，默认 true
  showClose: true, // 是否显示关闭按钮，默认 true
  appendToBody: true, // 是否插入到 body，默认 true
  destroyOnClose: true // 关闭后销毁内容，默认 true
})
```

### 带文件后缀的用法

如果文件 URL 中无法提取后缀（例如接口返回的 URL 不含扩展名），可以通过 `suffix` 字段手动指定：

```typescript
openFileListPreview({
  title: '合同文件',
  files: [
    {
      name: '采购合同',
      url: 'https://example.com/api/file/download?id=123',
      suffix: 'PDF' // 手动指定后缀，用于显示和判断预览类型
    }
  ]
})
```

## 组件式调用 `IipFileListPreview`

通过在模板中声明组件，使用 `ref` 获取实例后手动调用 `open()` 方法打开弹窗。

### 基础用法

<Component />

::: details 查看代码
<<< @/examples/filelist-preview/component.vue
:::

### 动态更新文件列表

组件式调用可以利用响应式数据，实现点击不同行时动态切换预览的文件列表：

```vue
<template>
  <el-table :data="tableData" border @row-click="handleRowClick">
    <el-table-column prop="name" label="项目名称" />
    <el-table-column prop="fileCount" label="附件数量" width="100" />
  </el-table>

  <iip-file-list-preview ref="previewRef" :title="currentTitle" :files="currentFiles" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { FileListPreviewInstance, FilePreviewItem } from '@bingwu/iip-ui-components'

const previewRef = ref<FileListPreviewInstance>()
const currentTitle = ref('附件列表')
const currentFiles = ref<FilePreviewItem[]>([])

const tableData = ref([
  {
    id: 1,
    name: '电商平台项目',
    fileCount: 2,
    files: [
      { name: '需求说明书.docx', url: 'https://example.com/req.docx' },
      { name: '产品原型.pdf', url: 'https://example.com/prototype.pdf' }
    ] as FilePreviewItem[]
  },
  {
    id: 2,
    name: '移动端项目',
    fileCount: 1,
    files: [{ name: '技术方案.pptx', url: 'https://example.com/tech.pptx' }] as FilePreviewItem[]
  }
])

const handleRowClick = (row: any) => {
  currentTitle.value = `${row.name} - 附件列表`
  currentFiles.value = row.files
  previewRef.value?.open()
}
</script>
```

### 监听关闭事件

组件支持 `handle-close` 事件，在弹窗关闭时触发：

```vue
<template>
  <iip-file-list-preview ref="previewRef" title="附件预览" :files="files" @handle-close="onClose" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { FileListPreviewInstance } from '@bingwu/iip-ui-components'

const previewRef = ref<FileListPreviewInstance>()

const onClose = () => {
  console.log('预览弹窗已关闭')
}
</script>
```

## 支持的文件类型

| 文件类型     | 后缀名                                            | 预览方式                        |
| ------------ | ------------------------------------------------- | ------------------------------- |
| 图片         | `png`, `jpg`, `jpeg`, `gif`, `bmp`, `webp`, `svg` | `el-image` 组件（支持点击放大） |
| Word 文档    | `doc`, `docx`                                     | kkFileView 服务渲染             |
| Excel 表格   | `xls`, `xlsx`                                     | kkFileView 服务渲染             |
| PDF 文档     | `pdf`                                             | kkFileView 服务渲染             |
| PPT 演示文稿 | `ppt`, `pptx`                                     | kkFileView 服务渲染             |
| 文本文件     | `txt`, `md`                                       | kkFileView 服务渲染             |
| 压缩包       | `zip`, `rar`, `7z`, `tar`, `gz`                   | ❌ 不支持，显示下载提示         |
| 可执行文件   | `exe`, `apk`, `bin`, `dll`                        | ❌ 不支持，显示下载提示         |

::: tip
对于不支持预览的文件类型，组件会在右侧显示友好提示，并提供"直接下载到本地查看"按钮，**不会**向 kkFileView 服务发出请求。
:::

## API

### openFileListPreview

函数支持两种调用方式（重载签名）：

```typescript
// 重载 1：传入配置项对象
function openFileListPreview(options: OpenFileListPreviewOptions): void

// 重载 2：直接传入文件数组（title 使用默认值 '文件列表'）
function openFileListPreview(files: FilePreviewItem[]): void
```

**完整签名：**

```typescript
function openFileListPreview(optionsOrFiles: OpenFileListPreviewOptions | FilePreviewItem[]): void
```

| 参数           | 说明                           | 类型                                              |
| -------------- | ------------------------------ | ------------------------------------------------- |
| optionsOrFiles | 配置项对象，或直接传入文件数组 | `OpenFileListPreviewOptions \| FilePreviewItem[]` |

### OpenFileListPreviewOptions

`OpenFileListPreviewOptions` 继承了 `el-dialog` 的全部 Props（`Partial<DialogProps>`），并额外增加以下字段：

| 参数              | 说明                   | 类型                | 默认值       | 必需 |
| ----------------- | ---------------------- | ------------------- | ------------ | ---- |
| files             | 文件列表               | `FilePreviewItem[]` | `[]`         | ❌   |
| title             | 弹窗标题               | `string`            | `'文件列表'` | ❌   |
| width             | 弹窗宽度               | `string \| number`  | `'90%'`      | ❌   |
| top               | 弹窗距顶部距离         | `string`            | `'10vh'`     | ❌   |
| modal             | 是否显示遮罩层         | `boolean`           | `true`       | ❌   |
| showClose         | 是否显示关闭按钮       | `boolean`           | `true`       | ❌   |
| appendToBody      | 是否插入到 body        | `boolean`           | `true`       | ❌   |
| destroyOnClose    | 关闭后销毁内容         | `boolean`           | `true`       | ❌   |
| animationDuration | 弹窗关闭动画时长（ms） | `number`            | `300`        | ❌   |

> 其他 `el-dialog` Props 均可透传，详见 [Element Plus Dialog 文档](https://element-plus.org/zh-CN/component/dialog.html)。

### IipFileListPreview 组件 Props

与 `OpenFileListPreviewOptions` 一致（去掉 `animationDuration`）：

| 参数           | 说明                        | 类型                | 默认值       |
| -------------- | --------------------------- | ------------------- | ------------ |
| files          | 文件列表                    | `FilePreviewItem[]` | `[]`         |
| title          | 弹窗标题                    | `string`            | `'文件列表'` |
| width          | 弹窗宽度                    | `string \| number`  | `'90%'`      |
| top            | 弹窗距顶部距离              | `string`            | `'10vh'`     |
| ...DialogProps | 支持 el-dialog 的全部 Props | -                   | -            |

### IipFileListPreview 组件 Emits

| 事件名       | 说明           | 参数 |
| ------------ | -------------- | ---- |
| handle-close | 弹窗关闭时触发 | -    |

### IipFileListPreview 组件实例方法（defineExpose）

通过 `ref` 获取到的组件实例，除了 `el-dialog` 原有的方法外，还额外暴露以下方法：

| 方法名 | 说明         | 参数 | 返回值 |
| ------ | ------------ | ---- | ------ |
| open() | 打开预览弹窗 | -    | `void` |

### FilePreviewItem

文件列表中每一项的数据结构：

| 字段   | 说明                                        | 类型     | 必需 |
| ------ | ------------------------------------------- | -------- | ---- |
| name   | 文件名（显示在左侧列表中）                  | `string` | ✅   |
| url    | 文件地址                                    | `string` | ✅   |
| suffix | 文件后缀名（可选，优先级高于从 url 中解析） | `string` | ❌   |

## 类型定义

```typescript
/**
 * 文件列表预览 - 文件项类型
 */
export type FilePreviewItem = {
  /** 文件名 */
  name: string
  /** 文件地址 */
  url: string
  /** 文件后缀名（可选，不传时从 url 自动解析） */
  suffix?: string
}

/**
 * FileListPreview 组件 Props（继承 el-dialog 全部 Props）
 */
export type FileListPreviewProps = Partial<DialogProps> & {
  /** 文件列表 */
  files?: FilePreviewItem[]
}

/**
 * FileListPreview 组件 Emits
 */
export type FileListPreviewEmits = {
  /** 弹窗关闭 */
  'handle-close': []
}

/**
 * FileListPreview 组件实例（defineExpose 暴露的方法）
 */
export type FileListPreviewInstance = InstanceType<typeof ElDialog> & {
  /** 打开弹窗 */
  open: () => void
}

/**
 * 函数式调用 openFileListPreview 的选项
 */
export type OpenFileListPreviewOptions = FileListPreviewProps & {
  /** 弹窗关闭动画时长（ms），默认 300 */
  animationDuration?: number
}
```

## 使用场景

### 1. 工单/任务附件查看

在工单系统中，为每条工单提供附件预览入口：

```vue
<el-table-column label="操作" width="100">
  <template #default="{ row }">
    <el-button type="primary" link @click="openFileListPreview({ title: row.title + ' 附件', files: row.attachments })">
      查看附件
    </el-button>
  </template>
</el-table-column>
```

### 2. 表单页面附件展示

在详情页或编辑表单中，以组件形式固定展示附件列表：

```vue
<template>
  <div class="form-item">
    <label>项目附件</label>
    <el-button size="small" @click="previewRef?.open()">预览附件</el-button>
  </div>

  <iip-file-list-preview
    ref="previewRef"
    title="项目附件"
    :files="formData.attachments"
    width="85%"
  />
</template>
```

### 3. 动态文件来源

从接口获取文件列表后再打开预览：

```typescript
const handlePreview = async (id: string) => {
  const { data } = await fetchAttachments(id)
  openFileListPreview({
    title: '附件预览',
    files: data.map(item => ({
      name: item.fileName,
      url: item.fileUrl,
      suffix: item.fileExt
    }))
  })
}
```

## 函数式调用 vs 组件式调用

| 对比项   | 函数式调用 (`openFileListPreview`) | 组件式调用 (`IipFileListPreview`) |
| -------- | ---------------------------------- | --------------------------------- |
| 模板声明 | ❌ 无需                            | ✅ 需要在模板中声明               |
| 使用方式 | 在 JS/TS 中直接调用函数            | 通过 `ref` 调用实例方法           |
| 动态文件 | ✅ 每次调用传入文件                | ✅ 通过响应式 Props 更新          |
| 适用场景 | 按钮点击、表格操作列、异步获取     | 需要监听事件、固定在页面某处      |
| 自动清理 | ✅ 关闭后自动销毁 DOM              | 由 Vue 管理组件生命周期           |

## 最佳实践

### 1. 从接口数据映射文件列表

接口返回的字段名通常与 `FilePreviewItem` 不一致，建议显式映射：

```typescript
const attachments = apiData.attachments.map(item => ({
  name: item.fileName, // 对应 FilePreviewItem.name
  url: item.downloadUrl, // 对应 FilePreviewItem.url
  suffix: item.fileType // 对应 FilePreviewItem.suffix（可选）
}))

openFileListPreview({ title: '附件', files: attachments })
```

### 2. 空文件列表处理

调用前判断文件列表是否为空，避免打开空弹窗：

```typescript
const handlePreview = (row: any) => {
  if (!row.files?.length) {
    ElMessage.info('该记录暂无附件')
    return
  }
  openFileListPreview({ title: '附件列表', files: row.files })
}
```

### 3. 使用 suffix 字段处理特殊 URL

当文件地址是接口路径而非直接的静态资源地址时，组件无法从 URL 自动识别文件类型，需要通过 `suffix` 手动指定：

```typescript
openFileListPreview({
  files: [
    {
      name: '合同文件',
      url: '/api/file/download?fileId=abc123',
      suffix: 'pdf' // 手动指定，确保正确判断预览方式
    }
  ]
})
```

## 注意事项

1. **全局配置必需**: 文档类文件（Word、Excel、PDF 等）必须在 `app.use(IipUI, { website: '...' })` 中配置 kkFileView 服务地址，否则会抛出异常。图片和不支持预览的文件类型不受此限制。
2. **不支持预览的类型**: `zip`, `rar`, `7z`, `tar`, `gz`, `apk`, `exe`, `bin`, `dll` 等文件会被自动拦截，显示友好提示，不会向后端发送请求。
3. **suffix 优先级**: 若同时存在 `FilePreviewItem.suffix` 和 URL 中的扩展名，以 `suffix` 字段为准。
4. **自动清理（函数式）**: 使用 `openFileListPreview` 时，弹窗关闭后会自动移除 DOM 节点，无需手动管理。
5. **组件式调用时弹窗默认隐藏**: 组件渲染在模板中，但弹窗默认不可见，需调用 `previewRef.value?.open()` 才会显示。

## 常见问题

### Q: 点击文档文件没有反应或报错？

A: 请检查是否在 `app.use(IipUI, { website: '...' })` 中配置了正确的 kkFileView 预览服务地址。

### Q: 文件预览时一直显示 loading 动画？

A: 通常是 kkFileView 服务无法访问，或文件 URL 无法被服务器端读取。检查 kkFileView 服务是否正常运行，以及文件 URL 是否可以被服务器访问。

### Q: 如何为文件增加后缀标签显示？

A: 组件会自动从 `url` 中解析文件后缀（大写）显示在文件名右侧，无需额外配置。如果 URL 无法解析，可以在 `FilePreviewItem` 中手动指定 `suffix` 字段。

### Q: 函数式调用可以在同一页面多次使用吗？

A: 可以。每次 `openFileListPreview` 调用都会创建独立的弹窗实例，互不干扰，关闭后自动清理。

### Q: 如何自定义弹窗宽度？

A: 通过 `width` 参数设置（同 `el-dialog` 的 `width` prop）：

```typescript
openFileListPreview({
  files: myFiles,
  width: '80%' // 或 '1200px' 等具体值
})
```

### Q: 组件式调用如何知道弹窗已经关闭？

A: 监听 `handle-close` 事件：

```vue
<iip-file-list-preview ref="previewRef" :files="files" @handle-close="onPreviewClosed" />
```

### Q: 图片支持点击放大吗？

A: 支持。图片使用 `el-image` 组件展示，点击图片后会弹出大图预览（使用 Element Plus 的图片预览功能）。
