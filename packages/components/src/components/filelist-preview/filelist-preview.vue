<template>
  <el-dialog ref="fileListPreviewRef" @close="handleClose" v-bind="dialogProps" v-model="visible">
    <div class="split-layout">
      <!-- 左侧文件列表 -->
      <div class="file-list-panel">
        <template v-if="filesWithId.length">
          <div
            v-for="item in filesWithId"
            :key="item._id"
            class="file-preview-item"
            :class="{ 'is-active': activeItem?._id === item._id }"
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
              <el-button
                type="primary"
                @click="handleDownload(activeItem as FilePreviewItemWithId)"
              >
                直接下载到本地查看
              </el-button>
            </template>
          </el-empty>
        </div>

        <!-- 图片预览 -->
        <div v-else-if="isImage" class="image-preview-wrapper">
          <el-image
            :src="currentPreviewUrl"
            fit="contain"
            :preview-src-list="[currentPreviewUrl]"
            :initial-index="0"
            preview-teleported
            class="preview-image"
          />
        </div>

        <!-- iframe 预览 -->
        <div v-else class="iframe-wrapper">
          <div v-if="iframeLoading" class="iframe-loading">
            <el-icon class="iframe-loading-icon"><loading /></el-icon>
            <span>正在为您解析文档，请稍候...</span>
          </div>
          <iframe
            :key="currentPreviewUrl"
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
import { ElIcon, ElDialog, ElEmpty, ElButton, ElTooltip, ElImage } from 'element-plus'
import { ref, computed } from 'vue'
import { Document, Download, Loading } from '@element-plus/icons-vue'
import { Base64 } from 'js-base64'
import type { FileListPreviewProps, FileListPreviewEmits, FilePreviewItem } from './types'
import { getFileSuffix, omitObject, generateId, debounce } from '@bingwu/iip-ui-utils'
import { globalConfig } from '../../config'
import type { FileListPreviewInstance } from './types'
defineOptions({
  name: 'IipFileListPreview'
})
type FilePreviewItemWithId = FilePreviewItem & { _id: string }
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

const filesWithId = computed<FilePreviewItemWithId[]>(() =>
  props.files.map(item => ({ ...item, _id: generateId() }))
)

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

const activeItem = ref<FilePreviewItemWithId | null>(null)
const iframeLoading = ref(false)
const iframeError = ref(false)
const isImage = ref(false)
const currentPreviewUrl = ref('')

const handlePreview = (item: FilePreviewItemWithId) => {
  if (activeItem.value?._id === item._id) return
  // 立即更新高亮，给用户即时反馈
  activeItem.value = item
  debouncedLoad(item)
}

const debouncedLoad = debounce((item: FilePreviewItemWithId) => {
  if (!item.url) {
    throw new Error('文件地址不能为空')
  }

  const suffix = getDisplaySuffix(item).toLowerCase()

  // 不支持预览的类型
  if (UNSUPPORTED_EXTENSIONS.includes(suffix)) {
    iframeError.value = true
    isImage.value = false
    return
  }

  iframeError.value = false
  iframeLoading.value = true

  // 图片用 el-image 展示
  if (IMAGE_EXTENSIONS.includes(suffix)) {
    isImage.value = true
    iframeLoading.value = false
    currentPreviewUrl.value = item.url
    return
  }

  isImage.value = false

  // 文档类型走服务端预览
  const website = globalConfig.website
  if (!website) {
    throw new Error(
      '未配置文件预览基础地址，请在 app.use(IipUI, { website: "..." }) 中进行全局配置'
    )
  }
  currentPreviewUrl.value = website + '?url=' + encodeURIComponent(Base64.encode(item.url))
}, 300)

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

.image-preview-wrapper {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  overflow: hidden;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  cursor: zoom-in;
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
