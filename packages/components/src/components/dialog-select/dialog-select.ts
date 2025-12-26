import { h, render, type VNode, nextTick } from 'vue'
import DialogSelect from './dialog-select.vue'
import type { DialogSelectInstance, OpenDialogSelectOptions } from './types'
import type { BaseRecord } from '../../utils/types'
export function openDialogSelect<T extends BaseRecord = BaseRecord>(
  options: OpenDialogSelectOptions<T>
): Promise<T | T[] | null> {
  return new Promise((resolve, reject) => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const animationDuration = options.animationDuration ?? 300
    let vnode: VNode | null = null
    let currentValue = options.initialValue || null
    let isConfirmed = false // 标记是否是确认操作
    const isCancelled = false // 标记是否已取消（预留给未来可能的主动取消功能）

    const cleanup = () => {
      if (vnode) {
        render(null, container)
        vnode = null
      }

      setTimeout(() => {
        if (container.parentNode) {
          document.body.removeChild(container)
        }
      }, animationDuration)
    }

    const handleChange = (value: T | T[] | null) => {
      currentValue = value
    }

    const handleDialogVisibleChange = (visible: boolean) => {
      if (!visible && !isConfirmed && !isCancelled) {
        // 弹窗关闭，且不是确认操作也不是主动取消，说明是用户点击了取消按钮或遮罩层
        cleanup()
        reject(new Error('用户取消选择'))
      }
    }

    const handleConfirm = (value: T | T[] | null) => {
      isConfirmed = true
      currentValue = value

      // 等待弹窗关闭动画完成后再清理
      setTimeout(() => {
        cleanup()
        resolve(value)
      }, animationDuration)
    }

    const handleError = (error: any) => {
      cleanup()
      reject(error)
    }

    // 直接创建 DialogSelect 组件的 VNode，无需额外包装
    vnode = h(DialogSelect, {
      modelValue: currentValue,
      multiple: options.multiple ?? false,
      valueKey: options.valueKey ?? 'id',
      labelKey: options.labelKey ?? 'name',
      keyGetter: options.keyGetter,
      dialogTitle: options.dialogTitle ?? '请选择',
      dialogWidth: options.dialogWidth ?? '1100px',
      fetchData: options.fetchData,
      dialogSelectOptions: options.dialogSelectOptions,
      gridConfig: options.gridConfig,
      // 通过 style 隐藏输入框，因为命令式调用只需要弹窗
      style: { display: 'none' },
      'onUpdate:modelValue': handleChange,
      onChange: handleConfirm,
      'onDialog-visible-change': handleDialogVisibleChange,
      onError: handleError
    })

    render(vnode, container)

    // 手动触发打开弹窗
    // 需要等待组件完全挂载和 props 完全解析后再调用 open

    nextTick(() => {
      // 从 vnode 中获取组件实例
      const componentInstance = vnode?.component?.exposed as DialogSelectInstance | undefined
      if (componentInstance?.open) {
        componentInstance.open()
      } else {
        cleanup()
        reject(new Error('无法打开弹窗，组件实例获取失败'))
      }
    })
  })
}
