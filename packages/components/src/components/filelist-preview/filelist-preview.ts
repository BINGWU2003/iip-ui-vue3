import { h, render, type VNode, nextTick } from 'vue'
import FileListPreview from './filelist-preview.vue'
import type { FileListPreviewInstance, OpenFileListPreviewOptions, FilePreviewItem } from './types'

/**
 * 打开文件列表预览弹窗（函数式调用）
 * @param options - 配置选项，或者直接传入文件数组
 * @example
 *
 * // 传配置项
 * openFileListPreview({ files: item.fileList, title: '附件列表' })
 */
export function openFileListPreview(
  optionsOrFiles: OpenFileListPreviewOptions | FilePreviewItem[] = {}
): void {
  const optionsOrFilesArray = Array.isArray(optionsOrFiles)
    ? { files: optionsOrFiles }
    : optionsOrFiles
  const options = optionsOrFilesArray as OpenFileListPreviewOptions
  const { animationDuration = 300, ...rest } = options

  const container = document.createElement('div')
  document.body.appendChild(container)

  let vnode: VNode | null = null

  const close = () => {
    if (vnode) {
      render(null, container)
      vnode = null
    }
    setTimeout(() => {
      if (container.parentNode) {
        container.parentNode.removeChild(container)
      }
    }, animationDuration)
  }

  vnode = h(FileListPreview, {
    ...rest,
    onHandleClose: close
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any)

  render(vnode, container)

  nextTick(() => {
    const instance = vnode?.component?.exposed as FileListPreviewInstance | undefined
    if (instance?.open) {
      instance.open()
    } else {
      console.error('FileListPreview 组件实例不存在')
      close()
    }
  })
}

export default openFileListPreview
