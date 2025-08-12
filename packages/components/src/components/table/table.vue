<template>
  <div class="iip-table">
    <!-- 表格主体 -->
    <vxe-table
      ref="tableRef"
      v-bind="tableProps"
      :data="data"
      :height="height"
      :max-height="maxHeight"
      :border="border"
      :stripe="stripe"
      :show-header="showHeader"
      :resizable="resizable"
      :loading="loading"
      :empty-text="emptyText"
      :row-config="{ keyField: rowKey }"
      :size="size"
      :auto-resize="autoResize"
      @cell-click="handleCellClick"
      @cell-dblclick="handleCellDblclick"
      @checkbox-change="handleCheckboxChange"
      @checkbox-all="handleCheckboxAll"
      @sort-change="handleSortChange"
      @filter-change="handleFilterChange"
    >
      <!-- 复选框列 -->
      <vxe-column v-if="showCheckbox" type="checkbox" width="60" fixed="left" />

      <!-- 序号列 -->
      <vxe-column v-if="showSeq" type="seq" title="序号" width="80" fixed="left" />

      <!-- 数据列 -->
      <vxe-column
        v-for="column in columns"
        :key="column.field"
        :field="column.field"
        :title="column.title"
        :width="column.width"
        :min-width="column.minWidth"
        :sortable="column.sortable"
        :filterable="column.filterable"
        :align="column.align"
        :fixed="column.fixed"
        :formatter="column.formatter"
      >
        <!-- 自定义插槽 -->
        <template v-if="column.slotName" #default="{ row, rowIndex }">
          <slot :name="column.slotName" :row="row" :rowIndex="rowIndex" :column="column"></slot>
        </template>
      </vxe-column>
    </vxe-table>

    <!-- 分页器 -->
    <div v-if="pagination" class="iip-table__pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="currentPageSize"
        :total="pagination.total"
        :page-sizes="pagination.pageSizes || [10, 20, 50, 100]"
        :show-total="pagination.showTotal !== false"
        :show-sizes="pagination.showSizes !== false"
        :show-jumper="pagination.showJumper !== false"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handlePageChange"
        @size-change="handlePageSizeChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { VxeTable, VxeColumn } from 'vxe-table'
import { ElPagination } from 'element-plus'
import type { IipTableProps, IipTableEmits, IipTableExpose } from './types'

defineOptions({
  name: 'IipTable'
})

const props = withDefaults(defineProps<IipTableProps>(), {
  data: () => [],
  columns: () => [],
  border: true,
  stripe: false,
  showHeader: true,
  showCheckbox: false,
  showSeq: false,
  resizable: true,
  loading: false,
  emptyText: '暂无数据',
  rowKey: 'id',
  size: 'medium',
  autoResize: true
})

const emit = defineEmits<IipTableEmits>()

// 表格实例
const tableRef = ref()

// 分页数据
const currentPage = ref(props.pagination?.currentPage || 1)
const currentPageSize = ref(props.pagination?.pageSize || 20)

// 计算属性
const tableProps = computed(() => {
  const { data, columns, pagination, rowKey, ...rest } = props
  return rest
})

// 监听分页变化
watch(
  () => props.pagination?.currentPage,
  val => {
    if (val !== undefined) {
      currentPage.value = val
    }
  }
)

watch(
  () => props.pagination?.pageSize,
  val => {
    if (val !== undefined) {
      currentPageSize.value = val
    }
  }
)

// 事件处理
const handleCellClick = (params: any) => {
  emit('row-click', params)
}

const handleCellDblclick = (params: any) => {
  emit('row-dblclick', params)
}

const handleCheckboxChange = (params: any) => {
  emit('checkbox-change', params)
}

const handleCheckboxAll = (params: any) => {
  emit('checkbox-all', params)
}

const handleSortChange = (params: any) => {
  emit('sort-change', params)
}

const handleFilterChange = (params: any) => {
  emit('filter-change', params)
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  emit('page-change', { currentPage: page, pageSize: currentPageSize.value })
}

const handlePageSizeChange = (size: number) => {
  currentPageSize.value = size
  currentPage.value = 1 // 重置到第一页
  emit('page-size-change', { pageSize: size })
  emit('page-change', { currentPage: 1, pageSize: size })
}

// 暴露的方法
const getTableInstance = () => tableRef.value

const getCheckboxRecords = () => {
  return tableRef.value?.getCheckboxRecords() || []
}

const setCheckboxRow = (rows: any[], checked: boolean) => {
  tableRef.value?.setCheckboxRow(rows, checked)
}

const setAllCheckboxRow = (checked: boolean) => {
  tableRef.value?.setAllCheckboxRow(checked)
}

const clearCheckboxRow = () => {
  tableRef.value?.clearCheckboxRow()
}

const refresh = () => {
  tableRef.value?.refreshData()
}

const recalculate = () => {
  tableRef.value?.recalculate()
}

// 组件挂载后自动计算
onMounted(() => {
  if (props.autoResize) {
    recalculate()
  }
})

defineExpose<IipTableExpose>({
  getTableInstance,
  getCheckboxRecords,
  setCheckboxRow,
  setAllCheckboxRow,
  clearCheckboxRow,
  refresh,
  recalculate
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
