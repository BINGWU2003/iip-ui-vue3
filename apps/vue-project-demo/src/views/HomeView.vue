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
        name: '项目需1111111111111111求文档.docx',
        url: 'https://cqk.cdn.iipcloud.com/upload/20260314/c2331e8086f9fa933908cb85d8b78f9a.docx',
      },
      {
        name: 'xlsx测试文件.xlsx',
        url: 'https://cqk.cdn.iipcloud.com/upload/20260314/dcf613d3bbb877b94b11c955a7ee566f.xls',
      },
      {
        name: '图片测试文件.png',
        url: 'https://sdcdn.mes.iipcloud.com/upload/20260309/120f3a43c621b11699ca2b620238b4a9.png',
      },
      {
        name: '项目需1111111111111111求文档.docx',
        url: 'https://cqk.cdn.iipcloud.com/upload/20260314/c2331e8086f9fa933908cb85d8b78f9a.docx',
      },
      {
        name: 'xlsx测试文件.xlsx',
        url: 'https://cqk.cdn.iipcloud.com/upload/20260314/dcf613d3bbb877b94b11c955a7ee566f.xls',
      },
      {
        name: '图片测试文件.png',
        url: 'https://sdcdn.mes.iipcloud.com/upload/20260309/120f3a43c621b11699ca2b620238b4a9.png',
      },
      {
        name: '项目需1111111111111111求文档.docx',
        url: 'https://cqk.cdn.iipcloud.com/upload/20260314/c2331e8086f9fa933908cb85d8b78f9a.docx',
      },
      {
        name: 'xlsx测试文件.xlsx',
        url: 'https://cqk.cdn.iipcloud.com/upload/20260314/dcf613d3bbb877b94b11c955a7ee566f.xls',
      },
      {
        name: '图片测试文件.png',
        url: 'https://sdcdn.mes.iipcloud.com/upload/20260309/120f3a43c621b11699ca2b620238b4a9.png',
      },
      {
        name: '项目需1111111111111111求文档.docx',
        url: 'https://cqk.cdn.iipcloud.com/upload/20260314/c2331e8086f9fa933908cb85d8b78f9a.docx',
      },
      {
        name: 'xlsx测试文件.xlsx',
        url: 'https://cqk.cdn.iipcloud.com/upload/20260314/dcf613d3bbb877b94b11c955a7ee566f.xls',
      },
      {
        name: '图片测试文件.png',
        url: 'https://sdcdn.mes.iipcloud.com/upload/20260309/120f3a43c621b11699ca2b620238b4a9.png',
      },
      {
        name: '项目需1111111111111111求文档.docx',
        url: 'https://cqk.cdn.iipcloud.com/upload/20260314/c2331e8086f9fa933908cb85d8b78f9a.docx',
      },
      {
        name: 'xlsx测试文件.xlsx',
        url: 'https://cqk.cdn.iipcloud.com/upload/20260314/dcf613d3bbb877b94b11c955a7ee566f.xls',
      },
      {
        name: '图片测试文件.png',
        url: 'https://sdcdn.mes.iipcloud.com/upload/20260309/120f3a43c621b11699ca2b620238b4a9.png',
      },
      {
        name: '项目需1111111111111111求文档.docx',
        url: 'https://cqk.cdn.iipcloud.com/upload/20260314/c2331e8086f9fa933908cb85d8b78f9a.docx',
      },
      {
        name: 'xlsx测试文件.xlsx',
        url: 'https://cqk.cdn.iipcloud.com/upload/20260314/dcf613d3bbb877b94b11c955a7ee566f.xls',
      },
      {
        name: '图片测试文件.png',
        url: 'https://sdcdn.mes.iipcloud.com/upload/20260309/120f3a43c621b11699ca2b620238b4a9.png',
      },
      // {
      //   name: '111',
      //   url: 'https://cqk.cdn.iipcloud.com/upload/20260314/c033fca1943c1796c992320cb9333fc2.docx',
      // },
      {
        name: '11223211',
        url: 'https://cqk.csssad/20260314/c033fca1943c1796c992320cb9333fc2.docx',
      },
    ],
  })
}
</script>
