import type { CSSProperties, Ref } from 'vue'
import { ElSelect } from 'element-plus'
import type { BaseRecord } from '../../utils/types'

export type OptionItem<T extends BaseRecord = BaseRecord> = T & {
  disabled?: boolean
}

/** 基础分页参数 */
export type PaginationParams = {
  page: number
  pageSize: number
}

/**
 * 查询参数类型（支持泛型推导）
 * @template T - 选项数据类型，查询参数会根据此类型推导
 * @description 包含必填的分页参数 + keyword + 选项字段的可选查询参数
 * @example
 * ```ts
 * interface UserOption {
 *   id: number
 *   name: string
 *   department: string
 * }
 * // params 类型为 { page: number, pageSize: number, keyword: string, id?: number, name?: string, department?: string }
 * const fetchData = (params: FetchDataParams<UserOption>) => { ... }
 * ```
 */
export type FetchDataParams<T extends BaseRecord = BaseRecord> = PaginationParams & {
  keyword: string
} & Partial<T>

/**
 * 查询结果类型（支持泛型）
 * @template T - 选项数据类型
 */
export type FetchDataResult<T extends BaseRecord = BaseRecord> = {
  data: OptionItem<T>[]
  total: number
  [key: string]: any
}

/**
 * PaginationSelect 组件 Props（支持泛型）
 * @template T - 选项数据类型，用于类型推导
 */
export type PaginationSelectProps<T extends BaseRecord = BaseRecord> = {
  /** 绑定值，对象形式，属性名由 valueKey 和 labelKey 决定 */
  modelValue?: T | T[] | null
  /** 占位符 */
  placeholder?: string
  /** 选项值的键名 */
  valueKey?: string
  /** 选项标签的键名 */
  labelKey?: string
  /** 每页显示条数 */
  pageSize?: number
  /** 是否可清空 */
  clearable?: boolean
  /** 是否显示分页器 */
  showPagination?: boolean
  /** 下拉框类名 */
  popperClass?: string
  /** 搜索防抖时间(ms) */
  debounceTime?: number
  /** 获取数据的方法 */
  fetchData: (params: FetchDataParams<T>) => Promise<FetchDataResult<T>>
  /** Style样式 */
  style?: CSSProperties
  /** 是否多选 */
  multiple?: boolean
}

/**
 * PaginationSelect 组件 Emits（支持泛型）
 * @template T - 选项数据类型
 */
export type PaginationSelectEmits<T extends BaseRecord = BaseRecord> = {
  /** 更新绑定值，返回对象形式，属性名由 valueKey 和 labelKey 决定；多选模式下返回数组 */
  'update:modelValue': [value: T | T[] | null]
  /** 选择变化；多选模式下 value 为数组，option 为选中项数组 */
  change: [value: T | T[] | null, option?: OptionItem<T> | OptionItem<T>[]]
  /** 清空 */
  clear: []
  /** 下拉框显示/隐藏 */
  'visible-change': [visible: boolean]
  /** 数据加载完成 */
  'data-loaded': [result: FetchDataResult<T>]
  /** 错误 */
  error: [error: any]
}
export type ElSelectInstanceType = InstanceType<typeof ElSelect>

/**
 * PaginationSelect 组件实例（支持泛型）
 * @template T - 选项数据类型
 */
export type PaginationSelectInstance<T extends BaseRecord = BaseRecord> = ElSelectInstanceType & {
  /** 刷新数据 */
  refresh: () => void
  /** 搜索 */
  search: (keyword: string) => void
  /** 加载状态 */
  loading: Readonly<Ref<boolean>>
  /** 选项列表 */
  options: Readonly<Ref<OptionItem<T>[]>>
  /** 总数 */
  total: Readonly<Ref<number>>
  /** 当前页 */
  currentPage: Readonly<Ref<number>>
}

export type PaginationSelectSlots = ElSelectInstanceType['$slots']
