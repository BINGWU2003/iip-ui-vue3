import { h, render, type VNode, nextTick } from 'vue'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import DialogSelect from './dialog-select.vue'
import type {
  TableRowItem,
  FetchDialogSelectDataParams,
  FetchDialogSelectDataResult,
  DialogSelectOptions
} from './types'

export interface OpenDialogSelectOptions {
  fetchData: (params: FetchDialogSelectDataParams) => Promise<FetchDialogSelectDataResult>
  dialogSelectOptions: DialogSelectOptions
  multiple?: boolean
  valueKey?: string
  labelKey?: string
  keyGetter?: (row: TableRowItem) => string | number
  dialogTitle?: string
  dialogWidth?: string | number
  gridConfig?: any
  initialValue?: TableRowItem | TableRowItem[] | null
}

export function openDialogSelect(
  options: OpenDialogSelectOptions
): Promise<TableRowItem | TableRowItem[] | null> {
  return new Promise((resolve, reject) => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    let vnode: VNode | null = null
    let currentValue: TableRowItem | TableRowItem[] | null = options.initialValue || null

    const cleanup = () => {
      if (vnode) {
        render(null, container)
        vnode = null
      }
      setTimeout(() => {
        if (container.parentNode) {
          document.body.removeChild(container)
        }
      }, 300) // 等待动画完成
    }

    const handleChange = (value: TableRowItem | TableRowItem[] | null) => {
      currentValue = value
    }

    const handleDialogVisibleChange = (visible: boolean) => {
      if (!visible) {
        // 弹窗关闭时，如果没有确认，则取消
        cleanup()
        reject(new Error('用户取消选择'))
      }
    }

    vnode = h(
      ElConfigProvider,
      { locale: zhCn },
      {
        default: () =>
          h('div', { style: 'display: none;' }, [
            h(DialogSelect, {
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
              'onUpdate:modelValue': handleChange,
              onChange: (value: any) => {
                currentValue = value
                // 如果弹窗还在显示，说明是确认操作
                // 需要等待弹窗关闭动画完成
                setTimeout(() => {
                  cleanup()
                  resolve(value)
                }, 300)
              },
              'onDialog-visible-change': handleDialogVisibleChange
            })
          ])
      }
    )

    render(vnode, container)

    // 手动触发打开弹窗
    nextTick(() => {
      const instance =
        (vnode as any)?.component?.exposed || (vnode as any)?.children?.[0]?.component?.exposed
      if (instance?.open) {
        instance.open()
      }
    })
  })
}
