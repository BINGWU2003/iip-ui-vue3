<template>
  <div class="demo-container">
    <iip-pagination-select
      v-model="selectedUser"
      :fetch-data="fetchUserData"
      placeholder="请选择用户"
      value-key="id"
      label-key="name"
      :page-size="20"
      @change="handleChange"
    />

    <div v-if="selectedUser" style="margin-top: 10px">
      已选择：{{ selectedUser.name }} (ID: {{ selectedUser.id }})
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { FetchDataParams, FetchDataResult } from '@bingwu/iip-ui-components'

// 定义用户数据类型
interface UserOption {
  id: number
  name: string
  email: string
}

const selectedUser = ref<UserOption | null>(null)

const handleChange = (value: UserOption | null) => {
  console.log('选中的用户：', value)
}

// 模拟用户数据
const mockUsers: UserOption[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `用户${i + 1}`,
  email: `user${i + 1}@example.com`
}))

// 模拟数据获取函数
const fetchUserData = async (
  params: FetchDataParams<UserOption>
): Promise<FetchDataResult<UserOption>> => {
  await new Promise(resolve => setTimeout(resolve, 300))

  const { page, pageSize, keyword } = params

  let filteredUsers = mockUsers
  if (keyword) {
    filteredUsers = mockUsers.filter(
      user => user.name.includes(keyword) || user.email.includes(keyword)
    )
  }

  const start = (page - 1) * pageSize
  const end = start + pageSize
  const data = filteredUsers.slice(start, end)

  return {
    data,
    total: filteredUsers.length
  }
}
</script>
