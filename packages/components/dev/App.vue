<template>
  <div class="app-container">
    <h1>IIP UI Components 示例</h1>

    <!-- DateRange 示例 -->
    <div class="component-group">
      <h2 class="component-title">DateRange 组件</h2>

      <div class="demo-section">
        <h3>基础用法</h3>
        <IipDateRange v-model="dateRange1" @change="handleChange1" />
        <div class="result">
          <p>选择的日期范围：</p>
          <pre>{{ JSON.stringify(dateRange1, null, 2) }}</pre>
        </div>
      </div>

      <div class="demo-section">
        <h3>允许选择未来时间</h3>
        <IipDateRange v-model="dateRange2" :select-future-time="true" @change="handleChange2" />
        <div class="result">
          <p>选择的日期范围：</p>
          <pre>{{ JSON.stringify(dateRange2, null, 2) }}</pre>
        </div>
      </div>

      <div class="demo-section">
        <h3>自定义样式</h3>
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

    <!-- PaginationSelect 示例 -->
    <div class="component-group">
      <h2 class="component-title">PaginationSelect 组件</h2>

      <div class="demo-section">
        <h3>基础用法</h3>
        <IipPaginationSelect
          v-model="paginationSelect1"
          :fetch-data="fetchUserData"
          :loading="false"
          multiple
          placeholder="请选择用户"
          @change="handlePaginationSelectChange1"
        />
        <div class="result">
          <p>选中的值：</p>
          <pre>{{ JSON.stringify(paginationSelect1, null, 2) }}</pre>
        </div>
      </div>

      <div class="demo-section">
        <h3>自定义每页条数</h3>
        <IipPaginationSelect
          v-model="paginationSelect2"
          :fetch-data="fetchUserData"
          :page-size="5"
          placeholder="请选择用户（每页5条）"
          @change="handlePaginationSelectChange2"
        />
        <div class="result">
          <p>选中的值：</p>
          <pre>{{ JSON.stringify(paginationSelect2, null, 2) }}</pre>
        </div>
      </div>

      <div class="demo-section">
        <h3>隐藏分页器</h3>
        <IipPaginationSelect
          v-model="paginationSelect3"
          :fetch-data="fetchUserData"
          :show-pagination="false"
          placeholder="请选择用户（无分页）"
          @change="handlePaginationSelectChange3"
        />
        <div class="result">
          <p>选中的值：</p>
          <pre>{{ JSON.stringify(paginationSelect3, null, 2) }}</pre>
        </div>
      </div>

      <div class="demo-section">
        <h3>自定义样式</h3>
        <IipPaginationSelect
          v-model="paginationSelect4"
          :fetch-data="fetchUserData"
          placeholder="请选择用户（自定义宽度）"
          :style="{ width: '300px' }"
          @change="handlePaginationSelectChange4"
        />
        <div class="result">
          <p>选中的值：</p>
          <pre>{{ JSON.stringify(paginationSelect4, null, 2) }}</pre>
        </div>
      </div>

      <div class="demo-section">
        <h3>自定义 valueKey 和 labelKey</h3>
        <IipPaginationSelect
          v-model="paginationSelect5"
          :fetch-data="fetchProductData"
          value-key="id"
          label-key="name"
          placeholder="请选择产品（使用 id 和 name）"
          @change="handlePaginationSelectChange5"
        />
        <div class="result">
          <p>选中的值：</p>
          <pre>{{ JSON.stringify(paginationSelect5, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IipDateRange } from '../src/components/date-range'
import { IipPaginationSelect } from '../src/components/pagination-select'
import type {
  FetchDataParams,
  FetchDataResult,
  OptionItem
} from '../src/components/pagination-select/types'

// DateRange 相关
const dateRange1 = ref({ startTime: '', endTime: '' })
const dateRange2 = ref({ startTime: '', endTime: '' })
const dateRange3 = ref({ startTime: '', endTime: '' })

const handleChange1 = (value: { startTime: string; endTime: string }) => {
  console.log('dateRange1 changed:', value)
}

const handleChange2 = (value: { startTime: string; endTime: string }) => {
  console.log('dateRange2 changed:', value)
}

const handleChange3 = (value: { startTime: string; endTime: string }) => {
  console.log('dateRange3 changed:', value)
}

// PaginationSelect 相关
const paginationSelect1 = ref(null)
const paginationSelect2 = ref(null)
const paginationSelect3 = ref(null)
const paginationSelect4 = ref(null)
const paginationSelect5 = ref(null)

// 模拟用户数据
const mockUsers = Array.from({ length: 50 }, (_, i) => ({
  value: i + 1,
  label: `用户${i + 1}`,
  email: `user${i + 1}@example.com`
}))

// 模拟获取用户数据的函数
const fetchUserData = async (params: FetchDataParams): Promise<FetchDataResult> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))

  const { page, pageSize, keyword } = params

  // 根据关键词过滤
  let filteredUsers = mockUsers
  if (keyword) {
    filteredUsers = mockUsers.filter(
      user => user.label.includes(keyword) || user.email.includes(keyword)
    )
  }

  // 分页处理
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const data = filteredUsers.slice(start, end)

  return {
    data,
    total: filteredUsers.length
  }
}

// 模拟产品数据（使用 id 和 name 作为键名）
const mockProducts = Array.from({ length: 50 }, (_, i) => ({
  id: `PROD-${String(i + 1).padStart(3, '0')}`,
  name: `产品${i + 1}`,
  price: (Math.random() * 1000).toFixed(2),
  category: ['电子产品', '服装', '食品', '家居'][i % 4]
}))

// 模拟获取产品数据的函数（使用自定义键名）
const fetchProductData = async (params: FetchDataParams): Promise<FetchDataResult> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))

  const { page, pageSize, keyword } = params

  // 根据关键词过滤
  let filteredProducts = mockProducts
  if (keyword) {
    filteredProducts = mockProducts.filter(
      product =>
        product.name.includes(keyword) ||
        product.id.includes(keyword) ||
        product.category.includes(keyword)
    )
  }

  // 分页处理
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const data = filteredProducts.slice(start, end)

  return {
    data,
    total: filteredProducts.length
  }
}

const handlePaginationSelectChange1 = (value, option?: OptionItem) => {
  console.log('paginationSelect1 changed:', value, option)
}

const handlePaginationSelectChange2 = (value, option?: OptionItem) => {
  console.log('paginationSelect2 changed:', value, option)
}

const handlePaginationSelectChange3 = (value, option?: OptionItem) => {
  console.log('paginationSelect3 changed:', value, option)
}

const handlePaginationSelectChange4 = (value, option?: OptionItem) => {
  console.log('paginationSelect4 changed:', value, option)
}

const handlePaginationSelectChange5 = (value, option?: OptionItem) => {
  console.log('paginationSelect5 changed:', value, option)
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

.component-group {
  margin-bottom: 50px;
}

.component-title {
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e0e0e0;
}

h2 {
  color: #666;
  font-size: 18px;
  margin-bottom: 15px;
}

h3 {
  color: #666;
  font-size: 16px;
  margin-bottom: 15px;
}

.demo-section {
  margin-bottom: 30px;
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
