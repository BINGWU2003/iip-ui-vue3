// DateRange 组件的类型定义
import type { DatePickerProps } from 'element-plus'
import type { CSSProperties } from 'vue'
export interface DateRangeProps {
  modelValue: { startTime: string; endTime: string }
  gap?: number | string
  startProps?: Partial<DatePickerProps>
  endProps?: Partial<DatePickerProps>
  selectFutureTime?: boolean
  startPickerCss?: CSSProperties
  endPickerCss?: CSSProperties
}

export interface DateRangeEmits {
  'update:modelValue': [value: { startTime: string; endTime: string }]
  change: [value: { startTime: string; endTime: string }]
}
