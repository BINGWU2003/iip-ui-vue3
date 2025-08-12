<template>
  <div class="demo-container">
    <h1>IIP UI Vue3 组件演示</h1>

    <!-- IipInput 演示 -->
    <section class="demo-section">
      <h2>IipInput 输入框</h2>

      <div class="demo-item">
        <h3>基础用法</h3>
        <iip-input v-model="inputValue1" placeholder="请输入内容" clearable />
        <p>输入值：{{ inputValue1 }}</p>
      </div>

      <div class="demo-item">
        <h3>字符计数</h3>
        <iip-input
          v-model="inputValue2"
          placeholder="最多输入20个字符"
          :maxlength="20"
          show-word-limit
          clearable
        />
      </div>

      <div class="demo-item">
        <h3>邮箱验证</h3>
        <iip-input
          v-model="inputValue3"
          placeholder="请输入邮箱地址"
          validate-rule="email"
          clearable
          @validate="handleValidate"
        />
      </div>

      <div class="demo-item">
        <h3>手机号验证</h3>
        <iip-input
          v-model="inputValue4"
          placeholder="请输入手机号码"
          validate-rule="phone"
          clearable
        />
      </div>
    </section>

    <!-- IipSelect 演示 -->
    <section class="demo-section">
      <h2>IipSelect 选择器</h2>

      <div class="demo-item">
        <h3>基础用法</h3>
        <iip-select v-model="selectValue1" :options="basicOptions" placeholder="请选择" clearable />
        <p>选择值：{{ selectValue1 }}</p>
      </div>

      <div class="demo-item">
        <h3>多选模式</h3>
        <iip-select
          v-model="selectValue2"
          :options="basicOptions"
          placeholder="请选择多个选项"
          multiple
          show-select-all
          show-count
          clearable
        />
        <p>选择值：{{ selectValue2 }}</p>
      </div>

      <div class="demo-item">
        <h3>可搜索</h3>
        <iip-select
          v-model="selectValue3"
          :options="searchOptions"
          placeholder="可搜索选择"
          filterable
          clearable
        />
      </div>

      <div class="demo-item">
        <h3>分组选项</h3>
        <iip-select
          v-model="selectValue4"
          :options="groupOptions"
          placeholder="分组选择"
          clearable
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IipInput, IipSelect } from '../src'

// Input 相关数据
const inputValue1 = ref('')
const inputValue2 = ref('')
const inputValue3 = ref('')
const inputValue4 = ref('')

// Select 相关数据
const selectValue1 = ref('')
const selectValue2 = ref([])
const selectValue3 = ref('')
const selectValue4 = ref('')

// 基础选项
const basicOptions = [
  { value: 'option1', label: '选项一' },
  { value: 'option2', label: '选项二' },
  { value: 'option3', label: '选项三' },
  { value: 'option4', label: '选项四' },
  { value: 'option5', label: '选项五' }
]

// 搜索选项
const searchOptions = [
  { value: 'beijing', label: '北京' },
  { value: 'shanghai', label: '上海' },
  { value: 'guangzhou', label: '广州' },
  { value: 'shenzhen', label: '深圳' },
  { value: 'hangzhou', label: '杭州' },
  { value: 'nanjing', label: '南京' },
  { value: 'wuhan', label: '武汉' },
  { value: 'chengdu', label: '成都' }
]

// 分组选项
const groupOptions = [
  { value: 'html', label: 'HTML', group: '前端技术' },
  { value: 'css', label: 'CSS', group: '前端技术' },
  { value: 'javascript', label: 'JavaScript', group: '前端技术' },
  { value: 'vue', label: 'Vue.js', group: '前端技术' },
  { value: 'react', label: 'React', group: '前端技术' },
  { value: 'nodejs', label: 'Node.js', group: '后端技术' },
  { value: 'python', label: 'Python', group: '后端技术' },
  { value: 'java', label: 'Java', group: '后端技术' },
  { value: 'mysql', label: 'MySQL', group: '数据库' },
  { value: 'mongodb', label: 'MongoDB', group: '数据库' },
  { value: 'redis', label: 'Redis', group: '数据库' }
]

// 事件处理
const handleValidate = (isValid: boolean, message?: string) => {
  console.log('验证结果:', isValid, message)
}
</script>

<style scoped>
.demo-container {
  max-width: 800px;
  padding: 20px;
  margin: 0 auto;
}

.demo-section {
  margin-bottom: 40px;
}

.demo-item {
  padding: 16px;
  margin-bottom: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.demo-item h3 {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.demo-item p {
  margin: 8px 0 0;
  font-size: 12px;
  color: #606266;
}

h1 {
  margin-bottom: 40px;
  color: #303133;
  text-align: center;
}

h2 {
  padding-bottom: 8px;
  margin-bottom: 20px;
  color: #409eff;
  border-bottom: 2px solid #409eff;
}
</style>
