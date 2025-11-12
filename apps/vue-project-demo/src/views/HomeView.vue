<script setup lang="ts">
// iip-ui-utils 工具函数
import { EovaToAvueConverter } from '@bingwu/iip-ui-utils'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
onMounted(() => {
  console.log(EovaToAvueConverter)
})
</script>

<template>
  <main class="test">home</main>
  <el-button @click="router.push('/about')" type="primary"> to about </el-button>
</template>
