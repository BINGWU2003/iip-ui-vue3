<template>
  <div class="table-demo">
    <h2>IipTable 表格组件示例</h2>

    <!-- 基础表格 -->
    <div class="demo-section">
      <h3>基础表格</h3>
      <iip-table :data="tableData" :columns="basicColumns" border stripe />
    </div>

    <!-- 带复选框和序号的表格 -->
    <div class="demo-section">
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
      <p>已选择: {{ selectedRows.length }} 行</p>
    </div>

    <!-- 带分页的表格 -->
    <div class="demo-section">
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
    <div class="demo-section">
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
    <div class="demo-section">
      <h3>加载状态</h3>
      <el-button @click="toggleLoading">
        {{ loading ? '停止加载' : '开始加载' }}
      </el-button>
      <iip-table :data="tableData" :columns="basicColumns" :loading="loading" border />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElButton, ElTag } from 'element-plus'
import type { TableColumn } from '../src/components/table/types'

// 模拟数据
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
const basicColumns: TableColumn[] = [
  { field: 'name', title: '姓名', width: 120 },
  { field: 'age', title: '年龄', width: 80, sortable: true },
  { field: 'email', title: '邮箱', minWidth: 200 },
  { field: 'department', title: '部门', width: 120 },
  { field: 'createTime', title: '创建时间', width: 120 }
]

// 自定义列配置
const customColumns: TableColumn[] = [
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

// 选中的行
const selectedRows = ref([])

// 加载状态
const loading = ref(false)

// 事件处理
const handleCheckboxChange = (params: any) => {
  console.log('复选框变化:', params)
  // 这里可以更新选中状态
}

const handleCheckboxAll = (params: any) => {
  console.log('全选变化:', params)
  selectedRows.value = params.checked ? params.records : []
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
.table-demo {
  padding: 20px;
}

.demo-section {
  margin-bottom: 40px;
}

.demo-section h3 {
  margin-bottom: 16px;
  color: #333;
  font-size: 16px;
}

.demo-section p {
  margin-top: 10px;
  color: #666;
  font-size: 14px;
}
</style>
