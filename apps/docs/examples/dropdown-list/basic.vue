<template>
  <div class="demo-container">
    <el-table :data="tableData" border stripe>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="status" label="状态" width="100" />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <iip-dropdown-list
            :dropdown-list="getDropdownList(row)"
            :dropdown-props="{
              trigger: 'click',
              onCommand: command => handleCommand(command, row)
            }"
          >
            <el-button type="primary" size="small">
              操作 <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
          </iip-dropdown-list>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import type { DropdownListItemType } from '@bingwu/iip-ui-components'
import { ElMessage } from 'element-plus'

type User = {
  id: number
  name: string
  status: string
}

const tableData = ref<User[]>([
  { id: 1, name: '张三', status: '正常' },
  { id: 2, name: '李四', status: '禁用' },
  { id: 3, name: '王五', status: '正常' }
])

// 获取下拉列表配置（通过闭包捕获 row 数据）
const getDropdownList = (row: User): DropdownListItemType[] => {
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

const handleCommand = (command: string | number | object, row: User) => {
  ElMessage.success(`执行 ${command} 操作：${row.name}`)
}
</script>
