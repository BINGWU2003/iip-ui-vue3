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

      <!-- Form 组件预览 -->
      <div class="demo-section">
        <h2>Form 表单组件</h2>

        <!-- 基础表单 -->
        <div class="demo-item">
          <h3>基础表单 (网格布局)</h3>
          <iip-form
            ref="formRef"
            :model="formModel"
            :form-items="formItems"
            :actions-config="actionsConfig"
            :row-props="{ gutter: 20 }"
            label-width="100px"
            @submit="handleFormSubmit"
            @reset="handleFormReset"
          />
        </div>

        <!-- 内联表单 -->
        <div class="demo-item">
          <h3>内联表单 (搜索表单)</h3>
          <iip-form
            :model="inlineFormModel"
            :form-items="inlineFormItems"
            :actions-config="inlineActionsConfig"
            inline
            label-width="80px"
            @submit="handleInlineSearch"
            @reset="handleInlineReset"
          >
            <template #form-item-status1>
              <el-select
                v-model="inlineFormModel.status1"
                placeholder="请选择状态1"
                style="width: 300px"
              >
                <el-option label="全部" value="" />
                <el-option label="激活" value="active" />
                <el-option label="禁用" value="inactive" />
              </el-select>
            </template>
          </iip-form>
        </div>

        <!-- 表单数据展示 -->
        <div class="demo-item">
          <h3>表单数据</h3>
          <div class="form-data-display">
            <h4>基础表单数据：</h4>
            <pre>{{ JSON.stringify(formModel, null, 2) }}</pre>

            <h4>内联表单数据：</h4>
            <pre>{{ JSON.stringify(inlineFormModel, null, 2) }}</pre>
          </div>
        </div>
      </div>

      <!-- DateRange 组件预览 -->
      <div class="demo-section">
        <h2>DateRange 日期范围组件</h2>

        <!-- 基础日期范围选择器 -->
        <div class="demo-item">
          <h3>基础日期范围选择器</h3>
          <iip-date-range v-model="dateRangeModel" @change="handleDateRangeChange" />
          <div class="form-data-display">
            <h4>选中的日期范围：</h4>
            <pre>{{ JSON.stringify(dateRangeModel, null, 2) }}</pre>
          </div>
        </div>

        <!-- 自定义配置的日期范围选择器 -->
        <div class="demo-item">
          <h3>自定义配置的日期范围选择器</h3>
          <iip-date-range
            v-model="dateRangeModel2"
            :gap="20"
            :select-future-time="true"
            :start-props="{
              placeholder: '选择开始日期',
            }"
            :startPickerCss="{ width: '280px' }"
            :end-props="{
              placeholder: '选择结束日期',
            }"
            :endPickerCss="{ width: '280px' }"
            @change="handleDateRangeChange2"
          />
          <div class="form-data-display">
            <h4>自定义配置日期范围：</h4>
            <pre>{{ JSON.stringify(dateRangeModel2, null, 2) }}</pre>
          </div>
        </div>
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
import { ref, onMounted, reactive } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import type { IipTableExpose, FormExpose, FormItemConfig } from '@bingwu/iip-ui-components'
import { eovaConverter } from '@bingwu/iip-ui-utils'
const tableRef = ref<IipTableExpose | null>(null)
const formRef = ref<FormExpose | null>(null)

// 基础方法
const showMessage = () => {
  ElMessage.success('开发环境配置成功！')
}

// 表单数据
const formModel = reactive({
  name: '',
  age: 25,
  email: '',
  department: '',
  joinDate: '',
  workTime: '',
  isActive: true,
})

// 表单项配置
const formItems: FormItemConfig[] = [
  {
    formItemProps: { label: '姓名', prop: 'name', required: true },
    colProps: { span: 12 },
    show: true,
    componentProps: {
      type: 'input',
      formItemKey: 'name',
      itemProps: {
        placeholder: '请输入姓名',
        clearable: true,
      },
    },
  },
  {
    formItemProps: { label: '年龄', prop: 'age' },
    colProps: { span: 12 },
    show: true,
    componentProps: {
      type: 'number',
      formItemKey: 'age',
      itemProps: {
        min: 18,
        max: 65,
        placeholder: '请输入年龄',
      },
    },
  },
  {
    formItemProps: { label: '邮箱', prop: 'email', required: true },
    colProps: { span: 12 },
    show: true,
    componentProps: {
      type: 'input',
      formItemKey: 'email',
      itemProps: {
        placeholder: '请输入邮箱地址',
        clearable: true,
      },
    },
  },
  {
    formItemProps: { label: '部门', prop: 'department' },
    colProps: { span: 12 },
    show: true,
    componentProps: {
      type: 'select',
      formItemKey: 'department',
      itemProps: {
        placeholder: '请选择部门',
        clearable: true,
        options: [
          { label: '研发部', value: '研发部' },
          { label: '产品部', value: '产品部' },
          { label: '设计部', value: '设计部' },
          { label: '运营部', value: '运营部' },
        ],
      },
    },
  },
  {
    formItemProps: { label: '入职日期', prop: 'joinDate' },
    colProps: { span: 12 },
    show: true,
    componentProps: {
      type: 'datetime',
      formItemKey: 'joinDate',
      itemProps: {
        placeholder: '请选择入职日期',
        type: 'date',
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
      },
    },
  },
  {
    formItemProps: { label: '工作时间', prop: 'workTime' },
    colProps: { span: 12 },
    show: true,
    componentProps: {
      type: 'time',
      formItemKey: 'workTime',
      itemProps: {
        placeholder: '请选择工作时间',
        format: 'HH:mm',
        valueFormat: 'HH:mm',
      },
    },
  },
  {
    formItemProps: { label: '状态', prop: 'isActive' },
    colProps: { span: 24 },
    show: true,
    componentProps: {
      type: 'switch',
      formItemKey: 'isActive',
      itemProps: {
        activeText: '激活',
        inactiveText: '禁用',
      },
    },
  },
]

// 内联表单配置
const inlineFormItems: FormItemConfig[] = [
  {
    formItemProps: { label: '关键词' },
    show: true,
    componentProps: {
      type: 'input',
      formItemKey: 'keyword',
      itemProps: {
        placeholder: '请输入关键词',
        clearable: true,
      },
    },
  },
  {
    formItemProps: { label: '状态' },
    show: true,
    componentProps: {
      type: 'select',
      formItemKey: 'status',
      itemProps: {
        placeholder: '请选择状态',
        clearable: true,
        options: [
          { label: '全部', value: '' },
          { label: '激活', value: 'active' },
          { label: '禁用', value: 'inactive' },
        ],
      },
    },
  },
  {
    formItemProps: { label: '状态1自定义插槽', labelWidth: '150px' },
    show: true,
    componentProps: {
      type: 'select',
      formItemKey: 'status1',
      itemProps: {
        placeholder: '请选择状态1',
        clearable: true,
        options: [
          { label: '全部', value: '' },
          { label: '激活', value: 'active' },
          { label: '禁用', value: 'inactive' },
        ],
      },
    },
  },
]

const inlineFormModel = reactive({
  keyword: '',
  status: '',
  status1: '',
})

// DateRange 组件数据
const dateRangeModel = reactive({
  startTime: '',
  endTime: '',
})

const dateRangeModel2 = reactive({
  startTime: '',
  endTime: '',
})

// 表单操作配置
const actionsConfig = {
  show: true,
  span: 24,
  align: 'center' as const,
  submitText: '提交表单',
  resetText: '重置表单',
  submitProps: { type: 'primary' as const },
  resetProps: { type: 'default' as const },
  showSubmit: true,
  showReset: true,
}

const inlineActionsConfig = {
  show: true,
  submitText: '搜索',
  resetText: '重置',
  submitProps: { type: 'primary' as const },
  resetProps: { type: 'default' as const },
  showSubmit: true,
  showReset: true,
}

// 表单方法
const handleFormSubmit = () => {
  console.log('表单提交:', formModel)
  ElMessage.success('表单提交成功！')
}

const handleFormReset = () => {
  Object.assign(formModel, {
    name: '',
    age: 25,
    email: '',
    department: '',
    joinDate: '',
    workTime: '',
    isActive: true,
  })
  ElMessage.info('表单已重置')
}

const handleInlineSearch = () => {
  console.log('搜索条件:', inlineFormModel)
  ElMessage.success('搜索执行成功！')
}

const handleInlineReset = () => {
  Object.assign(inlineFormModel, {
    keyword: '',
    status: '',
  })
  ElMessage.info('搜索条件已重置')
}

// DateRange 组件方法
const handleDateRangeChange = (value: { startTime: string; endTime: string }) => {
  console.log('日期范围改变:', value)
  ElMessage.success(`日期范围已选择: ${value.startTime} 至 ${value.endTime}`)
}

const handleDateRangeChange2 = (value: { startTime: string; endTime: string }) => {
  console.log('日期范围2改变:', value)
  ElMessage.info(`自定义日期范围: ${value.startTime} 至 ${value.endTime}`)
}

const pageChangeEvent = (params: any) => {
  console.log(params)
}
const footerData = ref([
  { seq: '合计', age: '18' },
  { seq: '平均', age: '18' },
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
    createTime: '2021-01-01',
  },
  {
    name: '张三',
    age: 18,
    email: 'zhangsan@example.com',
    department: '研发部',
    createTime: '2021-01-01',
  },
  {
    name: '张三',
    age: 18,
    email: 'zhangsan@example.com',
    department: '研发部',
    createTime: '2021-01-01',
  },
  {
    name: '张三',
    age: 18,
    email: 'zhangsan@example.com',
    department: '研发部',
    createTime: '2021-01-01',
  },
])

// 基础列配置
const basicColumns = [
  {
    tableColumnProps: { field: 'name', title: '姓名', width: 120 },
  },
  {
    tableColumnProps: {
      field: 'age',
      title: '年龄',
      width: 200,
      sortable: true,
      editRender: { name: 'input', attrs: { type: 'number' } },
    },
  },
  { tableColumnProps: { field: 'email', title: '邮箱', minWidth: 200 } },
  {
    tableColumnProps: { field: 'department', title: '部门', width: 120 },
  },
  {
    tableColumnProps: { field: 'createTime', title: '创建时间', width: 120 },
  },
  {
    tableColumnProps: { field: 'action', title: '操作', width: 200, fixed: 'right' },
  },
  {
    tableColumnProps: { field: 'sum', title: '合计', width: 100 },
  },
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
  onPageChange: pageChangeEvent,
})

onMounted(() => {
  setTimeout(() => {
    const instance = tableRef.value?.getTableInstance()
    console.log(instance?.getTableData())
  }, 1000)
  setTimeout(() => {
    const instance = formRef.value?.getFormInstance()
    console.log(instance)
  }, 1000)
  console.log(eovaConverter)
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

.form-data-display {
  margin-top: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.form-data-display h4 {
  margin: 0 0 10px 0;
  color: #495057;
  font-size: 14px;
  font-weight: 600;
}

.form-data-display pre {
  margin: 0 0 20px 0;
  padding: 12px;
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.5;
  color: #495057;
  overflow-x: auto;
}

.form-data-display pre:last-child {
  margin-bottom: 0;
}
</style>
