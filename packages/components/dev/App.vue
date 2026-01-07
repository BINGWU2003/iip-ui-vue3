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
          ref="paginationSelect1Ref"
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

    <!-- DialogSelect 示例 -->
    <div class="component-group">
      <h2 class="component-title">DialogSelect 组件</h2>

      <div class="demo-section">
        <h3>单选 + 筛选 + keyGetter</h3>
        <IipDialogSelect
          v-model="dialogSelect1"
          :fetch-data="fetchEmployeeData"
          :dialog-select-options="employeeDialogSelectOptions"
          :key-getter="employeeKeyGetter"
          placeholder="请选择员工"
          scroll-to-top-left
          dialog-title="选择员工"
          @change="handleDialogSelectChange1"
        />
        <div class="result">
          <p>选中的值：</p>
          <pre>{{ JSON.stringify(dialogSelect1, null, 2) }}</pre>
        </div>
      </div>

      <div class="demo-section">
        <h3>多选 + 筛选 + keyGetter</h3>
        <IipDialogSelect
          v-model="dialogSelect2"
          :fetch-data="fetchEmployeeData"
          :dialog-select-options="employeeDialogSelectOptions"
          :key-getter="employeeKeyGetter"
          :multiple="true"
          placeholder="请选择员工（可多选）"
          dialog-title="选择员工（多选）"
          @change="handleDialogSelectChange2"
        />
        <div class="result">
          <p>选中的值：</p>
          <pre>{{ JSON.stringify(dialogSelect2, null, 2) }}</pre>
        </div>
      </div>

      <div class="demo-section">
        <h3>自定义 valueKey/labelKey + 筛选 + keyGetter + 初始化表单数据</h3>
        <IipDialogSelect
          v-model="dialogSelect3"
          :fetch-data="fetchProductDataForDialog"
          :dialog-select-options="productDialogSelectOptions"
          :key-getter="productKeyGetter"
          value-key="id"
          label-key="name"
          placeholder="请选择产品"
          dialog-title="选择产品"
          @change="handleDialogSelectChange3"
        />
        <div class="result">
          <p>选中的值：</p>
          <pre>{{ JSON.stringify(dialogSelect3, null, 2) }}</pre>
        </div>
      </div>
    </div>

    <!-- DropdownList 示例 -->
    <div class="component-group">
      <h2 class="component-title">DropdownList 组件</h2>

      <div class="demo-section">
        <h3>表格操作列中使用下拉列表</h3>
        <p style="margin-bottom: 15px; color: #666">
          在表格的操作列中，可以使用下拉列表提供更多操作选项
        </p>
        <el-table :data="orderTableData" border stripe style="width: 100%">
          <el-table-column prop="id" label="订单ID" width="100" />
          <el-table-column prop="orderNo" label="订单号" width="150" />
          <el-table-column prop="customerName" label="客户名称" min-width="120" />
          <el-table-column prop="amount" label="金额" width="120" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="{ row }">
              <IipDropdownList
                :dropdown-list="getOrderDropdownList(row)"
                :dropdown-props="{
                  trigger: 'click',
                  onCommand: command => handleOrderCommand(command, row)
                }"
              >
                <el-button type="primary" size="small">
                  操作 <el-icon class="el-icon--right"><arrow-down /></el-icon>
                </el-button>
              </IipDropdownList>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="demo-section">
        <h3>动态控制下拉项显示</h3>
        <p style="margin-bottom: 15px; color: #666">根据数据状态动态控制下拉项的显示和禁用状态</p>
        <el-table :data="taskTableDataForDropdown" border stripe style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="taskName" label="任务名称" min-width="200" />
          <el-table-column prop="assignee" label="指派人" width="120" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getTaskStatusType(row.status)">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="{ row }">
              <IipDropdownList
                :dropdown-list="getTaskDropdownList(row)"
                ref="taskDropdownListRef"
                :dropdown-props="{
                  trigger: 'click',
                  size: 'small',
                  onCommand: command => handleTaskCommand(command, row)
                }"
              >
                <el-button type="primary" link size="small"
                  >更多操作 <el-icon><arrow-down /></el-icon
                ></el-button>
              </IipDropdownList>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- openDialogSelect 函数式调用示例 -->
    <div class="component-group">
      <h2 class="component-title">openDialogSelect 函数式调用</h2>

      <div class="demo-section">
        <h3>点击表格单元格选择员工（单选）</h3>
        <p style="margin-bottom: 15px; color: #666">点击"负责人"列的单元格可以选择员工</p>
        <el-table :data="taskTableData" border stripe style="width: 100%" max-height="300">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="taskName" label="任务名称" min-width="200" />
          <el-table-column prop="owner" label="负责人" width="150">
            <template #default="{ row }">
              <span class="cell-link" @click="handleOwnerClick(row)">
                {{ row.owner || '点击选择' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="120" />
        </el-table>
      </div>

      <div class="demo-section">
        <h3>点击表格单元格选择产品（多选）</h3>
        <p style="margin-bottom: 15px; color: #666">点击"已选产品"列的单元格可以选择多个产品</p>
        <el-table :data="projectTableData" border stripe style="width: 100%" max-height="250">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="projectName" label="项目名称" min-width="200" />
          <el-table-column prop="productsDisplay" label="已选产品" min-width="300">
            <template #default="{ row }">
              <span class="cell-link" @click="handleProductsClick(row)">
                {{ row.productsDisplay || '点击选择' }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="demo-section">
        <h3>带初始值的选择</h3>
        <p style="margin-bottom: 15px; color: #666">点击单元格时会带上当前选中的值作为初始值</p>
        <el-table :data="ticketTableData" border stripe style="width: 100%" max-height="250">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="ticketNo" label="工单号" width="120" />
          <el-table-column prop="title" label="标题" min-width="200" />
          <el-table-column prop="assignee" label="指派人" width="150">
            <template #default="{ row }">
              <span class="cell-link" @click="handleAssigneeClick(row)">
                {{ row.assignee || '点击选择' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="priority" label="优先级" width="100" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { IipDateRange } from '../src/components/date-range'
import {
  IipPaginationSelect,
  type PaginationSelectInstance
} from '../src/components/pagination-select'
import { IipDialogSelect, openDialogSelect } from '../src/components/dialog-select'
import { IipDropdownList } from '../src/components/dropdown-list'
import type {
  FetchDataParams,
  FetchDataResult,
  OptionItem
} from '../src/components/pagination-select/types'
import type {
  FetchDialogSelectDataParams,
  FetchDialogSelectDataResult,
  TableRowItem
} from '../src/components/dialog-select/types'
import { ElMessage } from 'element-plus'
import type { DropdownListItemType } from '../src/components/dropdown-list/type'
import type { DropdownListInstance } from '../src/components/dropdown-list/type'
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
const paginationSelect1 = ref([
  { value: 16, label: '用户16' },
  { value: 17, label: '用户17' }
])
const paginationSelect1Ref = ref<PaginationSelectInstance | null>(null)
const paginationSelect2 = ref({
  value: 16,
  label: '用户16'
})
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
  console.log('paginationSelect1Ref', paginationSelect1Ref.value.selectedLabel)
  console.log('paginationSelect1Ref', paginationSelect1Ref.value.options)
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

// DialogSelect 相关
const dialogSelect1 = ref<TableRowItem | null>({
  id: 5,
  name: '员工5',
  department: '人事部',
  email: 'employee5@example.com',
  phone: '13800000005',
  status: '离职'
})
const dialogSelect2 = ref<TableRowItem[] | null>(null)
const dialogSelect3 = ref<TableRowItem | null>(null)

// 模拟员工数据
const mockEmployees = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `员工${i + 1}`,
  department: ['技术部', '产品部', '运营部', '市场部', '人事部'][i % 5],
  email: `employee${i + 1}@example.com`,
  phone: `138${String(i + 1).padStart(8, '0')}`,
  status: i % 3 === 0 ? '在职' : '离职'
}))

type Employee = {
  id: number
  name: string
  department: string
  email: string
  phone: string
  status: string
}

// DialogSelect 选项配置（合并 columns 和 formItems）
const employeeDialogSelectOptions = [
  // 表格列配置（useForm 默认为 false，或显式设置为 false）
  { field: 'id', title: 'ID', useForm: false, columnProps: { width: 80 } },
  { field: 'name', title: '姓名', useForm: false, columnProps: { width: 120 } },
  { field: 'department', title: '部门', useForm: false, columnProps: { width: 120 } },
  { field: 'email', title: '邮箱', useForm: false, columnProps: { width: 200 } },
  { field: 'phone', title: '电话', useForm: false, columnProps: { width: 150 } },
  { field: 'status', title: '状态', useForm: false, columnProps: { width: 100 } },
  // 表单配置（用于筛选，useForm 设置为 true）
  {
    field: 'name',
    title: '姓名',
    useForm: true,
    formItemProps: {
      formType: 'input' as const,
      placeholder: '请输入姓名'
    },
    columnProps: {
      width: 150
    }
  },
  {
    field: 'department',
    title: '部门',
    useForm: true,
    formItemProps: {
      formType: 'select' as const,
      placeholder: '请选择部门',
      // 使用函数返回选项，支持从接口获取
      options: async () => {
        // 模拟从接口获取数据
        await new Promise(resolve => setTimeout(resolve, 200))
        return [
          { label: '技术部', value: '技术部' },
          { label: '产品部', value: '产品部' },
          { label: '运营部', value: '运营部' },
          { label: '市场部', value: '市场部' },
          { label: '人事部', value: '人事部' }
        ]
      }
    },
    columnProps: {
      width: 150
    }
  },
  {
    field: 'createDate',
    title: '创建日期',
    useForm: true,
    formItemProps: {
      formType: 'date' as const,
      placeholder: '请选择创建日期',
      type: 'daterange'
    },
    columnProps: {
      width: 150
    }
  }
]

// 获取员工数据
const fetchEmployeeData = async (
  params: FetchDialogSelectDataParams<Employee>
): Promise<FetchDialogSelectDataResult<Employee>> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))

  const { page, pageSize, name, department } = params

  // 根据筛选条件过滤
  let filteredEmployees = mockEmployees
  if (name) {
    filteredEmployees = filteredEmployees.filter(employee => employee.name.includes(name as string))
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

// DialogSelect 选项配置（合并 columns 和 formItems）
const productDialogSelectOptions = [
  // 表格列配置（useForm 默认为 false）
  { field: 'id', title: '产品ID', columnProps: { width: 120 } },
  { field: 'name', title: '产品名称', columnProps: { width: 150 } },
  { field: 'price', title: '价格', columnProps: { width: 100 } },
  { field: 'category', title: '分类', columnProps: { width: 120 } },
  // 表单配置（用于筛选，useForm 设置为 true）
  {
    field: 'name',
    title: '产品名称',
    useForm: true,
    formItemProps: {
      formType: 'input' as const,
      placeholder: '请输入产品名称',
      defaultValue: '产品'
    }
  },
  {
    field: 'category',
    title: '分类',
    useForm: true,
    formItemProps: {
      formType: 'select' as const,
      placeholder: '请选择分类',
      defaultValue: '电子产品',
      options: [
        { label: '电子产品', value: '电子产品' },
        { label: '服装', value: '服装' },
        { label: '食品', value: '食品' },
        { label: '家居', value: '家居' }
      ]
    }
  }
]

// 获取产品数据（用于 DialogSelect）
const fetchProductDataForDialog = async (
  params: FetchDialogSelectDataParams
): Promise<FetchDialogSelectDataResult> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))

  const { page, pageSize, name, category } = params

  // 根据筛选条件过滤
  let filteredProducts = mockProducts
  if (name) {
    filteredProducts = filteredProducts.filter(product => product.name.includes(name as string))
  }
  if (category) {
    filteredProducts = filteredProducts.filter(product => product.category === category)
  }

  // 分页处理
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const data = filteredProducts.slice(start, end)
  console.log('data', data)
  return {
    data,
    total: filteredProducts.length
  }
}

// 员工 keyGetter：使用 id 作为 key
const employeeKeyGetter = (row: TableRowItem<Employee>) => {
  return row.id
}

// 产品 keyGetter：使用 id 和 category 拼接作为 key
const productKeyGetter = (row: TableRowItem) => {
  return `${row.id}-${row.category}`
}

const handleDialogSelectChange1 = (value: TableRowItem | null, selectedRows: TableRowItem[]) => {
  console.log('dialogSelect1 changed:', value, selectedRows)
}

const handleDialogSelectChange2 = (value: TableRowItem[] | null, selectedRows: TableRowItem[]) => {
  console.log('dialogSelect2 changed:', value, selectedRows)
}

const handleDialogSelectChange3 = (value: TableRowItem | null, selectedRows: TableRowItem[]) => {
  console.log('dialogSelect3 changed:', value, selectedRows)
}

// openDialogSelect 函数式调用相关
// 示例1：任务表格数据（单选员工作为负责人）
const taskTableData = ref([
  { id: 1, taskName: '开发用户登录功能', owner: '', ownerData: null, status: '进行中' },
  { id: 2, taskName: '设计产品首页', owner: '', ownerData: null, status: '未开始' },
  { id: 3, taskName: '编写API文档', owner: '', ownerData: null, status: '进行中' },
  { id: 4, taskName: '修复Bug #123', owner: '', ownerData: null, status: '已完成' },
  { id: 5, taskName: '优化数据库查询', owner: '', ownerData: null, status: '进行中' }
])

const handleOwnerClick = async (row: any) => {
  try {
    const result = await openDialogSelect({
      fetchData: fetchEmployeeData,
      dialogSelectOptions: employeeDialogSelectOptions,
      keyGetter: employeeKeyGetter,
      dialogTitle: '选择负责人',
      initialValue: row.ownerData
    })

    if (result && typeof result === 'object' && !Array.isArray(result)) {
      row.owner = result.name as string
      row.ownerData = result
      ElMessage.success(`已选择负责人：${result.name}`)
    }
  } catch (error: any) {
    console.log('取消选择:', error.message)
  }
}

// 示例2：项目表格数据（多选产品）
const projectTableData = ref([
  { id: 1, projectName: '电商平台开发', products: [], productsDisplay: '' },
  { id: 2, projectName: '移动应用设计', products: [], productsDisplay: '' },
  { id: 3, projectName: '数据分析系统', products: [], productsDisplay: '' }
])

const handleProductsClick = async (row: any) => {
  try {
    const result = await openDialogSelect({
      fetchData: fetchProductDataForDialog,
      dialogSelectOptions: productDialogSelectOptions,
      keyGetter: productKeyGetter,
      multiple: true,
      valueKey: 'id',
      labelKey: 'name',
      dialogTitle: '选择产品',
      initialValue: row.products
    })

    if (result && Array.isArray(result)) {
      row.products = result
      row.productsDisplay = result.map((item: any) => item.name).join(', ')
      ElMessage.success(`已选择 ${result.length} 个产品`)
    }
  } catch (error: any) {
    console.log('取消选择:', error.message)
  }
}

// 示例3：工单表格数据（带初始值的单选）
const ticketTableData = ref([
  {
    id: 1,
    ticketNo: 'TK-001',
    title: '系统登录异常',
    assignee: '员工3',
    assigneeData: {
      id: 3,
      name: '员工3',
      department: '运营部',
      email: 'employee3@example.com',
      phone: '13800000003',
      status: '离职'
    },
    priority: '高'
  },
  {
    id: 2,
    ticketNo: 'TK-002',
    title: '页面加载缓慢',
    assignee: '',
    assigneeData: null,
    priority: '中'
  },
  {
    id: 3,
    ticketNo: 'TK-003',
    title: '数据导出功能失效',
    assignee: '',
    assigneeData: null,
    priority: '低'
  }
])

const handleAssigneeClick = async (row: any) => {
  try {
    const result = await openDialogSelect({
      fetchData: fetchEmployeeData,
      dialogSelectOptions: employeeDialogSelectOptions,
      keyGetter: employeeKeyGetter,
      dialogTitle: '选择指派人',
      // 传入初始值，会在弹窗打开时自动选中
      initialValue: row.assigneeData
    })

    if (result && typeof result === 'object' && !Array.isArray(result)) {
      row.assignee = result.name as string
      row.assigneeData = result
      ElMessage.success(`已指派给：${result.name}`)
    }
  } catch (error: any) {
    console.log('取消选择:', error.message)
  }
}

// DropdownList 相关
// 订单表格数据
const orderTableData = ref([
  { id: 1, orderNo: 'ORD-2024-001', customerName: '张三', amount: '¥1,280.00', status: '待支付' },
  { id: 2, orderNo: 'ORD-2024-002', customerName: '李四', amount: '¥2,560.00', status: '已支付' },
  { id: 3, orderNo: 'ORD-2024-003', customerName: '王五', amount: '¥3,840.00', status: '已发货' },
  { id: 4, orderNo: 'ORD-2024-004', customerName: '赵六', amount: '¥5,120.00', status: '已完成' },
  { id: 5, orderNo: 'ORD-2024-005', customerName: '钱七', amount: '¥890.00', status: '已取消' }
])
type Order = {
  id: number
  orderNo: string
  customerName: string
  amount: string
  status: string
}
// 获取订单下拉列表配置
const getOrderDropdownList = (row: Order): DropdownListItemType[] => {
  return [
    {
      content: `查看详情：${row.orderNo}`,
      command: 'view',
      show: true
    },
    {
      content: '编辑订单',
      command: 'edit',
      show: row.status === '待支付' || row.status === '已支付'
    },
    {
      content: '确认支付',
      command: 'pay',
      show: row.status === '待支付',
      divided: true
    },
    {
      content: '发货',
      command: 'ship',
      show: row.status === '已支付'
    },
    {
      content: '完成订单',
      command: 'complete',
      show: row.status === '已发货'
    },
    {
      content: '取消订单',
      command: 'cancel',
      show: row.status === '待支付' || row.status === '已支付',
      divided: true
    },
    {
      content: '删除订单',
      command: 'delete',
      show: row.status === '已取消'
    }
  ]
}

// 获取状态标签类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    待支付: 'warning',
    已支付: 'success',
    已发货: 'primary',
    已完成: 'info',
    已取消: 'danger'
  }
  return typeMap[status] || 'info'
}

const taskDropdownListRef = ref<DropdownListInstance>()

// 任务表格数据（用于下拉列表）
const taskTableDataForDropdown = ref([
  { id: 1, taskName: '开发登录功能', assignee: '张三', status: '进行中' },
  { id: 2, taskName: '设计首页', assignee: '李四', status: '未开始' },
  { id: 3, taskName: '编写文档', assignee: '王五', status: '已完成' },
  { id: 4, taskName: '测试功能', assignee: '赵六', status: '进行中' }
])
type Task = {
  id: number
  taskName: string
  assignee: string
  status: string
}
// 获取任务下拉列表配置
const getTaskDropdownList = (row: Task): DropdownListItemType[] => {
  return [
    {
      content: '查看详情',
      command: 'view',
      show: true
    },
    {
      content: '开始任务',
      command: 'start',
      show: row.status === '未开始'
    },
    {
      content: '暂停任务',
      command: 'pause',
      show: row.status === '进行中'
    },
    {
      content: '完成任务',
      command: 'complete',
      show: row.status === '进行中',
      divided: true
    },
    {
      content: '重新开始',
      command: 'restart',
      show: row.status === '已完成'
    },
    {
      content: '编辑',
      command: 'edit',
      show: row.status !== '已完成',
      divided: true
    },
    {
      content: '删除',
      command: 'delete',
      show: true,
      disabled: row.status === '进行中'
    }
  ]
}

// 获取任务状态标签类型
const getTaskStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    未开始: 'info',
    进行中: 'warning',
    已完成: 'success'
  }
  return typeMap[status] || 'info'
}

// 处理订单下拉菜单命令
const handleOrderCommand = (command: string | number | object, row: Order) => {
  console.log('执行订单操作:', command, row)
  console.log('taskDropdownListRef', taskDropdownListRef.value)
  const commandStr = String(command)
  const messages: Record<string, string> = {
    view: `查看订单详情：${row.orderNo}`,
    edit: `编辑订单：${row.orderNo}`,
    pay: `确认支付订单：${row.orderNo}`,
    ship: `发货订单：${row.orderNo}`,
    complete: `完成订单：${row.orderNo}`,
    cancel: `取消订单：${row.orderNo}`,
    delete: `删除订单：${row.orderNo}`
  }

  ElMessage.success(messages[commandStr] || '执行操作')

  // 更新订单状态（模拟）
  if (commandStr === 'pay') {
    row.status = '已支付'
  } else if (commandStr === 'ship') {
    row.status = '已发货'
  } else if (commandStr === 'complete') {
    row.status = '已完成'
  } else if (commandStr === 'cancel') {
    row.status = '已取消'
  } else if (commandStr === 'delete') {
    const index = orderTableData.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      orderTableData.value.splice(index, 1)
    }
  }
}

// 处理任务下拉菜单命令
const handleTaskCommand = (command: string | number | object, row: Task) => {
  console.log('执行任务操作:', command, row)

  const commandStr = String(command)
  const messages: Record<string, string> = {
    view: `查看任务详情：${row.taskName}`,
    start: `开始任务：${row.taskName}`,
    pause: `暂停任务：${row.taskName}`,
    complete: `完成任务：${row.taskName}`,
    restart: `重新开始任务：${row.taskName}`,
    edit: `编辑任务：${row.taskName}`,
    delete: `删除任务：${row.taskName}`
  }

  ElMessage.success(messages[commandStr] || '执行操作')

  // 更新任务状态（模拟）
  if (commandStr === 'start') {
    row.status = '进行中'
  } else if (commandStr === 'pause') {
    row.status = '未开始'
  } else if (commandStr === 'complete') {
    row.status = '已完成'
  } else if (commandStr === 'restart') {
    row.status = '进行中'
  } else if (commandStr === 'delete') {
    const index = taskTableDataForDropdown.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      taskTableDataForDropdown.value.splice(index, 1)
    }
  }
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

.cell-link {
  color: #409eff;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s;
}

.cell-link:hover {
  color: #66b1ff;
}
</style>
