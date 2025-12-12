import type { CSSProperties, Ref } from 'vue'
import type { VxeGridProps } from 'vxe-table'

export type TableRowItem = {
  [key: string]: any
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

export type FormItemOption = {
  label: string
  value: any
}

export type FormItem = {
  /** 字段名 */
  field: string
  /** 标签 */
  label: string
  /** 表单项类型：input（输入框）、select（下拉框）或 date（日期选择） */
  type: 'input' | 'select' | 'date'
  /** 占位符 */
  placeholder?: string
  /** 下拉选项（当type为select时使用），可以是数组或返回数组的函数 */
  options?: FormItemOption[] | (() => FormItemOption[] | Promise<FormItemOption[]>)
  /** 默认值，可以是值或返回值的同步函数 */
  defaultValue?: any | (() => any)
  /** 其他属性，会透传给对应的组件 */
  props?: Record<string, any>
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
  /** 获取行的唯一标识key的函数，如果不提供则使用valueKey */
  keyGetter?: (row: TableRowItem) => string | number
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
  /** 表单配置（用于筛选） */
  formItems?: FormItem[]
  /** vxe-grid 配置，支持透传 vxe-grid 的所有 props */
  gridConfig?: VxeGridProps
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
  /** 表单变化 */
  'form-change': [formData: Record<string, any>]
}

export type DialogSelectInstance = {
  /** 打开弹窗 */
  open: () => void
  /** 关闭弹窗 */
  close: () => void
  /** 刷新数据 */
  refresh: () => void
  /** 加载状态 */
  loading: Readonly<Ref<boolean>>
  /** 表格数据 */
  tableData: Readonly<Ref<TableRowItem[]>>
  /** 总数 */
  total: Readonly<Ref<number>>
  /** 当前页 */
  currentPage: Readonly<Ref<number>>
}
