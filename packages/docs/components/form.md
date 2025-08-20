# Form 表单

基于 Element Plus 二次封装的配置化表单组件，通过配置快速生成表单，支持多种布局和丰富的表单项类型。

## 特性

- 🚀 **配置化驱动**: 通过配置快速生成表单
- 🎨 **多种布局**: 支持网格布局和内联布局
- 📋 **丰富组件**: 支持输入框、数字输入、选择器、日期时间、开关等组件
- ✅ **数据验证**: 支持Element Plus验证规则
- 🔄 **动态显示**: 支持条件显示/隐藏表单项
- 📱 **响应式**: 支持栅格布局，适配不同屏幕
- 🎯 **类型安全**: 完整的 TypeScript 类型定义
- 🎪 **插槽支持**: 支持自定义表单项插槽

## 基础用法

最简单的表单配置：

```vue
<template>
  <div>
    <iip-form
      :model="formModel"
      :form-items="formItems"
      :actions-config="actionsConfig"
      label-width="100px"
      @submit="handleSubmit"
      @reset="handleReset"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import type { FormItemConfig } from '@bingwu/iip-ui-components'

const formModel = reactive({
  name: '',
  email: '',
  age: 0
})

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
        clearable: true
      }
    }
  },
  {
    formItemProps: { label: '邮箱', prop: 'email' },
    colProps: { span: 12 },
    show: true,
    componentProps: {
      type: 'input',
      formItemKey: 'email',
      itemProps: {
        placeholder: '请输入邮箱',
        clearable: true
      }
    }
  },
  {
    formItemProps: { label: '年龄', prop: 'age' },
    colProps: { span: 12 },
    show: true,
    componentProps: {
      type: 'number',
      formItemKey: 'age',
      itemProps: {
        min: 0,
        max: 120,
        placeholder: '请输入年龄'
      }
    }
  }
]

const actionsConfig = {
  show: true,
  span: 24,
  align: 'center' as const,
  submitText: '提交',
  resetText: '重置',
  showSubmit: true,
  showReset: true
}

const handleSubmit = (formData: Record<string, any>) => {
  console.log('表单数据:', formData)
}

const handleReset = (formData: Record<string, any>) => {
  console.log('重置数据:', formData)
}
</script>
```

## 表单布局

### 网格布局（默认）

表单默认使用网格布局，通过 `colProps` 控制每个表单项的栅格配置：

```vue
<template>
  <iip-form
    :model="formModel"
    :form-items="formItems"
    :row-props="{ gutter: 20 }"
    label-width="100px"
    @submit="handleSubmit"
  />
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const formModel = reactive({
  name: '',
  email: '',
  department: '',
  description: ''
})

const formItems: FormItemConfig[] = [
  {
    formItemProps: { label: '姓名', prop: 'name' },
    colProps: { span: 12 }, // 占据12个栅格
    show: true,
    componentProps: {
      type: 'input',
      formItemKey: 'name',
      itemProps: { placeholder: '请输入姓名' }
    }
  },
  {
    formItemProps: { label: '邮箱', prop: 'email' },
    colProps: { span: 12 }, // 占据12个栅格
    show: true,
    componentProps: {
      type: 'input',
      formItemKey: 'email',
      itemProps: { placeholder: '请输入邮箱' }
    }
  },
  {
    formItemProps: { label: '部门', prop: 'department' },
    colProps: { span: 24 }, // 占据整行
    show: true,
    componentProps: {
      type: 'select',
      formItemKey: 'department',
      itemProps: {
        placeholder: '请选择部门',
        options: [
          { label: '研发部', value: 'dev' },
          { label: '产品部', value: 'product' }
        ]
      }
    }
  },
  {
    formItemProps: { label: '描述', prop: 'description' },
    colProps: { span: 24 },
    show: true,
    componentProps: {
      type: 'input',
      formItemKey: 'description',
      itemProps: {
        type: 'textarea',
        rows: 4,
        placeholder: '请输入描述'
      }
    }
  }
]

const handleSubmit = (data: Record<string, any>) => {
  console.log('表单数据:', data)
}
</script>
```

### 内联布局

设置 `inline` 属性启用内联布局，适合搜索表单：

```vue
<template>
  <iip-form
    :model="searchModel"
    :form-items="searchItems"
    :actions-config="searchActions"
    inline
    label-width="80px"
    @submit="handleSearch"
    @reset="handleReset"
  />
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const searchModel = reactive({
  keyword: '',
  status: '',
  dateRange: ''
})

const searchItems: FormItemConfig[] = [
  {
    formItemProps: { label: '关键词' },
    show: true,
    componentProps: {
      type: 'input',
      formItemKey: 'keyword',
      itemProps: {
        placeholder: '请输入关键词',
        clearable: true
      }
    }
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
          { label: '启用', value: 'active' },
          { label: '禁用', value: 'inactive' }
        ]
      }
    }
  },
  {
    formItemProps: { label: '日期' },
    show: true,
    componentProps: {
      type: 'datetime',
      formItemKey: 'dateRange',
      itemProps: {
        type: 'date',
        placeholder: '请选择日期'
      }
    }
  }
]

const searchActions = {
  show: true,
  submitText: '搜索',
  resetText: '重置',
  showSubmit: true,
  showReset: true
}

const handleSearch = (data: Record<string, any>) => {
  console.log('搜索条件:', data)
}

const handleReset = (data: Record<string, any>) => {
  console.log('重置数据:', data)
}
</script>
```

## 表单项类型

组件支持以下表单项类型：`input`、`number`、`select`、`datetime`、`time`、`switch`、`custom`。

### 输入类组件

```vue
<template>
  <iip-form
    :model="inputModel"
    :form-items="inputItems"
    label-width="100px"
    @submit="handleSubmit"
  />
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const inputModel = reactive({
  text: '',
  textarea: '',
  password: '',
  number: 0
})

const inputItems: FormItemConfig[] = [
  {
    formItemProps: { label: '文本输入', prop: 'text' },
    colProps: { span: 12 },
    show: true,
    componentProps: {
      type: 'input',
      formItemKey: 'text',
      itemProps: {
        placeholder: '请输入文本',
        clearable: true
      }
    }
  },
  {
    formItemProps: { label: '多行文本', prop: 'textarea' },
    colProps: { span: 12 },
    show: true,
    componentProps: {
      type: 'input',
      formItemKey: 'textarea',
      itemProps: {
        type: 'textarea',
        rows: 4,
        placeholder: '请输入多行文本'
      }
    }
  },
  {
    formItemProps: { label: '密码', prop: 'password' },
    colProps: { span: 12 },
    show: true,
    componentProps: {
      type: 'input',
      formItemKey: 'password',
      itemProps: {
        type: 'password',
        placeholder: '请输入密码',
        showPassword: true
      }
    }
  },
  {
    formItemProps: { label: '数字', prop: 'number' },
    colProps: { span: 12 },
    show: true,
    componentProps: {
      type: 'number',
      formItemKey: 'number',
      itemProps: {
        min: 0,
        max: 100,
        step: 1,
        placeholder: '请输入数字'
      }
    }
  }
]

const handleSubmit = (data: Record<string, any>) => {
  console.log('表单数据:', data)
}
</script>
```

### 选择类组件

```vue
<template>
  <iip-form
    :model="selectModel"
    :form-items="selectItems"
    label-width="100px"
    @submit="handleSubmit"
  />
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const selectModel = reactive({
  department: '',
  status: false
})

const selectItems: FormItemConfig[] = [
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
          { label: '研发部', value: 'dev' },
          { label: '产品部', value: 'product' },
          { label: '设计部', value: 'design' },
          { label: '运营部', value: 'operation' }
        ]
      }
    }
  },
  {
    formItemProps: { label: '状态', prop: 'status' },
    colProps: { span: 12 },
    show: true,
    componentProps: {
      type: 'switch',
      formItemKey: 'status',
      itemProps: {
        activeText: '启用',
        inactiveText: '禁用'
      }
    }
  }
]

const handleSubmit = (data: Record<string, any>) => {
  console.log('表单数据:', data)
}
</script>
```

### 日期时间组件

```vue
<template>
  <iip-form :model="dateModel" :form-items="dateItems" label-width="100px" @submit="handleSubmit" />
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const dateModel = reactive({
  joinDate: '',
  workTime: ''
})

const dateItems: FormItemConfig[] = [
  {
    formItemProps: { label: '入职日期', prop: 'joinDate' },
    colProps: { span: 12 },
    show: true,
    componentProps: {
      type: 'datetime',
      formItemKey: 'joinDate',
      itemProps: {
        type: 'date',
        placeholder: '请选择入职日期',
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD'
      }
    }
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
        valueFormat: 'HH:mm'
      }
    }
  }
]

const handleSubmit = (data: Record<string, any>) => {
  console.log('表单数据:', data)
}
</script>
```

### 自定义组件

使用 `custom` 类型可以传入自定义组件：

```vue
<template>
  <iip-form
    :model="customModel"
    :form-items="customItems"
    label-width="100px"
    @submit="handleSubmit"
  />
</template>

<script setup lang="ts">
import { reactive, defineComponent, h } from 'vue'
import { ElTag, ElButton } from 'element-plus'

// 自定义标签选择器组件
const TagSelector = defineComponent({
  props: {
    modelValue: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const tags = ['Vue', 'React', 'Angular', 'Node.js']

    const toggleTag = (tag: string) => {
      const currentTags = [...props.modelValue]
      const index = currentTags.indexOf(tag)

      if (index > -1) {
        currentTags.splice(index, 1)
      } else {
        currentTags.push(tag)
      }

      emit('update:modelValue', currentTags)
    }

    return () =>
      h(
        'div',
        { class: 'tag-selector' },
        tags.map(tag =>
          h(
            ElTag,
            {
              key: tag,
              type: props.modelValue.includes(tag) ? 'primary' : 'info',
              style: { margin: '4px', cursor: 'pointer' },
              onClick: () => toggleTag(tag)
            },
            () => tag
          )
        )
      )
  }
})

const customModel = reactive({
  name: '',
  skills: []
})

const customItems: FormItemConfig[] = [
  {
    formItemProps: { label: '姓名', prop: 'name' },
    colProps: { span: 24 },
    show: true,
    componentProps: {
      type: 'input',
      formItemKey: 'name',
      itemProps: {
        placeholder: '请输入姓名'
      }
    }
  },
  {
    formItemProps: { label: '技能标签', prop: 'skills' },
    colProps: { span: 24 },
    show: true,
    component: TagSelector,
    componentProps: {
      type: 'custom',
      formItemKey: 'skills'
    }
  }
]

const handleSubmit = (data: Record<string, any>) => {
  console.log('表单数据:', data)
}
</script>

<style scoped>
.tag-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
```

## 插槽使用

组件支持表单项插槽，可以完全自定义表单项的内容：

```vue
<template>
  <iip-form
    :model="slotModel"
    :form-items="slotItems"
    :actions-config="actionsConfig"
    label-width="120px"
    @submit="handleSubmit"
  >
    <!-- 自定义状态选择插槽 -->
    <template #form-item-status>
      <el-select v-model="slotModel.status" placeholder="请选择状态" style="width: 200px">
        <el-option label="全部" value="" />
        <el-option label="激活" value="active" />
        <el-option label="禁用" value="inactive" />
      </el-select>
    </template>

    <!-- 自定义复杂输入插槽 -->
    <template #form-item-customField>
      <div style="display: flex; gap: 10px; align-items: center;">
        <el-input v-model="slotModel.customField" placeholder="自定义输入" style="flex: 1" />
        <el-button type="primary" size="small">验证</el-button>
      </div>
    </template>
  </iip-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const slotModel = reactive({
  name: '',
  status: '',
  customField: ''
})

const slotItems: FormItemConfig[] = [
  {
    formItemProps: { label: '姓名', prop: 'name' },
    colProps: { span: 12 },
    show: true,
    componentProps: {
      type: 'input',
      formItemKey: 'name',
      itemProps: {
        placeholder: '请输入姓名'
      }
    }
  },
  {
    formItemProps: { label: '状态', prop: 'status' },
    colProps: { span: 12 },
    show: true,
    componentProps: {
      type: 'select', // 组件类型，但会被插槽覆盖
      formItemKey: 'status'
    }
  },
  {
    formItemProps: { label: '自定义字段', prop: 'customField' },
    colProps: { span: 24 },
    show: true,
    componentProps: {
      type: 'input', // 组件类型，但会被插槽覆盖
      formItemKey: 'customField'
    }
  }
]

const actionsConfig = {
  show: true,
  submitText: '提交',
  resetText: '重置'
}

const handleSubmit = (data: Record<string, any>) => {
  console.log('表单数据:', data)
}
</script>
```

插槽命名规则：`form-item-{formItemKey}`，其中 `formItemKey` 是表单项配置中的 `componentProps.formItemKey`。

## 数据验证

使用 Element Plus 的验证规则：

```vue
<template>
  <iip-form
    :model="validationModel"
    :form-items="validationItems"
    :rules="validationRules"
    label-width="100px"
    @submit="handleSubmit"
  />
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const validationModel = reactive({
  name: '',
  email: '',
  age: 0
})

const validationItems: FormItemConfig[] = [
  {
    formItemProps: { label: '姓名', prop: 'name', required: true },
    colProps: { span: 12 },
    show: true,
    componentProps: {
      type: 'input',
      formItemKey: 'name',
      itemProps: {
        placeholder: '请输入姓名'
      }
    }
  },
  {
    formItemProps: { label: '邮箱', prop: 'email', required: true },
    colProps: { span: 12 },
    show: true,
    componentProps: {
      type: 'input',
      formItemKey: 'email',
      itemProps: {
        placeholder: '请输入邮箱'
      }
    }
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
        placeholder: '请输入年龄'
      }
    }
  }
]

// Element Plus 验证规则
const validationRules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度在2-10个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  age: [{ type: 'number', min: 18, max: 65, message: '年龄必须在18-65之间', trigger: 'change' }]
}

const handleSubmit = (data: Record<string, any>) => {
  console.log('表单数据:', data)
}
</script>
```

## 条件显示

根据表单数据动态显示/隐藏表单项：

```vue
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

const conditionalModel = reactive({
  userType: '',
  companyName: '',
  personalName: '',
  hasExperience: false,
  experience: 0
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
          { label: '企业用户', value: 'company' }
        ]
      }
    }
  },
  {
    formItemProps: { label: '姓名', prop: 'personalName', required: true },
    colProps: { span: 24 },
    show: conditionalModel.userType === 'personal', // 只有选择个人用户时才显示
    componentProps: {
      type: 'input',
      formItemKey: 'personalName',
      itemProps: {
        placeholder: '请输入姓名'
      }
    }
  },
  {
    formItemProps: { label: '公司名称', prop: 'companyName', required: true },
    colProps: { span: 24 },
    show: conditionalModel.userType === 'company', // 只有选择企业用户时才显示
    componentProps: {
      type: 'input',
      formItemKey: 'companyName',
      itemProps: {
        placeholder: '请输入公司名称'
      }
    }
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
        inactiveText: '无'
      }
    }
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
        placeholder: '请输入工作年限'
      }
    }
  }
])

const handleSubmit = (data: Record<string, any>) => {
  console.log('表单数据:', data)
}
</script>
```

## API

### Form Props

| 参数          | 说明                   | 类型                | 默认值 |
| ------------- | ---------------------- | ------------------- | ------ |
| formItems     | 表单项配置数组         | `FormItemConfig[]`  | `[]`   |
| actionsConfig | 操作按钮配置           | `ActionsConfig`     | -      |
| rowProps      | el-row 组件属性        | `Partial<RowProps>` | -      |
| ...           | 其他 Element Form 属性 | `ElFormProps`       | -      |

### FormItemConfig

| 参数           | 说明              | 类型                     | 默认值 |
| -------------- | ----------------- | ------------------------ | ------ |
| formItemProps  | el-form-item 属性 | `Partial<FormItemProps>` | -      |
| colProps       | el-col 属性       | `Partial<ColProps>`      | -      |
| component      | 自定义组件        | `Component`              | -      |
| show           | 是否显示          | `boolean`                | `true` |
| componentProps | 表单项组件属性    | `ComponentProps`         | -      |

### ComponentProps

| 参数        | 说明         | 类型            | 默认值 |
| ----------- | ------------ | --------------- | ------ |
| type        | 组件类型     | `FormItemType`  | -      |
| formItemKey | 表单字段名   | `string`        | -      |
| itemProps   | 组件透传属性 | `any`           | -      |
| style       | 组件样式     | `CSSProperties` | -      |

### FormItemType

支持的表单项类型：

```typescript
type FormItemType = 'input' | 'number' | 'select' | 'datetime' | 'time' | 'switch' | 'custom'
```

### ActionsConfig

| 参数        | 说明         | 类型                            | 默认值   |
| ----------- | ------------ | ------------------------------- | -------- |
| show        | 是否显示     | `boolean`                       | `true`   |
| span        | 栅格占位     | `number`                        | -        |
| align       | 对齐方式     | `'left' \| 'center' \| 'right'` | `'left'` |
| submitText  | 提交按钮文本 | `string`                        | `'提交'` |
| resetText   | 重置按钮文本 | `string`                        | `'重置'` |
| submitProps | 提交按钮属性 | `Partial<ButtonProps>`          | -        |
| resetProps  | 重置按钮属性 | `Partial<ButtonProps>`          | -        |
| showSubmit  | 显示提交按钮 | `boolean`                       | `true`   |
| showReset   | 显示重置按钮 | `boolean`                       | `true`   |

### Events

| 事件名 | 说明           | 参数                          |
| ------ | -------------- | ----------------------------- |
| submit | 表单提交时触发 | `(data: Record<string, any>)` |
| reset  | 表单重置时触发 | `(data: Record<string, any>)` |

### Methods

通过 ref 获取组件实例，调用以下方法：

| 方法名          | 说明                   | 返回值                        |
| --------------- | ---------------------- | ----------------------------- |
| getFormInstance | 获取 Element Form 实例 | `InstanceType<typeof ElForm>` |

### Slots

| 插槽名                  | 说明       | 参数 |
| ----------------------- | ---------- | ---- |
| form-item-{formItemKey} | 表单项插槽 | -    |

插槽命名规则：`form-item-{formItemKey}`，其中 `{formItemKey}` 是 `componentProps.formItemKey` 的值。

## 最佳实践

### 1. 表单配置管理

建议将复杂的表单配置提取到单独的文件中管理：

```typescript
// composables/useUserForm.ts
import { reactive } from 'vue'
import type { FormItemConfig } from '@bingwu/iip-ui-components'

export const useUserForm = () => {
  const formModel = reactive({
    name: '',
    email: '',
    department: '',
    isActive: true
  })

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
          clearable: true
        }
      }
    },
    {
      formItemProps: { label: '邮箱', prop: 'email', required: true },
      colProps: { span: 12 },
      show: true,
      componentProps: {
        type: 'input',
        formItemKey: 'email',
        itemProps: {
          placeholder: '请输入邮箱',
          clearable: true
        }
      }
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
            { label: '研发部', value: 'dev' },
            { label: '产品部', value: 'product' },
            { label: '设计部', value: 'design' }
          ]
        }
      }
    },
    {
      formItemProps: { label: '状态', prop: 'isActive' },
      colProps: { span: 12 },
      show: true,
      componentProps: {
        type: 'switch',
        formItemKey: 'isActive',
        itemProps: {
          activeText: '启用',
          inactiveText: '禁用'
        }
      }
    }
  ]

  const actionsConfig = {
    show: true,
    span: 24,
    align: 'center' as const,
    submitText: '保存用户',
    resetText: '重置表单'
  }

  return {
    formModel,
    formItems,
    actionsConfig
  }
}
```

### 2. 表单验证

使用 Element Plus 的验证规则：

```vue
<template>
  <iip-form
    ref="formRef"
    :model="formModel"
    :form-items="formItems"
    :rules="formRules"
    label-width="100px"
    @submit="handleSubmit"
  />
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormExpose } from '@bingwu/iip-ui-components'

const formRef = ref<FormExpose>()

const formModel = reactive({
  name: '',
  email: ''
})

const formRules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在2-20个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}

const handleSubmit = async (data: Record<string, any>) => {
  // 手动验证表单
  const formInstance = formRef.value?.getFormInstance()
  const isValid = await formInstance?.validate()

  if (isValid) {
    console.log('表单验证通过:', data)
    // 提交数据到服务器
  }
}
</script>
```

### 3. 响应式布局

根据屏幕尺寸调整表单布局：

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize()

// 根据屏幕宽度动态调整表单项的span
const formItems = computed((): FormItemConfig[] => {
  const isMobile = width.value < 768
  const span = isMobile ? 24 : 12

  return [
    {
      formItemProps: { label: '姓名', prop: 'name' },
      colProps: { span },
      show: true,
      componentProps: {
        type: 'input',
        formItemKey: 'name',
        itemProps: { placeholder: '请输入姓名' }
      }
    },
    {
      formItemProps: { label: '邮箱', prop: 'email' },
      colProps: { span },
      show: true,
      componentProps: {
        type: 'input',
        formItemKey: 'email',
        itemProps: { placeholder: '请输入邮箱' }
      }
    }
  ]
})
</script>
```

### 4. 表单状态管理

使用组合式API管理复杂表单状态：

```typescript
// composables/useFormState.ts
import { ref, reactive } from 'vue'

export const useFormState = () => {
  const loading = ref(false)
  const formData = reactive<Record<string, any>>({})

  const updateFormData = (key: string, value: any) => {
    formData[key] = value
  }

  const resetFormData = () => {
    Object.keys(formData).forEach(key => {
      delete formData[key]
    })
  }

  const submitForm = async (data: Record<string, any>) => {
    loading.value = true
    try {
      // 提交表单数据的逻辑
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('提交成功:', data)
    } catch (error) {
      console.error('提交失败:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    formData,
    updateFormData,
    resetFormData,
    submitForm
  }
}
```

### 5. 动态表单项

根据业务逻辑动态添加或移除表单项：

```vue
<template>
  <iip-form :model="formModel" :form-items="dynamicFormItems" @submit="handleSubmit" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const showAdvanced = ref(false)
const userType = ref('')

const dynamicFormItems = computed((): FormItemConfig[] => {
  const baseItems: FormItemConfig[] = [
    {
      formItemProps: { label: '用户类型', prop: 'userType' },
      colProps: { span: 24 },
      show: true,
      componentProps: {
        type: 'select',
        formItemKey: 'userType',
        itemProps: {
          placeholder: '请选择用户类型',
          options: [
            { label: '普通用户', value: 'normal' },
            { label: 'VIP用户', value: 'vip' }
          ]
        }
      }
    }
  ]

  // 根据用户类型添加不同的表单项
  if (userType.value === 'vip') {
    baseItems.push({
      formItemProps: { label: 'VIP等级', prop: 'vipLevel' },
      colProps: { span: 24 },
      show: true,
      componentProps: {
        type: 'select',
        formItemKey: 'vipLevel',
        itemProps: {
          placeholder: '请选择VIP等级',
          options: [
            { label: '黄金VIP', value: 'gold' },
            { label: '钻石VIP', value: 'diamond' }
          ]
        }
      }
    })
  }

  return baseItems
})
</script>
```

通过这些最佳实践，你可以更好地使用 Form 组件构建灵活、可维护的表单应用。
