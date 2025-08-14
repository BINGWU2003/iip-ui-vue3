<template>
  <div class="iip-table">
    <!-- 表格主体 -->
    <vxe-table ref="tableRef" v-bind="attrs">
      <!-- 展开列 -->
      <vxe-column
        type="expand"
        v-if="expandColumnConfig?.show"
        v-bind="expandColumnConfig.tableColumnProps"
      >
        <template #content="slotData">
          <template v-if="getExpandSlot('content')">
            <slot name="expand-slot-column-content" v-bind="slotData"></slot>
          </template>
        </template>
      </vxe-column>
      <!-- 序号 -->
      <vxe-column type="seq" v-if="seqColumnConfig?.show" v-bind="seqColumnConfig.tableColumnProps">
        <template #default="slotData">
          <template v-if="getSeqSlot('default')">
            <slot name="seq-slot-column-default" v-bind="slotData"></slot>
          </template>
          <template v-else>
            {{ slotData.rowIndex + 1 }}
          </template>
        </template>
      </vxe-column>
      <!-- 复选框 -->
      <vxe-column
        type="checkbox"
        v-if="checkBoxColumnConfig?.show"
        v-bind="checkBoxColumnConfig.tableColumnProps"
      >
        <template #default="slotData">
          <template v-if="getCheckBoxSlot('default')">
            <slot name="checkbox-slot-column-default" v-bind="slotData"></slot>
          </template>
        </template>
      </vxe-column>
      <!-- 单选框 -->
      <vxe-column
        type="radio"
        v-if="radioColumnConfig?.show"
        v-bind="radioColumnConfig.tableColumnProps"
      >
        <template #default="slotData">
          <template v-if="getRadioSlot('default')">
            <slot name="radio-slot-column-default" v-bind="slotData"></slot>
          </template>
        </template>
      </vxe-column>
      <!-- 数据列 -->
      <vxe-column
        v-for="(column, columnIndex) in columns"
        :key="columnIndex"
        v-bind="column.tableColumnProps"
      >
        <template v-for="slotType in columnSlotTypeList" :key="slotType" #[slotType]="slotData">
          <template v-if="getSlotKey(column, slotType) in getColumnSlot(slotType)">
            <slot :name="getSlotKey(column, slotType)" v-bind="slotData"></slot>
          </template>
          <template v-else-if="slotType === 'header'">
            {{ slotData.column.title }}
          </template>
          <template v-else-if="slotType === 'default'">
            {{ slotData.row[column.tableColumnProps.field || ''] }}
          </template>
        </template>
      </vxe-column>
      <!-- vxe表格插槽 -->
      <template v-for="(_, slotKey) in slots" :key="slotKey + 'table'" #[slotKey]="slotData">
        <slot :name="slotKey" v-bind="slotData"></slot>
      </template>
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
const {
  pagination,
  columns,
  checkBoxColumnConfig,
  seqColumnConfig,
  expandColumnConfig,
  radioColumnConfig
} = toRefs<IipTableProps>(props)

const columnSlotTypeList = ['header', 'default']
// 表格实例
const tableRef = ref()
const tableInstance = computed(() => tableRef.value)
const getColumnSlot = (slotType: string) => {
  const columnSlot = columns?.value
  if (columnSlot && columnSlot.length > 0) {
    const columnSlotMap: Record<string, any> = {}
    columnSlot.forEach(column => {
      const slotKey = getSlotKey(column, slotType)
      if (slots[slotKey]) {
        columnSlotMap[slotKey] = slots[slotKey]
      }
    })
    return columnSlotMap
  }
  return {}
}
const getSlotKey = (column: TableColumn, slotType: string) => {
  return `${column.tableColumnProps.field}-slot-column-${slotType}`
}
const getCheckBoxSlot = (slotType: string) => {
  return slots[`checkbox-slot-column-${slotType}`]
}
const getSeqSlot = (slotType: string) => {
  return slots[`seq-slot-column-${slotType}`]
}
const getExpandSlot = (slotType: string) => {
  return slots[`expand-slot-column-${slotType}`]
}
const getRadioSlot = (slotType: string) => {
  return slots[`radio-slot-column-${slotType}`]
}
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
