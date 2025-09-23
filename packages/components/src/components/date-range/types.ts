// DateRange 组件的类型定义
import type { DatePickerProps, ElDatePicker } from 'element-plus'
import type { Prefixed } from '../../utils/types'
import type { CSSProperties } from 'vue'
export type DateRangeProps = {
  modelValue: { startTime: string; endTime: string }
  gap?: number | string
  startProps?: Partial<DatePickerProps>
  endProps?: Partial<DatePickerProps>
  selectFutureTime?: boolean
  startPickerCss?: CSSProperties
  endPickerCss?: CSSProperties
}

export type DateRangeEmits = {
  'update:modelValue': [value: { startTime: string; endTime: string }]
  change: [value: { startTime: string; endTime: string }]
}
export type DatePickerSlots = InstanceType<typeof ElDatePicker>['$slots']
export type DatePickerSlotsKeys = keyof DatePickerSlots
export type DateRangeSlotsKeys = 'start' | 'end'
export type DateRangeSlots = Prefixed<DatePickerSlots, DateRangeSlotsKeys>
