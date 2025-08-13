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

      <!-- Table 组件预览 -->
      <div class="demo-section">
        <h2>Table 表格组件</h2>

        <!-- 基础表格 -->
        <div class="demo-item">
          <h3>基础表格</h3>
          <vxe-table :data="tableData" border stripe>
            <vxe-column field="name" title="姓名" width="120" />
            <vxe-column field="age" title="年龄" width="80" />
            <vxe-column field="email" title="邮箱" min-width="200" />
            <vxe-column field="department" title="部门" width="120" />
          </vxe-table>
        </div>

        <!-- 带复选框和序号的表格 -->
        <div class="demo-item">
          <h3>带复选框和序号</h3>
          <iip-table
            :data="tableData"
            :columns="basicColumns"
            show-checkbox
            show-seq
            border
            @checkbox-change="handleCheckboxChange"
            @checkbox-all="handleCheckboxAll"
          />
          <p class="info">已选择: {{ selectedCount }} 行</p>
        </div>

        <!-- 带分页的表格 -->
        <div class="demo-item">
          <h3>带分页</h3>
          <iip-table
            :data="paginatedData"
            :columns="basicColumns"
            :pagination="paginationConfig"
            border
            @page-change="handlePageChange"
            @page-size-change="handlePageSizeChange"
          />
        </div>

        <!-- 自定义列的表格 -->
        <div class="demo-item">
          <h3>自定义列</h3>
          <iip-table :data="tableData" :columns="customColumns" border>
            <!-- 状态列自定义渲染 -->
            <template #status="{ row }">
              <el-tag :type="getStatusType(row.status)">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </iip-table>
        </div>

        <!-- 加载状态 -->
        <div class="demo-item">
          <h3>加载状态</h3>
          <el-button @click="toggleLoading" style="margin-bottom: 16px">
            {{ loading ? '停止加载' : '开始加载' }}
          </el-button>
          <iip-table :data="tableData" :columns="basicColumns" :loading="loading" border />
        </div>
      </div>

      <!-- Input 组件预览 -->
      <div class="demo-section">
        <h2>Input 输入框组件</h2>
        <div class="demo-item">
          <h3>基础输入框</h3>
          <iip-input v-model="inputValue" placeholder="请输入内容" />
          <p class="info">输入值: {{ inputValue }}</p>
        </div>

        <div class="demo-item">
          <h3>带验证的输入框</h3>
          <iip-input
            v-model="emailValue"
            placeholder="请输入邮箱"
            validate-rule="email"
            show-validate-message
          />
        </div>
      </div>

      <!-- Select 组件预览 -->
      <div class="demo-section">
        <h2>Select 选择器组件</h2>
        <div class="demo-item">
          <h3>基础选择器</h3>
          <iip-select v-model="selectValue" :options="selectOptions" placeholder="请选择" />
          <p class="info">选择值: {{ selectValue }}</p>
        </div>

        <div class="demo-item">
          <h3>多选选择器</h3>
          <iip-select
            v-model="multiSelectValue"
            :options="selectOptions"
            multiple
            show-select-all
            placeholder="多选"
          />
          <p class="info">选择值: {{ multiSelectValue }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElButton, ElTag, ElMessage } from 'element-plus'

// 基础方法
const showMessage = () => {
  ElMessage.success('开发环境配置成功！')
}

// Table 数据
const tableData = ref([
  {
    id: 1,
    name: '张三',
    age: 25,
    email: 'zhangsan@example.com',
    department: '技术部',
    status: 1,
    createTime: '2024-01-15'
  },
  {
    id: 2,
    name: '李四',
    age: 30,
    email: 'lisi@example.com',
    department: '产品部',
    status: 2,
    createTime: '2024-02-20'
  },
  {
    id: 3,
    name: '王五',
    age: 28,
    email: 'wangwu@example.com',
    department: '设计部',
    status: 1,
    createTime: '2024-03-10'
  },
  {
    id: 4,
    name: '赵六',
    age: 32,
    email: 'zhaoliu@example.com',
    department: '运营部',
    status: 0,
    createTime: '2024-04-05'
  },
  {
    id: 5,
    name: '钱七',
    age: 27,
    email: 'qianqi@example.com',
    department: '技术部',
    status: 1,
    createTime: '2024-05-12'
  }
])

// 基础列配置
const basicColumns = [
  { field: 'name', title: '姓名', width: 120 },
  { field: 'age', title: '年龄', width: 80, sortable: true },
  { field: 'email', title: '邮箱', minWidth: 200 },
  { field: 'department', title: '部门', width: 120 },
  { field: 'createTime', title: '创建时间', width: 120 }
]

// 自定义列配置
const customColumns = [
  { field: 'name', title: '姓名', width: 120 },
  { field: 'age', title: '年龄', width: 80, sortable: true },
  { field: 'email', title: '邮箱', minWidth: 200 },
  { field: 'department', title: '部门', width: 120 },
  {
    field: 'status',
    title: '状态',
    width: 100,
    slotName: 'status'
  },
  { field: 'createTime', title: '创建时间', width: 120 }
]

// 分页配置
const paginationConfig = ref({
  currentPage: 1,
  pageSize: 3,
  total: tableData.value.length,
  showTotal: true,
  showSizes: true,
  showJumper: true,
  pageSizes: [3, 5, 10, 20]
})

// 分页数据
const paginatedData = computed(() => {
  const start = (paginationConfig.value.currentPage - 1) * paginationConfig.value.pageSize
  const end = start + paginationConfig.value.pageSize
  return tableData.value.slice(start, end)
})

// 选中计数
const selectedCount = ref(0)

// 加载状态
const loading = ref(false)

// Input 数据
const inputValue = ref('')
const emailValue = ref('')

// Select 数据
const selectValue = ref('')
const multiSelectValue = ref([])
const selectOptions = [
  { value: '1', label: '选项一' },
  { value: '2', label: '选项二' },
  { value: '3', label: '选项三' },
  { value: '4', label: '选项四' }
]

// 事件处理
const handleCheckboxChange = (params: any) => {
  console.log('复选框变化:', params)
}

const handleCheckboxAll = (params: any) => {
  console.log('全选变化:', params)
  selectedCount.value = params.checked ? params.records.length : 0
}

const handlePageChange = (params: any) => {
  console.log('页码变化:', params)
  paginationConfig.value.currentPage = params.currentPage
}

const handlePageSizeChange = (params: any) => {
  console.log('每页条数变化:', params)
  paginationConfig.value.pageSize = params.pageSize
  paginationConfig.value.currentPage = 1
}

const toggleLoading = () => {
  loading.value = !loading.value
}

// 状态相关方法
const getStatusType = (status: number): 'success' | 'warning' | 'info' => {
  const types: ('success' | 'warning' | 'info')[] = ['info', 'success', 'warning']
  return types[status] || 'info'
}

const getStatusText = (status: number) => {
  const texts = ['禁用', '正常', '待审核']
  return texts[status] || '未知'
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
</style>
