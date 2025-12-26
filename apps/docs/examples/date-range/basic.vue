<template>
  <div>
    <iip-date-range v-model="dateRange" @change="handleDateChange" />
    <p style="margin-top: 12px; color: #606266">
      选择的日期范围：{{ dateRange.startTime }} ~ {{ dateRange.endTime }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const dateRange = ref({
  startTime: '',
  endTime: ''
})

const handleDateChange = (value: { startTime: string; endTime: string }) => {
  console.log('日期范围变化:', value)

  console.log(dateRange)
}
</script>
