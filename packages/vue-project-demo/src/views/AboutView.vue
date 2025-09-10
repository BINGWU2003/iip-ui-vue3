<template>
  <iip-form
    :model="conditionalModel"
    :form-items="conditionalItems"
    label-width="100px"
    @submit="handleSubmit"
  />
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import type { FormItemConfig } from '@bingwu/iip-ui-components'

const conditionalModel = reactive({
  userType: '',
  companyName: '',
  personalName: '',
  hasExperience: false,
  experience: 0,
})

const conditionalItems = computed((): FormItemConfig[] => [
  {
    formItemProps: { label: '用户类型', prop: 'userType', required: true },
    colProps: { span: 24 },
    show: true,
    componentProps: {
      type: 'select',
      formItemKey: 'userType',
      itemProps: {
        placeholder: '请选择用户类型',
        options: [
          { label: '个人用户', value: 'personal' },
          { label: '企业用户', value: 'company' },
        ],
      },
    },
  },
  {
    formItemProps: { label: '姓名', prop: 'personalName', required: true },
    colProps: { span: 24 },
    show: conditionalModel.userType === 'personal', // 只有选择个人用户时才显示
    componentProps: {
      type: 'input',
      formItemKey: 'personalName',
      itemProps: {
        placeholder: '请输入姓名',
      },
    },
  },
  {
    formItemProps: { label: '公司名称', prop: 'companyName', required: true },
    colProps: { span: 24 },
    show: conditionalModel.userType === 'company', // 只有选择企业用户时才显示
    componentProps: {
      type: 'input',
      formItemKey: 'companyName',
      itemProps: {
        placeholder: '请输入公司名称',
      },
    },
  },
  {
    formItemProps: { label: '是否有工作经验', prop: 'hasExperience' },
    colProps: { span: 24 },
    show: conditionalModel.userType === 'personal', // 只有个人用户才显示
    componentProps: {
      type: 'switch',
      formItemKey: 'hasExperience',
      itemProps: {
        activeText: '有',
        inactiveText: '无',
      },
    },
  },
  {
    formItemProps: { label: '工作年限', prop: 'experience' },
    colProps: { span: 24 },
    show: conditionalModel.userType === 'personal' && conditionalModel.hasExperience, // 个人用户且有工作经验才显示
    componentProps: {
      type: 'number',
      formItemKey: 'experience',
      itemProps: {
        min: 0,
        max: 50,
        placeholder: '请输入工作年限',
      },
    },
  },
])

const handleSubmit = (data: Record<string, any>) => {
  console.log('表单数据:', data)
}
</script>
