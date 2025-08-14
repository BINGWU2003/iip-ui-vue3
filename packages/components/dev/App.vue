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
          <iip-table
            ref="tableRef"
            :data="tableData"
            :columns="basicColumns"
            border
            stripe
            :pagination="paginationConfig"
            @checkbox-all="selectAllChangeEvent"
            @checkbox-change="selectChangeEvent"
            :checkbox-config="{ highlight: true }"
            :check-box-column-config="{ show: true, tableColumnProps: { width: 60 } }"
            @page-change="pageChangeEvent"
          >
            <template #checkbox-slot-column="{ row }"> 你好 {{ row.name }} </template>

            <template #department-slot-column="{ row }"> 你好 {{ row.department }} </template>
            <template #createTime-slot-column="{ row }"> 你好 {{ row.createTime }} </template>
          </iip-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElButton, ElMessage } from 'element-plus'

const tableRef = ref(null)

// 基础方法
const showMessage = () => {
  ElMessage.success('开发环境配置成功！')
}

const pageChangeEvent = (params: any) => {
  console.log(params)
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
  { tableColumnProps: { field: 'name', title: '姓名', width: 120 } },
  {
    tableColumnProps: { field: 'age', title: '年龄', width: 80, sortable: true }
  },
  { tableColumnProps: { field: 'email', title: '邮箱', minWidth: 200 } },
  {
    tableColumnProps: { field: 'department', title: '部门', width: 120 },
    slotName: 'department-slot'
  },
  {
    tableColumnProps: { field: 'createTime', title: '创建时间', width: 120 },
    slotName: 'createTime-slot'
  }
]
const selectAllChangeEvent = (params: any) => {
  console.log(params)
}
const selectChangeEvent = (params: any) => {
  console.log(params)
}
// 分页配置
const paginationConfig = ref({
  currentPage: 1,
  pageSize: 3,
  total: tableData.value.length,
  layouts: ['Total', 'Sizes', 'PrevPage', 'Number', 'NextPage', 'Jump'],
  pageSizes: [3, 5, 10, 20],
  onPageChange: pageChangeEvent
})

onMounted(() => {
  tableRef.value?.getTableInstance()
})
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
