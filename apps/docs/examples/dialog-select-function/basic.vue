<template>
  <div class="demo-container">
    <el-table :data="tableData" border>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="taskName" label="任务名称" />
      <el-table-column prop="owner" label="负责人" width="150">
        <template #default="{ row }">
          <span class="cell-link" @click="handleOwnerClick(row)">
            {{ row.owner || '点击选择' }}
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { openDialogSelect } from '@bingwu/iip-ui-components'
import type {
  FetchDialogSelectDataParams,
  FetchDialogSelectDataResult,
  DialogSelectOptions
} from '@bingwu/iip-ui-components'
import { ElMessage } from 'element-plus'

// 定义员工数据类型
interface EmployeeRow {
  id: number
  name: string
  department: string
  email: string
  phone: string
  status: string
}
interface TableRowItem {
  id: number
  taskName: string
  owner: string
  ownerData: EmployeeRow | null
}
const tableData = ref<TableRowItem[]>([
  { id: 1, taskName: '开发用户登录功能', owner: '', ownerData: null },
  { id: 2, taskName: '设计产品首页', owner: '', ownerData: null }
])

// 模拟员工数据
const mockEmployees: EmployeeRow[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `员工${i + 1}`,
  department: ['技术部', '产品部', '运营部', '市场部', '人事部'][i % 5],
  email: `employee${i + 1}@example.com`,
  phone: `138${String(i + 1).padStart(8, '0')}`,
  status: i % 3 === 0 ? '在职' : '离职'
}))

// DialogSelect 选项配置
const employeeDialogSelectOptions: DialogSelectOptions = [
  { field: 'id', title: 'ID', columnProps: { width: 80 } },
  { field: 'name', title: '姓名', columnProps: { width: 120 } },
  { field: 'department', title: '部门', columnProps: { width: 120 } },
  { field: 'email', title: '邮箱', columnProps: { width: 200 } },
  { field: 'phone', title: '电话', columnProps: { width: 150 } },
  { field: 'status', title: '状态', columnProps: { width: 100 } },
  {
    field: 'name',
    title: '姓名',
    useForm: true,
    formItemProps: {
      formType: 'input',
      placeholder: '请输入姓名'
    }
  },
  {
    field: 'department',
    title: '部门',
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
  }
]

// 获取员工数据
const fetchEmployeeData = async (
  params: FetchDialogSelectDataParams<EmployeeRow>
): Promise<FetchDialogSelectDataResult<EmployeeRow>> => {
  await new Promise(resolve => setTimeout(resolve, 300))

  const { page, pageSize, name, department } = params

  let filteredEmployees = mockEmployees
  if (name) {
    filteredEmployees = filteredEmployees.filter(employee => employee.name.includes(name))
  }
  if (department) {
    filteredEmployees = filteredEmployees.filter(employee => employee.department === department)
  }

  const start = (page - 1) * pageSize
  const end = start + pageSize
  const data = filteredEmployees.slice(start, end)

  return {
    data,
    total: filteredEmployees.length
  }
}

// 点击单元格选择负责人
const handleOwnerClick = async (row: TableRowItem) => {
  try {
    const result = await openDialogSelect<EmployeeRow>({
      fetchData: fetchEmployeeData,
      dialogSelectOptions: employeeDialogSelectOptions,
      dialogTitle: '选择负责人',
      initialValue: row.ownerData,
      scrollToTopLeft: true
    })

    if (result && typeof result === 'object' && !Array.isArray(result)) {
      row.owner = result.name
      row.ownerData = result
      ElMessage.success(`已选择负责人：${result.name}`)
    }
  } catch (error: any) {
    console.log('取消选择:', error.message)
  }
}
</script>

<style scoped>
.cell-link {
  color: #409eff;
  cursor: pointer;
  text-decoration: underline;
}

.cell-link:hover {
  color: #66b1ff;
}
</style>
