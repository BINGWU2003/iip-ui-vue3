<template>
  <div>
    <iip-dialog-select
      v-model="selectedEmployees"
      :fetch-data="fetchEmployeeData"
      :dialog-select-options="employeeDialogSelectOptions"
      :multiple="true"
      placeholder="请选择员工（可多选）"
      dialog-title="选择员工"
      @change="handleChange"
    />

    <div v-if="selectedEmployees && selectedEmployees.length > 0" style="margin-top: 10px">
      已选择 {{ selectedEmployees.length }} 个员工：
      <ul>
        <li v-for="emp in selectedEmployees" :key="emp.id">
          {{ emp.name }} ({{ emp.department }})
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type {
  FetchDialogSelectDataParams,
  FetchDialogSelectDataResult,
  DialogSelectOptions
} from '@bingwu/iip-ui-components'

// 定义员工数据类型（使用泛型获得类型推导）
interface EmployeeRow {
  id: number
  name: string
  department: string
  email: string
  phone: string
  status: string
}

// 多选时 modelValue 是数组
const selectedEmployees = ref<EmployeeRow[] | null>(null)

const handleChange = (value: EmployeeRow[] | null) => {
  console.log('选中的员工：', value)
}

// 模拟员工数据
const mockEmployees: EmployeeRow[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `员工${i + 1}`,
  department: ['技术部', '产品部', '运营部', '市场部', '人事部'][i % 5],
  email: `employee${i + 1}@example.com`,
  phone: `138${String(i + 1).padStart(8, '0')}`,
  status: i % 3 === 0 ? '在职' : '离职'
}))

// DialogSelect 选项配置（合并 columns 和 formItems）
const employeeDialogSelectOptions: DialogSelectOptions = [
  // 表格列配置（useForm 默认为 false）
  { field: 'id', title: 'ID', columnProps: { width: 80 } },
  // name 字段同时作为列和表单项
  {
    field: 'name',
    title: '姓名',
    columnProps: { width: 120 },
    useForm: true,
    formItemProps: {
      formType: 'input',
      placeholder: '请输入姓名'
    }
  },
  // department 字段同时作为列和表单项
  {
    field: 'department',
    title: '部门',
    columnProps: { width: 120 },
    useForm: true,
    formItemProps: {
      formType: 'select',
      placeholder: '请选择部门',
      options: [
        { label: '技术部', value: '技术部' },
        { label: '产品部', value: '产品部' },
        { label: '运营部', value: '运营部' },
        { label: '市场部', value: '市场部' },
        { label: '人事部', value: '人事部' }
      ]
    }
  },
  { field: 'email', title: '邮箱', columnProps: { width: 200 } },
  { field: 'phone', title: '电话', columnProps: { width: 150 } },
  { field: 'status', title: '状态', columnProps: { width: 100 } }
]

// 获取员工数据（使用泛型，获得类型推导）
const fetchEmployeeData = async (
  params: FetchDialogSelectDataParams<EmployeeRow>
): Promise<FetchDialogSelectDataResult<EmployeeRow>> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))

  const { page, pageSize, name, department } = params

  // 根据筛选条件过滤
  let filteredEmployees = mockEmployees
  if (name) {
    filteredEmployees = filteredEmployees.filter(employee => employee.name.includes(name))
  }
  if (department) {
    filteredEmployees = filteredEmployees.filter(employee => employee.department === department)
  }

  // 分页处理
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const data = filteredEmployees.slice(start, end)

  return {
    data,
    total: filteredEmployees.length
  }
}
</script>
