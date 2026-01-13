import { defineConfig } from 'vitepress'
import { genComponentsSidebar, getComponentsDir } from './utils/genComponentsSidebar'
import { fileURLToPath, URL } from 'node:url'

// 自动生成组件文档侧边栏
const componentsDir = getComponentsDir()

const componentItems = genComponentsSidebar(componentsDir)

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
      { text: '组件', link: '/components/pagination-select' },
      { text: '工具函数', link: '/utils/utils' },
      { text: '主题', link: '/theme/theme' },
      { text: '更新日志', link: '/guide/changelog' },
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
            { text: '快速开始', link: '/guide/quickstart' }
          ]
        },
        {
          text: '其他',
          items: [{ text: '更新日志', link: '/guide/changelog' }]
        }
      ],
      '/components/': [
        {
          text: '数据录入',
          items: componentItems
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
    resolve: {
      alias: {
        '@bingwu/iip-ui-components': fileURLToPath(
          new URL('../../../packages/components/src/index.ts', import.meta.url)
        )
      }
    },
    ssr: {
      noExternal: ['element-plus', '@bingwu/iip-ui-components']
    },
    server: {
      port: 3001,
      host: '0.0.0.0'
    }
  }
})
