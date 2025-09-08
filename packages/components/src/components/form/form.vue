<template>
  <el-form ref="formRef" class="iip-form" v-bind="attrs">
    <el-row v-bind="rowProps" v-if="isInline">
      <template v-for="item in visibleItems" :key="item.componentProps.formItemKey">
        <el-col v-bind="item.colProps">
          <el-form-item v-bind="item.formItemProps">
            <!-- 表单项内容 -->
            <slot :name="getFormItemSlotName(item)" v-if="getFormItemSlot(item)"></slot>
            <component
              :is="getComponentName(item)"
              v-else
              v-model="model[item.componentProps.formItemKey as keyof typeof model]"
              v-bind="getComponentProps(item.componentProps)"
            />
          </el-form-item>
        </el-col>
      </template>

      <!-- 操作按钮 -->
      <el-col v-if="showActions" :span="actionsSpan">
        <el-form-item>
          <el-button
            v-if="actionsConfig?.showSubmit !== false"
            type="primary"
            v-bind="actionsConfig?.submitProps || {}"
            @click="handleSubmit"
          >
            {{ actionsConfig?.submitText || '提交' }}
          </el-button>

          <el-button
            v-if="actionsConfig?.showReset !== false"
            v-bind="actionsConfig?.resetProps || {}"
            @click="handleReset"
          >
            {{ actionsConfig?.resetText || '重置' }}
          </el-button>
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 内联布局 -->
    <template v-else>
      <el-form-item v-for="(item, index) in visibleItems" :key="index" v-bind="item.formItemProps">
        <template v-if="getFormItemSlot(item)">
          <slot :name="getFormItemSlotName(item)"></slot>
        </template>
        <component
          v-else
          :is="getComponentName(item)"
          v-model="model[item.componentProps.formItemKey as keyof typeof model]"
          v-bind="getComponentProps(item.componentProps)"
          :style="getComponentStyle(item.componentProps)"
        />
      </el-form-item>

      <!-- 内联模式操作按钮 -->
      <el-form-item v-if="showActions">
        <el-button
          v-if="actionsConfig?.showSubmit !== false"
          type="primary"
          v-bind="actionsConfig?.submitProps || {}"
          @click="handleSubmit"
        >
          {{ actionsConfig?.submitText || '提交' }}
        </el-button>

        <el-button
          v-if="actionsConfig?.showReset !== false"
          v-bind="actionsConfig?.resetProps || {}"
          @click="handleReset"
        >
          {{ actionsConfig?.resetText || '重置' }}
        </el-button>
      </el-form-item>
    </template>

    <template v-for="(_, slotKey) in slots" :key="slotKey + 'form'" #[slotKey]="slotData">
      <slot :name="slotKey" v-bind="slotData"></slot>
    </template>
  </el-form>
</template>

<script setup lang="ts">
import { ref, computed, toRefs, useAttrs, useSlots } from 'vue'
import {
  ElForm,
  ElFormItem,
  ElRow,
  ElCol,
  ElButton,
  ElInput,
  ElSelect,
  ElDatePicker,
  ElTimePicker,
  ElSwitch,
  ElInputNumber
} from 'element-plus'
import type { FormItemConfig, FormExpose, FormProps } from './types'

defineOptions({
  name: 'IipForm'
})

const props = defineProps<FormProps>()
// 定义事件
const emit = defineEmits<{
  submit: [data: Record<string, any>]
  reset: [data: Record<string, any>]
}>()
const attrs = useAttrs()
const slots = useSlots()
const { formItems, actionsConfig, rowProps } = toRefs(props)
const isInline = computed(() => !!attrs.inline)
const model = computed(() => attrs.model || {})
// 表单引用
const formRef = ref<InstanceType<typeof ElForm>>()

const defaultSpan = computed(() => {
  const itemsLength = visibleItems.value.length
  if (itemsLength <= 1) return 24
  if (itemsLength === 2) return 12
  if (itemsLength === 3) return 8
  return 6
})
const visibleItems = computed(() => {
  if (!formItems.value) return []
  return formItems.value.filter(item => item.show)
})

const showActions = computed(() => actionsConfig.value?.show !== false)

const actionsSpan = computed(() => actionsConfig.value?.span || defaultSpan.value)

// 组件映射
const componentMap: Record<string, any> = {
  input: ElInput,
  number: ElInputNumber,
  select: ElSelect,
  datetime: ElDatePicker,
  time: ElTimePicker,
  switch: ElSwitch
}

// 方法
const getComponentName = (item: FormItemConfig) => {
  if (item.component) return item.component
  return componentMap[item.componentProps.type] || ElInput
}

const getComponentProps = (item: FormItemConfig['componentProps']) => {
  return item.itemProps || {}
}

const getFormInstance = () => {
  return formRef.value as InstanceType<typeof ElForm>
}

const getComponentStyle = ({ type, style = {} }: FormItemConfig['componentProps']) => {
  if (type === 'select') return { width: '200px', ...style }
  return style
}
const getFormItemSlotName = (item: FormItemConfig) => {
  return `form-item-${item.componentProps.formItemKey}`
}
const getFormItemSlot = (item: FormItemConfig) => {
  return slots[getFormItemSlotName(item)]
}
// 事件处理方法
const handleSubmit = () => {
  emit('submit', model.value)
}

const handleReset = () => {
  formRef.value?.resetFields()
  emit('reset', model.value)
}

// 暴露实例方法
defineExpose<FormExpose>({
  getFormInstance
})
</script>

<style scoped lang="scss">
.iip-form {
  width: 100%;
}

.iip-form--inline .el-form-item {
  margin-right: 16px;
}

.iip-form--vertical .el-form-item {
  margin-bottom: 24px;
}

.text-left {
  text-align: left;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}
</style>
