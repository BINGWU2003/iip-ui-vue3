import type { InputProps } from 'element-plus'

export type ValidateRule = 'email' | 'phone' | 'idCard' | 'url' | 'number' | 'integer' | 'positive'

export interface IipInputProps extends Partial<InputProps> {
  /** 是否显示清空按钮 */
  clearable?: boolean
  /** 是否显示字符计数 */
  showWordLimit?: boolean
  /** 最大字符数 */
  maxlength?: number | string
  /** 输入防抖延迟时间（毫秒） */
  debounceDelay?: number
  /** 内置验证规则 */
  validateRule?: ValidateRule
  /** 自定义验证函数 */
  validator?: (value: string) => boolean | string
  /** 是否在粘贴时自动去除首尾空格 */
  trimOnPaste?: boolean
  /** 是否在失焦时自动去除首尾空格 */
  trimOnBlur?: boolean
  /** 占位符文本 */
  placeholder?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只读 */
  readonly?: boolean
  /** 输入框尺寸 */
  size?: 'large' | 'default' | 'small'
  /** 输入框类型 */
  type?: 'text' | 'textarea' | 'password' | 'number'
}

export interface IipInputEmits {
  /** 输入值变化时触发 */
  (e: 'update:modelValue', value: string): void
  /** 输入时触发（防抖后） */
  (e: 'input', value: string): void
  /** 失焦时触发 */
  (e: 'blur', event: FocusEvent): void
  /** 聚焦时触发 */
  (e: 'focus', event: FocusEvent): void
  /** 按下回车时触发 */
  (e: 'enter', value: string): void
  /** 清空时触发 */
  (e: 'clear'): void
  /** 验证状态变化时触发 */
  (e: 'validate', isValid: boolean, message?: string): void
}

export interface IipInputExpose {
  /** 聚焦输入框 */
  focus: () => void
  /** 失焦输入框 */
  blur: () => void
  /** 选中输入框内容 */
  select: () => void
  /** 清空输入框 */
  clear: () => void
  /** 手动触发验证 */
  validate: () => boolean
}
