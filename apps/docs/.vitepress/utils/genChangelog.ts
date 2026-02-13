import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

interface ChangelogEntry {
  version: string
  packageName: string
  changes: string[]
}

/**
 * 解析单个 CHANGELOG.md 文件
 * @param filePath CHANGELOG 文件路径
 * @returns 解析后的版本条目数组
 */
function parseChangelog(filePath: string): ChangelogEntry[] {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')

  // 提取包名（第一行）
  const packageName = lines[0].replace(/^#\s*/, '').trim()

  const entries: ChangelogEntry[] = []
  let currentVersion: string | null = null
  let currentChanges: string[] = []
  let inChangesSection = false

  for (let i = 1; i < lines.length; i++) {
    const originalLine = lines[i]
    const line = originalLine.trim()

    // 检测版本号行 (## 1.2.30)
    if (line.startsWith('## ')) {
      // 保存上一个版本
      if (currentVersion && currentChanges.length > 0) {
        entries.push({
          version: currentVersion,
          packageName,
          changes: [...currentChanges]
        })
      }

      // 开始新版本
      currentVersion = line.replace(/^##\s*/, '').trim()
      currentChanges = []
      inChangesSection = false
      continue
    }

    // 检测变更类型行 (### Patch Changes)
    if (line.startsWith('### ')) {
      inChangesSection = true
      continue
    }

    // 收集变更内容（以 - 开头的列表项）
    if (inChangesSection && line.startsWith('-')) {
      currentChanges.push(originalLine)
    } else if (inChangesSection && originalLine && !line.startsWith('#')) {
      // 处理多行变更内容（如依赖更新，缩进的行）
      if (currentChanges.length > 0) {
        // 如果行有缩进（以空格或制表符开头），保持原样追加
        if (originalLine.startsWith('  ') || originalLine.startsWith('\t')) {
          currentChanges[currentChanges.length - 1] += '\n' + originalLine
        } else if (line) {
          // 非空行但没有缩进，可能是续行，追加到上一行
          currentChanges[currentChanges.length - 1] += ' ' + line
        }
      }
    }
  }

  // 保存最后一个版本
  if (currentVersion && currentChanges.length > 0) {
    entries.push({
      version: currentVersion,
      packageName,
      changes: [...currentChanges]
    })
  }

  return entries
}

/**
 * 比较版本号大小
 * @param v1 版本号1
 * @param v2 版本号2
 * @returns 负数表示 v1 < v2，正数表示 v1 > v2，0 表示相等
 */
function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.').map(Number)
  const parts2 = v2.split('.').map(Number)

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0
    const part2 = parts2[i] || 0

    if (part1 < part2) return 1 // 降序排列，所以返回 1
    if (part1 > part2) return -1
  }

  return 0
}

/**
 * 生成合并后的 CHANGELOG 内容
 * @param changelogDir packages 目录路径
 * @param outputPath 输出文件路径
 */
export function genChangelog(changelogDir: string, outputPath: string): void {
  const packages = ['components', 'utils', 'uniapp-utils', 'theme']
  const packageEntriesMap = new Map<string, ChangelogEntry[]>()

  // 读取所有包的 CHANGELOG，按包分组
  for (const pkg of packages) {
    const changelogPath = path.join(changelogDir, pkg, 'CHANGELOG.md')
    if (fs.existsSync(changelogPath)) {
      const entries = parseChangelog(changelogPath)
      // 按版本号排序（从高到低）
      entries.sort((a, b) => compareVersions(a.version, b.version))
      packageEntriesMap.set(pkg, entries)
    }
  }

  // 生成 Markdown 内容
  let markdown = `# 更新日志

所有重要的项目变更都会记录在这个文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

`

  // 按包分组生成内容
  for (const pkg of packages) {
    const entries = packageEntriesMap.get(pkg)
    if (!entries || entries.length === 0) {
      continue
    }

    // 包名标题
    markdown += `## ${pkg}\n\n`

    // 生成每个版本的变更记录
    for (const entry of entries) {
      markdown += `### ${entry.version}\n\n`

      for (const change of entry.changes) {
        markdown += `${change}\n`
      }

      markdown += '\n'
    }
  }

  // 检查文件是否存在且内容相同
  if (fs.existsSync(outputPath)) {
    const existingContent = fs.readFileSync(outputPath, 'utf-8')
    if (existingContent === markdown) {
      console.log(`ℹ️  CHANGELOG 无变化，跳过生成: ${outputPath}`)
      return
    }
  }

  // 写入文件
  fs.writeFileSync(outputPath, markdown, 'utf-8')
  console.log(`✅ CHANGELOG 已生成: ${outputPath}`)
}

/**
 * 获取 packages 目录的绝对路径
 * @returns packages 目录路径
 */
export function getPackagesDir(): string {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  return path.resolve(__dirname, '../../../../packages')
}

/**
 * 获取输出文件路径
 * @returns changelog.md 文件路径
 */
export function getChangelogOutputPath(): string {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  return path.resolve(__dirname, '../../guide/changelog.md')
}
