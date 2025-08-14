import type { VxeColumnProps, VxeTableInstance } from 'vxe-table'
import type { VxePagerProps } from 'vxe-pc-ui'
export interface TableColumn {
  /** 表格列原生属性 */
  tableColumnProps: VxeColumnProps
}
export interface seqColumnConfigProps {
  /** 是否显示序号 */
  show?: boolean
  tableColumnProps?: VxeColumnProps
}
export interface checkBoxColumnConfigProps {
  /** 是否显示复选框 */
  show?: boolean
  tableColumnProps?: VxeColumnProps
}
export interface expandColumnConfigProps {
  /** 是否显示展开列 */
  show?: boolean
  tableColumnProps?: VxeColumnProps
}
export interface radioColumnConfigProps {
  /** 是否显示单选框 */
  show?: boolean
  tableColumnProps?: VxeColumnProps
}
export interface IipTableProps {
  /** 表格列配置 */
  columns?: TableColumn[]
  /** 表格复选框列配置 */
  checkBoxColumnConfig?: checkBoxColumnConfigProps
  /** 序号列配置 */
  seqColumnConfig?: seqColumnConfigProps
  /** 展开列配置 */
  expandColumnConfig?: expandColumnConfigProps
  /** 单选框列配置 */
  radioColumnConfig?: radioColumnConfigProps
  /** 分页配置 */
  pagination?: VxePagerProps
}

export interface IipTableExpose {
  getTableInstance: () => VxeTableInstance
}
