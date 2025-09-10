<template>
  <div id="app">
    <h1>我的第一个 IIP UI Vue3 应用</h1>

    <!-- 基础输入组件 -->
    <div class="demo-section">
      <h3>基础输入组件</h3>
      <div class="input-group">
        <iip-input
          v-model="inputValue"
          placeholder="请输入内容"
          clearable
          style="width: 300px; margin-right: 16px"
        />
        <iip-select
          v-model="selectValue"
          :options="selectOptions"
          placeholder="请选择"
          style="width: 200px; margin-right: 16px"
        />
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </div>
    </div>

    <!-- 高性能表格 -->
    <div class="demo-section">
      <h3>高性能表格</h3>
      <iip-table :data="tableData" :columns="tableColumns" border stripe height="300px">
        <!-- 操作列插槽 -->
        <template #action-slot-column-default="{ row }">
          <el-button type="primary" size="small" @click="editRow(row)"> 编辑 </el-button>
          <el-button type="danger" size="small" @click="deleteRow(row)"> 删除 </el-button>
        </template>
      </iip-table>
    </div>

    <!-- 配置化表单 -->
    <div class="demo-section">
      <h3>配置化表单</h3>
      <iip-form :config="formConfig" @submit="handleFormSubmit" style="max-width: 600px" />
    </div>

    <!-- 日期范围选择器 -->
    <div class="demo-section">
      <h3>日期范围选择器</h3>
      <iip-date-range v-model="dateRange" :gap="16" />
      <p
        v-if="dateRange && (dateRange.startTime || dateRange.endTime)"
        style="margin-top: 8px; color: var(--iip-color-info)"
      >
        选择的日期范围：{{ formatDateRange(dateRange) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { debounce, isEmail } from '@bingwu/iip-ui-utils'

// 基础输入数据
const inputValue = ref('')
const selectValue = ref('')
const selectOptions = [
  { label: '选项一', value: '1' },
  { label: '选项二', value: '2' },
  { label: '选项三', value: '3' },
]

// 日期范围
const dateRange = ref({ startTime: '', endTime: '' })

// 表格数据
const tableData = ref([
  {
    id: 1,
    name: '张三',
    age: 25,
    department: '技术部',
    status: '在职',
    email: 'zhangsan@example.com',
  },
  { id: 2, name: '李四', age: 30, department: '产品部', status: '在职', email: 'lisi@example.com' },
  {
    id: 3,
    name: '王五',
    age: 28,
    department: '设计部',
    status: '离职',
    email: 'wangwu@example.com',
  },
  {
    id: 4,
    name: '赵六',
    age: 32,
    department: '运营部',
    status: '在职',
    email: 'zhaoliu@example.com',
  },
])

// 表格列配置
const tableColumns = ref([
  { tableColumnProps: { field: 'name', title: '姓名', width: 100 } },
  { tableColumnProps: { field: 'age', title: '年龄', width: 80 } },
  { tableColumnProps: { field: 'department', title: '部门', width: 120 } },
  { tableColumnProps: { field: 'email', title: '邮箱', width: 180 } },
  { tableColumnProps: { field: 'status', title: '状态', width: 100 } },
  {
    slotKey: 'action-slot-column',
    tableColumnProps: { title: '操作', width: 120, fixed: 'right' },
  },
])

// 表单配置
const formConfig = ref({
  model: {
    name: '',
    email: '',
    phone: '',
    type: '',
  },
  items: [
    {
      prop: 'name',
      label: '姓名',
      type: 'input',
      required: true,
      placeholder: '请输入姓名',
      span: 12,
    },
    {
      prop: 'email',
      label: '邮箱',
      type: 'input',
      required: true,
      placeholder: '请输入邮箱地址',
      span: 12,
    },
    {
      prop: 'phone',
      label: '手机号',
      type: 'input',
      placeholder: '请输入手机号码',
      span: 12,
    },
    {
      prop: 'type',
      label: '用户类型',
      type: 'select',
      placeholder: '请选择用户类型',
      span: 12,
      options: [
        { label: '管理员', value: 'admin' },
        { label: '普通用户', value: 'user' },
        { label: '访客', value: 'guest' },
      ],
    },
  ],
  actions: {
    show: true,
    align: 'center',
    submitText: '提交表单',
    resetText: '重置',
  },
})

// 使用防抖处理提交
const handleSubmit = debounce(() => {
  if (!inputValue.value) {
    ElMessage.warning('请输入内容')
    return
  }

  if (isEmail(inputValue.value)) {
    ElMessage.success(`邮箱格式正确: ${inputValue.value}`)
  } else {
    ElMessage.info(`输入内容: ${inputValue.value}, 选择值: ${selectValue.value}`)
  }
}, 300)

// 表格操作
const editRow = (row: any) => {
  ElMessage.info(`编辑用户: ${row.name}`)
  console.log('编辑行数据:', row)
}

const deleteRow = (row: any) => {
  ElMessage.warning(`删除用户: ${row.name}`)
  console.log('删除行数据:', row)
}

// 表单提交处理
const handleFormSubmit = (formData: any) => {
  console.log('表单数据:', formData)

  // 使用工具函数验证
  if (formData.email && !isEmail(formData.email)) {
    ElMessage.error('邮箱格式不正确')
    return
  }

  ElMessage.success('表单提交成功！')
}

// 格式化日期范围
const formatDateRange = (range: { startTime: string; endTime: string }) => {
  if (!range || (!range.startTime && !range.endTime)) return ''

  const start = range.startTime || '未选择'
  const end = range.endTime || '未选择'

  return `${start} 至 ${end}`
}
</script>

<style scoped>
#app {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: var(--iip-color-primary);
  margin-bottom: 30px;
  text-align: center;
}

h3 {
  color: var(--iip-color-info);
  margin-bottom: 16px;
  border-bottom: 2px solid var(--iip-color-primary);
  padding-bottom: 8px;
}

.demo-section {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: var(--iip-border-radius-base);
  background-color: #fafafa;
}

.input-group {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

@media (max-width: 768px) {
  .input-group {
    flex-direction: column;
    align-items: stretch;
  }

  .input-group > * {
    width: 100% !important;
  }
}
</style>
