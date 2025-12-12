import type { CSSProperties } from 'vue'
import type { ElInput } from 'element-plus'
import type { VxeGridProps, VxeGridInstance } from 'vxe-table'

export type TableRowItem = {
  [key: string]: any
  disabled?: boolean
}

export type FetchDialogSelectDataParams = {
  page: number
  pageSize: number
  [key: string]: any // 支持其他查询参数
}

export type FetchDialogSelectDataResult = {
  data: TableRowItem[]
  total: number
  [key: string]: any
}

export type DialogSelectProps = {
  /** 绑定值，单选时为对象，多选时为对象数组 */
  modelValue?: TableRowItem | TableRowItem[] | null
  /** 占位符 */
  placeholder?: string
  /** 是否多选 */
  multiple?: boolean
  /** 选项值的键名 */
  valueKey?: string
  /** 选项标签的键名（用于显示在输入框中） */
  labelKey?: string
  /** 是否可清空 */
  clearable?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 弹窗标题 */
  dialogTitle?: string
  /** 弹窗宽度 */
  dialogWidth?: string | number
  /** 获取数据的方法 */
  fetchData: (params: FetchDialogSelectDataParams) => Promise<FetchDialogSelectDataResult>
  /** 表格列配置（vxe-grid的columns配置） */
  columns: VxeGridProps['columns']
  /** 表单配置（vxe-grid的form-config配置，用于筛选） */
  formConfig?: VxeGridProps['formConfig']
  /** 输入框样式 */
  style?: CSSProperties
}

export type DialogSelectEmits = {
  /** 更新绑定值 */
  'update:modelValue': [value: TableRowItem | TableRowItem[] | null]
  /** 选择变化 */
  change: [value: TableRowItem | TableRowItem[] | null, selectedRows: TableRowItem[]]
  /** 清空 */
  clear: []
  /** 弹窗打开/关闭 */
  'dialog-visible-change': [visible: boolean]
  /** 数据加载完成 */
  'data-loaded': [result: FetchDialogSelectDataResult]
  /** 错误 */
  error: [error: any]
}

export type DialogSelectInstance = {
  /** 打开弹窗 */
  open: () => void
  /** 关闭弹窗 */
  close: () => void
  /** 刷新数据 */
  refresh: () => void
  /** 获取表格实例 */
  getGridInstance: () => VxeGridInstance | null
  /** 获取输入框实例 */
  getInputInstance: () => InstanceType<typeof ElInput> | null
}
