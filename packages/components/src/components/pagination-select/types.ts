import type { CSSProperties, Ref } from 'vue'
import { ElSelect } from 'element-plus'
import type { BaseRecord } from '../../utils/types'

export type OptionItem<T extends BaseRecord = BaseRecord> = T & {
  disabled?: boolean
}

export type FetchDataParams = {
  page: number
  pageSize: number
  keyword: string
}

export type FetchDataResult = {
  data: OptionItem[]
  total: number
  [key: string]: any
}

export type PaginationSelectProps = {
  /** 绑定值，对象形式，属性名由 valueKey 和 labelKey 决定 */
  modelValue?: Record<string, any> | Record<string, any>[] | null
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
  fetchData: (params: FetchDataParams) => Promise<FetchDataResult>
  /** Style样式 */
  style?: CSSProperties
  /** 是否多选 */
  multiple?: boolean
}

export type PaginationSelectEmits = {
  /** 更新绑定值，返回对象形式，属性名由 valueKey 和 labelKey 决定；多选模式下返回数组 */
  'update:modelValue': [value: Record<string, any> | Record<string, any>[] | null]
  /** 选择变化；多选模式下 value 为数组，option 为选中项数组 */
  change: [
    value: Record<string, any> | Record<string, any>[] | null,
    option?: OptionItem | OptionItem[]
  ]
  /** 清空 */
  clear: []
  /** 下拉框显示/隐藏 */
  'visible-change': [visible: boolean]
  /** 数据加载完成 */
  'data-loaded': [result: FetchDataResult]
  /** 错误 */
  error: [error: any]
}
export type ElSelectInstanceType = InstanceType<typeof ElSelect>
export type PaginationSelectInstance = ElSelectInstanceType & {
  /** 刷新数据 */
  refresh: () => void
  /** 搜索 */
  search: (keyword: string) => void
  /** 加载状态 */
  loading: Readonly<Ref<boolean>>
  /** 选项列表 */
  options: Readonly<Ref<OptionItem[]>>
  /** 总数 */
  total: Readonly<Ref<number>>
  /** 当前页 */
  currentPage: Readonly<Ref<number>>
}

export type PaginationSelectSlots = ElSelectInstanceType['$slots']
