<template>
  <div class="iip-input" :class="inputClasses">
    <el-input
      ref="inputRef"
      v-model="inputValue"
      v-bind="$attrs"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :size="size"
      :type="type"
      :maxlength="maxlength"
      :show-word-limit="showWordLimit && !!maxlength"
      :clearable="clearable"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
      @keyup.enter="handleEnter"
      @clear="handleClear"
      @paste="handlePaste"
    >
      <template v-for="(_, slot) in $slots" #[slot]="scope">
        <slot :name="slot" v-bind="scope"></slot>
      </template>
    </el-input>

    <!-- 验证错误信息 -->
    <div v-if="showValidateMessage && validateMessage" class="iip-input__error">
      {{ validateMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { ElInput } from 'element-plus'
import { debounce } from '@bingwu/iip-ui-utils'
import { isEmail, isPhone, isIdCard, isUrl } from '@bingwu/iip-ui-utils'
import type { IipInputProps, IipInputEmits, IipInputExpose } from './types'

defineOptions({
  name: 'IipInput',
  inheritAttrs: false
})

const props = withDefaults(defineProps<IipInputProps & { modelValue?: string }>(), {
  clearable: true,
  showWordLimit: false,
  debounceDelay: 300,
  trimOnPaste: true,
  trimOnBlur: true,
  placeholder: '请输入',
  disabled: false,
  readonly: false,
  size: 'default',
  type: 'text'
})

const emit = defineEmits<IipInputEmits>()

// 组件引用
const inputRef = ref<InstanceType<typeof ElInput>>()

// 内部状态
const inputValue = ref('')
const validateMessage = ref('')
const isValid = ref(true)
const showValidateMessage = ref(false)

// 计算属性
const inputClasses = computed(() => ({
  'iip-input--error': !isValid.value && showValidateMessage.value,
  'iip-input--disabled': props.disabled,
  'iip-input--readonly': props.readonly,
  [`iip-input--${props.size}`]: props.size !== 'default'
}))

// 防抖输入处理
const debouncedInput = debounce((value: string) => {
  emit('input', value)
}, props.debounceDelay)

// 验证函数
const validateInput = (value: string): { isValid: boolean; message?: string } => {
  if (!value && !props.validateRule && !props.validator) {
    return { isValid: true }
  }

  // 自定义验证器优先
  if (props.validator) {
    const result = props.validator(value)
    if (typeof result === 'boolean') {
      return { isValid: result, message: result ? '' : '输入格式不正确' }
    }
    return { isValid: false, message: result }
  }

  // 内置验证规则
  if (props.validateRule && value) {
    switch (props.validateRule) {
      case 'email':
        return { isValid: isEmail(value), message: '请输入正确的邮箱地址' }
      case 'phone':
        return { isValid: isPhone(value), message: '请输入正确的手机号码' }
      case 'idCard':
        return { isValid: isIdCard(value), message: '请输入正确的身份证号码' }
      case 'url':
        return { isValid: isUrl(value), message: '请输入正确的网址' }
      case 'number':
        return { isValid: /^\d+(\.\d+)?$/.test(value), message: '请输入数字' }
      case 'integer':
        return { isValid: /^\d+$/.test(value), message: '请输入整数' }
      case 'positive':
        return { isValid: /^[1-9]\d*$/.test(value), message: '请输入正整数' }
      default:
        return { isValid: true }
    }
  }

  return { isValid: true }
}

// 事件处理
const handleInput = (value: string) => {
  inputValue.value = value
  emit('update:modelValue', value)

  // 防抖输入
  debouncedInput(value)

  // 实时验证
  if (props.validateRule || props.validator) {
    const result = validateInput(value)
    isValid.value = result.isValid
    validateMessage.value = result.message || ''
    showValidateMessage.value = !result.isValid
    emit('validate', result.isValid, result.message)
  }
}

const handleBlur = (event: FocusEvent) => {
  // 失焦时去除首尾空格
  if (props.trimOnBlur && inputValue.value) {
    const trimmedValue = inputValue.value.trim()
    if (trimmedValue !== inputValue.value) {
      inputValue.value = trimmedValue
      emit('update:modelValue', trimmedValue)
    }
  }

  // 失焦时显示验证信息
  if (props.validateRule || props.validator) {
    showValidateMessage.value = !isValid.value
  }

  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  // 聚焦时隐藏验证信息
  showValidateMessage.value = false
  emit('focus', event)
}

const handleEnter = () => {
  emit('enter', inputValue.value)
}

const handleClear = () => {
  inputValue.value = ''
  isValid.value = true
  validateMessage.value = ''
  showValidateMessage.value = false
  emit('update:modelValue', '')
  emit('clear')
}

const handlePaste = (event: ClipboardEvent) => {
  if (props.trimOnPaste) {
    nextTick(() => {
      const trimmedValue = inputValue.value.trim()
      if (trimmedValue !== inputValue.value) {
        inputValue.value = trimmedValue
        emit('update:modelValue', trimmedValue)
      }
    })
  }
}

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  newValue => {
    if (newValue !== inputValue.value) {
      inputValue.value = newValue || ''
    }
  },
  { immediate: true }
)

// 暴露的方法
const focus = () => {
  inputRef.value?.focus()
}

const blur = () => {
  inputRef.value?.blur()
}

const select = () => {
  inputRef.value?.select()
}

const clear = () => {
  handleClear()
}

const validate = (): boolean => {
  const result = validateInput(inputValue.value)
  isValid.value = result.isValid
  validateMessage.value = result.message || ''
  showValidateMessage.value = !result.isValid
  emit('validate', result.isValid, result.message)
  return result.isValid
}

defineExpose<IipInputExpose>({
  focus,
  blur,
  select,
  clear,
  validate
})
</script>

<style lang="scss" scoped>
.iip-input {
  position: relative;

  &__error {
    margin-top: 4px;
    font-size: 12px;
    line-height: 1.2;
    color: var(--el-color-danger);
  }

  &--error {
    :deep(.el-input__wrapper) {
      border-color: var(--el-color-danger);
      box-shadow: 0 0 0 1px var(--el-color-danger) inset;
    }
  }

  &--disabled {
    :deep(.el-input__wrapper) {
      color: var(--el-disabled-text-color);
      cursor: not-allowed;
      background-color: var(--el-disabled-bg-color);
      border-color: var(--el-disabled-border-color);
    }
  }

  &--readonly {
    :deep(.el-input__wrapper) {
      background-color: var(--el-fill-color-light);
      border-color: var(--el-border-color);
    }
  }
}
</style>
