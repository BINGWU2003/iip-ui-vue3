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

class EovaToAvueConverter {
  private readonly _fieldTypeMap: Record<string, string>

  /**
   * 构造函数
   */
  constructor() {
    this._fieldTypeMap = {
      // 基础输入组件
      文本框: 'input',
      文本域: 'textarea',
      数字框: 'number',
      自增框: 'input',
      密码框: 'password',

      // 日期时间组件
      日期框: 'date',
      时间框: 'datetime',
      时间框2: 'datetime',
      年: 'year',
      月: 'month',
      日: 'date',

      // 选择组件
      下拉框: 'select',
      单选框: 'radio',
      复选框: 'checkbox',
      布尔框: 'switch',
      查找框: 'select',
      下拉树: 'tree',
      输入选择框: 'select',

      // 媒体组件
      图片框: 'upload',
      多图框: 'upload',
      多图框2: 'upload',
      文件框: 'upload',

      // 富文本和特殊组件
      编辑框: 'ueditor',
      JSON: 'textarea',
      JSON框: 'textarea',
      图标框: 'icon',
      颜色框: 'color',
      坐标框: 'input',
      SVG: 'input'
    }
  }

  /**
   * 获取字段类型映射（只读副本）
   */
  get fieldTypeMap(): Record<string, string> {
    return { ...this._fieldTypeMap }
  }

  /**
   * 设置字段类型映射
   */
  set fieldTypeMap(fieldTypeMap: Record<string, string>) {
    Object.assign(this._fieldTypeMap, fieldTypeMap)
  }

  /**
   * 转换字段数组为表格列配置
   * @param fields Eova字段数组
   * @returns 表格列配置数组
   */
  convertColumns(fields: EovaField[]): TableColumnProps[] {
    return fields.filter(this._isValidField).map(this._convertField.bind(this))
  }

  /**
   * 检查字段是否有效
   * @param field Eova字段
   * @returns 是否有效
   */
  private _isValidField(field: EovaField): boolean {
    return Boolean(field.cn?.trim())
  }

  /**
   * 转换单个字段
   * @param field Eova字段
   * @returns 表格列属性
   */
  private _convertField(field: EovaField): TableColumnProps {
    const tableColumnProps: TableColumnProps = {
      field: field.en,
      title: field.cn
    }

    // 宽度转换
    if (!isNullOrUndefined(field.width)) {
      tableColumnProps.width = field.width
    }

    // 显示状态转换
    if (!isNullOrUndefined(field.is_show)) {
      tableColumnProps.visible = field.is_show
    }

    // 排序转换
    if (!isNullOrUndefined(field.is_order)) {
      tableColumnProps.sortable = field.is_order
    }

    return tableColumnProps
  }
}

// 导出转换工具类
export { EovaToAvueConverter }

// 导出转换工具实例
export const eovaConverter = new EovaToAvueConverter()

// 默认导出实例（向后兼容）
export default new EovaToAvueConverter()
