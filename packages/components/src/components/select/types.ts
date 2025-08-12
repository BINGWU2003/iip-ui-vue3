import type { SelectProps } from 'element-plus'

export interface SelectOption {
  /** 选项的值 */
  value: string | number
  /** 选项的标签 */
  label: string
  /** 是否禁用该选项 */
  disabled?: boolean
  /** 选项的分组 */
  group?: string
  /** 额外数据 */
  [key: string]: any
}

export interface IipSelectProps extends Partial<SelectProps> {
  /** 选项数据 */
  options?: SelectOption[]
  /** 是否显示全选选项（仅多选模式） */
  showSelectAll?: boolean
  /** 全选选项的文本 */
  selectAllText?: string
  /** 是否可搜索 */
  filterable?: boolean
  /** 是否远程搜索 */
  remote?: boolean
  /** 远程搜索方法 */
  remoteMethod?: (query: string) => Promise<SelectOption[]> | SelectOption[]
  /** 搜索防抖延迟时间（毫秒） */
  searchDebounce?: number
  /** 是否在选择后清空搜索关键词 */
  clearSearchOnSelect?: boolean
  /** 空数据时的文本 */
  emptyText?: string
  /** 加载中的文本 */
  loadingText?: string
  /** 是否显示选项数量统计 */
  showCount?: boolean
  /** 占位符文本 */
  placeholder?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否多选 */
  multiple?: boolean
  /** 是否可清空 */
  clearable?: boolean
  /** 选择器尺寸 */
  size?: 'large' | 'default' | 'small'
  /** 最多显示多少个标签（多选模式） */
  maxCollapseTags?: number
}

export interface IipSelectEmits {
  /** 选中值变化时触发 */
  (e: 'update:modelValue', value: any): void
  /** 选择选项时触发 */
  (e: 'change', value: any): void
  /** 下拉框出现/隐藏时触发 */
  (e: 'visible-change', visible: boolean): void
  /** 清空选项时触发 */
  (e: 'clear'): void
  /** 移除标签时触发（多选模式） */
  (e: 'remove-tag', value: any): void
  /** 搜索关键词变化时触发 */
  (e: 'search', query: string): void
  /** 全选/取消全选时触发 */
  (e: 'select-all', selected: boolean): void
}

export interface IipSelectExpose {
  /** 聚焦选择器 */
  focus: () => void
  /** 失焦选择器 */
  blur: () => void
  /** 清空选择 */
  clear: () => void
  /** 获取选中的选项数据 */
  getSelectedOptions: () => SelectOption[]
  /** 设置选项数据 */
  setOptions: (options: SelectOption[]) => void
}
