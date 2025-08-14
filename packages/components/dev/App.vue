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
            :check-box-column-config="{ show: true, tableColumnProps: { width: 120 } }"
            :seq-column-config="{ show: true, tableColumnProps: { width: 60 } }"
            :expand-column-config="{ show: true, tableColumnProps: { width: 60 } }"
            :radio-column-config="{ show: true, tableColumnProps: { width: 60 } }"
            :edit-config="{ trigger: 'click', mode: 'cell' }"
            :column-config="{ resizable: true }"
            :footer-data="footerData"
            show-footer
          >
            <template #checkbox-slot-column-default="{ row }"> 复选框插槽 {{ row.name }} </template>
            <template #radio-slot-column-default="{ row }"> 单选框插槽 {{ row.name }} </template>
            <template #department-slot-column-default="{ row }">
              默认插槽 {{ row.department }}
            </template>
            <template #department-slot-column-header="{ column }">
              列头插槽 {{ column.title }}
            </template>
            <template #createTime-slot-column-default="{ row }">
              默认插槽 {{ row.createTime }}
            </template>
            <!-- <template #age-slot-column-edit="{ row }"> 编辑插槽 {{ row.age }} </template> -->
            <template #expand-slot-column-content="{ row }"> 展开插槽 {{ row.name }} </template>
            <template #sum-slot-column-default="{ row }"> 合计插槽 {{ sumRowNum(row) }} </template>
            <template #action-slot-column-default="{ row }">
              操作插槽 - {{ row.name }}
              <el-button type="primary" size="small">编辑</el-button>
              <el-button type="danger" size="small">删除</el-button>
            </template>
            <template #empty>
              <span style="color: red">
                <img
                  src="https://n.sinaimg.cn/sinacn17/w120h120/20180314/89fc-fyscsmv5911424.gif"
                />
                <p>没有更多数据了！</p>
              </span>
            </template>
          </iip-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import type { IipTableExpose } from '../src/components/table/types'

const tableRef = ref<IipTableExpose | null>(null)
// 基础方法
const showMessage = () => {
  ElMessage.success('开发环境配置成功！')
}

const pageChangeEvent = (params: any) => {
  console.log(params)
}
const footerData = ref([
  { seq: '合计', age: '18' },
  { seq: '平均', age: '18' }
])
const sumRowNum = (row: any) => {
  return row.age + 99
}
// Table 数据
const tableData = ref([
  {
    name: '张三',
    age: 18,
    email: 'zhangsan@example.com',
    department: '研发部',
    createTime: '2021-01-01'
  },
  {
    name: '张三',
    age: 18,
    email: 'zhangsan@example.com',
    department: '研发部',
    createTime: '2021-01-01'
  },
  {
    name: '张三',
    age: 18,
    email: 'zhangsan@example.com',
    department: '研发部',
    createTime: '2021-01-01'
  },
  {
    name: '张三',
    age: 18,
    email: 'zhangsan@example.com',
    department: '研发部',
    createTime: '2021-01-01'
  }
])

// 基础列配置
const basicColumns = [
  {
    tableColumnProps: { field: 'name', title: '姓名', width: 120 }
  },
  {
    tableColumnProps: {
      field: 'age',
      title: '年龄',
      width: 200,
      sortable: true,
      editRender: { name: 'input', attrs: { type: 'number' } }
    }
  },
  { tableColumnProps: { field: 'email', title: '邮箱', minWidth: 200 } },
  {
    tableColumnProps: { field: 'department', title: '部门', width: 120 }
  },
  {
    tableColumnProps: { field: 'createTime', title: '创建时间', width: 120 }
  },
  {
    tableColumnProps: { field: 'action', title: '操作', width: 200, fixed: 'right' }
  },
  {
    tableColumnProps: { field: 'sum', title: '合计', width: 100 }
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
  setTimeout(() => {
    const instance = tableRef.value?.getTableInstance()
    console.log(instance?.getTableData())
  }, 1000)
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
