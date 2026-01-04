import { genChangelog, getPackagesDir, getChangelogOutputPath } from './genChangelog'

/**
 * 构建 CHANGELOG
 * 在 VitePress 构建前运行此脚本来生成合并后的更新日志
 */
function buildChangelog() {
  try {
    const packagesDir = getPackagesDir()
    const outputPath = getChangelogOutputPath()

    genChangelog(packagesDir, outputPath)
  } catch (error) {
    console.error('❌ 生成 CHANGELOG 失败:', error)
    process.exit(1)
  }
}

buildChangelog()
