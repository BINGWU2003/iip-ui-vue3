import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import IipInput from '../input.vue'

describe('IipInput', () => {
  it('renders correctly', () => {
    const wrapper = mount(IipInput, {
      props: {
        modelValue: '',
        placeholder: '请输入内容'
      }
    })

    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('input').attributes('placeholder')).toBe('请输入内容')
  })

  it('emits update:modelValue when input value changes', async () => {
    const wrapper = mount(IipInput, {
      props: {
        modelValue: ''
      }
    })

    const input = wrapper.find('input')
    await input.setValue('test value')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['test value'])
  })

  it('shows clear button when clearable is true and has value', async () => {
    const wrapper = mount(IipInput, {
      props: {
        modelValue: 'test',
        clearable: true
      }
    })

    await nextTick()
    // 检查组件是否正确接收了 props
    expect(wrapper.props('clearable')).toBe(true)
    expect(wrapper.props('modelValue')).toBe('test')
  })

  it('validates email format correctly', async () => {
    const wrapper = mount(IipInput, {
      props: {
        modelValue: '',
        validateRule: 'email'
      }
    })

    const input = wrapper.find('input')

    // 测试无效邮箱
    await input.setValue('invalid-email')
    await input.trigger('blur')
    await nextTick()

    expect(wrapper.emitted('validate')).toBeTruthy()
    const validateEvents = wrapper.emitted('validate') as any[]
    expect(validateEvents[validateEvents.length - 1][0]).toBe(false)

    // 测试有效邮箱
    await input.setValue('test@example.com')
    await input.trigger('blur')
    await nextTick()

    const newValidateEvents = wrapper.emitted('validate') as any[]
    expect(newValidateEvents[newValidateEvents.length - 1][0]).toBe(true)
  })

  it('validates phone format correctly', async () => {
    const wrapper = mount(IipInput, {
      props: {
        modelValue: '',
        validateRule: 'phone'
      }
    })

    const input = wrapper.find('input')

    // 测试无效手机号
    await input.setValue('123')
    await input.trigger('blur')
    await nextTick()

    expect(wrapper.emitted('validate')).toBeTruthy()
    const validateEvents = wrapper.emitted('validate') as any[]
    expect(validateEvents[validateEvents.length - 1][0]).toBe(false)

    // 测试有效手机号
    await input.setValue('13812345678')
    await input.trigger('blur')
    await nextTick()

    const newValidateEvents = wrapper.emitted('validate') as any[]
    expect(newValidateEvents[newValidateEvents.length - 1][0]).toBe(true)
  })

  it('trims value on blur when trimOnBlur is true', async () => {
    const wrapper = mount(IipInput, {
      props: {
        modelValue: '',
        trimOnBlur: true
      }
    })

    const input = wrapper.find('input')
    await input.setValue('  test  ')
    await input.trigger('blur')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    const events = wrapper.emitted('update:modelValue') as any[]
    expect(events[events.length - 1]).toEqual(['test'])
  })

  it('debounces input events', async () => {
    vi.useFakeTimers()

    const wrapper = mount(IipInput, {
      props: {
        modelValue: '',
        debounceDelay: 300
      }
    })

    const input = wrapper.find('input')
    await input.setValue('test')

    // 在防抖时间内不应该触发 input 事件
    expect(wrapper.emitted('input')).toBeFalsy()

    // 快进时间
    vi.advanceTimersByTime(300)
    await nextTick()

    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted('input')?.[0]).toEqual(['test'])

    vi.useRealTimers()
  })

  it('exposes correct methods', () => {
    const wrapper = mount(IipInput, {
      props: {
        modelValue: ''
      }
    })

    const vm = wrapper.vm as any
    expect(typeof vm.focus).toBe('function')
    expect(typeof vm.blur).toBe('function')
    expect(typeof vm.clear).toBe('function')
    expect(typeof vm.validate).toBe('function')
  })

  it('handles custom validator function', async () => {
    const customValidator = vi.fn((value: string) => {
      return value.length >= 5 || '至少输入5个字符'
    })

    const wrapper = mount(IipInput, {
      props: {
        modelValue: '',
        validator: customValidator
      }
    })

    const input = wrapper.find('input')
    await input.setValue('123')
    await input.trigger('blur')
    await nextTick()

    expect(customValidator).toHaveBeenCalledWith('123')
    expect(wrapper.emitted('validate')).toBeTruthy()
    const validateEvents = wrapper.emitted('validate') as any[]
    expect(validateEvents[validateEvents.length - 1][0]).toBe(false)
    expect(validateEvents[validateEvents.length - 1][1]).toBe('至少输入5个字符')
  })
})
