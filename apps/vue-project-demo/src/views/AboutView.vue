<template>
  <div id="app">
    <div class="dev-container">
      <h1>IIP UI Vue3 组件开发预览 App Vue</h1>

      <!-- 基础测试 -->
      <div class="demo-section">
        <h2>基础测试</h2>
        <el-button type="primary" @click="showMessage">测试 Element Plus</el-button>
        <p class="info">如果看到这个页面，说明开发环境配置成功！</p>
      </div>

      <!-- DateRange 组件预览 -->
      <div class="demo-section">
        <h2>DateRange 日期范围组件</h2>

        <!-- 基础日期范围选择器 -->
        <div class="demo-item">
          <h3>基础日期范围选择器</h3>
          <iip-date-range v-model="dateRangeModel" @change="handleDateRangeChange" />
          <div class="form-data-display">
            <h4>选中的日期范围：</h4>
            <pre>{{ JSON.stringify(dateRangeModel, null, 2) }}</pre>
          </div>
        </div>

        <!-- 自定义配置的日期范围选择器 -->
        <div class="demo-item">
          <h3>自定义配置的日期范围选择器</h3>
          <iip-date-range
            v-model="dateRangeModel2"
            :gap="20"
            :select-future-time="true"
            :start-props="{
              placeholder: '选择开始日期',
            }"
            :startPickerCss="{ width: '280px' }"
            :end-props="{
              placeholder: '选择结束日期',
            }"
            :endPickerCss="{ width: '280px' }"
            @change="handleDateRangeChange2"
          />
          <div class="form-data-display">
            <h4>自定义配置日期范围：</h4>
            <pre>{{ JSON.stringify(dateRangeModel2, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElButton, ElMessage } from 'element-plus'

// 基础方法
const showMessage = () => {
  ElMessage.success('开发环境配置成功！')
}

// DateRange 组件数据
const dateRangeModel = ref({
  startTime: '',
  endTime: '',
})

const dateRangeModel2 = ref({
  startTime: '',
  endTime: '',
})

// DateRange 组件方法
const handleDateRangeChange = (value: { startTime: string; endTime: string }) => {
  console.log('日期范围改变:', value)
  ElMessage.success(`日期范围已选择: ${value.startTime} 至 ${value.endTime}`)
}

const handleDateRangeChange2 = (value: { startTime: string; endTime: string }) => {
  console.log('日期范围2改变:', value)
  ElMessage.info(`自定义日期范围: ${value.startTime} 至 ${value.endTime}`)
}
</script>

<style scoped>
.dev-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.demo-section {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
}

.demo-section h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #303133;
  border-bottom: 2px solid #409eff;
  padding-bottom: 10px;
}

.demo-item {
  margin-bottom: 30px;
}

.demo-item h3 {
  margin-bottom: 16px;
  color: #606266;
  font-size: 16px;
}

.info {
  margin-top: 10px;
  color: #909399;
  font-size: 14px;
}

.theme-section {
  margin-bottom: 30px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.theme-section h2 {
  margin-top: 0;
  margin-bottom: 16px;
  color: #303133;
}

.form-data-display {
  margin-top: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.form-data-display h4 {
  margin: 0 0 10px 0;
  color: #495057;
  font-size: 14px;
  font-weight: 600;
}

.form-data-display pre {
  margin: 0 0 20px 0;
  padding: 12px;
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.5;
  color: #495057;
  overflow-x: auto;
}

.form-data-display pre:last-child {
  margin-bottom: 0;
}
</style>
