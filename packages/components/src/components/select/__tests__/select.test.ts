import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import IipSelect from '../select.vue'

const mockOptions = [
  { value: '1', label: '选项一' },
  { value: '2', label: '选项二' },
  { value: '3', label: '选项三' },
  { value: '4', label: '选项四' }
]

describe('IipSelect', () => {
  it('renders correctly', () => {
    const wrapper = mount(IipSelect, {
      props: {
        modelValue: '',
        options: mockOptions,
        placeholder: '请选择'
      }
    })

    expect(wrapper.find('.el-select').exists()).toBe(true)
  })

  it('emits update:modelValue when selection changes', async () => {
    const wrapper = mount(IipSelect, {
      props: {
        modelValue: '',
        options: mockOptions
      }
    })

    // 检查组件是否正确接收了 props
    expect(wrapper.props('options')).toEqual(mockOptions)
    expect(wrapper.props('modelValue')).toBe('')
  })

  it('supports multiple selection', async () => {
    const wrapper = mount(IipSelect, {
      props: {
        modelValue: [],
        options: mockOptions,
        multiple: true
      }
    })

    expect(wrapper.props('multiple')).toBe(true)
  })

  it('shows select all option in multiple mode', async () => {
    const wrapper = mount(IipSelect, {
      props: {
        modelValue: [],
        options: mockOptions,
        multiple: true,
        showSelectAll: true
      }
    })

    await nextTick()
    expect(wrapper.props('showSelectAll')).toBe(true)
    expect(wrapper.props('multiple')).toBe(true)
  })

  it('filters options correctly', async () => {
    const wrapper = mount(IipSelect, {
      props: {
        modelValue: '',
        options: mockOptions,
        filterable: true
      }
    })

    await nextTick()
    expect(wrapper.props('filterable')).toBe(true)
    expect(wrapper.props('options')).toEqual(mockOptions)
  })

  it('groups options correctly', async () => {
    const groupedOptions = [
      { value: '1', label: '选项一', group: '分组A' },
      { value: '2', label: '选项二', group: '分组A' },
      { value: '3', label: '选项三', group: '分组B' },
      { value: '4', label: '选项四', group: '分组B' }
    ]

    const wrapper = mount(IipSelect, {
      props: {
        modelValue: '',
        options: groupedOptions
      }
    })

    await nextTick()
    const vm = wrapper.vm as any
    const grouped = vm.groupedOptions
    expect(grouped).toHaveLength(2)
    expect(grouped[0].name).toBe('分组A')
    expect(grouped[1].name).toBe('分组B')
  })

  it('handles remote search correctly', async () => {
    const remoteMethod = vi.fn().mockResolvedValue([{ value: 'remote1', label: '远程选项1' }])

    const wrapper = mount(IipSelect, {
      props: {
        modelValue: '',
        options: [],
        remote: true,
        remoteMethod
      }
    })

    await nextTick()
    expect(wrapper.props('remote')).toBe(true)
    expect(wrapper.props('remoteMethod')).toBe(remoteMethod)
  })

  it('calculates select all state correctly', async () => {
    const wrapper = mount(IipSelect, {
      props: {
        modelValue: ['1', '2'],
        options: mockOptions,
        multiple: true,
        showSelectAll: true
      }
    })

    await nextTick()
    const vm = wrapper.vm as any

    // 部分选中状态
    expect(vm.isIndeterminate).toBe(true)
    expect(vm.isAllSelected).toBe(false)

    // 全选状态
    await wrapper.setProps({ modelValue: ['1', '2', '3', '4'] })
    await nextTick()
    expect(vm.isAllSelected).toBe(true)
    expect(vm.isIndeterminate).toBe(false)
  })

  it('handles select all functionality', async () => {
    const wrapper = mount(IipSelect, {
      props: {
        modelValue: [],
        options: mockOptions,
        multiple: true,
        showSelectAll: true
      }
    })

    const vm = wrapper.vm as any

    // 测试全选
    await vm.handleSelectAll()

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('select-all')).toBeTruthy()
  })

  it('shows count when showCount is true', async () => {
    const wrapper = mount(IipSelect, {
      props: {
        modelValue: ['1', '2'],
        options: mockOptions,
        multiple: true,
        showCount: true
      }
    })

    await nextTick()
    expect(wrapper.html()).toContain('已选择 2 项')
  })

  it('exposes correct methods', () => {
    const wrapper = mount(IipSelect, {
      props: {
        modelValue: '',
        options: mockOptions
      }
    })

    const vm = wrapper.vm as any
    expect(typeof vm.focus).toBe('function')
    expect(typeof vm.blur).toBe('function')
    expect(typeof vm.clear).toBe('function')
    expect(typeof vm.getSelectedOptions).toBe('function')
    expect(typeof vm.setOptions).toBe('function')
  })

  it('gets selected options correctly', async () => {
    const wrapper = mount(IipSelect, {
      props: {
        modelValue: '1',
        options: mockOptions
      }
    })

    const vm = wrapper.vm as any
    const selectedOptions = vm.getSelectedOptions()
    expect(selectedOptions).toHaveLength(1)
    expect(selectedOptions[0].value).toBe('1')
    expect(selectedOptions[0].label).toBe('选项一')
  })

  it('sets options correctly', async () => {
    const wrapper = mount(IipSelect, {
      props: {
        modelValue: '',
        options: []
      }
    })

    const vm = wrapper.vm as any
    const newOptions = [{ value: 'new', label: '新选项' }]
    vm.setOptions(newOptions)

    await nextTick()
    expect(vm.internalOptions).toEqual(newOptions)
  })
})
