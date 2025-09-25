<template>
  <el-select
    v-model="selectedValue"
    :placeholder="placeholder"
    :loading="loading && !viewMode"
    :remote="!viewMode"
    :remote-method="handleRemoteMethod"
    :clearable="clearable && !viewMode"
    :filterable="!viewMode"
    :disabled="viewMode"
    :reserve-keyword="false"
    :popper-class="`${popperClass} pagination-select-popper`"
    v-bind="$attrs"
    :style="style"
    @change="handleChange"
    @clear="handleClear"
    @visible-change="handleVisibleChange"
    ref="selectRef"
  >
    <el-option
      v-for="item in displayOptions"
      :key="item[valueKey]"
      :label="item[labelKey]"
      :value="item[valueKey]"
      :disabled="item.disabled"
    />

    <!-- 分页器 -->
    <template v-if="showPagination && total > 0" #footer>
      <div class="pagination-select-footer">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          :pager-count="5"
          layout="prev, pager, next"
          small
          @current-change="handlePageChange"
        />
        <div class="pagination-info">共 {{ total }} 条</div>
      </div>
    </template>
  </el-select>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, readonly } from 'vue'
import type { ElSelect } from 'element-plus'
import type { PaginationSelectProps, PaginationSelectEmits, OptionItem } from './types'

defineOptions({
  name: 'iip-pagination-select',
  inheritAttrs: false
})

const props = withDefaults(defineProps<PaginationSelectProps>(), {
  modelValue: undefined,
  placeholder: '请选择',
  valueKey: 'value',
  labelKey: 'label',
  pageSize: 10,
  clearable: true,
  showPagination: true,
  popperClass: '',
  debounceTime: 300,
  immediate: false,
  displayLabel: '',
  viewMode: false,
  style: () => ({}),
  clearOptionsOnClose: false
})

const emit = defineEmits<PaginationSelectEmits>()

// 响应式数据
const selectedValue = ref(props.modelValue)
const options = ref<OptionItem[]>([])
const loading = ref(false)
const currentPage = ref(1)
const total = ref(0)
const searchKeyword = ref('')
const selectRef = ref<InstanceType<typeof ElSelect>>()
let debounceTimer = null

// 计算属性
const showPagination = computed(() => props.showPagination && total.value > props.pageSize)

// 在查看模式下，如果有 displayLabel，则创建一个虚拟选项来显示
const displayOptions = computed(() => {
  if (props.viewMode && props.displayLabel && props.modelValue) {
    // 检查当前选中的值是否在 options 中
    const existingOption = options.value.find(item => item[props.valueKey] === props.modelValue)
    if (!existingOption) {
      // 如果不存在，创建一个虚拟选项
      const virtualOption = {
        [props.valueKey]: props.modelValue,
        [props.labelKey]: props.displayLabel,
        _isVirtual: true
      }
      return [virtualOption, ...options.value]
    }
  }
  return options.value
})

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  newVal => {
    selectedValue.value = newVal
  },
  { immediate: true }
)

// 监听选中值变化
watch(selectedValue, newVal => {
  emit('update:modelValue', newVal)
})

// 处理远程搜索
const handleRemoteMethod = (query: string) => {
  // 查看模式下不执行远程搜索
  if (props.viewMode) {
    return
  }

  searchKeyword.value = query

  // 防抖处理
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  debounceTimer = setTimeout(() => {
    currentPage.value = 1
    fetchData()
  }, props.debounceTime)
}

// 获取数据
const fetchData = async () => {
  if (!props.fetchData) {
    console.warn('PaginationSelect: fetchData prop is required')
    return
  }

  loading.value = true

  try {
    const params = {
      page: currentPage.value,
      pageSize: props.pageSize,
      keyword: searchKeyword.value
    }

    const result = await props.fetchData(params)

    options.value = result.data || []
    total.value = result.total || 0

    emit('data-loaded', result)
  } catch (error) {
    console.error('PaginationSelect fetch data error:', error)
    emit('error', error)
    options.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 处理分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchData()
}

// 处理选择变化
const handleChange = (value: any) => {
  const selectedOption = options.value.find(item => item[props.valueKey] === value)
  emit('change', value, selectedOption)
}

// 处理清空
const handleClear = () => {
  emit('clear')
}

// 处理下拉框显示/隐藏
const handleVisibleChange = (visible: boolean) => {
  if (!visible && !props.viewMode && props.clearOptionsOnClose) {
    // 只在非查看模式下清空选项
    options.value = []
  }
  emit('visible-change', visible)
}

// 暴露方法
const refresh = () => {
  currentPage.value = 1
  searchKeyword.value = ''
  fetchData()
}

const search = (keyword: string) => {
  searchKeyword.value = keyword
  currentPage.value = 1
  fetchData()
}
const getSelectInstance = () => {
  return selectRef.value as InstanceType<typeof ElSelect>
}
defineExpose({
  refresh,
  search,
  loading: readonly(loading),
  options: readonly(options),
  total: readonly(total),
  currentPage: readonly(currentPage),
  getSelectInstance
})

// 组件挂载时初始化
onMounted(() => {
  if (props.immediate) {
    fetchData()
  }
})
</script>

<style scoped lang="scss">
.pagination-select-footer {
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--el-bg-color);
}

.pagination-info {
  font-size: 12px;
  color: var(--el-text-color-regular);
}

:deep(.el-pagination) {
  --el-pagination-font-size: 12px;
}

:deep(.el-pagination .el-pager li) {
  min-width: 24px;
  height: 24px;
  line-height: 24px;
  font-size: 12px;
}

:deep(.el-pagination .btn-prev),
:deep(.el-pagination .btn-next) {
  height: 24px;
  line-height: 24px;
  font-size: 12px;
}
</style>
