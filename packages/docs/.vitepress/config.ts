import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'IIP UI Vue3',
  description: '基于 vxe-table、Element Plus、Vue 3 和 TypeScript 的企业级组件库',

  // 基础配置
  base: '/',
  lang: 'zh-CN',
  cleanUrls: true,

  // 主题配置
  themeConfig: {
    // 导航栏
    nav: [
      { text: '指南', link: '/guide/introduction' },
      { text: '组件', link: '/components/table' },
      { text: '更新日志', link: '/guide/changelog' },
      {
        text: 'v1.2.1',
        items: [
          { text: '更新日志', link: '/guide/changelog' },
          { text: '发布说明', link: '/guide/releases' }
        ]
      },
      {
        text: '相关链接',
        items: [
          { text: 'vxe-table', link: 'https://vxetable.cn/' },
          { text: 'Element Plus', link: 'https://element-plus.org/' },
          { text: 'Vue 3', link: 'https://vuejs.org/' },
          { text: 'TypeScript', link: 'https://www.typescriptlang.org/' }
        ]
      }
    ],

    // 侧边栏
    sidebar: {
      '/guide/': [
        {
          text: '开始',
          items: [
            { text: '介绍', link: '/guide/introduction' },
            { text: '快速开始', link: '/guide/quickstart' },
            { text: '安装指南', link: '/guide/installation' }
          ]
        },
        {
          text: '进阶',
          items: [
            { text: '主题定制', link: '/guide/theme' },
            { text: 'Eova 工具', link: '/guide/eova' }
          ]
        },
        {
          text: '其他',
          items: [{ text: '更新日志', link: '/guide/changelog' }]
        }
      ],
      '/components/': [
        {
          text: '数据展示',
          items: [{ text: 'Table 表格 🔥', link: '/components/table' }]
        },
        {
          text: '数据录入',
          items: [
            { text: 'Form 表单 🔥', link: '/components/form' },
            { text: 'Input 输入框', link: '/components/input' },
            { text: 'Select 选择器', link: '/components/select' },
            { text: 'DateRange 日期范围', link: '/components/date-range' }
          ]
        },
        {
          text: '主题组件',
          items: [
            { text: 'ThemeProvider 主题提供者', link: '/components/theme-provider' },
            { text: 'ThemeSwitcher 主题切换器', link: '/components/theme-switcher' }
          ]
        },
        {
          text: '工具组件',
          items: [{ text: 'Utils 工具函数', link: '/components/utils' }]
        }
      ]
    },

    // 社交链接
    socialLinks: [{ icon: 'github', link: 'https://github.com/BINGWU2003/iip-ui-vue3' }],

    // 页脚
    footer: {
      message: '基于 MIT 许可发布',
      copyright: 'Copyright © 2024 IIP UI Vue3 Team'
    },

    // 搜索
    search: {
      provider: 'local'
    },

    // 编辑链接
    editLink: {
      pattern: 'https://github.com/BINGWU2003/iip-ui-vue3/edit/main/packages/docs/:path',
      text: '在 GitHub 上编辑此页'
    },

    // 最后更新时间
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    }
  },

  // Markdown 配置
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    lineNumbers: true
  },

  // 构建配置
  vite: {
    // 可以在这里添加其他 Vite 配置
  }
})
