<template>
  <div class="iip-table">
    <!-- 表格主体 -->
    <vxe-table ref="tableRef" v-bind="attrs">
      <!-- 复选框 -->
      <vxe-column
        type="checkbox"
        v-if="checkBoxColumnConfig?.show"
        v-bind="checkBoxColumnConfig.tableColumnProps"
      >
        <template #default="slotData">
          <slot name="checkbox-slot-column" v-bind="slotData"></slot>
        </template>
      </vxe-column>
      <!-- 数据列 -->
      <vxe-column
        v-for="(column, columnIndex) in columns"
        :key="columnIndex"
        v-bind="column.tableColumnProps"
      >
        <template #default="slotData">
          <template v-if="column.slotName">
            <slot :name="column.slotName + '-column'" v-bind="slotData"></slot>
          </template>
          <template v-else>
            {{ slotData.row[column.tableColumnProps.field || ''] }}
          </template>
        </template>
      </vxe-column>
    </vxe-table>

    <!-- 分页器 -->
    <div v-if="pagination" class="iip-table__pagination">
      <vxe-pager v-bind="pagination" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, toRefs, useAttrs } from 'vue'
import { VxeTable, VxeColumn, VxeTableInstance } from 'vxe-table'
import { VxePager } from 'vxe-pc-ui'
import type { IipTableProps, IipTableExpose } from './types'
import 'vxe-pc-ui/es/style.css'
defineOptions({
  name: 'IipTable'
})
const attrs = useAttrs()
const props = defineProps<IipTableProps>()

// 表格实例
const tableRef = ref()
const tableInstance = computed(() => tableRef.value)
// 解构 props
const { pagination, columns, checkBoxColumnConfig } = toRefs<IipTableProps>(props)

defineExpose<IipTableExpose>({
  getTableInstance: () => tableInstance.value as VxeTableInstance
})
</script>

<style scoped>
.iip-table {
  width: 100%;
}

.iip-table__pagination {
  display: flex;
  justify-content: flex-end;
  padding: 16px 0;
  margin-top: 16px;
}
</style>
