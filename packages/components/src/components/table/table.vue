<template>
  <div class="iip-table">
    <!-- 表格主体 -->
    <vxe-table ref="tableRef" v-bind="attrs">
      <!-- 展开列 -->
      <vxe-column
        type="expand"
        field="expand"
        v-if="expandColumnConfig?.show"
        v-bind="expandColumnConfig.tableColumnProps"
      >
        <template #content="slotData" v-if="getExpandSlot('content')">
          <slot name="expand-slot-column-content" v-bind="slotData"></slot>
        </template>
      </vxe-column>
      <!-- 序号 -->
      <vxe-column
        field="seq"
        type="seq"
        v-if="seqColumnConfig?.show"
        v-bind="seqColumnConfig.tableColumnProps"
      >
        <template #default="slotData" v-if="getSeqSlot('default')">
          <slot name="seq-slot-column-default" v-bind="slotData"></slot>
        </template>
      </vxe-column>
      <!-- 复选框 -->
      <vxe-column
        type="checkbox"
        field="checkbox"
        v-if="checkBoxColumnConfig?.show"
        v-bind="checkBoxColumnConfig.tableColumnProps"
      >
        <template #default="slotData" v-if="getCheckBoxSlot('default')">
          <slot name="checkbox-slot-column-default" v-bind="slotData"></slot>
        </template>
      </vxe-column>
      <!-- 单选框 -->
      <vxe-column
        type="radio"
        field="radio"
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
        <!-- header 插槽 -->
        <template v-if="hasColumnSlot(column, 'header')" #header="slotData">
          <slot :name="getSlotKey(column, 'header')" v-bind="slotData"></slot>
        </template>
        <!-- default 插槽 -->
        <template v-if="hasColumnSlot(column, 'default')" #default="slotData">
          <slot :name="getSlotKey(column, 'default')" v-bind="slotData"></slot>
        </template>
        <!-- edit 插槽 -->
        <template v-if="hasColumnSlot(column, 'edit')" #edit="slotData">
          <slot :name="getSlotKey(column, 'edit')" v-bind="slotData"></slot>
        </template>
        <!-- filter 插槽 -->
        <template v-if="hasColumnSlot(column, 'filter')" #filter="slotData">
          <slot :name="getSlotKey(column, 'filter')" v-bind="slotData"></slot>
        </template>
        <!-- footer 插槽 -->
        <template v-if="hasColumnSlot(column, 'footer')" #footer="slotData">
          <slot :name="getSlotKey(column, 'footer')" v-bind="slotData"></slot>
        </template>
        <!-- valid 插槽 -->
        <template v-if="hasColumnSlot(column, 'valid')" #valid="slotData">
          <slot :name="getSlotKey(column, 'valid')" v-bind="slotData"></slot>
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
// 列文档参考：https://vxetable.cn/v4/#/column/
// 表格文档参考：https://vxetable.cn/v4/#/table/
import { ref, computed, toRefs, useAttrs, useSlots } from 'vue'
import { VxeTable, VxeColumn, VxeTableInstance } from 'vxe-table'
import { VxePager } from 'vxe-pc-ui'
import type { IipTableProps, IipTableExpose, TableColumn } from './types'
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

// 表格实例
const tableRef = ref()
const tableInstance = computed(() => tableRef.value)

// 检查特定列是否有插槽
const hasColumnSlot = (column: TableColumn, slotType: string) => {
  const slotKey = getSlotKey(column, slotType)
  return !!slots[slotKey]
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
