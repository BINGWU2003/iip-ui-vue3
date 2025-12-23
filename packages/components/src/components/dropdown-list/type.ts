import { ElDropdown, ElDropdownItem } from 'element-plus'

export type DropdownListItemType = Partial<InstanceType<typeof ElDropdownItem>['$props']> & {
  /**
   * 是否显示该菜单项
   * - undefined: 默认显示
   * - boolean: 直接控制显示/隐藏
   */
  show?: boolean
  /**
   * 菜单项内容
   */
  content?: string
}

export type DropdownListProps = {
  /**
   * 下拉列表配置数组
   */
  dropdownList: DropdownListItemType[]
  /**
   * 下拉框属性，透传 ElDropdown 的所有 props
   */
  dropdownProps?: Partial<InstanceType<typeof ElDropdown>['$props']>
}

export type DropdownListSlots = InstanceType<typeof ElDropdown>['$slots']

export type DropdownListInstance = InstanceType<typeof ElDropdown>
