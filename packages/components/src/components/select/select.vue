<template>
  <div class="iip-select" :class="selectClasses">
    <el-select
      ref="selectRef"
      v-model="selectedValue"
      v-bind="$attrs"
      :placeholder="placeholder"
      :disabled="disabled"
      :multiple="multiple"
      :clearable="clearable"
      :filterable="filterable"
      :remote="remote"
      :remote-method="handleRemoteSearch"
      :loading="loading"
      :loading-text="loadingText"
      :no-data-text="emptyText"
      :size="size"
      :max-collapse-tags="maxCollapseTags"
      @change="handleChange"
      @visible-change="handleVisibleChange"
      @clear="handleClear"
      @remove-tag="handleRemoveTag"
      @focus="handleFocus"
      @blur="handleBlur"
    >
      <!-- 全选选项 -->
      <el-option
        v-if="showSelectAll && multiple && filteredOptions.length > 0"
        :value="SELECT_ALL_VALUE"
        :label="selectAllText"
        class="iip-select__select-all"
        @click.stop="handleSelectAll"
      >
        <el-checkbox
          :model-value="isAllSelected"
          :indeterminate="isIndeterminate"
          @change="handleSelectAll"
        >
          {{ selectAllText }}
        </el-checkbox>
      </el-option>

      <!-- 选项列表 -->
      <template v-if="groupedOptions.length > 0">
        <template v-for="group in groupedOptions" :key="group.name">
          <el-option-group v-if="group.name" :label="group.name">
            <el-option
              v-for="option in group.options"
              :key="option.value"
              :value="option.value"
              :label="option.label"
              :disabled="option.disabled"
            >
              <slot name="option" :option="option">
                {{ option.label }}
              </slot>
            </el-option>
          </el-option-group>
          <template v-else>
            <el-option
              v-for="option in group.options"
              :key="option.value"
              :value="option.value"
              :label="option.label"
              :disabled="option.disabled"
            >
              <slot name="option" :option="option">
                {{ option.label }}
              </slot>
            </el-option>
          </template>
        </template>
      </template>

      <!-- 自定义插槽 -->
      <template v-for="(_, slot) in $slots" #[slot]="scope">
        <slot v-if="slot !== 'option'" :name="slot" v-bind="scope"></slot>
      </template>
    </el-select>

    <!-- 选项数量统计 -->
    <div v-if="showCount && multiple && selectedValue.length > 0" class="iip-select__count">
      已选择 {{ selectedValue.length }} 项
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElSelect, ElOption, ElOptionGroup, ElCheckbox } from 'element-plus'
import { debounce } from '@bingwu/iip-ui-utils'
import type { IipSelectProps, IipSelectEmits, IipSelectExpose, SelectOption } from './types'

defineOptions({
  name: 'IipSelect',
  inheritAttrs: false
})

const props = withDefaults(defineProps<IipSelectProps & { modelValue?: any }>(), {
  options: () => [],
  showSelectAll: false,
  selectAllText: '全选',
  filterable: false,
  remote: false,
  searchDebounce: 300,
  clearSearchOnSelect: true,
  emptyText: '暂无数据',
  loadingText: '加载中...',
  showCount: false,
  placeholder: '请选择',
  disabled: false,
  multiple: false,
  clearable: true,
  size: 'default',
  maxCollapseTags: 1
})

const emit = defineEmits<IipSelectEmits>()

// 常量
const SELECT_ALL_VALUE = '__SELECT_ALL__'

// 组件引用
const selectRef = ref<InstanceType<typeof ElSelect>>()

// 内部状态
const selectedValue = ref<any>(props.multiple ? [] : '')
const internalOptions = ref<SelectOption[]>([...props.options])
const loading = ref(false)
const searchQuery = ref('')

// 计算属性
const selectClasses = computed(() => ({
  'iip-select--multiple': props.multiple,
  'iip-select--disabled': props.disabled,
  [`iip-select--${props.size}`]: props.size !== 'default'
}))

// 过滤后的选项
const filteredOptions = computed(() => {
  if (!props.filterable || !searchQuery.value) {
    return internalOptions.value
  }

  return internalOptions.value.filter(option =>
    option.label.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// 分组选项
const groupedOptions = computed(() => {
  const groups: { name: string; options: SelectOption[] }[] = []
  const groupMap = new Map<string, SelectOption[]>()

  filteredOptions.value.forEach(option => {
    const groupName = option.group || ''
    if (!groupMap.has(groupName)) {
      groupMap.set(groupName, [])
    }
    groupMap.get(groupName)!.push(option)
  })

  groupMap.forEach((options, name) => {
    groups.push({ name, options })
  })

  return groups
})

// 全选状态
const isAllSelected = computed(() => {
  if (!props.multiple || filteredOptions.value.length === 0) return false
  const availableValues = filteredOptions.value
    .filter(option => !option.disabled)
    .map(option => option.value)
  return availableValues.every(value => selectedValue.value.includes(value))
})

const isIndeterminate = computed(() => {
  if (!props.multiple || filteredOptions.value.length === 0) return false
  const availableValues = filteredOptions.value
    .filter(option => !option.disabled)
    .map(option => option.value)
  const selectedCount = availableValues.filter(value => selectedValue.value.includes(value)).length
  return selectedCount > 0 && selectedCount < availableValues.length
})

// 防抖搜索
const debouncedSearch = debounce(async (query: string) => {
  if (props.remote && props.remoteMethod) {
    loading.value = true
    try {
      const result = await props.remoteMethod(query)
      internalOptions.value = Array.isArray(result) ? result : []
    } catch (error) {
      console.error('Remote search error:', error)
      internalOptions.value = []
    } finally {
      loading.value = false
    }
  }
  emit('search', query)
}, props.searchDebounce)

// 事件处理
const handleChange = (value: any) => {
  // 过滤掉全选的特殊值
  if (props.multiple && Array.isArray(value)) {
    const filteredValue = value.filter(v => v !== SELECT_ALL_VALUE)
    selectedValue.value = filteredValue
    emit('update:modelValue', filteredValue)
    emit('change', filteredValue)
  } else {
    selectedValue.value = value
    emit('update:modelValue', value)
    emit('change', value)
  }

  // 选择后清空搜索
  if (props.clearSearchOnSelect && !props.multiple) {
    searchQuery.value = ''
  }
}

const handleVisibleChange = (visible: boolean) => {
  emit('visible-change', visible)
}

const handleClear = () => {
  selectedValue.value = props.multiple ? [] : ''
  emit('update:modelValue', selectedValue.value)
  emit('clear')
}

const handleRemoveTag = (value: any) => {
  emit('remove-tag', value)
}

const handleFocus = () => {
  // 聚焦时的处理
}

const handleBlur = () => {
  // 失焦时的处理
}

const handleRemoteSearch = (query: string) => {
  searchQuery.value = query
  if (props.remote) {
    debouncedSearch(query)
  }
}

const handleSelectAll = () => {
  if (!props.multiple) return

  const availableValues = filteredOptions.value
    .filter(option => !option.disabled)
    .map(option => option.value)

  if (isAllSelected.value) {
    // 取消全选
    selectedValue.value = selectedValue.value.filter(
      (value: any) => !availableValues.includes(value)
    )
  } else {
    // 全选
    const newValues = [...new Set([...selectedValue.value, ...availableValues])]
    selectedValue.value = newValues
  }

  emit('update:modelValue', selectedValue.value)
  emit('change', selectedValue.value)
  emit('select-all', !isAllSelected.value)
}

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  newValue => {
    selectedValue.value = newValue ?? (props.multiple ? [] : '')
  },
  { immediate: true }
)

// 监听 options 变化
watch(
  () => props.options,
  newOptions => {
    internalOptions.value = [...newOptions]
  },
  { immediate: true }
)

// 暴露的方法
const focus = () => {
  selectRef.value?.focus()
}

const blur = () => {
  selectRef.value?.blur()
}

const clear = () => {
  handleClear()
}

const getSelectedOptions = (): SelectOption[] => {
  if (!props.multiple) {
    const option = internalOptions.value.find(opt => opt.value === selectedValue.value)
    return option ? [option] : []
  }

  return internalOptions.value.filter(opt => selectedValue.value.includes(opt.value))
}

const setOptions = (options: SelectOption[]) => {
  internalOptions.value = [...options]
}

defineExpose<IipSelectExpose>({
  focus,
  blur,
  clear,
  getSelectedOptions,
  setOptions
})
</script>

<style lang="scss" scoped>
.iip-select {
  position: relative;

  &__count {
    margin-top: 4px;
    font-size: 12px;
    line-height: 1.2;
    color: var(--el-text-color-regular);
  }

  &__select-all {
    :deep(.el-checkbox) {
      width: 100%;

      .el-checkbox__label {
        width: 100%;
        padding-left: 8px;
      }
    }
  }

  &--disabled {
    :deep(.el-select) {
      .el-input__wrapper {
        color: var(--el-disabled-text-color);
        cursor: not-allowed;
        background-color: var(--el-disabled-bg-color);
        border-color: var(--el-disabled-border-color);
      }
    }
  }
}
</style>
