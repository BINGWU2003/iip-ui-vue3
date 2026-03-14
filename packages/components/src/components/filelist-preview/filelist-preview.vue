<template>
  <el-dialog ref="fileListPreviewRef" @close="handleClose" v-bind="dialogProps" v-model="visible">
    <div class="file-preview-list">
      <template v-if="props.files.length">
        <div
          v-for="(item, index) in props.files"
          :key="index"
          class="file-preview-item"
          @click="handlePreview(item)"
        >
          <el-icon class="file-preview-icon"><document /></el-icon>
          <span class="file-preview-name" :title="item.name">{{ item.name }}</span>
          <span v-if="getDisplaySuffix(item)" class="file-preview-type">
            {{ getDisplaySuffix(item) }}
          </span>
          <el-icon class="file-download-icon" title="下载" @click.stop="handleDownload(item)">
            <download />
          </el-icon>
        </div>
      </template>
      <el-empty v-else description="暂无文件" />
    </div>

    <!-- 图片原生预览 -->
    <el-image-viewer
      v-if="imageViewerVisible"
      :url-list="[currentPreviewUrl]"
      @close="imageViewerVisible = false"
    />

    <!-- iframe 沉浸式文档预览弹窗 -->
    <el-dialog
      v-model="iframeViewerVisible"
      :title="currentPreviewTitle"
      width="80%"
      top="5vh"
      append-to-body
      destroy-on-close
      class="iframe-preview-dialog"
    >
      <div v-if="iframeError" class="iframe-error-wrapper">
        <el-empty :image-size="160" description="该文件类型暂不支持在线预览">
          <template #default>
            <el-button
              type="primary"
              @click="handleDownload(currentPreviewItem as FilePreviewItem)"
            >
              直接下载到本地查看
            </el-button>
          </template>
        </el-empty>
      </div>
      <div v-else class="iframe-wrapper">
        <div v-if="iframeLoading" class="iframe-loading">
          <el-icon class="iframe-loading-icon"><loading /></el-icon>
          <span>正在为您解析文档，请稍候...</span>
        </div>
        <iframe
          :src="currentPreviewUrl"
          class="preview-iframe"
          :class="{ 'iframe-hidden': iframeLoading }"
          frameborder="0"
          @load="iframeLoading = false"
        ></iframe>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElIcon, ElDialog, ElEmpty, ElImageViewer } from 'element-plus'
import { ref, computed } from 'vue'

defineOptions({
  name: 'IipFileListPreview'
})
import { Document, Download, Loading } from '@element-plus/icons-vue'
import { Base64 } from 'js-base64'
import type { FileListPreviewProps, FileListPreviewEmits, FilePreviewItem } from './types'
import { getFileSuffix, omitObject } from '@bingwu/iip-ui-utils'
import { globalConfig } from '../../config'
import type { FileListPreviewInstance } from './types'
const fileListPreviewRef = ref<FileListPreviewInstance>()
const props = withDefaults(defineProps<FileListPreviewProps>(), {
  title: '文件列表',
  files: () => [],
  appendToBody: true,
  modal: true,
  width: '600px',
  destroyOnClose: true,
  showClose: true
})
const emit = defineEmits<FileListPreviewEmits>()
const visible = ref(false)
const dialogProps = computed(() => omitObject(props, ['files', 'modelValue']))
/**
 * 优先使用 item.suffix，不存在时从 url 中提取
 */
const getDisplaySuffix = (item: FilePreviewItem): string => {
  return item.suffix ?? getFileSuffix(item.url)
}

const open = () => {
  visible.value = true
}

const handleClose = () => {
  visible.value = false
  emit('handle-close')
}

const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg']
// 明确不支持在线预览的二进制 / 压缩包黑名单
const UNSUPPORTED_EXTENSIONS = ['zip', 'rar', '7z', 'tar', 'gz', 'apk', 'exe', 'bin', 'dll']

const imageViewerVisible = ref(false)
const iframeViewerVisible = ref(false)
const iframeLoading = ref(true)
const iframeError = ref(false)
const currentPreviewUrl = ref('')
const currentPreviewTitle = ref('')
const currentPreviewItem = ref<FilePreviewItem | null>(null)

const handlePreview = (item: FilePreviewItem) => {
  if (!item.url) {
    throw new Error('文件地址不能为空')
  }

  const suffix = getDisplaySuffix(item).toLowerCase()

  // 1. 如果是图片类型，使用原生浏览器解析（不再依赖服务端在线服务）
  if (IMAGE_EXTENSIONS.includes(suffix)) {
    currentPreviewUrl.value = item.url
    imageViewerVisible.value = true
    return
  }

  // 2. 检查是否在不支持的黑名单中
  if (UNSUPPORTED_EXTENSIONS.includes(suffix)) {
    iframeError.value = true
    iframeViewerVisible.value = true
    currentPreviewItem.value = item
    currentPreviewTitle.value = item.name || '无法预览'
    return
  }

  // 3. 对于不能解析的（如 pdf、docx 等），走 iframe 嵌套式预览
  const website = globalConfig.website
  if (!website) {
    const errorMsg =
      '未配置文件预览基础地址，请在 app.use(IipUI, { website: "..." }) 中进行全局配置'
    throw new Error(errorMsg)
  }

  iframeError.value = false
  currentPreviewItem.value = item
  currentPreviewUrl.value = website + '?url=' + encodeURIComponent(Base64.encode(item.url))
  currentPreviewTitle.value = item.name || '文件预览'
  iframeLoading.value = true
  iframeViewerVisible.value = true
}

const handleDownload = (item: FilePreviewItem) => {
  if (!item.url) return

  const a = document.createElement('a')
  a.href = item.url
  a.download = item.name || 'download'
  a.target = '_blank'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

const customExpose = {
  open
}
defineExpose(
  new Proxy(customExpose, {
    get(target, key) {
      if (key in target) {
        return target[key]
      }
      return fileListPreviewRef.value?.[key]
    },
    has(target, key) {
      return key in target || key in (fileListPreviewRef.value ?? {})
    }
  })
)
</script>

<style lang="scss" scoped>
.file-preview-list {
  height: 400px;
  overflow-y: auto;
  padding: 0 4px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f5f7fa;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c0c4cc;
    border-radius: 3px;

    &:hover {
      background: #a8abb2;
    }
  }
}

.file-preview-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f0f7ff;
  }

  & + .file-preview-item {
    border-top: 1px solid #f0f0f0;
  }
}

.file-preview-icon {
  font-size: 18px;
  color: #409eff;
  flex-shrink: 0;
}

.file-preview-name {
  flex: 1;
  font-size: 13px;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-preview-type {
  font-size: 12px;
  color: #909399;
  flex-shrink: 0;
}

.file-download-icon {
  font-size: 16px;
  color: #909399;
  cursor: pointer;
  margin-left: 10px;
  transition: color 0.2s;

  &:hover {
    color: #409eff;
  }
}

.preview-iframe {
  width: 100%;
  height: 80vh;
  border: none;
  display: block;
}

.iframe-wrapper {
  position: relative;
  width: 100%;
  height: 80vh;
}

.iframe-loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: #fff;
  font-size: 14px;
  color: #909399;
  z-index: 1;
}

.iframe-loading-icon {
  font-size: 32px;
  color: #409eff;
  animation: rotating 1.5s linear infinite;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.iframe-hidden {
  opacity: 0;
}

.iframe-error-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
  width: 100%;
}
</style>
