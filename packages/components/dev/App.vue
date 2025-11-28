<template>
  <div class="app-container">
    <h1>IIP UI Components - DateRange 示例</h1>

    <div class="demo-section">
      <h2>基础用法</h2>
      <IipDateRange v-model="dateRange1" @change="handleChange1" />
      <div class="result">
        <p>选择的日期范围：</p>
        <pre>{{ JSON.stringify(dateRange1, null, 2) }}</pre>
      </div>
    </div>

    <div class="demo-section">
      <h2>允许选择未来时间</h2>
      <IipDateRange v-model="dateRange2" :select-future-time="true" @change="handleChange2" />
      <div class="result">
        <p>选择的日期范围：</p>
        <pre>{{ JSON.stringify(dateRange2, null, 2) }}</pre>
      </div>
    </div>

    <div class="demo-section">
      <h2>自定义样式</h2>
      <IipDateRange
        v-model="dateRange3"
        :gap="20"
        :start-picker-css="{ width: '200px' }"
        :end-picker-css="{ width: '200px' }"
        @change="handleChange3"
      />
      <div class="result">
        <p>选择的日期范围：</p>
        <pre>{{ JSON.stringify(dateRange3, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IipDateRange } from '../src/components/date-range'

const dateRange1 = ref({ startTime: '', endTime: '' })
const dateRange2 = ref({ startTime: '', endTime: '' })
const dateRange3 = ref({ startTime: '', endTime: '' })

const handleChange1 = (value: any) => {
  console.log('dateRange1 changed:', value)
}

const handleChange2 = (value: any) => {
  console.log('dateRange2 changed:', value)
}

const handleChange3 = (value: any) => {
  console.log('dateRange3 changed:', value)
}
</script>

<style scoped>
.app-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: #333;
  margin-bottom: 30px;
}

h2 {
  color: #666;
  font-size: 18px;
  margin-bottom: 15px;
}

.demo-section {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fafafa;
}

.result {
  margin-top: 20px;
  padding: 15px;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

.result p {
  margin: 0 0 10px 0;
  font-weight: 600;
  color: #333;
}

.result pre {
  margin: 0;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 14px;
  color: #666;
}
</style>
