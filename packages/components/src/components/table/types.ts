import type { VxeColumnProps } from 'vxe-table'

export interface TableColumn extends Partial<VxeColumnProps> {
  /** 列标识 */
  field: string
  /** 列标题 */
  title: string
  /** 列宽度 */
  width?: number | string
  /** 最小宽度 */
  minWidth?: number | string
  /** 是否可排序 */
  sortable?: boolean
  /** 是否可筛选 */
  filterable?: boolean
  /** 列对齐方式 */
  align?: 'left' | 'center' | 'right'
  /** 是否固定列 */
  fixed?: 'left' | 'right'
  /** 自定义渲染函数 */
  formatter?: (params: any) => string | number
  /** 插槽名称 */
  slotName?: string
}

export interface IipTableProps {
  /** 表格数据 */
  data?: any[]
  /** 表格列配置 */
  columns?: TableColumn[]
  /** 表格高度 */
  height?: number | string
  /** 最大高度 */
  maxHeight?: number | string
  /** 是否显示边框 */
  border?: boolean
  /** 是否显示斑马纹 */
  stripe?: boolean
  /** 是否显示表头 */
  showHeader?: boolean
  /** 是否显示复选框 */
  showCheckbox?: boolean
  /** 是否显示序号 */
  showSeq?: boolean
  /** 是否可调整列宽 */
  resizable?: boolean
  /** 加载状态 */
  loading?: boolean
  /** 空数据提示文本 */
  emptyText?: string
  /** 行键名 */
  rowKey?: string
  /** 表格尺寸 */
  size?: 'mini' | 'small' | 'medium'
  /** 是否自适应父容器 */
  autoResize?: boolean
  /** 分页配置 */
  pagination?: {
    /** 当前页码 */
    currentPage: number
    /** 每页条数 */
    pageSize: number
    /** 总条数 */
    total: number
    /** 每页条数选项 */
    pageSizes?: number[]
    /** 是否显示总条数 */
    showTotal?: boolean
    /** 是否显示每页条数选择器 */
    showSizes?: boolean
    /** 是否显示跳转页面 */
    showJumper?: boolean
  }
}

export interface IipTableEmits {
  /** 行点击事件 */
  (e: 'row-click', params: { row: any; rowIndex: number; $event: Event }): void
  /** 行双击事件 */
  (e: 'row-dblclick', params: { row: any; rowIndex: number; $event: Event }): void
  /** 复选框变化事件 */
  (e: 'checkbox-change', params: { checked: boolean; row: any; rowIndex: number }): void
  /** 全选变化事件 */
  (e: 'checkbox-all', params: { checked: boolean; records: any[] }): void
  /** 排序变化事件 */
  (e: 'sort-change', params: { column: any; field: string; order: string }): void
  /** 筛选变化事件 */
  (e: 'filter-change', params: { column: any; field: string; values: any[] }): void
  /** 分页变化事件 */
  (e: 'page-change', params: { currentPage: number; pageSize: number }): void
  /** 每页条数变化事件 */
  (e: 'page-size-change', params: { pageSize: number }): void
}

export interface IipTableExpose {
  /** 获取表格实例 */
  getTableInstance: () => any
  /** 获取选中的行数据 */
  getCheckboxRecords: () => any[]
  /** 设置选中的行 */
  setCheckboxRow: (rows: any[], checked: boolean) => void
  /** 设置全选状态 */
  setAllCheckboxRow: (checked: boolean) => void
  /** 清空选中状态 */
  clearCheckboxRow: () => void
  /** 刷新表格 */
  refresh: () => void
  /** 重新计算表格 */
  recalculate: () => void
}
