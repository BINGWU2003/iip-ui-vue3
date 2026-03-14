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
          <span class="file-preview-name">{{ item.name }}</span>
          <span v-if="getDisplaySuffix(item)" class="file-preview-type">
            {{ getDisplaySuffix(item) }}
          </span>
        </div>
      </template>
      <el-empty v-else description="暂无文件" />
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElIcon, ElDialog, ElEmpty } from 'element-plus'
import { ref, computed } from 'vue'

defineOptions({
  name: 'IipFileListPreview'
})
import { Document } from '@element-plus/icons-vue'
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
  width: '600px'
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

const handlePreview = (item: FilePreviewItem) => {
  if (!item.url) {
    throw new Error('文件地址不能为空')
  }
  const website = globalConfig.website
  if (!website) {
    const errorMsg =
      '未配置文件预览基础地址，请在 app.use(IipUI, { website: "..." }) 中进行全局配置'
    throw new Error(errorMsg)
  }
  const link = item.url
  window.open(website + '?url=' + encodeURIComponent(Base64.encode(link)))
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
</style>
