<template>
  <main class="test">home</main>
  <el-button @click="router.push('/about')" type="primary"> to about </el-button>
  <el-button @click="handlePreview" type="success" style="margin-left: 10px">
    指令式调用文件列表预览
  </el-button>
  <el-button @click="handleComponentPreview" type="warning" style="margin-left: 10px">
    普通组件形式调用文件列表预览
  </el-button>

  <iip-file-list-preview ref="previewRef" title="组件形式调用的附件" :files="componentFiles" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { openFileListPreview } from '@bingwu/iip-ui-components'
import type { FileListPreviewInstance } from '@bingwu/iip-ui-components'

const router = useRouter()
const previewRef = ref<FileListPreviewInstance>()

const componentFiles = [
  {
    name: '组件模式传的测试图.jpg',
    url: 'https://sdcdn.mes.iipcloud.com/upload/20260119/00908c587d0bb47e6657b79e41f30fa1.jpg',
  },
]

const handleComponentPreview = () => {
  previewRef.value?.open()
}

const handlePreview = () => {
  openFileListPreview({
    title: '我的测试附件',
    files: [
      {
        name: '项目需求文档.docx',
        url: 'https://sdcdn.mes.iipcloud.com/upload/20260119/00908c587d0bb47e6657b79e41f30fa1.jpg',
      },
      { name: '年度汇报PPT(无后缀的错误例子测试提取)', url: 'https://example.com/report' },
      {
        name: '接口说明.pdf',
        url: 'https://sdcdn.mes.iipcloud.com/upload/20260309/120f3a43c621b11699ca2b620238b4a9.png',
      },
    ],
  })
}
</script>
