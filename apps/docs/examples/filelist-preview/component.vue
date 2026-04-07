<template>
  <div class="demo-container">
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="工单标题" min-width="200" />
      <el-table-column prop="fileCount" label="附件数量" width="100" align="center" />
      <el-table-column label="操作" width="120" align="center">
        <template #default="{ row }">
          <el-button type="primary" link :disabled="!row.files.length" @click="handlePreview(row)">
            查看附件
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 组件式声明，通过 ref 调用 open() -->
    <iip-file-list-preview
      ref="previewRef"
      :title="currentTitle"
      :files="currentFiles"
      @handle-close="onClose"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { FileListPreviewInstance, FilePreviewItem } from '@bingwu/iip-ui-components'

const previewRef = ref<FileListPreviewInstance>()
const currentTitle = ref('附件列表')
const currentFiles = ref<FilePreviewItem[]>([])

interface TicketRow {
  id: number
  title: string
  fileCount: number
  files: FilePreviewItem[]
}

const tableData = ref<TicketRow[]>([
  {
    id: 1,
    title: '系统登录异常排查',
    fileCount: 3,
    files: [
      {
        name: '项目需求文档.docx',
        url: 'https://cqk.cdn.iipcloud.com/upload/20260314/c2331e8086f9fa933908cb85d8b78f9a.docx'
      },
      {
        name: '报表数据.xlsx',
        url: 'https://cqk.cdn.iipcloud.com/upload/20260314/dcf613d3bbb877b94b11c955a7ee566f.xls'
      },
      {
        name: '效果图.png',
        url: 'https://sdcdn.mes.iipcloud.com/upload/20260309/120f3a43c621b11699ca2b620238b4a9.png'
      }
    ]
  },
  {
    id: 2,
    title: '页面加载性能优化',
    fileCount: 1,
    files: [
      {
        name: '性能测试截图.jpg',
        url: 'https://sdcdn.mes.iipcloud.com/upload/20260119/00908c587d0bb47e6657b79e41f30fa1.jpg'
      }
    ]
  },
  {
    id: 3,
    title: '数据导出功能需求',
    fileCount: 0,
    files: []
  }
])

const handlePreview = (row: TicketRow) => {
  currentTitle.value = `${row.title} — 附件列表`
  currentFiles.value = row.files
  previewRef.value?.open()
}

const onClose = () => {
  // 弹窗关闭后的回调
}
</script>

<style scoped>
.demo-container {
  padding: 16px;
}
</style>
