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
          <template v-if="getCheckBoxSlot">
            <slot name="checkbox-slot-column-default" v-bind="slotData"></slot>
          </template>
        </template>
      </vxe-column>
      <!-- 数据列 -->
      <vxe-column
        v-for="(column, columnIndex) in columns"
        :key="columnIndex"
        v-bind="column.tableColumnProps"
      >
        <template #default="slotData">
          <template v-if="getSlotKey(column) in getColumnSlot('default')">
            <slot :name="getSlotKey(column)" v-bind="slotData"></slot>
          </template>
          <template v-else>
            {{ slotData.row[column.tableColumnProps.field || ''] }}
          </template>
        </template>
        <template #header="slotData">
          <template v-if="getSlotKey(column) in getColumnSlot('header')">
            <slot :name="getSlotKey(column)" v-bind="slotData"></slot>
          </template>
          <template v-else>
            {{ slotData.column.title }}
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
import { ref, computed, toRefs, useAttrs, useSlots } from 'vue'
import { VxeTable, VxeColumn, VxeTableInstance } from 'vxe-table'
import { VxePager } from 'vxe-pc-ui'
import type { IipTableProps, IipTableExpose, TableColumn } from './types'
import 'vxe-pc-ui/es/style.css'
defineOptions({
  name: 'IipTable'
})
const slots = useSlots()
const attrs = useAttrs()
const props = defineProps<IipTableProps>()
// 解构 props
const { pagination, columns, checkBoxColumnConfig } = toRefs<IipTableProps>(props)
const getColumnSlot = (slotType: string) => {
  const columnSlot = columns?.value?.filter(column => column.slotConfig?.slotType === slotType)
  if (columnSlot && columnSlot.length > 0) {
    const defaultColumnSlotMap: Record<string, any> = {}
    columnSlot.forEach(column => {
      const slotKey = getSlotKey(column)
      if (slots[slotKey]) {
        defaultColumnSlotMap[slotKey] = slots[slotKey]
      }
    })
    return defaultColumnSlotMap
  }
  return {}
}
const getSlotKey = (column: TableColumn) => {
  return `${column.tableColumnProps.field}-slot-${column.slotConfig?.slotArea}-${column.slotConfig?.slotType}`
}
const getCheckBoxSlot = computed(() => {
  return slots['checkbox-slot-column-default']
})
// 表格实例
const tableRef = ref()
const tableInstance = computed(() => tableRef.value)

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
