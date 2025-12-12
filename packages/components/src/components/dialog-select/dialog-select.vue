<template>
  <el-config-provider :locale="zhCn">
    <div class="dialog-select">
      <el-input
        ref="inputRef"
        v-model="displayText"
        :placeholder="placeholder"
        :clearable="clearable"
        :disabled="disabled"
        :style="style"
        readonly
        @click="handleInputClick"
        @clear="handleClear"
      />

      <el-dialog
        v-model="dialogVisible"
        :title="dialogTitle"
        :width="dialogWidth"
        :close-on-click-modal="false"
        @close="handleDialogClose"
      >
        <!-- 表单筛选区域 -->
        <div v-if="formItems && formItems.length > 0" class="dialog-select-form">
          <el-form :model="formData" inline>
            <el-form-item v-for="item in formItems" :key="item.field" :label="item.label">
              <el-input
                v-if="item.type === 'input'"
                v-model="formData[item.field]"
                :placeholder="item.placeholder || `请输入${item.label}`"
                clearable
                v-bind="item.props"
                style="width: 200px"
                @change="handleFormChange"
              />
              <el-select
                v-else-if="item.type === 'select'"
                v-model="formData[item.field]"
                :placeholder="item.placeholder || `请选择${item.label}`"
                clearable
                v-bind="item.props"
                style="width: 200px"
                @change="handleFormChange"
              >
                <el-option
                  v-for="option in getSelectOptions(item)"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
              <el-date-picker
                v-else
                v-model="formData[item.field]"
                :placeholder="item.placeholder || `请选择${item.label}`"
                clearable
                v-bind="item.props"
                style="width: 200px"
                @change="handleFormChange"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleFormSubmit">搜索</el-button>
              <el-button @click="handleFormReset">重置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 表格区域 -->
        <div class="dialog-select-table">
          <vxe-grid
            ref="gridRef"
            :loading="loading"
            :data="tableData"
            :columns="computedColumns"
            :pager-config="pagerConfig"
            :checkbox-config="checkboxConfig"
            :radio-config="radioConfig"
            :row-config="rowConfig"
            highlight-current-row
            v-bind="gridConfig"
            @page-change="handlePageChange"
            @checkbox-change="handleCheckboxChange"
            @checkbox-all="handleCheckboxAll"
            @radio-change="handleRadioChange"
          />
        </div>

        <template #footer>
          <div class="dialog-select-footer">
            <div class="dialog-select-footer-info">
              <span v-if="multiple">已选择 {{ selectedRows.length }} 项</span>
            </div>
            <div>
              <el-button @click="handleDialogClose">取消</el-button>
              <el-button type="primary" @click="handleConfirm">确定</el-button>
            </div>
          </div>
        </template>
      </el-dialog>
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import { ref, computed, watch, readonly, nextTick } from 'vue'
import {
  ElInput,
  ElDialog,
  ElButton,
  ElForm,
  ElFormItem,
  ElSelect,
  ElOption,
  ElDatePicker,
  ElMessage,
  ElConfigProvider
} from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import type { VxeGridInstance } from 'vxe-table'
import type {
  DialogSelectProps,
  DialogSelectEmits,
  TableRowItem,
  FetchDialogSelectDataParams,
  FormItemOption,
  FormItem
} from './types'

defineOptions({
  name: 'IipDialogSelect'
})

// 默认每页显示条数
const DEFAULT_PAGE_SIZE = 10

const props = withDefaults(defineProps<DialogSelectProps>(), {
  modelValue: null,
  placeholder: '请选择',
  multiple: false,
  valueKey: 'id',
  labelKey: 'name',
  clearable: true,
  disabled: false,
  dialogTitle: '请选择',
  dialogWidth: '1100px',
  formItems: () => [],
  gridConfig: undefined,
  style: () => ({})
})

const emit = defineEmits<DialogSelectEmits>()

// 响应式数据
const gridRef = ref<VxeGridInstance>()
const dialogVisible = ref(false)
const loading = ref(false)
const tableData = ref<TableRowItem[]>([])
const total = ref(0)
const currentPage = ref(1)
const currentPageSize = ref(DEFAULT_PAGE_SIZE)
const formData = ref<Record<string, any>>({})
const selectedRows = ref<TableRowItem[]>([])
const selectedRowKeys = ref<(string | number)[]>([])
// 存储每个表单项的选项数据
const formItemOptions = ref<Record<string, FormItemOption[]>>({})

// 获取行的唯一标识key
const getRowKey = (row: TableRowItem): string | number => {
  if (props.keyGetter) {
    return props.keyGetter(row)
  }
  return row[props.valueKey]
}

// 计算属性
const displayText = computed(() => {
  if (!props.modelValue) return ''

  if (props.multiple) {
    const values = props.modelValue as TableRowItem[]
    if (values.length === 0) return ''
    return values.map(item => item[props.labelKey] || String(item[props.valueKey])).join(', ')
  } else {
    const value = props.modelValue as TableRowItem
    return value[props.labelKey] || String(value[props.valueKey]) || ''
  }
})

// 初始化表单数据
const initFormData = () => {
  const data: Record<string, any> = {}

  for (const item of props.formItems || []) {
    if (item.defaultValue !== undefined) {
      // 如果 defaultValue 是函数，执行函数获取值
      if (typeof item.defaultValue === 'function') {
        try {
          data[item.field] = item.defaultValue()
        } catch (error) {
          console.error(`获取表单项 ${item.field} 的默认值失败:`, error)
          data[item.field] = undefined
        }
      } else {
        // 否则直接使用值
        data[item.field] = item.defaultValue
      }
    } else {
      if (item.type === 'select' || item.type === 'date') {
        data[item.field] = undefined
      } else {
        data[item.field] = ''
      }
    }
  }

  formData.value = data
}

// 获取下拉选项
const getSelectOptions = (item: FormItem): FormItemOption[] => {
  if (!item.options) return []

  // 如果 options 是数组，直接返回
  if (Array.isArray(item.options)) {
    return item.options
  }

  // 如果 options 是函数，从缓存中获取或执行函数
  if (typeof item.options === 'function') {
    if (formItemOptions.value[item.field]) {
      return formItemOptions.value[item.field]
    }
    // 如果是异步函数，返回空数组，在打开弹窗时加载
    return []
  }

  return []
}

// 加载表单项的选项数据
const loadFormItemOptions = async () => {
  if (!props.formItems) return

  for (const item of props.formItems) {
    if (item.type === 'select' && typeof item.options === 'function') {
      try {
        const result = await item.options()
        formItemOptions.value[item.field] = Array.isArray(result) ? result : []
      } catch (error) {
        console.error(`加载表单项 ${item.field} 的选项失败:`, error)
        formItemOptions.value[item.field] = []
      }
    }
  }
}

// 计算列配置，动态添加 radio 或 checkbox 列
const computedColumns = computed(() => {
  const baseColumns = props.columns || []

  // 检查是否已经有 radio 或 checkbox 列
  const hasRadioOrCheckbox = baseColumns.some(
    col => col.type === 'radio' || col.type === 'checkbox'
  )

  if (hasRadioOrCheckbox) {
    return baseColumns
  }

  // 根据 multiple 添加对应的列
  const selectColumn = props.multiple
    ? { type: 'checkbox' as const, width: 60, fixed: 'left' as const }
    : { type: 'radio' as const, width: 60, fixed: 'left' as const }

  return [selectColumn, ...baseColumns] as any
})

const pagerConfig = computed(() => {
  return {
    currentPage: currentPage.value,
    pageSize: currentPageSize.value,
    total: total.value,
    pageSizes: [10, 20, 50, 100],
    layouts: [
      'PrevJump',
      'PrevPage',
      'Number',
      'NextPage',
      'NextJump',
      'Sizes',
      'FullJump',
      'Total'
    ]
  } as any
})

const checkboxConfig = computed(() => {
  if (!props.multiple) return undefined
  return {
    trigger: 'row' as const // 点击行触发
  }
})

const radioConfig = computed(() => {
  if (props.multiple) return undefined
  return {
    trigger: 'row' as const // 点击行触发
  } as any
})

const rowConfig = computed(() => {
  return {
    isCurrent: true, // 启用当前行高亮
    isHover: true // 启用悬停效果
  }
})

const gridConfig = computed(() => {
  // 默认配置
  const defaultConfig = {
    border: true,
    height: '500px'
  }
  // 合并用户传入的配置
  return {
    ...defaultConfig,
    ...props.gridConfig
  } as any
})

// 监听 modelValue 变化，同步选中状态
watch(
  () => props.modelValue,
  async newVal => {
    if (!dialogVisible.value) return

    if (props.multiple) {
      const values = (newVal as TableRowItem[]) || []
      selectedRows.value = values
      selectedRowKeys.value = values.map(item => getRowKey(item))
      // 更新表格选中状态
      await nextTick()
      if (gridRef.value) {
        gridRef.value.setCheckboxRow(values, true)
      }
    } else {
      const value = newVal as TableRowItem | null
      selectedRows.value = value ? [value] : []
      selectedRowKeys.value = value ? [getRowKey(value)] : []
      // 更新表格选中状态
      await nextTick()
      if (gridRef.value && value) {
        gridRef.value.setRadioRow(value)
      }
    }
  },
  { immediate: true, deep: true }
)

// 同步选中状态到表格
const syncSelectedToTable = async () => {
  if (!gridRef.value || !dialogVisible.value) return

  await nextTick()
  if (props.multiple) {
    // 多选模式：根据 selectedRows 设置表格选中状态
    if (selectedRows.value.length > 0) {
      // 只选中当前页存在的行
      const currentPageRows = tableData.value.filter(row => {
        const rowKey = getRowKey(row)
        return selectedRows.value.some(selected => getRowKey(selected) === rowKey)
      })
      if (currentPageRows.length > 0) {
        gridRef.value.setCheckboxRow(currentPageRows, true)
      }
    } else {
      // 清空所有选中
      gridRef.value.clearCheckboxRow()
    }
  } else {
    // 单选模式：根据 selectedRows 设置表格选中状态
    if (selectedRows.value.length > 0) {
      const selectedRow = selectedRows.value[0]
      // 检查当前页是否有选中的行
      const selectedKey = getRowKey(selectedRow)
      const currentPageRow = tableData.value.find(row => getRowKey(row) === selectedKey)
      if (currentPageRow) {
        gridRef.value.setRadioRow(currentPageRow)
      } else {
        // 如果当前页没有选中的行，清空选中
        gridRef.value.clearRadioRow()
      }
    } else {
      // 清空选中
      gridRef.value.clearRadioRow()
    }
  }
}

// 获取数据
const fetchData = async () => {
  if (!props.fetchData) {
    console.warn('DialogSelect: fetchData prop is required')
    return
  }

  loading.value = true

  try {
    const params: FetchDialogSelectDataParams = {
      page: currentPage.value,
      pageSize: currentPageSize.value,
      ...formData.value
    }

    const result = await props.fetchData(params)

    tableData.value = result.data || []
    total.value = result.total || 0

    emit('data-loaded', result)

    // 数据加载完成后，同步选中状态到表格
    syncSelectedToTable()
  } catch (error) {
    console.error('DialogSelect fetch data error:', error)
    emit('error', error)
    tableData.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 处理输入框点击
const handleInputClick = () => {
  if (props.disabled) return
  open()
}

// 打开弹窗
const open = async () => {
  dialogVisible.value = true
  currentPage.value = 1
  currentPageSize.value = DEFAULT_PAGE_SIZE

  // 初始化表单数据（使用 formItems 中的 defaultValue）
  initFormData()

  selectedRows.value = []
  selectedRowKeys.value = []

  // 加载表单项的选项数据
  await loadFormItemOptions()

  // 如果有选中值，需要回显
  if (props.modelValue) {
    if (props.multiple) {
      const values = props.modelValue as TableRowItem[]
      selectedRows.value = [...values]
      selectedRowKeys.value = values.map(item => getRowKey(item))
    } else {
      const value = props.modelValue as TableRowItem
      selectedRows.value = [value]
      selectedRowKeys.value = [getRowKey(value)]
    }
  }

  fetchData()
  emit('dialog-visible-change', true)
}

// 关闭弹窗
const close = () => {
  dialogVisible.value = false
  emit('dialog-visible-change', false)
}

// 处理弹窗关闭
const handleDialogClose = () => {
  close()
}

// 处理表单变化
const handleFormChange = () => {
  // 抛出表单变化事件
  emit('form-change', { ...formData.value })
}

// 处理表单提交（搜索）
const handleFormSubmit = () => {
  currentPage.value = 1
  fetchData()
}

// 处理表单重置
const handleFormReset = () => {
  initFormData()
  currentPage.value = 1
  fetchData()
}

// 处理分页变化（包括 pageSize 变化）
const handlePageChange = ({
  currentPage: page,
  pageSize
}: {
  currentPage: number
  pageSize: number
}) => {
  // 如果 pageSize 发生变化，需要重置到第一页
  if (pageSize !== currentPageSize.value) {
    currentPageSize.value = pageSize
    currentPage.value = 1
  } else {
    currentPage.value = page
  }
  fetchData()
}

// 处理多选变化
const handleCheckboxChange = ({ row, checked }: { row: TableRowItem; checked: boolean }) => {
  const rowKey = getRowKey(row)
  if (checked) {
    if (!selectedRows.value.find(item => getRowKey(item) === rowKey)) {
      selectedRows.value.push(row)
    }
  } else {
    selectedRows.value = selectedRows.value.filter(item => getRowKey(item) !== rowKey)
  }
  selectedRowKeys.value = selectedRows.value.map(item => getRowKey(item))
}

// 处理全选
const handleCheckboxAll = ({ checked, records }: { checked: boolean; records: TableRowItem[] }) => {
  if (checked) {
    // 全选：将当前页所有行添加到选中列表
    records.forEach(row => {
      const rowKey = getRowKey(row)
      if (!selectedRows.value.find(item => getRowKey(item) === rowKey)) {
        selectedRows.value.push(row)
      }
    })
  } else {
    // 取消全选：从选中列表中移除当前页所有行
    // 使用 tableData 获取当前页所有行，而不是 records（records 可能只包含已选中的行）
    const currentPageKeys = tableData.value.map(row => getRowKey(row))
    selectedRows.value = selectedRows.value.filter(
      item => !currentPageKeys.includes(getRowKey(item))
    )
  }
  selectedRowKeys.value = selectedRows.value.map(item => getRowKey(item))
}

// 处理单选变化
const handleRadioChange = ({ row }: { row: TableRowItem }) => {
  selectedRows.value = [row]
  selectedRowKeys.value = [getRowKey(row)]
}

// 处理确认
const handleConfirm = () => {
  // 判断至少选择一个
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请至少选择一项')
    return
  }

  if (props.multiple) {
    emit('update:modelValue', selectedRows.value)
    emit('change', selectedRows.value, selectedRows.value)
  } else {
    const value = selectedRows.value[0]
    emit('update:modelValue', value)
    emit('change', value, selectedRows.value)
  }
  close()
}

// 处理清空
const handleClear = () => {
  emit('update:modelValue', null)
  emit('change', null, [])
  emit('clear')
}

// 刷新数据
const refresh = () => {
  currentPage.value = 1
  fetchData()
}

// 暴露方法
defineExpose({
  open,
  close,
  refresh,
  loading: readonly(loading),
  tableData: readonly(tableData),
  total: readonly(total),
  currentPage: readonly(currentPage)
})
</script>

<style scoped lang="scss">
.dialog-select {
  width: 100%;
}

.dialog-select-form {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.dialog-select-table {
  margin-bottom: 16px;
}

.dialog-select-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .dialog-select-footer-info {
    color: var(--el-text-color-regular);
    font-size: 14px;
  }
}

:deep(.el-input__inner) {
  cursor: pointer;
}
</style>
