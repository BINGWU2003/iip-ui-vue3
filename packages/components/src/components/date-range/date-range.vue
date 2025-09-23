<template>
  <div :style="{ display: 'flex', alignItems: 'center', gap: (gap || 10) + 'px' }">
    <el-date-picker
      placeholder="开始日期"
      format="YYYY-MM-DD"
      value-format="YYYY-MM-DD"
      v-bind="startProps"
      v-model="formData.startTime"
      type="date"
      :shortcuts="shortcuts"
      :style="getStartPickerCss"
      @change="handleStartTimeChange"
      :disabled-date="(date: Date) => isDisabledDate(date, 'start')"
    >
      <template v-for="slot in getSlots($slots, 'start')" :key="`start-${slot}`" #[slot]="slotData">
        <slot :name="`start-${slot}`" v-bind="slotData"></slot>
      </template>
    </el-date-picker>
    <el-date-picker
      placeholder="结束日期"
      format="YYYY-MM-DD"
      value-format="YYYY-MM-DD"
      v-bind="endProps"
      v-model="formData.endTime"
      @change="handleEndTimeChange"
      type="date"
      :style="getEndPickerCss"
      :disabled-date="(date: Date) => isDisabledDate(date, 'end')"
    >
      <template v-for="slot in getSlots($slots, 'end')" :key="`end-${slot}`" #[slot]="slotData">
        <slot :name="`end-${slot}`" v-bind="slotData"></slot>
      </template>
    </el-date-picker>
  </div>
</template>

<script setup lang="ts">
import type { DateRangeProps, DateRangeEmits, DateRangeSlots, DateRangeSlotsKeys } from './types'
import { splitSlots } from '../../utils/tools'
import { reactive, computed, watch, toRefs, withDefaults } from 'vue'
import dayjs from 'dayjs'
interface dateKey {
  yesterday: string
  thisWeek: string
  thisMonth: string
  lastMonth: string
  thisYear: string
}
defineOptions({
  name: 'IipDateRange'
})
defineSlots<DateRangeSlots>()
const props = withDefaults(defineProps<DateRangeProps>(), {
  modelValue: () => ({ startTime: '', endTime: '' }),
  gap: 10,
  startProps: () => ({}),
  endProps: () => ({}),
  selectFutureTime: false,
  startPickerCss: () => ({}),
  endPickerCss: () => ({})
})
const { modelValue, gap, startProps, endProps, selectFutureTime, startPickerCss, endPickerCss } =
  toRefs(props)
const emits = defineEmits<DateRangeEmits>()

const formData = reactive<{
  startTime: string
  endTime: string
}>({
  startTime: '',
  endTime: ''
})
const shortcuts = computed(() => {
  return [
    { text: '今天', value: () => dayjs() },
    { text: '昨天', value: () => handleFormatDate('yesterday')[0] },
    { text: '本周', value: () => handleFormatDate('thisWeek')[0] },
    { text: '本月', value: () => handleFormatDate('thisMonth')[0] },
    { text: '上月', value: () => handleFormatDate('lastMonth')[0] },
    { text: '本年', value: () => handleFormatDate('thisYear')[0] }
  ]
})
const getStartPickerCss = computed(() => {
  return {
    width: '150px',
    ...startPickerCss.value
  }
})
const getEndPickerCss = computed(() => {
  return {
    width: '150px',
    ...endPickerCss.value
  }
})
const emitEvent = () => {
  emits('update:modelValue', { ...formData })
  emits('change', { ...formData })
}

const handleStartTimeChange = () => {
  if (formData.startTime) {
    if (!formData.endTime || dayjs(formData.startTime).isSame(dayjs(), 'day')) {
      formData.endTime = dayjs().format('YYYY-MM-DD')
    }
  }
  emitEvent()
}

const handleEndTimeChange = () => {
  emitEvent()
}

const handleFormatDate = (dateKey: keyof dateKey) => {
  const dateMap = {
    yesterday: [dayjs().subtract(1, 'day').startOf('day'), dayjs().subtract(1, 'day').endOf('day')],
    thisWeek: [dayjs().startOf('week'), dayjs()],
    thisMonth: [dayjs().startOf('month'), dayjs().endOf('month')],
    lastMonth: [
      dayjs().subtract(1, 'month').startOf('month'),
      dayjs().subtract(1, 'month').endOf('month')
    ],
    thisYear: [dayjs().startOf('year'), dayjs()]
  }
  const date = dateMap[dateKey].map(item => item.format('YYYY-MM-DD'))
  formData.endTime = date[1]
  return date
}

const isDisabledDate = (date: Date, action: 'start' | 'end') => {
  const today = dayjs().endOf('day')
  const currentDate = dayjs(date)
  // 禁止选择未来日期
  if (currentDate.isAfter(today) && !selectFutureTime.value) return true
  // 开始时间不能晚于结束时间
  if (action === 'start' && formData.endTime) {
    const endDate = dayjs(formData.endTime)
    if (currentDate.isAfter(endDate)) return true
  }
  // 结束时间不能早于开始时间
  if (action === 'end' && formData.startTime) {
    const startDate = dayjs(formData.startTime)
    if (currentDate.isBefore(startDate)) return true
  }
  return false
}
const getSlots = (slots: DateRangeSlots, prefix: DateRangeSlotsKeys) => {
  return splitSlots(slots, prefix)
}
watch(
  () => modelValue,
  newValue => {
    formData.startTime = newValue.value.startTime
    formData.endTime = newValue.value.endTime
  },
  {
    deep: true,
    immediate: true
  }
)
</script>
