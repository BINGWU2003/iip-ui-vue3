<template>
  <div>
    <el-button>
      <slot name="title"></slot>
    </el-button>
    <el-dropdown>
      <slot name="content"></slot>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
