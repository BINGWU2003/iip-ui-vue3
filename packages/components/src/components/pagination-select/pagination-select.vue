<template>
  <el-config-provider :locale="zhCn">
    <el-select
      v-model="selectedValue"
      :placeholder="placeholder"
      :loading="loading"
      remote
      :remote-method="handleRemoteMethod"
      :clearable="clearable"
      filterable
      :reserve-keyword="false"
      :popper-class="`${popperClass} pagination-select-popper`"
      v-bind="$attrs"
      :style="style"
      @change="handleChange"
      @clear="handleClear"
      @visible-change="handleVisibleChange"
      ref="selectRef"
    >
      <template v-for="(_, slot) in $slots" #[slot]="slotData">
        <slot :name="slot" v-bind="slotData"></slot>
      </template>
      <template v-for="item in displayOptions" :key="item[valueKey]">
        <el-option
          v-show="!item._isVirtual"
          :label="item[labelKey]"
          :value="item[valueKey]"
          :disabled="item.disabled"
        />
      </template>

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
  </el-config-provider>
</template>

<script setup lang="ts">
import { ref, computed, watch, readonly } from 'vue'
import { ElSelect, ElPagination, ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import type {
  PaginationSelectProps,
  PaginationSelectEmits,
  OptionItem,
  PaginationSelectSlots
} from './types'

defineOptions({
  name: 'iip-pagination-select'
})
defineSlots<PaginationSelectSlots>()
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
  style: () => ({})
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

// 处理数据回显：确保选中项能正确显示
const displayOptions = computed(() => {
  const baseOptions = [...options.value]

  // 如果有选中值但在当前选项中找不到对应项，则创建虚拟选项用于回显
  const currentValue = props.modelValue?.[props.valueKey]
  if (currentValue !== undefined && currentValue !== null && currentValue !== '') {
    const existingOption = baseOptions.find(item => item[props.valueKey] === currentValue)
    if (!existingOption) {
      // 创建虚拟选项用于回显（例如：选中的是第二页的数据）
      const virtualOption = {
        [props.valueKey]: props.modelValue![props.valueKey],
        [props.labelKey]: props.modelValue![props.labelKey],
        _isVirtual: true
      }

      return [virtualOption, ...baseOptions]
    }
  }

  return baseOptions
})

// 监听 modelValue 变化，同步到内部selectedValue
watch(
  () => props.modelValue,
  newVal => {
    selectedValue.value = newVal?.[props.valueKey]
  },
  { immediate: true }
)

// 监听选中值变化，发出事件
watch(selectedValue, newVal => {
  if (newVal === undefined || newVal === null) {
    emit('update:modelValue', null)
  } else {
    // 从displayOptions中找到对应的label
    const selectedOption = displayOptions.value.find(item => item[props.valueKey] === newVal)
    const label = selectedOption ? selectedOption[props.labelKey] : String(newVal)

    emit('update:modelValue', {
      [props.valueKey]: newVal,
      [props.labelKey]: label
    })
  }
})

// 处理远程搜索
const handleRemoteMethod = (query: string) => {
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
const handleChange = (value: unknown) => {
  // 从displayOptions中查找，这样可以包含虚拟选项
  const selectedOption = displayOptions.value.find(item => item[props.valueKey] === value)

  if (value === undefined || value === null || value === '') {
    emit('change', null, selectedOption)
  } else {
    const label = selectedOption ? selectedOption[props.labelKey] : String(value)
    emit(
      'change',
      {
        [props.valueKey]: value,
        [props.labelKey]: label
      },
      selectedOption
    )
  }
}

// 处理清空
const handleClear = () => {
  emit('clear')
}

// 处理下拉框显示/隐藏
const handleVisibleChange = (visible: boolean) => {
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
