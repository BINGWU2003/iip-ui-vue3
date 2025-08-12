import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ElPagination } from 'element-plus'
import IipTable from '../table.vue'
import type { TableColumn } from '../types'

// Mock vxe-table
const mockVxeTable = {
  template: '<div class="mock-vxe-table"><slot /></div>',
  props: ['data', 'height', 'border', 'stripe', 'loading'],
  emits: ['cell-click', 'checkbox-change']
}

const mockVxeColumn = {
  template: '<div class="mock-vxe-column"><slot /></div>',
  props: ['field', 'title', 'width', 'type']
}

describe('IipTable', () => {
  const mockData = [
    { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
    { id: 2, name: '李四', age: 30, email: 'lisi@example.com' },
    { id: 3, name: '王五', age: 28, email: 'wangwu@example.com' }
  ]

  const mockColumns: TableColumn[] = [
    { field: 'name', title: '姓名', width: 120 },
    { field: 'age', title: '年龄', width: 80, sortable: true },
    { field: 'email', title: '邮箱', minWidth: 200 }
  ]

  beforeEach(() => {
    // Reset any global state if needed
  })

  it('renders correctly with basic props', () => {
    const wrapper = mount(IipTable, {
      props: {
        data: mockData,
        columns: mockColumns
      },
      global: {
        components: {
          'vxe-table': mockVxeTable,
          'vxe-column': mockVxeColumn,
          'el-pagination': ElPagination
        }
      }
    })

    expect(wrapper.find('.iip-table').exists()).toBe(true)
    expect(wrapper.find('.mock-vxe-table').exists()).toBe(true)
  })

  it('shows checkbox column when showCheckbox is true', () => {
    const wrapper = mount(IipTable, {
      props: {
        data: mockData,
        columns: mockColumns,
        showCheckbox: true
      },
      global: {
        components: {
          'vxe-table': mockVxeTable,
          'vxe-column': mockVxeColumn
        }
      }
    })

    const checkboxColumn = wrapper
      .findAll('.mock-vxe-column')
      .find(col => col.attributes('type') === 'checkbox')
    expect(checkboxColumn).toBeDefined()
  })

  it('shows sequence column when showSeq is true', () => {
    const wrapper = mount(IipTable, {
      props: {
        data: mockData,
        columns: mockColumns,
        showSeq: true
      },
      global: {
        components: {
          'vxe-table': mockVxeTable,
          'vxe-column': mockVxeColumn
        }
      }
    })

    const seqColumn = wrapper
      .findAll('.mock-vxe-column')
      .find(col => col.attributes('type') === 'seq')
    expect(seqColumn).toBeDefined()
  })

  it('renders pagination when pagination prop is provided', () => {
    const wrapper = mount(IipTable, {
      props: {
        data: mockData,
        columns: mockColumns,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 100
        }
      },
      global: {
        components: {
          'vxe-table': mockVxeTable,
          'vxe-column': mockVxeColumn,
          'el-pagination': ElPagination
        }
      }
    })

    expect(wrapper.find('.iip-table__pagination').exists()).toBe(true)
  })

  it('does not render pagination when pagination prop is not provided', () => {
    const wrapper = mount(IipTable, {
      props: {
        data: mockData,
        columns: mockColumns
      },
      global: {
        components: {
          'vxe-table': mockVxeTable,
          'vxe-column': mockVxeColumn
        }
      }
    })

    expect(wrapper.find('.iip-table__pagination').exists()).toBe(false)
  })

  it('emits row-click event when cell is clicked', async () => {
    const wrapper = mount(IipTable, {
      props: {
        data: mockData,
        columns: mockColumns
      },
      global: {
        components: {
          'vxe-table': mockVxeTable,
          'vxe-column': mockVxeColumn
        }
      }
    })

    const table = wrapper.findComponent({ name: 'vxe-table' })
    await table.vm.$emit('cell-click', { row: mockData[0], rowIndex: 0 })

    expect(wrapper.emitted('row-click')).toBeTruthy()
    expect(wrapper.emitted('row-click')?.[0]).toEqual([{ row: mockData[0], rowIndex: 0 }])
  })

  it('emits page-change event when pagination changes', async () => {
    const wrapper = mount(IipTable, {
      props: {
        data: mockData,
        columns: mockColumns,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 100
        }
      },
      global: {
        components: {
          'vxe-table': mockVxeTable,
          'vxe-column': mockVxeColumn,
          'el-pagination': ElPagination
        }
      }
    })

    const pagination = wrapper.findComponent(ElPagination)
    await pagination.vm.$emit('current-change', 2)

    expect(wrapper.emitted('page-change')).toBeTruthy()
    expect(wrapper.emitted('page-change')?.[0]).toEqual([{ currentPage: 2, pageSize: 10 }])
  })

  it('applies correct props to vxe-table', () => {
    const wrapper = mount(IipTable, {
      props: {
        data: mockData,
        columns: mockColumns,
        border: false,
        stripe: true,
        loading: true,
        height: 400
      },
      global: {
        components: {
          'vxe-table': mockVxeTable,
          'vxe-column': mockVxeColumn
        }
      }
    })

    const table = wrapper.findComponent({ name: 'vxe-table' })
    expect(table.props('border')).toBe(false)
    expect(table.props('stripe')).toBe(true)
    expect(table.props('loading')).toBe(true)
    expect(table.props('height')).toBe(400)
  })
})
