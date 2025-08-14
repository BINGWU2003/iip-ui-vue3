import { isNullOrUndefined } from './types'

/**
 * eova字段类型
 */
interface EovaField {
  add_status: number
  cn: string
  config: null
  defaulter: string
  en: string
  fieldnum: number
  fieldset: string
  formatter: null
  height: number
  id: number
  is_add: boolean
  is_auto: boolean
  is_br: boolean
  is_disable: boolean
  is_edit: boolean
  is_fixed: boolean
  is_multiple: boolean
  is_order: boolean
  is_query: boolean
  is_required: boolean
  is_show: boolean
  is_update: boolean
  object_code: string
  order_num: number
  placeholder: null
  space: number
  type: string
  update_status: number
  validator: null
  width: number
}
type TableColumnProps = {
  title?: string
  field?: string
  width?: number
  visible?: boolean
  fixed?: 'left' | 'right'
  sortable?: boolean
}
type TableProps = {
  showAddButton?: boolean
  showEditButton?: boolean
  showDeleteButton?: boolean
  showViewButton?: boolean
}
type CheckBoxColumnConfig = {
  show?: boolean
  tableColumnProps?: TableColumnProps
}

class EovaToAvueConverter {
  /**
   * 构造函数
   */
  constructor() {
    this.fieldTypeMap = {
      文本框: 'input',
      文本域: 'textarea',
      数字框: 'number',
      日期框: 'date',
      时间框: 'datetime',
      时间框2: 'datetime',
      下拉框: 'select',
      单选框: 'radio',
      复选框: 'checkbox',
      布尔框: 'switch',
      图片框: 'upload',
      多图框: 'upload',
      多图框2: 'upload',
      编辑框: 'ueditor',
      查找框: 'select',
      下拉树: 'tree',
      年: 'year',
      月: 'month',
      日: 'date',
      // 根据meta.md补充的映射关系
      JSON: 'textarea',
      文件框: 'upload',
      图标框: 'icon',
      自增框: 'input',
      密码框: 'password',
      颜色框: 'color',
      坐标框: 'input',
      SVG: 'input',
      输入选择框: 'select',
      JSON框: 'textarea'
    }
  }

  get fieldTypeMap() {
    return this.fieldTypeMap
  }
  set fieldTypeMap(fieldTypeMap: Record<string, string>) {
    this.fieldTypeMap = fieldTypeMap
  }

  convertColumns(fields: EovaField[]) {
    // 过滤掉cn为空字符的字段
    return fields
      .filter(field => field.cn && field.cn.trim() !== '')
      .map(field => {
        const tableColumnProps: TableColumnProps = {}
        // 列字段转换
        tableColumnProps.field = field.en
        tableColumnProps.title = field.cn
        // 宽度转换
        if (!isNullOrUndefined(field.width)) {
          tableColumnProps.width = field.width
        }
        // 根据meta.md，如果is_show为false，则不在列表显示
        if (!isNullOrUndefined(field.is_show)) {
          tableColumnProps.visible = field.is_show
        }
        // 可排序转换
        if (!isNullOrUndefined(field.is_order)) {
          tableColumnProps.sortable = field.is_order
        }

        return tableColumnProps
      })
  }
}

// 导出转换工具
export default new EovaToAvueConverter()
