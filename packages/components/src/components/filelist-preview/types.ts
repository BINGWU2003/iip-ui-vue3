import { ElDialog, type DialogProps } from 'element-plus'
/**
 * 文件列表预览 - 文件项类型
 */
export type FilePreviewItem = {
  /** 文件名 */
  name: string
  /** 文件地址 */
  url: string
  /** 文件后缀名 */
  suffix?: string
}

/**
 * FileListPreview 组件 Props
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
