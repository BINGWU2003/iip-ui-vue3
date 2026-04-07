import { h, render, type VNode, nextTick } from 'vue'
import FileListPreview from './filelist-preview.vue'
import type { FileListPreviewInstance, OpenFileListPreviewOptions, FilePreviewItem } from './types'

/**
 * 打开文件列表预览弹窗（函数式调用）
 *
 * @param options - 配置项对象
 * @param options.files - 文件列表，每项包含：
 *   - `name`   文件名（显示在左侧列表中）
 *   - `url`    文件地址（用于预览和下载）
 *   - `suffix` 文件后缀名（可选，优先级高于从 url 中自动解析；适用于 url 不含扩展名的场景）
 * @param options.title - 弹窗标题，默认 `'文件列表'`
 * @param options.animationDuration - 弹窗关闭动画时长（ms），默认 `300`
 *
 * @example
 * // 传入配置项
 * openFileListPreview({ files: item.fileList, title: '附件列表' })
 *
 * // 直接传入文件数组（标题使用默认值 '文件列表'）
 * openFileListPreview(item.fileList)
 */
export function openFileListPreview(options: OpenFileListPreviewOptions): void
export function openFileListPreview(files: FilePreviewItem[]): void
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
