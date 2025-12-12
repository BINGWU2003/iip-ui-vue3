<template>
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
      <!-- 使用vxe-grid，包含表单和表格 -->
      <div class="dialog-select-grid">
        <vxe-grid
          ref="gridRef"
          :loading="loading"
          :data="tableData"
          :columns="computedColumns"
          :form-config="formConfigComputed"
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
          @form-submit="handleFormSubmit"
          @form-reset="handleFormReset"
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
</template>

<script setup lang="ts">
import { ref, computed, watch, readonly, nextTick } from 'vue'
import { ElInput, ElDialog, ElButton } from 'element-plus'
import type { VxeGridInstance } from 'vxe-table'
import type {
  DialogSelectProps,
  DialogSelectEmits,
  TableRowItem,
  FetchDialogSelectDataParams
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
  dialogWidth: '800px',
  formConfig: undefined,
  style: () => ({})
})

const emit = defineEmits<DialogSelectEmits>()

// 响应式数据
const inputRef = ref<InstanceType<typeof ElInput>>()
const gridRef = ref<VxeGridInstance>()
const dialogVisible = ref(false)
const loading = ref(false)
const tableData = ref<TableRowItem[]>([])
const total = ref(0)
const currentPage = ref(1)
const formData = ref<Record<string, any>>({})
const selectedRows = ref<TableRowItem[]>([])
const selectedRowKeys = ref<(string | number)[]>([])

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

const formConfigComputed = computed(() => {
  if (!props.formConfig) return undefined

  // 获取原始 items
  const originalItems = props.formConfig.items || []

  // 检查是否已经有按钮项
  const hasButtons = originalItems.some(
    (item: any) => item.itemRender?.name === 'VxeButton' || item.itemRender?.name === 'button'
  )

  // 如果没有按钮，则添加搜索和重置按钮
  const items = hasButtons
    ? originalItems
    : [
        ...originalItems,
        {
          itemRender: {
            name: 'VxeButton',
            props: {
              type: 'submit',
              content: '搜索',
              status: 'primary'
            }
          }
        },
        {
          itemRender: {
            name: 'VxeButton',
            props: {
              type: 'reset',
              content: '重置'
            }
          }
        }
      ]

  return {
    ...props.formConfig,
    data: formData.value,
    items
  } as any
})

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
    pageSize: DEFAULT_PAGE_SIZE,
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
  return {
    border: true,
    height: '500px'
  }
})

// 监听 modelValue 变化，同步选中状态
watch(
  () => props.modelValue,
  newVal => {
    if (!dialogVisible.value) return

    if (props.multiple) {
      const values = (newVal as TableRowItem[]) || []
      selectedRows.value = values
      selectedRowKeys.value = values.map(item => item[props.valueKey])
      // 更新表格选中状态
      nextTick(() => {
        if (gridRef.value) {
          gridRef.value.setCheckboxRow(values, true)
        }
      })
    } else {
      const value = newVal as TableRowItem | null
      selectedRows.value = value ? [value] : []
      selectedRowKeys.value = value ? [value[props.valueKey]] : []
      // 更新表格选中状态
      nextTick(() => {
        if (gridRef.value && value) {
          gridRef.value.setRadioRow(value)
        }
      })
    }
  },
  { immediate: true, deep: true }
)

// 获取数据
const fetchData = async () => {
  if (!props.fetchData) {
    console.warn('DialogSelect: fetchData prop is required')
    return
  }

  loading.value = true

  try {
    // 获取表单数据
    const formDataValue = gridRef.value?.getFormData() || formData.value

    const params: FetchDialogSelectDataParams = {
      page: currentPage.value,
      pageSize: DEFAULT_PAGE_SIZE,
      ...formDataValue
    }

    const result = await props.fetchData(params)

    tableData.value = result.data || []
    total.value = result.total || 0

    emit('data-loaded', result)
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
const open = () => {
  dialogVisible.value = true
  currentPage.value = 1
  formData.value = {}
  selectedRows.value = []
  selectedRowKeys.value = []

  // 如果有选中值，需要回显
  if (props.modelValue) {
    if (props.multiple) {
      const values = props.modelValue as TableRowItem[]
      selectedRows.value = [...values]
      selectedRowKeys.value = values.map(item => item[props.valueKey])
    } else {
      const value = props.modelValue as TableRowItem
      selectedRows.value = [value]
      selectedRowKeys.value = [value[props.valueKey]]
    }
  }

  // 重置表单
  nextTick(() => {
    if (gridRef.value && props.formConfig) {
      gridRef.value.resetForm()
    }
    fetchData()
  })

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

// 处理表单提交（搜索）
const handleFormSubmit = () => {
  currentPage.value = 1
  fetchData()
}

// 处理表单重置
const handleFormReset = () => {
  currentPage.value = 1
  fetchData()
}

// 处理分页变化
const handlePageChange = ({ currentPage: page }: { currentPage: number }) => {
  currentPage.value = page
  fetchData()
}

// 处理多选变化
const handleCheckboxChange = ({ row, checked }: { row: TableRowItem; checked: boolean }) => {
  if (checked) {
    if (!selectedRows.value.find(item => item[props.valueKey] === row[props.valueKey])) {
      selectedRows.value.push(row)
    }
  } else {
    selectedRows.value = selectedRows.value.filter(
      item => item[props.valueKey] !== row[props.valueKey]
    )
  }
  selectedRowKeys.value = selectedRows.value.map(item => item[props.valueKey])
}

// 处理全选
const handleCheckboxAll = ({ checked, records }: { checked: boolean; records: TableRowItem[] }) => {
  if (checked) {
    records.forEach(row => {
      if (!selectedRows.value.find(item => item[props.valueKey] === row[props.valueKey])) {
        selectedRows.value.push(row)
      }
    })
  } else {
    const currentPageKeys = records.map(row => row[props.valueKey])
    selectedRows.value = selectedRows.value.filter(
      item => !currentPageKeys.includes(item[props.valueKey])
    )
  }
  selectedRowKeys.value = selectedRows.value.map(item => item[props.valueKey])
}

// 处理单选变化
const handleRadioChange = ({ row }: { row: TableRowItem }) => {
  selectedRows.value = [row]
  selectedRowKeys.value = [row[props.valueKey]]
}

// 处理确认
const handleConfirm = () => {
  if (props.multiple) {
    emit('update:modelValue', selectedRows.value.length > 0 ? selectedRows.value : null)
    emit('change', selectedRows.value.length > 0 ? selectedRows.value : null, selectedRows.value)
  } else {
    const value = selectedRows.value.length > 0 ? selectedRows.value[0] : null
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

// 获取表格实例
const getGridInstance = () => {
  return gridRef.value
}

// 获取输入框实例
const getInputInstance = () => {
  return inputRef.value || null
}

// 暴露方法
defineExpose({
  open,
  close,
  refresh,
  getGridInstance,
  getInputInstance,
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

.dialog-select-grid {
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
