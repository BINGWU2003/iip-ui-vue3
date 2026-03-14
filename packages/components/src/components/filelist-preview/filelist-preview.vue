<template>
  <el-dialog ref="fileListPreviewRef" @close="handleClose" v-bind="dialogProps" v-model="visible">
    <div class="split-layout">
      <!-- 左侧文件列表 -->
      <div class="file-list-panel">
        <template v-if="props.files.length">
          <div
            v-for="(item, index) in props.files"
            :key="index"
            class="file-preview-item"
            :class="{ 'is-active': activeItem === item }"
            @click="handlePreview(item)"
          >
            <el-icon class="file-preview-icon"><document /></el-icon>
            <el-tooltip :content="item.name" placement="top" :show-after="500">
              <span class="file-preview-name">{{ item.name }}</span>
            </el-tooltip>
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

      <!-- 右侧预览区域 -->
      <div class="preview-panel">
        <!-- 未选择文件 -->
        <div v-if="!activeItem" class="preview-empty">
          <el-icon class="preview-empty-icon"><document /></el-icon>
          <span>点击左侧文件进行预览</span>
        </div>

        <!-- 不支持预览 -->
        <div v-else-if="iframeError" class="iframe-error-wrapper">
          <el-empty :image-size="120" description="该文件类型暂不支持在线预览">
            <template #default>
              <el-button type="primary" @click="handleDownload(activeItem as FilePreviewItem)">
                直接下载到本地查看
              </el-button>
            </template>
          </el-empty>
        </div>

        <!-- iframe 预览 -->
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
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElIcon, ElDialog, ElEmpty, ElButton, ElTooltip } from 'element-plus'
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
  width: '90%',
  destroyOnClose: true,
  showClose: true,
  top: '10vh'
})
const emit = defineEmits<FileListPreviewEmits>()
const visible = ref(false)
const dialogProps = computed(() => omitObject(props, ['files', 'modelValue']))

const getDisplaySuffix = (item: FilePreviewItem): string => {
  return item.suffix ?? getFileSuffix(item.url)
}

const open = () => {
  visible.value = true
}

const handleClose = () => {
  visible.value = false
  activeItem.value = null
  emit('handle-close')
}

const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg']
const UNSUPPORTED_EXTENSIONS = ['zip', 'rar', '7z', 'tar', 'gz', 'apk', 'exe', 'bin', 'dll']

const activeItem = ref<FilePreviewItem | null>(null)
const iframeLoading = ref(false)
const iframeError = ref(false)
const currentPreviewUrl = ref('')

const handlePreview = (item: FilePreviewItem) => {
  if (!item.url) {
    throw new Error('文件地址不能为空')
  }

  activeItem.value = item
  const suffix = getDisplaySuffix(item).toLowerCase()

  // 不支持预览的类型
  if (UNSUPPORTED_EXTENSIONS.includes(suffix)) {
    iframeError.value = true
    return
  }

  iframeError.value = false
  iframeLoading.value = true

  // 图片直接用 URL 作为 iframe src，浏览器原生渲染
  if (IMAGE_EXTENSIONS.includes(suffix)) {
    currentPreviewUrl.value = item.url
    return
  }

  // 文档类型走服务端预览
  const website = globalConfig.website
  if (!website) {
    throw new Error(
      '未配置文件预览基础地址，请在 app.use(IipUI, { website: "..." }) 中进行全局配置'
    )
  }
  currentPreviewUrl.value = website + '?url=' + encodeURIComponent(Base64.encode(item.url))
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

const customExpose = { open }
defineExpose(
  new Proxy(customExpose, {
    get(target, key) {
      if (key in target) return target[key]
      return fileListPreviewRef.value?.[key]
    },
    has(target, key) {
      return key in target || key in (fileListPreviewRef.value ?? {})
    }
  })
)
</script>

<style lang="scss" scoped>
.split-layout {
  display: flex;
  height: 75vh;
  gap: 0;
}

/* 左侧文件列表 */
.file-list-panel {
  width: 260px;
  flex-shrink: 0;
  border-right: 1px solid #e4e7ed;
  overflow-y: auto;
  padding: 4px;

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

  &.is-active {
    background-color: #ecf5ff;

    .file-preview-name {
      color: #409eff;
      font-weight: 500;
    }

    .file-preview-icon {
      color: #409eff;
    }
  }

  & + .file-preview-item {
    border-top: 1px solid #f0f0f0;
  }
}

.file-preview-icon {
  font-size: 18px;
  color: #c0c4cc;
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
  color: #c0c4cc;
  cursor: pointer;
  flex-shrink: 0;
  transition: color 0.2s;

  &:hover {
    color: #409eff;
  }
}

/* 右侧预览区域 */
.preview-panel {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.preview-empty {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #c0c4cc;
  font-size: 14px;
}

.preview-empty-icon {
  font-size: 48px;
}

.iframe-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
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

.preview-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

.iframe-hidden {
  opacity: 0;
}

.iframe-error-wrapper {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
