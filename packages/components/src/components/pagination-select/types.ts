import type { CSSProperties, Ref } from 'vue'
import { ElSelect } from 'element-plus'
export type OptionItem = {
  [key: string]: any
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
  /** 绑定值 */
  modelValue?: any
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
  /** 直接显示的标签文本 */
  displayLabel: string
  /** 是否为查看模式 */
  viewMode?: boolean
  /** Style样式 */
  style?: CSSProperties
}

export type PaginationSelectEmits = {
  /** 更新绑定值 */
  'update:modelValue': [value: any]
  /** 选择变化 */
  change: [value: any, option?: OptionItem]
  /** 清空 */
  clear: []
  /** 下拉框显示/隐藏 */
  'visible-change': [visible: boolean]
  /** 数据加载完成 */
  'data-loaded': [result: FetchDataResult]
  /** 错误 */
  error: [error: any]
}

export type PaginationSelectInstance = {
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
  /** 获取Select组件实例 */
  getSelectInstance: () => InstanceType<typeof ElSelect>
}

export type PaginationSelectSlots = InstanceType<typeof ElSelect>['$slots']
