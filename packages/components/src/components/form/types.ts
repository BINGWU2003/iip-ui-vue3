import type { Component } from 'vue'
import type { RowProps, ColProps, FormItemProps, ButtonProps } from 'element-plus'
import type { ElForm } from 'element-plus'
import type { CSSProperties } from 'vue'
// 表单项类型
export type FormItemType = 'input' | 'number' | 'select' | 'datetime' | 'time' | 'switch' | 'custom'

// 表单项配置
export interface FormItemConfig {
  // 基础属性
  formItemProps?: Partial<FormItemProps>
  // 布局属性
  colProps?: Partial<ColProps>
  // 自定义组件
  component?: Component
  // 显示控制
  show?: boolean

  // 表单项组件属性
  componentProps: {
    // 表单类型
    type: FormItemType
    // 表单字段名
    formItemKey: string
    // 表单项组件透传的props
    itemProps?: any
    // 表单项组件的style
    style?: CSSProperties
  }
}

// 表单组件 Props
export interface FormProps {
  // 操作按钮配置
  actionsConfig?: {
    show?: boolean
    span?: number
    align?: 'left' | 'center' | 'right'
    submitText?: string
    resetText?: string
    submitProps?: Partial<ButtonProps>
    resetProps?: Partial<ButtonProps>
    showSubmit?: boolean
    showReset?: boolean
  }
  // 表单项配置
  formItems: FormItemConfig[]
  // 表单行属性el-row的属性
  rowProps?: Partial<RowProps>
  // 其他透传的属性
}

// 表单组件实例方法
export interface FormExpose {
  getFormInstance: () => InstanceType<typeof ElForm>
}
