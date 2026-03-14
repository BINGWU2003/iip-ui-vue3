<template>
  <div class="demo-container">
    <el-button type="primary" @click="handlePreview">函数式调用预览</el-button>
  </div>
</template>

<script setup lang="ts">
import { openFileListPreview } from '@bingwu/iip-ui-components'

const handlePreview = () => {
  openFileListPreview({
    title: '项目附件列表',
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
      },
      {
        name: '压缩包示例.zip',
        url: 'https://example.com/archive.zip'
      }
    ]
  })
}
</script>

<style scoped>
.demo-container {
  padding: 16px;
}
</style>
