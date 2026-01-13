import type { CSSProperties, Ref } from 'vue'
import type { VxeGridProps, VxeColumnProps } from 'vxe-table'
import type { BaseRecord } from '../../utils/types'

/** 表格行数据类型（默认类型，建议使用泛型传入具体类型） */
export type TableRowItem<T extends BaseRecord = BaseRecord> = T

/** 基础分页参数 */
type PaginationParams = {
  page: number
  pageSize: number
}

/**
 * 查询参数类型
 * @template T - 表格行数据类型，查询参数会根据此类型推导
 * @description 包含必填的分页参数 + 表格字段的可选查询参数
 * @example
 * ```ts
 * interface UserRow {
 *   id: number
 *   name: string
 *   age: number
 * }
 * // params 类型为 { page: number, pageSize: number, id?: number, name?: string, age?: number }
 * const fetchData = (params: FetchDialogSelectDataParams<UserRow>) => { ... }
 * ```
 */
export type FetchDialogSelectDataParams<T extends BaseRecord = BaseRecord> = PaginationParams &
  Partial<T>

/**
 * 查询结果类型
 * @template T - 表格行数据类型
 */
export type FetchDialogSelectDataResult<T extends BaseRecord = BaseRecord> = {
  data: T[]
  total: number
  [key: string]: any
}

export type FormItemOption = {
  label: string
  value: any
}

/** 列配置类型（从 VxeColumnProps 中提取，剔除公共字段） */
type VxeColumnItem = Omit<VxeColumnProps, 'field' | 'title'>

/** DialogSelect 选项配置（合并 columns 和 formItems） */
export type DialogSelectOption = {
  /** 字段名（公共字段） */
  field: string
  /** 标题（公共字段） */
  title: string
  /** 是否是表单项，默认为 false */
  useForm?: boolean
  /** 列配置属性（当作为表格列时使用），继承 VxeGridProps['columns'] 但剔除 field 和 title */
  columnProps?: VxeColumnItem
  /** 表单项配置属性（当作为表单项时使用） */
  formItemProps?: {
    /** 表单项类型：input（输入框）、select（下拉框）或 date（日期选择） */
    formType?: 'input' | 'select' | 'date'
    /** 占位符 */
    placeholder?: string
    /** 下拉选项（当formType为select时使用），可以是数组或返回数组的函数 */
    options?: FormItemOption[] | (() => FormItemOption[] | Promise<FormItemOption[]>)
    /** 默认值，可以是值或返回值的同步函数 */
    defaultValue?: any | (() => any)
    /** 其他属性，会透传给对应的组件 */
    [key: string]: any
  }
}

/** DialogSelect 选项配置数组 */
export type DialogSelectOptions = DialogSelectOption[]

/**
 * DialogSelect 组件 Props
 * @template T - 表格行数据类型，用于类型推导
 */
export type DialogSelectProps<T extends BaseRecord = BaseRecord> = {
  /** 绑定值，单选时为对象，多选时为对象数组 */
  modelValue?: T | T[] | null
  /** 占位符 */
  placeholder?: string
  /** 是否多选 */
  multiple?: boolean
  /** 选项值的键名 */
  valueKey?: string
  /** 选项标签的键名（用于显示在输入框中） */
  labelKey?: string
  /** 获取行的唯一标识key的函数，如果不提供则使用valueKey */
  keyGetter?: (row: T) => string | number
  /** 是否可清空 */
  clearable?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 弹窗标题 */
  dialogTitle?: string
  /** 弹窗宽度 */
  dialogWidth?: string | number
  /** 获取数据的方法 */
  fetchData: (params: FetchDialogSelectDataParams<T>) => Promise<FetchDialogSelectDataResult<T>>
  /** DialogSelect 选项配置数组（合并 columns 和 formItems） */
  dialogSelectOptions: DialogSelectOptions
  /** vxe-grid 配置，支持透传 vxe-grid 的所有 props */
  gridConfig?: VxeGridProps
  /** 输入框样式 */
  style?: CSSProperties
  /** 数据加载后是否滚动到顶部和左部，默认为 false */
  scrollToTopLeft?: boolean
  /** 多选时，已选项列表中每项的显示内容格式化函数 */
  selectedLabelFormatter?: (row: T) => string
  /** 多选时，是否显示已选项列表面板，默认为 true */
  showSelectionPanel?: boolean
  /**
   * 关闭前的回调函数
   * @param params - 参数对象
   * @param params.action - 'confirm' | 'cancel' 触发关闭的动作
   * @param params.done - 确认关闭的回调，调用后才会真正关闭
   * @param params.selectedRows - 当前已选中的数据行列表
   */
  beforeClose?: (params: {
    action: 'confirm' | 'cancel'
    done: () => void
    selectedRows: T[]
  }) => void | boolean | Promise<void>
}

/**
 * DialogSelect 组件 Emits
 * @template T - 表格行数据类型
 */
export type DialogSelectEmits<T extends BaseRecord = BaseRecord> = {
  /** 更新绑定值 */
  'update:modelValue': [value: T | T[] | null]
  /** 选择变化 */
  change: [value: T | T[] | null, selectedRows: T[]]
  /** 清空 */
  clear: []
  /** 弹窗打开/关闭 */
  'dialog-visible-change': [visible: boolean]
  /** 数据加载完成 */
  'data-loaded': [result: FetchDialogSelectDataResult<T>]
  /** 错误 */
  error: [error: any]
  /** 表单变化 */
  'form-change': [formData: Record<string, any>]
}

/**
 * DialogSelect 组件实例
 * @template T - 表格行数据类型
 */
export type DialogSelectInstance<T extends BaseRecord = BaseRecord> = {
  /** 打开弹窗 */
  open: () => void
  /** 关闭弹窗 */
  close: () => void
  /** 刷新数据 */
  refresh: () => void
  /** 加载状态 */
  loading: Readonly<Ref<boolean>>
  /** 表格数据 */
  tableData: Readonly<Ref<T[]>>
  /** 总数 */
  total: Readonly<Ref<number>>
  /** 当前页 */
  currentPage: Readonly<Ref<number>>
}

/**
 * 函数式调用 DialogSelect 的选项
 * @template T - 表格行数据类型
 */
export type OpenDialogSelectOptions<T extends BaseRecord = BaseRecord> = {
  fetchData: (params: FetchDialogSelectDataParams<T>) => Promise<FetchDialogSelectDataResult<T>>
  dialogSelectOptions: DialogSelectOptions
  multiple?: boolean
  valueKey?: string
  labelKey?: string
  keyGetter?: (row: T) => string | number
  dialogTitle?: string
  dialogWidth?: string | number
  gridConfig?: VxeGridProps
  initialValue?: T | T[] | null
  /** 弹窗关闭动画时长（ms），默认 300 */
  animationDuration?: number
  /** 数据加载后是否滚动到顶部和左部，默认为 false */
  scrollToTopLeft?: boolean
  /** 多选时，已选项列表中每项的显示内容格式化函数 */
  selectedLabelFormatter?: (row: T) => string
  /** 多选时，是否显示已选项列表面板，默认为 true */
  showSelectionPanel?: boolean
  /**
   * 关闭前的回调函数
   * @param params - 参数对象
   * @param params.action - 'confirm' | 'cancel' 触发关闭的动作
   * @param params.done - 确认关闭的回调，调用后才会真正关闭
   * @param params.selectedRows - 当前已选中的数据行列表
   */
  beforeClose?: (params: {
    action: 'confirm' | 'cancel'
    done: () => void
    selectedRows: T[]
  }) => void | boolean | Promise<void>
}
