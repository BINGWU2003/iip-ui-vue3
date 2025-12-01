<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <main class="test">home</main>
  <el-button @click="router.push('/about')" type="primary"> to about </el-button>
</template>
