import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ElForm, ElFormItem, ElInput, ElButton } from 'element-plus'
import Form from '../form.vue'
import type { FormConfig } from '../types'

// Mock Element Plus components
vi.mock('element-plus', () => ({
  ElForm: {
    name: 'ElForm',
    template: '<form><slot /></form>'
  },
  ElFormItem: {
    name: 'ElFormItem',
    template: '<div><slot /></div>'
  },
  ElInput: {
    name: 'ElInput',
    template: '<input />'
  },
  ElButton: {
    name: 'ElButton',
    template: '<button><slot /></button>'
  },
  ElRow: {
    name: 'ElRow',
    template: '<div><slot /></div>'
  },
  ElCol: {
    name: 'ElCol',
    template: '<div><slot /></div>'
  },
  ElSelect: {
    name: 'ElSelect',
    template: '<select><slot /></select>'
  },
  ElOption: {
    name: 'ElOption',
    template: '<option><slot /></option>'
  },
  ElDatePicker: {
    name: 'ElDatePicker',
    template: '<input type="date" />'
  },
  ElTimePicker: {
    name: 'ElTimePicker',
    template: '<input type="time" />'
  },
  ElSwitch: {
    name: 'ElSwitch',
    template: '<input type="checkbox" />'
  },
  ElRadioGroup: {
    name: 'ElRadioGroup',
    template: '<div><slot /></div>'
  },
  ElRadio: {
    name: 'ElRadio',
    template: '<input type="radio" /><slot />'
  },
  ElCheckboxGroup: {
    name: 'ElCheckboxGroup',
    template: '<div><slot /></div>'
  },
  ElCheckbox: {
    name: 'ElCheckbox',
    template: '<input type="checkbox" /><slot />'
  },
  ElCascader: {
    name: 'ElCascader',
    template: '<input />'
  },
  ElTreeSelect: {
    name: 'ElTreeSelect',
    template: '<select />'
  },
  ElUpload: {
    name: 'ElUpload',
    template: '<div><slot /></div>'
  },
  ElSlider: {
    name: 'ElSlider',
    template: '<input type="range" />'
  },
  ElRate: {
    name: 'ElRate',
    template: '<div />'
  },
  ElColorPicker: {
    name: 'ElColorPicker',
    template: '<input type="color" />'
  },
  ElTransfer: {
    name: 'ElTransfer',
    template: '<div />'
  },
  ElInputNumber: {
    name: 'ElInputNumber',
    template: '<input type="number" />'
  }
}))

describe('Form', () => {
  const basicConfig: FormConfig = {
    model: {
      name: '',
      email: '',
      age: 0
    },
    items: [
      {
        prop: 'name',
        label: '姓名',
        type: 'input',
        required: true,
        placeholder: '请输入姓名'
      },
      {
        prop: 'email',
        label: '邮箱',
        type: 'input',
        placeholder: '请输入邮箱'
      },
      {
        prop: 'age',
        label: '年龄',
        type: 'number'
      }
    ]
  }

  it('renders correctly with basic config', () => {
    const wrapper = mount(Form, {
      props: {
        config: basicConfig
      },
      global: {
        components: {
          ElForm,
          ElFormItem,
          ElInput,
          ElButton
        }
      }
    })

    expect(wrapper.find('.iip-form').exists()).toBe(true)
    expect(wrapper.findAll('.el-form-item')).toHaveLength(3)
  })

  it('handles form submission', async () => {
    const wrapper = mount(Form, {
      props: {
        config: {
          ...basicConfig,
          actions: {
            show: true,
            showSubmit: true,
            showReset: false
          }
        }
      },
      global: {
        components: {
          ElForm,
          ElFormItem,
          ElInput,
          ElButton
        }
      }
    })

    // 模拟表单验证通过
    const formRef = {
      validate: vi.fn().mockResolvedValue(true)
    }
    wrapper.vm.$refs.formRef = formRef

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('submit')).toBeTruthy()
  })

  it('handles form reset', async () => {
    const wrapper = mount(Form, {
      props: {
        config: {
          ...basicConfig,
          actions: {
            show: true,
            showSubmit: false,
            showReset: true
          }
        }
      },
      global: {
        components: {
          ElForm,
          ElFormItem,
          ElInput,
          ElButton
        }
      }
    })

    const formRef = {
      resetFields: vi.fn()
    }
    wrapper.vm.$refs.formRef = formRef

    await wrapper.find('button').trigger('click')

    expect(formRef.resetFields).toHaveBeenCalled()
    expect(wrapper.emitted('reset')).toBeTruthy()
  })

  it('renders select with options', () => {
    const selectConfig: FormConfig = {
      model: { status: '' },
      items: [
        {
          prop: 'status',
          label: '状态',
          type: 'select',
          options: [
            { label: '启用', value: 'active' },
            { label: '禁用', value: 'inactive' }
          ]
        }
      ]
    }

    const wrapper = mount(Form, {
      props: {
        config: selectConfig
      },
      global: {
        components: {
          ElForm,
          ElFormItem,
          ElInput,
          ElButton
        }
      }
    })

    expect(wrapper.find('select').exists()).toBe(true)
  })

  it('handles conditional visibility', async () => {
    const conditionalConfig: FormConfig = {
      model: { type: '', name: '' },
      items: [
        {
          prop: 'type',
          label: '类型',
          type: 'select',
          options: [
            { label: '个人', value: 'personal' },
            { label: '企业', value: 'company' }
          ]
        },
        {
          prop: 'name',
          label: '姓名',
          type: 'input',
          show: formData => formData.type === 'personal'
        }
      ]
    }

    const wrapper = mount(Form, {
      props: {
        config: conditionalConfig
      },
      global: {
        components: {
          ElForm,
          ElFormItem,
          ElInput,
          ElButton
        }
      }
    })

    // 初始状态，name 字段不显示
    expect(wrapper.findAll('.el-form-item')).toHaveLength(1)

    // 修改 type 值
    await wrapper.setProps({
      config: {
        ...conditionalConfig,
        model: { type: 'personal', name: '' }
      }
    })

    // name 字段应该显示
    expect(wrapper.findAll('.el-form-item')).toHaveLength(2)
  })

  it('supports inline layout', () => {
    const inlineConfig: FormConfig = {
      ...basicConfig,
      layout: 'inline'
    }

    const wrapper = mount(Form, {
      props: {
        config: inlineConfig
      },
      global: {
        components: {
          ElForm,
          ElFormItem,
          ElInput,
          ElButton
        }
      }
    })

    expect(wrapper.find('.iip-form--inline').exists()).toBe(true)
  })

  it('exposes form methods', () => {
    const wrapper = mount(Form, {
      props: {
        config: basicConfig
      },
      global: {
        components: {
          ElForm,
          ElFormItem,
          ElInput,
          ElButton
        }
      }
    })

    const instance = wrapper.vm as any

    expect(typeof instance.validate).toBe('function')
    expect(typeof instance.validateField).toBe('function')
    expect(typeof instance.resetFields).toBe('function')
    expect(typeof instance.clearValidate).toBe('function')
    expect(typeof instance.getFormData).toBe('function')
    expect(typeof instance.setFormData).toBe('function')
    expect(typeof instance.getFormRef).toBe('function')
  })
})
