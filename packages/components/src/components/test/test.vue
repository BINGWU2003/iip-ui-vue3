<template>
  <div class="test">
    <h1>{{ test }}</h1>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const test = ref('test')
</script>

<style scoped>
.test {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
</style>
