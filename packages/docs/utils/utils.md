# Utils 工具函数

IIP UI Vue3 提供了一系列实用的工具函数，包括类型检查、通用工具、数据验证、Vue 工具和 Eova 转换等功能。

## 安装和引入

```bash
# 安装工具包
pnpm add @bingwu/iip-ui-utils
```

```typescript
// 全量引入
import * as IipUtils from '@bingwu/iip-ui-utils'

// 按需引入
import { isNullOrUndefined, debounce, deepClone } from '@bingwu/iip-ui-utils'

// 分类引入
import {
  isString,
  isNumber,
  isBoolean, // 类型检查
  debounce,
  throttle,
  deepClone, // 通用工具
  isEmail,
  isPhone,
  isIdCard, // 验证工具
  withInstall,
  createNamespace, // Vue 工具
  eovaConverter // Eova 转换
} from '@bingwu/iip-ui-utils'
```

## 类型检查工具 (Types)

### 基础类型检查

```typescript
import {
  isString,
  isNumber,
  isBoolean,
  isFunction,
  isObject,
  isArray,
  isUndefined,
  isNull,
  isNullOrUndefined
} from '@bingwu/iip-ui-utils'

// 检查字符串
console.log(isString('hello')) // true
console.log(isString(123)) // false

// 检查数字
console.log(isNumber(123)) // true
console.log(isNumber('123')) // false

// 检查布尔值
console.log(isBoolean(true)) // true
console.log(isBoolean(1)) // false

// 检查函数
console.log(isFunction(() => {})) // true
console.log(isFunction('string')) // false

// 检查对象
console.log(isObject({})) // true
console.log(isObject([])) // false
console.log(isObject(null)) // false

// 检查数组
console.log(isArray([])) // true
console.log(isArray({})) // false

// 检查 undefined
console.log(isUndefined(undefined)) // true
console.log(isUndefined(null)) // false

// 检查 null
console.log(isNull(null)) // true
console.log(isNull(undefined)) // false

// 检查 null 或 undefined
console.log(isNullOrUndefined(null)) // true
console.log(isNullOrUndefined(undefined)) // true
console.log(isNullOrUndefined('')) // false
```

## 通用工具函数 (Common)

### 防抖和节流

```typescript
import { debounce, throttle } from '@bingwu/iip-ui-utils'

// 防抖函数 - 延迟执行，如果在延迟期间再次调用则重新计时
const debouncedSave = debounce((data: any) => {
  console.log('保存数据:', data)
}, 500)

// 使用防抖
debouncedSave({ name: 'test1' })
debouncedSave({ name: 'test2' }) // 会取消上一次的调用
// 只有最后一次调用会在 500ms 后执行

// 立即执行的防抖（第一次立即执行，后续防抖）
const immediateDebounced = debounce(
  (data: any) => {
    console.log('立即执行:', data)
  },
  500,
  true
)

// 节流函数 - 限制执行频率
const throttledScroll = throttle(() => {
  console.log('滚动事件')
}, 100)

window.addEventListener('scroll', throttledScroll)
```

### 深拷贝

```typescript
import { deepClone } from '@bingwu/iip-ui-utils'

const original = {
  name: 'John',
  age: 30,
  address: {
    city: 'Beijing',
    street: 'Main St'
  },
  hobbies: ['reading', 'coding'],
  createdAt: new Date()
}

// 深拷贝对象
const cloned = deepClone(original)
cloned.address.city = 'Shanghai'
cloned.hobbies.push('swimming')

console.log(original.address.city) // 'Beijing' (原对象不受影响)
console.log(original.hobbies) // ['reading', 'coding'] (原数组不受影响)
console.log(cloned.address.city) // 'Shanghai'
console.log(cloned.hobbies) // ['reading', 'coding', 'swimming']

// 支持各种数据类型
const complexData = {
  date: new Date(),
  array: [1, { nested: true }, [2, 3]],
  nullValue: null,
  undefinedValue: undefined
}

const clonedComplex = deepClone(complexData)
console.log(clonedComplex.date instanceof Date) // true
```

### ID 生成器

```typescript
import { generateId } from '@bingwu/iip-ui-utils'

// 生成默认 ID（前缀为 'id'）
const id1 = generateId()
console.log(id1) // 'id-a1b2c3d4e'

// 生成带自定义前缀的 ID
const userId = generateId('user')
console.log(userId) // 'user-x9y8z7w6v'

const componentId = generateId('component')
console.log(componentId) // 'component-m5n4o3p2q'

// 在 Vue 组件中使用
export default {
  setup() {
    const formId = generateId('form')
    const fieldId = generateId('field')

    return {
      formId,
      fieldId
    }
  }
}
```

## 数据验证工具 (Validate)

### 基础验证

```typescript
import { isEmail, isPhone, isIdCard, isUrl, isIP, getPasswordStrength } from '@bingwu/iip-ui-utils'

// 邮箱验证
console.log(isEmail('test@example.com')) // true
console.log(isEmail('user@domain.cn')) // true
console.log(isEmail('invalid-email')) // false
console.log(isEmail('test@')) // false

// 手机号验证（中国大陆）
console.log(isPhone('13812345678')) // true
console.log(isPhone('15987654321')) // true
console.log(isPhone('12345678901')) // false
console.log(isPhone('1381234567')) // false

// 身份证验证（中国大陆）
console.log(isIdCard('110101199003077777')) // true
console.log(isIdCard('12345678901234567')) // false
console.log(isIdCard('110101199003077')) // false

// URL 验证
console.log(isUrl('https://example.com')) // true
console.log(isUrl('http://localhost:3000')) // true
console.log(isUrl('ftp://files.example.com')) // true
console.log(isUrl('not-a-url')) // false

// IP 地址验证
console.log(isIP('192.168.1.1')) // true
console.log(isIP('127.0.0.1')) // true
console.log(isIP('256.1.1.1')) // false
console.log(isIP('192.168.1')) // false

// 密码强度检查
console.log(getPasswordStrength('123456')) // 0 (太短)
console.log(getPasswordStrength('12345678')) // 1 (仅数字)
console.log(getPasswordStrength('password')) // 2 (仅小写字母)
console.log(getPasswordStrength('Password')) // 3 (大小写字母)
console.log(getPasswordStrength('Password123')) // 4 (大小写字母+数字)
console.log(getPasswordStrength('Password123!')) // 4 (大小写字母+数字+特殊字符)

// 自定义最小长度
console.log(getPasswordStrength('Pass1!', 6)) // 4 (满足 6 位最小长度)
console.log(getPasswordStrength('Pass1!', 10)) // 0 (不满足 10 位最小长度)
```

### 表单验证示例

```typescript
import { isEmail, isPhone, getPasswordStrength } from '@bingwu/iip-ui-utils'

// 用户注册表单验证
interface RegisterForm {
  email: string
  phone: string
  password: string
  confirmPassword: string
}

function validateRegisterForm(form: RegisterForm) {
  const errors: string[] = []

  // 验证邮箱
  if (!form.email) {
    errors.push('邮箱不能为空')
  } else if (!isEmail(form.email)) {
    errors.push('请输入有效的邮箱地址')
  }

  // 验证手机号
  if (!form.phone) {
    errors.push('手机号不能为空')
  } else if (!isPhone(form.phone)) {
    errors.push('请输入有效的手机号')
  }

  // 验证密码
  if (!form.password) {
    errors.push('密码不能为空')
  } else {
    const strength = getPasswordStrength(form.password)
    if (strength < 3) {
      errors.push('密码强度太低，请包含大小写字母和数字')
    }
  }

  // 验证确认密码
  if (form.password !== form.confirmPassword) {
    errors.push('两次输入的密码不一致')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

// 使用示例
const formData = {
  email: 'user@example.com',
  phone: '13812345678',
  password: 'MyPassword123',
  confirmPassword: 'MyPassword123'
}

const validation = validateRegisterForm(formData)
console.log(validation) // { valid: true, errors: [] }
```

## Vue 工具函数 (Vue)

### 组件安装工具

```typescript
import { withInstall, withInstallFunction } from '@bingwu/iip-ui-utils'
import type { App } from 'vue'

// 为单个组件添加 install 方法
import MyButton from './MyButton.vue'

const IipButton = withInstall(MyButton)

export default IipButton

// 在插件中使用
export function install(app: App) {
  app.use(IipButton)
}

// 为函数添加 install 方法
function showMessage(message: string) {
  console.log(message)
}

const IipMessage = withInstallFunction(showMessage, '$message')

// 安装后可以通过 this.$message() 使用
```

### 命名空间工具

```typescript
import { createNamespace } from '@bingwu/iip-ui-utils'

// 创建组件命名空间
const { n, classes } = createNamespace('button')

console.log(n()) // 'iip-button'
console.log(n('primary')) // 'iip-button__primary'
console.log(n('large')) // 'iip-button__large'

// 生成多个类名
console.log(classes('primary', 'large', 'disabled'))
// 'iip-button__primary iip-button__large iip-button__disabled'

// 在 Vue 组件中使用
export default {
  name: 'IipButton',
  setup() {
    const { n, classes } = createNamespace('button')

    const buttonClass = computed(() => {
      return classes(props.type, props.size, props.disabled && 'disabled')
    })

    return {
      buttonClass
    }
  }
}
```

```vue
<!-- 在模板中使用 -->
<template>
  <button :class="[n(), buttonClass]">
    <slot />
  </button>
</template>

<style scoped>
.iip-button {
  /* 基础样式 */
}

.iip-button__primary {
  /* 主要按钮样式 */
}

.iip-button__large {
  /* 大尺寸样式 */
}

.iip-button__disabled {
  /* 禁用状态样式 */
}
</style>
```

## Eova 转换工具

### 基础使用

```typescript
import { eovaConverter, EovaToAvueConverter } from '@bingwu/iip-ui-utils'

// 定义 Eova 字段数据
const eovaFields = [
  {
    id: 1,
    cn: '用户姓名',
    en: 'userName',
    type: '文本框',
    width: 120,
    is_show: true,
    is_order: true,
    is_required: true,
    placeholder: '请输入用户姓名'
  },
  {
    id: 2,
    cn: '用户邮箱',
    en: 'email',
    type: '文本框',
    width: 180,
    is_show: true,
    is_order: false,
    is_required: true
  },
  {
    id: 3,
    cn: '注册时间',
    en: 'createTime',
    type: '日期框',
    width: 160,
    is_show: true,
    is_order: true
  },
  {
    id: 4,
    cn: '用户状态',
    en: 'status',
    type: '下拉框',
    width: 100,
    is_show: true,
    is_order: false
  }
]

// 使用预设转换器实例
const tableColumns = eovaConverter.convertColumns(eovaFields)
console.log(tableColumns)
/*
输出:
[
  {
    field: 'userName',
    title: '用户姓名',
    width: 120,
    visible: true,
    sortable: true
  },
  {
    field: 'email',
    title: '用户邮箱',
    width: 180,
    visible: true,
    sortable: false
  },
  {
    field: 'createTime',
    title: '注册时间',
    width: 160,
    visible: true,
    sortable: true
  },
  {
    field: 'status',
    title: '用户状态',
    width: 100,
    visible: true,
    sortable: false
  }
]
*/
```

### 自定义转换器

```typescript
import { EovaToAvueConverter } from '@bingwu/iip-ui-utils'

// 创建自定义转换器
const customConverter = new EovaToAvueConverter()

// 查看默认字段类型映射
console.log(customConverter.fieldTypeMap)
/*
{
  文本框: 'input',
  文本域: 'textarea',
  数字框: 'number',
  密码框: 'password',
  日期框: 'date',
  时间框: 'datetime',
  下拉框: 'select',
  单选框: 'radio',
  复选框: 'checkbox',
  布尔框: 'switch',
  图片框: 'upload',
  文件框: 'upload',
  编辑框: 'ueditor',
  // ... 更多类型映射
}
*/

// 扩展字段类型映射
customConverter.fieldTypeMap = {
  ...customConverter.fieldTypeMap,
  自定义输入框: 'custom-input',
  地址选择器: 'address-picker',
  标签选择器: 'tag-selector'
}

// 使用自定义转换器
const customFields = [
  {
    cn: '详细地址',
    en: 'address',
    type: '地址选择器',
    width: 200,
    is_show: true,
    is_order: false
  }
]

const customColumns = customConverter.convertColumns(customFields)
console.log(customColumns)
```

### 在表格组件中使用

```vue
<template>
  <div class="user-table">
    <iip-table :data="tableData" :columns="tableColumns" :loading="loading" border stripe />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { eovaConverter, isNullOrUndefined } from '@bingwu/iip-ui-utils'

// 表格数据
const tableData = ref([])
const loading = ref(false)

// 从后端获取的 Eova 字段配置
const eovaFields = ref([])

// 转换为表格列配置
const tableColumns = computed(() => {
  if (eovaFields.value.length === 0) return []

  const columns = eovaConverter.convertColumns(eovaFields.value)

  // 可以进一步自定义列配置
  return columns.map(col => ({
    tableColumnProps: {
      ...col,
      // 添加自定义格式化函数
      formatter: ({ cellValue, row, column }: any) => {
        if (col.field === 'createTime' && !isNullOrUndefined(cellValue)) {
          return new Date(cellValue).toLocaleDateString()
        }
        if (col.field === 'status') {
          return cellValue === 1 ? '激活' : '禁用'
        }
        return cellValue
      }
    }
  }))
})

// 获取字段配置和数据
const fetchData = async () => {
  loading.value = true
  try {
    // 模拟 API 调用
    const [fieldsResponse, dataResponse] = await Promise.all([
      fetch('/api/eova/fields'),
      fetch('/api/users')
    ])

    eovaFields.value = await fieldsResponse.json()
    tableData.value = await dataResponse.json()
  } catch (error) {
    console.error('获取数据失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>
```

## 实际应用示例

### 用户管理页面

```vue
<template>
  <div class="user-management">
    <!-- 搜索区域 -->
    <div class="search-area">
      <el-input
        v-model="searchText"
        placeholder="搜索用户姓名或邮箱..."
        clearable
        style="width: 300px;"
      />
      <el-button @click="handleSearch" type="primary">搜索</el-button>
    </div>

    <!-- 用户表格 -->
    <iip-table :data="filteredUsers" :columns="userColumns" :loading="loading" border stripe>
      <!-- 操作列插槽 -->
      <template #action="{ row }">
        <el-button size="small" @click="editUser(row)">编辑</el-button>
        <el-button size="small" type="danger" @click="deleteUser(row)">删除</el-button>
      </template>
    </iip-table>

    <!-- 用户编辑对话框 -->
    <el-dialog v-model="dialogVisible" title="编辑用户" width="600px">
      <el-form :model="editForm" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="用户姓名" prop="userName">
          <el-input v-model="editForm.userName" />
        </el-form-item>
        <el-form-item label="邮箱地址" prop="email">
          <el-input v-model="editForm.email" />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="editForm.phone" />
        </el-form-item>
        <el-form-item label="用户状态" prop="status">
          <el-select v-model="editForm.status">
            <el-option label="激活" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveUser">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import {
  debounce,
  deepClone,
  generateId,
  isEmail,
  isPhone,
  eovaConverter
} from '@bingwu/iip-ui-utils'

// 响应式数据
const loading = ref(false)
const searchText = ref('')
const dialogVisible = ref(false)
const users = ref([])
const editForm = reactive({
  id: '',
  userName: '',
  email: '',
  phone: '',
  status: 1
})

// 表单验证规则
const formRules = {
  userName: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (value && !isEmail(value)) {
          callback(new Error('请输入有效的邮箱地址'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (value && !isPhone(value)) {
          callback(new Error('请输入有效的手机号码'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 防抖搜索
const debouncedSearch = debounce(() => {
  // 执行搜索逻辑
  console.log('搜索:', searchText.value)
}, 300)

// 过滤用户数据
const filteredUsers = computed(() => {
  if (!searchText.value) return users.value

  return users.value.filter(
    (user: any) =>
      user.userName.toLowerCase().includes(searchText.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.value.toLowerCase())
  )
})

// 表格列配置（使用 Eova 转换器）
const userColumns = computed(() => {
  const eovaFields = [
    {
      cn: '用户姓名',
      en: 'userName',
      type: '文本框',
      width: 120,
      is_show: true,
      is_order: true
    },
    {
      cn: '邮箱地址',
      en: 'email',
      type: '文本框',
      width: 200,
      is_show: true,
      is_order: false
    },
    {
      cn: '手机号码',
      en: 'phone',
      type: '文本框',
      width: 140,
      is_show: true,
      is_order: false
    },
    {
      cn: '注册时间',
      en: 'createTime',
      type: '日期框',
      width: 160,
      is_show: true,
      is_order: true
    },
    {
      cn: '用户状态',
      en: 'status',
      type: '下拉框',
      width: 100,
      is_show: true,
      is_order: false
    }
  ]

  const columns = eovaConverter.convertColumns(eovaFields)

  // 添加操作列
  columns.push({
    field: 'action',
    title: '操作',
    width: 150,
    visible: true,
    sortable: false
  })

  return columns.map(col => ({
    tableColumnProps: {
      ...col,
      formatter: ({ cellValue, row }: any) => {
        if (col.field === 'status') {
          return cellValue === 1 ? '激活' : '禁用'
        }
        if (col.field === 'createTime') {
          return new Date(cellValue).toLocaleString()
        }
        return cellValue
      }
    }
  }))
})

// 方法
const handleSearch = debouncedSearch

const editUser = (user: any) => {
  // 深拷贝用户数据到编辑表单
  Object.assign(editForm, deepClone(user))
  dialogVisible.value = true
}

const deleteUser = async (user: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该用户吗？', '提示', {
      type: 'warning'
    })

    // 执行删除逻辑
    console.log('删除用户:', user)

    ElMessage.success('删除成功')
    await fetchUsers()
  } catch {
    // 用户取消删除
  }
}

const saveUser = async () => {
  try {
    // 表单验证
    await formRef.value.validate()

    // 保存用户数据
    console.log('保存用户:', editForm)

    dialogVisible.value = false
    ElMessage.success('保存成功')
    await fetchUsers()
  } catch (error) {
    console.error('保存失败:', error)
  }
}

const fetchUsers = async () => {
  loading.value = true
  try {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000))

    users.value = [
      {
        id: generateId('user'),
        userName: '张三',
        email: 'zhangsan@example.com',
        phone: '13812345678',
        createTime: new Date(),
        status: 1
      },
      {
        id: generateId('user'),
        userName: '李四',
        email: 'lisi@example.com',
        phone: '15987654321',
        createTime: new Date(),
        status: 0
      }
    ]
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.user-management {
  padding: 20px;
}

.search-area {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  align-items: center;
}
</style>
```

## API 参考

### 类型检查函数

| 函数名                   | 参数      | 返回值    | 描述                         |
| ------------------------ | --------- | --------- | ---------------------------- |
| `isString(val)`          | `unknown` | `boolean` | 检查是否为字符串             |
| `isNumber(val)`          | `unknown` | `boolean` | 检查是否为数字               |
| `isBoolean(val)`         | `unknown` | `boolean` | 检查是否为布尔值             |
| `isFunction(val)`        | `unknown` | `boolean` | 检查是否为函数               |
| `isObject(val)`          | `unknown` | `boolean` | 检查是否为对象               |
| `isArray(val)`           | `unknown` | `boolean` | 检查是否为数组               |
| `isUndefined(val)`       | `unknown` | `boolean` | 检查是否为 undefined         |
| `isNull(val)`            | `unknown` | `boolean` | 检查是否为 null              |
| `isNullOrUndefined(val)` | `unknown` | `boolean` | 检查是否为 null 或 undefined |

### 通用工具函数

| 函数名                             | 参数                         | 返回值     | 描述         |
| ---------------------------------- | ---------------------------- | ---------- | ------------ |
| `debounce(func, wait, immediate?)` | `Function, number, boolean?` | `Function` | 创建防抖函数 |
| `throttle(func, limit)`            | `Function, number`           | `Function` | 创建节流函数 |
| `deepClone(obj)`                   | `T`                          | `T`        | 深拷贝对象   |
| `generateId(prefix?)`              | `string?`                    | `string`   | 生成唯一ID   |

### 验证函数

| 函数名                                      | 参数              | 返回值    | 描述             |
| ------------------------------------------- | ----------------- | --------- | ---------------- |
| `isEmail(email)`                            | `string`          | `boolean` | 验证邮箱格式     |
| `isPhone(phone)`                            | `string`          | `boolean` | 验证手机号格式   |
| `isIdCard(idCard)`                          | `string`          | `boolean` | 验证身份证格式   |
| `isUrl(url)`                                | `string`          | `boolean` | 验证URL格式      |
| `isIP(ip)`                                  | `string`          | `boolean` | 验证IP地址格式   |
| `getPasswordStrength(password, minLength?)` | `string, number?` | `number`  | 获取密码强度等级 |

### Vue 工具函数

| 函数名                          | 参数               | 返回值              | 描述                    |
| ------------------------------- | ------------------ | ------------------- | ----------------------- |
| `withInstall(component)`        | `Component`        | `SFCWithInstall<T>` | 为组件添加 install 方法 |
| `withInstallFunction(fn, name)` | `Function, string` | `Function`          | 为函数添加 install 方法 |
| `createNamespace(name)`         | `string`           | `Object`            | 创建命名空间工具        |

### Eova 转换工具

| 类/函数名                | 方法/参数     | 返回值                   | 描述                 |
| ------------------------ | ------------- | ------------------------ | -------------------- |
| `EovaToAvueConverter`    | 构造函数      | `EovaToAvueConverter`    | 创建转换器实例       |
| `convertColumns(fields)` | `EovaField[]` | `TableColumnProps[]`     | 转换字段为表格列配置 |
| `fieldTypeMap`           | getter/setter | `Record<string, string>` | 字段类型映射         |
| `eovaConverter`          | 预设实例      | `EovaToAvueConverter`    | 默认转换器实例       |

通过这些工具函数，你可以大大简化日常开发中的常见任务，提高开发效率和代码质量。所有函数都经过 TypeScript 类型检查，提供完整的类型支持和 IDE 智能提示。
