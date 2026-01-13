#!/usr/bin/env node
/**
 * Git Tag 生成脚本
 * 功能：
 * 1. 更新 package.json 版本号
 * 2. 提交 git 记录
 * 3. 创建 git tag
 * 注意：不会推送到远程仓库
 */

import { readFileSync, writeFileSync } from 'fs'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 获取项目根目录
const rootDir = join(__dirname, '..')
const packageJsonPath = join(rootDir, 'package.json')

interface PackageJson {
  version: string
  [key: string]: any
}

/**
 * 读取 package.json
 */
function readPackageJson(): PackageJson {
  const content = readFileSync(packageJsonPath, 'utf-8')
  return JSON.parse(content)
}

/**
 * 写入 package.json
 */
function writePackageJson(pkg: PackageJson): void {
  const content = JSON.stringify(pkg, null, 2) + '\n'
  writeFileSync(packageJsonPath, content, 'utf-8')
}

/**
 * 验证版本号格式 (semver)
 */
function isValidVersion(version: string): boolean {
  const semverRegex = /^\d+\.\d+\.\d+(-[\w.]+)?$/
  return semverRegex.test(version)
}

/**
 * 递增版本号
 */
function incrementVersion(version: string, type: 'patch' | 'minor' | 'major' = 'patch'): string {
  const parts = version.split('.')
  const major = parseInt(parts[0], 10)
  const minor = parseInt(parts[1], 10)
  const patch = parseInt(parts[2].split('-')[0], 10)

  switch (type) {
    case 'major':
      return `${major + 1}.0.0`
    case 'minor':
      return `${major}.${minor + 1}.0`
    case 'patch':
    default:
      return `${major}.${minor}.${patch + 1}`
  }
}

/**
 * 执行 git 命令
 */
function execGitCommand(command: string, options: { cwd?: string } = {}): string {
  try {
    return execSync(command, {
      cwd: options.cwd || rootDir,
      encoding: 'utf-8',
      stdio: 'pipe'
    }).trim()
  } catch (error: any) {
    throw new Error(`Git 命令执行失败: ${command}\n错误信息: ${error.message}`)
  }
}

/**
 * 检查 git 工作区是否干净
 */
function checkGitStatus(): void {
  const status = execGitCommand('git status --porcelain')
  if (status) {
    console.warn('⚠️  警告: 工作区有未提交的更改:')
    console.warn(status)
    console.warn('')
  }
}

/**
 * 检查 tag 是否已存在
 */
function checkTagExists(tag: string): boolean {
  try {
    execGitCommand(`git rev-parse -q --verify "refs/tags/${tag}"`)
    return true
  } catch {
    return false
  }
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log('🚀 开始生成 Git Tag...\n')

    // 读取当前版本
    const pkg = readPackageJson()
    const currentVersion = pkg.version
    console.log(`📦 当前版本: ${currentVersion}`)

    // 检查 git 状态
    checkGitStatus()

    // 获取新版本号
    const args = process.argv.slice(2)
    let newVersion: string

    if (args.length > 0) {
      // 从命令行参数获取版本号
      newVersion = args[0]
      if (!isValidVersion(newVersion)) {
        throw new Error(`无效的版本号格式: ${newVersion}\n版本号格式应为: x.y.z (例如: 1.2.17)`)
      }
    } else {
      // 自动递增 patch 版本
      newVersion = incrementVersion(currentVersion, 'patch')
      console.log(`📈 自动递增版本: ${currentVersion} -> ${newVersion}`)
    }

    // 检查版本是否相同
    if (newVersion === currentVersion) {
      throw new Error(`新版本号 ${newVersion} 与当前版本相同`)
    }

    // 检查 tag 是否已存在
    const tagName = `v${newVersion}`
    if (checkTagExists(tagName)) {
      throw new Error(`Tag ${tagName} 已存在`)
    }

    console.log(`\n📝 更新版本号: ${currentVersion} -> ${newVersion}`)

    // 更新 package.json
    pkg.version = newVersion
    writePackageJson(pkg)
    console.log('✅ package.json 已更新')

    // 提交更改
    console.log('\n📤 提交 Git 更改...')
    execGitCommand('git add package.json')
    const commitMessage = `chore: bump version to ${newVersion}`
    execGitCommand(`git commit -m "${commitMessage}"`)
    console.log(`✅ 已提交: ${commitMessage}`)

    // 创建 tag
    console.log(`\n🏷️  创建 Git Tag: ${tagName}`)
    const tagMessage = `Release version ${newVersion}`
    execGitCommand(`git tag -a ${tagName} -m "${tagMessage}"`)
    console.log(`✅ Tag 已创建: ${tagName}`)

    console.log('\n✨ 完成！')
    console.log(`\n📋 摘要:`)
    console.log(`   版本: ${currentVersion} -> ${newVersion}`)
    console.log(`   Tag: ${tagName}`)
    console.log(`   提交: ${commitMessage}`)
    console.log(`\n💡 提示: 使用以下命令推送到远程仓库:`)
    console.log(`   git push origin master`)
    console.log(`   git push origin ${tagName}`)
    console.log(`   或: git push origin master --tags`)
  } catch (error: any) {
    console.error('\n❌ 错误:', error.message)
    process.exit(1)
  }
}

// 运行主函数
main()
