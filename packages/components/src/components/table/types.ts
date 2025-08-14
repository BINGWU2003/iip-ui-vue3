import type { VxeColumnProps, VxeTableInstance } from 'vxe-table'
import type { VxePagerProps } from 'vxe-pc-ui'
export interface TableColumn {
  /** 表格列原生属性 */
  tableColumnProps: VxeColumnProps
  /** 自定义插槽名称 */
  slotName?: string
}
export interface checkBoxColumnConfigProps {
  /** 是否显示复选框 */
  show?: boolean
  tableColumnProps?: TableColumn
}
export interface IipTableProps {
  /** 表格列配置 */
  columns?: TableColumn[]
  /** 表格复选框列配置 */
  checkBoxColumnConfig?: checkBoxColumnConfigProps
  /** 分页配置 */
  pagination?: VxePagerProps
}

export interface IipTableExpose {
  getTableInstance: () => VxeTableInstance
}
