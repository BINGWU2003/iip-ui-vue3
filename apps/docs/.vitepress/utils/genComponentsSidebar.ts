import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

interface SidebarItem {
  text: string
  link: string
}

/**
 * 自动生成组件文档侧边栏配置
 * @param componentsDir 组件文档目录路径
 * @returns 侧边栏配置数组
 */
export function genComponentsSidebar(componentsDir: string): SidebarItem[] {
  const items: SidebarItem[] = []

  // 读取目录下的所有文件
  const files = fs.readdirSync(componentsDir)

  // 过滤出 .md 文件并排序
  const mdFiles = files.filter(file => file.endsWith('.md')).sort()

  // 遍历每个 markdown 文件
  for (const file of mdFiles) {
    const filePath = path.join(componentsDir, file)
    const fileName = file.replace('.md', '')

    // 读取文件第一行获取标题
    const content = fs.readFileSync(filePath, 'utf-8')
    const firstLine = content.split('\n')[0]

    // 提取标题（去掉 # 号）
    let text = fileName
    if (firstLine && firstLine.startsWith('#')) {
      text = firstLine.replace(/^#+\s*/, '').trim()
    }

    items.push({
      text,
      link: `/components/${fileName}`
    })
  }

  return items
}

/**
 * 获取组件文档目录的绝对路径
 * @returns 组件文档目录路径
 */
export function getComponentsDir(): string {
  // 获取当前文件的目录
  const __dirname = path.dirname(fileURLToPath(import.meta.url))

  // 返回 components 目录的路径
  return path.resolve(__dirname, '../../components')
}
