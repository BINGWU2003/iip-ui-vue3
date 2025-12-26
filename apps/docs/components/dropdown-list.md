# DropdownList 下拉列表

基于 Element Plus 的 `el-dropdown` 组件二次封装，提供了更灵活的下拉菜单功能，特别适合在表格操作列中使用。

## 特性

- 🎯 **动态显示**: 支持根据数据动态控制菜单项的显示/隐藏
- 📝 **动态内容**: 菜单项内容支持字符串或函数，可根据数据动态生成
- 🎨 **完整继承**: 继承 Element Plus DropdownItem 的所有属性（icon、disabled、divided、command 等）
- 🔄 **数据驱动**: 通过配置数组驱动菜单项渲染
- 🎪 **插槽透传**: 完整支持 Dropdown 组件的所有插槽
- 🛠️ **TypeScript**: 完整的 TypeScript 类型支持
- 📦 **轻量封装**: 保留原生组件的所有功能，只增强不限制

## 基础用法

最简单的用法，在表格操作列中使用下拉列表：

<script setup>
import Basic from '../examples/dropdown-list/basic.vue'
</script>

<Basic />

::: details 查看代码
<<< @/examples/dropdown-list/basic.vue
:::

## 动态控制显示

通过 `show` 属性控制菜单项的显示/隐藏，支持布尔值或函数：

```vue
<template>
  <el-table :data="orderData" border stripe>
    <el-table-column prop="orderNo" label="订单号" width="150" />
    <el-table-column prop="status" label="状态" width="100">
      <template #default="{ row }">
        <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="150">
      <template #default="{ row }">
        <IipDropdownList
          :dropdown-list="orderDropdownList"
          :dropdown-props="{
            trigger: 'click',
            onCommand: command => handleOrderCommand(command, row)
          }"
        >
          <el-button type="primary" size="small">操作</el-button>
        </IipDropdownList>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IipDropdownList } from '@bingwu/iip-ui-components'
import type { DropdownListItemType } from '@bingwu/iip-ui-components'

type Order = {
  id: number
  orderNo: string
  status: '待支付' | '已支付' | '已发货' | '已完成' | '已取消'
}

const orderData = ref<Order[]>([
  { id: 1, orderNo: 'ORD-001', status: '待支付' },
  { id: 2, orderNo: 'ORD-002', status: '已支付' },
  { id: 3, orderNo: 'ORD-003', status: '已发货' }
])

// 获取订单下拉列表配置（根据订单状态动态显示不同的操作项）
const getOrderDropdownList = (row: Order): DropdownListItemType[] => {
  return [
    {
      content: '查看详情',
      command: 'view',
      show: true
    },
    {
      content: '确认支付',
      command: 'pay',
      show: row.status === '待支付',
      divided: true
    },
    {
      content: '发货',
      command: 'ship',
      show: row.status === '已支付'
    },
    {
      content: '完成订单',
      command: 'complete',
      show: row.status === '已发货'
    },
    {
      content: '取消订单',
      command: 'cancel',
      show: row.status === '待支付' || row.status === '已支付',
      divided: true
    }
  ]
}

const handleOrderCommand = (command: string | number | object, row: Order) => {
  console.log('执行操作:', command, row)
}

const getStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    待支付: 'warning',
    已支付: 'success',
    已发货: 'primary',
    已完成: 'info',
    已取消: 'danger'
  }
  return typeMap[status] || 'info'
}
</script>
```

## 动态内容

菜单项内容支持字符串或函数，可以根据数据动态生成：

```vue
<template>
  <el-table :data="userData" border stripe>
    <el-table-column prop="name" label="姓名" width="120" />
    <el-table-column prop="role" label="角色" width="100" />
    <el-table-column label="操作" width="150">
      <template #default="{ row }">
        <IipDropdownList
          :dropdown-list="getUserDropdownList(row)"
          :dropdown-props="{
            trigger: 'click',
            onCommand: command => handleUserCommand(command, row)
          }"
        >
          <el-button type="primary" link size="small">
            更多操作 <el-icon><arrow-down /></el-icon>
          </el-button>
        </IipDropdownList>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { IipDropdownList } from '@bingwu/iip-ui-components'
import type { DropdownListItemType } from '@bingwu/iip-ui-components'

type User = {
  id: number
  name: string
  role: 'admin' | 'user' | 'guest'
}

const userData = ref<User[]>([
  { id: 1, name: '管理员', role: 'admin' },
  { id: 2, name: '普通用户', role: 'user' },
  { id: 3, name: '访客', role: 'guest' }
])

// 获取用户下拉列表配置（动态生成菜单项内容）
const getUserDropdownList = (row: User): DropdownListItemType[] => {
  return [
    {
      content: `查看 ${row.name} 的详情`,
      command: 'view',
      show: true
    },
    {
      content: row.role === 'admin' ? '管理员设置' : '编辑用户',
      command: 'edit',
      show: true
    },
    {
      content: '重置密码',
      command: 'reset-password',
      show: row.role !== 'guest',
      divided: true
    },
    {
      content: '删除用户',
      command: 'delete',
      show: row.role !== 'admin',
      disabled: row.role === 'guest'
    }
  ]
}

const handleUserCommand = (command: string | number | object, row: User) => {
  console.log('执行操作:', command, row)
}
</script>
```

## 支持图标

继承了 Element Plus DropdownItem 的 `icon` 属性，支持显示图标：

```vue
<template>
  <IipDropdownList
    :dropdown-list="dropdownListWithIcon"
    :dropdown-props="{
      trigger: 'click',
      onCommand: handleCommand
    }"
  >
    <el-button type="primary">
      操作 <el-icon><arrow-down /></el-icon>
    </el-button>
  </IipDropdownList>
</template>

<script setup lang="ts">
import { Edit, Delete, View, Setting } from '@element-plus/icons-vue'
import { IipDropdownList } from '@bingwu/iip-ui-components'
import type { DropdownListItemType } from '@bingwu/iip-ui-components'

const dropdownListWithIcon: DropdownListItemType[] = [
  {
    content: '查看',
    command: 'view',
    icon: View,
    show: true
  },
  {
    content: '编辑',
    command: 'edit',
    icon: Edit,
    show: true
  },
  {
    content: '设置',
    command: 'setting',
    icon: Setting,
    show: true,
    divided: true
  },
  {
    content: '删除',
    command: 'delete',
    icon: Delete,
    show: true
  }
]

const handleCommand = (command: string | number | object) => {
  console.log('执行操作:', command)
}
</script>
```

## 禁用状态

使用 `disabled` 属性禁用菜单项，支持布尔值或函数：

```vue
<template>
  <el-table :data="taskData" border stripe>
    <el-table-column prop="taskName" label="任务名称" min-width="200" />
    <el-table-column prop="status" label="状态" width="100">
      <template #default="{ row }">
        <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="150">
      <template #default="{ row }">
        <IipDropdownList
          :dropdown-list="getTaskDropdownList(row)"
          :dropdown-props="{
            trigger: 'click',
            onCommand: command => handleTaskCommand(command, row)
          }"
        >
          <el-button type="primary" link size="small">更多操作</el-button>
        </IipDropdownList>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IipDropdownList } from '@bingwu/iip-ui-components'
import type { DropdownListItemType } from '@bingwu/iip-ui-components'

type Task = {
  id: number
  taskName: string
  status: '未开始' | '进行中' | '已完成'
}

const taskData = ref<Task[]>([
  { id: 1, taskName: '开发登录功能', status: '进行中' },
  { id: 2, taskName: '设计首页', status: '未开始' },
  { id: 3, taskName: '编写文档', status: '已完成' }
])

// 获取任务下拉列表配置
const getTaskDropdownList = (row: Task): DropdownListItemType[] => {
  return [
    {
      content: '查看详情',
      command: 'view',
      show: true
    },
    {
      content: '开始任务',
      command: 'start',
      show: row.status === '未开始'
    },
    {
      content: '暂停任务',
      command: 'pause',
      show: row.status === '进行中'
    },
    {
      content: '完成任务',
      command: 'complete',
      show: row.status === '进行中',
      divided: true
    },
    {
      content: '删除',
      command: 'delete',
      show: true,
      // 进行中的任务不能删除
      disabled: row.status === '进行中'
    }
  ]
}

const handleTaskCommand = (command: string | number | object, row: Task) => {
  console.log('执行操作:', command, row)
}

const getStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    未开始: 'info',
    进行中: 'warning',
    已完成: 'success'
  }
  return typeMap[status] || 'info'
}
</script>
```

## 分割线

使用 `divided` 属性在菜单项上方添加分割线：

```vue
<template>
  <IipDropdownList
    :dropdown-list="dropdownListWithDivider"
    :dropdown-props="{
      trigger: 'click',
      onCommand: handleCommand
    }"
  >
    <el-button type="primary">操作</el-button>
  </IipDropdownList>
</template>

<script setup lang="ts">
import { IipDropdownList } from '@bingwu/iip-ui-components'
import type { DropdownListItemType } from '@bingwu/iip-ui-components'

const dropdownListWithDivider: DropdownListItemType[] = [
  {
    content: '查看',
    command: 'view',
    show: true
  },
  {
    content: '编辑',
    command: 'edit',
    show: true
  },
  {
    content: '复制',
    command: 'copy',
    show: true,
    divided: true // 在"复制"上方添加分割线
  },
  {
    content: '删除',
    command: 'delete',
    show: true,
    divided: true // 在"删除"上方添加分割线
  }
]

const handleCommand = (command: string | number | object) => {
  console.log('执行操作:', command)
}
</script>
```

## 自定义触发器

通过默认插槽自定义触发器：

```vue
<template>
  <div>
    <!-- 按钮触发器 -->
    <IipDropdownList
      :dropdown-list="dropdownList"
      :dropdown-props="{ trigger: 'click', onCommand: handleCommand }"
    >
      <el-button type="primary" size="small">
        操作 <el-icon class="el-icon--right"><arrow-down /></el-icon>
      </el-button>
    </IipDropdownList>

    <!-- 链接触发器 -->
    <IipDropdownList
      :dropdown-list="dropdownList"
      :dropdown-props="{ trigger: 'click', onCommand: handleCommand }"
    >
      <el-button type="primary" link>
        更多 <el-icon><arrow-down /></el-icon>
      </el-button>
    </IipDropdownList>

    <!-- 图标触发器 -->
    <IipDropdownList
      :dropdown-list="dropdownList"
      :dropdown-props="{ trigger: 'click', onCommand: handleCommand }"
    >
      <el-icon :size="20" style="cursor: pointer">
        <more-filled />
      </el-icon>
    </IipDropdownList>

    <!-- 文本触发器 -->
    <IipDropdownList
      :dropdown-list="dropdownList"
      :dropdown-props="{ trigger: 'click', onCommand: handleCommand }"
    >
      <span style="color: #409eff; cursor: pointer">操作</span>
    </IipDropdownList>
  </div>
</template>

<script setup lang="ts">
import { ArrowDown, MoreFilled } from '@element-plus/icons-vue'
import { IipDropdownList } from '@bingwu/iip-ui-components'
import type { DropdownListItemType } from '@bingwu/iip-ui-components'

const dropdownList: DropdownListItemType[] = [
  { content: '查看', command: 'view', show: true },
  { content: '编辑', command: 'edit', show: true },
  { content: '删除', command: 'delete', show: true, divided: true }
]

const handleCommand = (command: string | number | object) => {
  console.log('执行操作:', command)
}
</script>
```

## 透传 Dropdown 配置

通过 `dropdownProps` 可以透传 Element Plus Dropdown 的所有配置：

```vue
<template>
  <IipDropdownList
    :dropdown-list="dropdownList"
    :dropdown-props="{
      trigger: 'hover',
      placement: 'bottom-start',
      hideOnClick: false,
      showTimeout: 200,
      hideTimeout: 200,
      size: 'large',
      onCommand: handleCommand,
      onVisibleChange: handleVisibleChange
    }"
  >
    <el-button type="primary">悬停触发</el-button>
  </IipDropdownList>
</template>

<script setup lang="ts">
import { IipDropdownList } from '@bingwu/iip-ui-components'
import type { DropdownListItemType } from '@bingwu/iip-ui-components'

const dropdownList: DropdownListItemType[] = [
  { content: '选项 1', command: 'option1', show: true },
  { content: '选项 2', command: 'option2', show: true },
  { content: '选项 3', command: 'option3', show: true }
]

const handleCommand = (command: string | number | object) => {
  console.log('选择了:', command)
}

const handleVisibleChange = (visible: boolean) => {
  console.log('下拉菜单可见性:', visible)
}
</script>
```

## 组件方法

通过 ref 可以调用 Element Plus Dropdown 的所有方法：

```vue
<template>
  <div>
    <IipDropdownList
      ref="dropdownRef"
      :dropdown-list="dropdownList"
      :dropdown-props="{ trigger: 'click', onCommand: handleCommand }"
    >
      <el-button type="primary">操作</el-button>
    </IipDropdownList>

    <el-button @click="handleShowDropdown">显示下拉菜单</el-button>
    <el-button @click="handleHideDropdown">隐藏下拉菜单</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IipDropdownList } from '@bingwu/iip-ui-components'
import type { DropdownListInstance, DropdownListItemType } from '@bingwu/iip-ui-components'

const dropdownRef = ref<DropdownListInstance>()

const dropdownList: DropdownListItemType[] = [
  { content: '查看', command: 'view', show: true },
  { content: '编辑', command: 'edit', show: true },
  { content: '删除', command: 'delete', show: true }
]

const handleCommand = (command: string | number | object) => {
  console.log('执行操作:', command)
}

const handleShowDropdown = () => {
  // 调用 Element Plus Dropdown 的 handleOpen 方法
  dropdownRef.value?.handleOpen?.()
}

const handleHideDropdown = () => {
  // 调用 Element Plus Dropdown 的 handleClose 方法
  dropdownRef.value?.handleClose?.()
}
</script>
```

## API

### Props

| 参数          | 说明                                | 类型                                                 | 默认值 |
| ------------- | ----------------------------------- | ---------------------------------------------------- | ------ |
| dropdownList  | 下拉列表配置数组                    | `DropdownListItemType[]`                             | `[]`   |
| dropdownProps | Dropdown 组件的配置，透传所有 props | `Partial<InstanceType<typeof ElDropdown>['$props']>` | `{}`   |

### DropdownListItemType

继承了 Element Plus `DropdownItem` 的所有属性，并额外扩展：

| 参数     | 说明                                          | 类型                         | 默认值      |
| -------- | --------------------------------------------- | ---------------------------- | ----------- |
| show     | 是否显示该菜单项                              | `boolean`                    | `undefined` |
| content  | 菜单项内容                                    | `string`                     | `''`        |
| command  | 点击菜单项时触发的命令（继承自 DropdownItem） | `string \| number \| object` | -           |
| disabled | 是否禁用（继承自 DropdownItem）               | `boolean`                    | `false`     |
| divided  | 是否显示分割线（继承自 DropdownItem）         | `boolean`                    | `false`     |
| icon     | 图标组件（继承自 DropdownItem）               | `Component`                  | -           |
| ...rest  | 其他 DropdownItem 的所有属性都会透传          | -                            | -           |

**注意：**

- `show` 属性为 `undefined` 时，默认显示该菜单项
- 通过闭包捕获数据，在函数内部直接使用，无需通过参数传递
- 所有 Element Plus DropdownItem 的属性都可以使用

### Slots

| 插槽名  | 说明                                     | 参数 |
| ------- | ---------------------------------------- | ---- |
| default | 触发器内容，通常是一个按钮或链接         | -    |
| ...     | 支持 Dropdown 组件的所有插槽（自动透传） | -    |

### Events

所有事件通过 `dropdownProps` 透传给 Element Plus Dropdown 组件：

| 事件名         | 说明                  | 回调参数                              |
| -------------- | --------------------- | ------------------------------------- |
| command        | 点击菜单项触发的事件  | `command: string \| number \| object` |
| visible-change | 下拉框出现/隐藏时触发 | `visible: boolean`                    |

**使用示例：**

```vue
<IipDropdownList
  :dropdown-list="dropdownList"
  :dropdown-props="{
    onCommand: command => handleCommand(command),
    onVisibleChange: visible => handleVisibleChange(visible)
  }"
>
  <el-button>操作</el-button>
</IipDropdownList>
```

### Methods

通过 ref 可以访问 Element Plus Dropdown 的所有方法（通过 Proxy 透传）：

| 方法名      | 说明         | 参数 |
| ----------- | ------------ | ---- |
| handleOpen  | 打开下拉菜单 | -    |
| handleClose | 关闭下拉菜单 | -    |

## 类型定义

```typescript
import { ElDropdown, ElDropdownItem } from 'element-plus'

/**
 * 下拉列表项类型
 */
export type DropdownListItemType = Partial<InstanceType<typeof ElDropdownItem>['$props']> & {
  /**
   * 是否显示该菜单项
   * - undefined: 默认显示
   * - boolean: 直接控制显示/隐藏
   */
  show?: boolean
  /**
   * 菜单项内容
   */
  content?: string
}

/**
 * DropdownList 组件 Props
 */
export type DropdownListProps = {
  /** 下拉列表配置数组 */
  dropdownList: DropdownListItemType[]
  /** Dropdown 组件的配置，透传所有 props */
  dropdownProps?: Partial<InstanceType<typeof ElDropdown>['$props']>
}

/** 插槽类型 */
export type DropdownListSlots = InstanceType<typeof ElDropdown>['$slots']

/** 组件实例类型（通过 Proxy 透传 Dropdown 实例） */
export type DropdownListInstance = InstanceType<typeof ElDropdown>
```

### 使用示例

通过闭包捕获数据，实现动态配置：

```typescript
// 1. 定义数据类型
interface Order {
  id: number
  orderNo: string
  status: '待支付' | '已支付' | '已发货'
  amount: number
}

// 2. 定义下拉列表生成函数（通过闭包捕获 row 数据）
const getOrderDropdownList = (row: Order): DropdownListItemType[] => {
  return [
    {
      content: '查看详情',
      command: 'view',
      show: true
    },
    {
      content: '确认支付',
      command: 'pay',
      // ✅ 直接使用闭包中的 row，类型完整推导
      show: row.status === '待支付'
    },
    {
      content: `订单金额：¥${row.amount}`,
      command: 'detail',
      show: true
    }
  ]
}

// 3. 在模板中使用
<IipDropdownList
  :dropdown-list="getOrderDropdownList(row)"
  :dropdown-props="{
    trigger: 'click',
    onCommand: command => handleCommand(command, row)
  }"
/>
```

## 最佳实践

### 1. 在表格中使用

```vue
<template>
  <el-table :data="tableData" border stripe>
    <el-table-column prop="name" label="姓名" />
    <el-table-column label="操作" width="150" fixed="right">
      <template #default="{ row }">
        <IipDropdownList
          :dropdown-list="getDropdownList(row)"
          :dropdown-props="{
            trigger: 'click',
            onCommand: command => handleCommand(command, row)
          }"
          :data="row"
        >
          <el-button type="primary" size="small">操作</el-button>
        </IipDropdownList>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IipDropdownList } from '@bingwu/iip-ui-components'
import type { DropdownListItemType } from '@bingwu/iip-ui-components'
import { ElMessage } from 'element-plus'

type User = {
  id: number
  name: string
  status: string
}

const tableData = ref<User[]>([{ id: 1, name: '张三', status: '正常' }])

const getDropdownList = (row: User): DropdownListItemType[] => {
  return [
    {
      content: '查看',
      command: 'view',
      show: true
    },
    {
      content: '编辑',
      command: 'edit',
      show: row.status === '正常'
    },
    {
      content: '删除',
      command: 'delete',
      show: true,
      divided: true
    }
  ]
}

const handleCommand = (command: string | number | object, row: User) => {
  const commandStr = String(command)

  switch (commandStr) {
    case 'view':
      ElMessage.info(`查看 ${row.name}`)
      break
    case 'edit':
      ElMessage.info(`编辑 ${row.name}`)
      break
    case 'delete':
      ElMessage.warning(`删除 ${row.name}`)
      break
  }
}
</script>
```

### 2. 权限控制

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { IipDropdownList } from '@bingwu/iip-ui-components'
import type { DropdownListItemType } from '@bingwu/iip-ui-components'

// 模拟权限
const permissions = ref(['view', 'edit'])

const hasPermission = (permission: string) => {
  return permissions.value.includes(permission)
}

type Data = {
  id: number
  name: string
}

// 根据权限生成下拉列表
const getDropdownList = (row: Data): DropdownListItemType[] => {
  return [
    {
      content: '查看',
      command: 'view',
      show: hasPermission('view')
    },
    {
      content: '编辑',
      command: 'edit',
      show: hasPermission('edit')
    },
    {
      content: '删除',
      command: 'delete',
      show: hasPermission('delete'),
      divided: true
    }
  ]
}
</script>
```

### 3. 配置复用

```typescript
// utils/dropdown-configs.ts
import type { DropdownListItemType } from '@bingwu/iip-ui-components'

export interface CommonData {
  id: number
  status: string
}

// 通用操作配置
export const getCommonDropdownList = (row: CommonData): DropdownListItemType[] => {
  return [
    {
      content: '查看详情',
      command: 'view',
      show: true
    },
    {
      content: '编辑',
      command: 'edit',
      show: row.status === '正常'
    },
    {
      content: '删除',
      command: 'delete',
      show: true,
      divided: true
    }
  ]
}

// 在组件中使用
import { getCommonDropdownList } from '@/utils/dropdown-configs'

<IipDropdownList
  :dropdown-list="getCommonDropdownList(row)"
  :dropdown-props="{
    trigger: 'click',
    onCommand: command => handleCommand(command, row)
  }"
/>
```

### 4. 批量操作确认

```vue
<script setup lang="ts">
import { ElMessageBox, ElMessage } from 'element-plus'
import { IipDropdownList } from '@bingwu/iip-ui-components'
import type { DropdownListItemType } from '@bingwu/iip-ui-components'

type User = {
  id: number
  name: string
}

// 获取下拉列表配置
const getDropdownList = (row: User): DropdownListItemType[] => {
  return [
    {
      content: '查看',
      command: 'view',
      show: true
    },
    {
      content: '删除',
      command: 'delete',
      show: true,
      divided: true
    }
  ]
}

const handleCommand = async (command: string | number | object, row: User) => {
  const commandStr = String(command)

  if (commandStr === 'delete') {
    try {
      await ElMessageBox.confirm(`确定要删除 ${row.name} 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })

      // 执行删除操作
      ElMessage.success('删除成功')
    } catch {
      ElMessage.info('已取消删除')
    }
  }
}
</script>
```

## 注意事项

1. **show 默认值**: `show` 属性为 `undefined` 时，菜单项会默认显示。如果要隐藏菜单项，需要显式设置为 `false`。

2. **命令处理**: `command` 事件需要通过 `dropdownProps` 的 `onCommand` 回调来处理，而不是通过组件的 `@command` 事件。

3. **闭包捕获**: 通过在函数中直接使用外部变量（闭包），可以方便地访问行数据，无需通过参数传递。

4. **类型安全**: 建议定义明确的数据类型接口，TypeScript 会自动推导闭包中的类型。

5. **性能优化**: 在表格场景中，每行都会调用配置函数，这是正常且必要的。配置函数本身很轻量，不会造成性能问题。

6. **事件透传**: 所有 Dropdown 组件的事件都需要通过 `dropdownProps` 透传，使用 `onXxx` 的形式（如 `onCommand`、`onVisibleChange`）。

## 常见问题

### Q: 为什么我的菜单项没有显示？

A: 检查以下几点：

1. `show` 属性是否设置为 `false`
2. 确认 `dropdownList` 数组不为空
3. 检查是否正确调用了配置函数（如 `getDropdownList(row)`）

### Q: 如何处理命令事件？

A: 通过 `dropdownProps` 的 `onCommand` 回调：

```vue
<IipDropdownList
  :dropdown-list="dropdownList"
  :dropdown-props="{
    onCommand: command => handleCommand(command, row)
  }"
/>
```

### Q: 如何访问 Dropdown 组件的方法？

A: 通过 ref 访问，组件会通过 Proxy 透传所有 Dropdown 的方法：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { DropdownListInstance } from '@bingwu/iip-ui-components'

const dropdownRef = ref<DropdownListInstance>()

// 调用方法
dropdownRef.value?.handleOpen?.()
dropdownRef.value?.handleClose?.()
</script>
```

### Q: 如何在菜单项中显示图标？

A: 使用 `icon` 属性（继承自 DropdownItem）：

```typescript
import { Edit, Delete } from '@element-plus/icons-vue'

const dropdownList: DropdownListItemType[] = [
  {
    content: '编辑',
    command: 'edit',
    icon: Edit,
    show: true
  },
  {
    content: '删除',
    command: 'delete',
    icon: Delete,
    show: true
  }
]
```

### Q: 如何实现二次确认？

A: 在命令处理函数中使用 `ElMessageBox`：

```typescript
const handleCommand = async (command: string | number | object, row: any) => {
  if (command === 'delete') {
    try {
      await ElMessageBox.confirm('确定要删除吗？', '提示', {
        type: 'warning'
      })
      // 执行删除
    } catch {
      // 取消删除
    }
  }
}
```

### Q: 如何根据数据动态禁用菜单项？

A: 在配置函数中根据数据直接设置 `disabled` 值：

```typescript
const getDropdownList = (row: User): DropdownListItemType[] => {
  return [
    {
      content: '编辑',
      command: 'edit',
      show: true,
      disabled: row.status === '已完成'
    }
  ]
}
```

### Q: 菜单项过多时如何优化？

A: 可以使用分组和分割线组织菜单项：

```typescript
const dropdownList: DropdownListItemType[] = [
  { content: '查看', command: 'view', show: true },
  { content: '编辑', command: 'edit', show: true },
  { content: '复制', command: 'copy', show: true, divided: true },
  { content: '移动', command: 'move', show: true },
  { content: '删除', command: 'delete', show: true, divided: true }
]
```
