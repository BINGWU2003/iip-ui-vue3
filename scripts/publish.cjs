#!/usr/bin/env node

const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

// 包发布顺序（按依赖关系）
const packages = [
  'utils', // 基础工具包，其他包依赖它
  'theme', // 主题包
  'components' // 组件包，依赖前两个
]

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function execCommand(command, cwd = process.cwd()) {
  try {
    log(`执行命令: ${command}`, 'cyan')
    const result = execSync(command, {
      cwd,
      stdio: 'inherit',
      encoding: 'utf8'
    })
    return result
  } catch (error) {
    log(`命令执行失败: ${command}`, 'red')
    log(`错误信息: ${error.message}`, 'red')
    process.exit(1)
  }
}

function checkNpmLogin() {
  try {
    execSync('npm whoami', { stdio: 'pipe' })
    log('✅ npm 已登录', 'green')
  } catch (error) {
    log('❌ 请先登录 npm: npm login', 'red')
    process.exit(1)
  }
}

function checkPackageExists(packageName) {
  try {
    execSync(`npm view ${packageName}`, { stdio: 'pipe' })
    return true
  } catch (error) {
    return false
  }
}

function publishPackage(packageName) {
  const packagePath = path.join(__dirname, '..', 'packages', packageName)
  const packageJsonPath = path.join(packagePath, 'package.json')

  if (!fs.existsSync(packageJsonPath)) {
    log(`❌ 包不存在: ${packageName}`, 'red')
    return false
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  const fullPackageName = packageJson.name
  const version = packageJson.version

  log(`\n📦 准备发布: ${fullPackageName}@${version}`, 'bright')

  // 检查包是否已存在
  if (checkPackageExists(fullPackageName)) {
    log(`⚠️  包 ${fullPackageName} 已存在，检查版本...`, 'yellow')
    try {
      const existingVersion = execSync(`npm view ${fullPackageName} version`, {
        stdio: 'pipe',
        encoding: 'utf8'
      }).trim()

      if (existingVersion === version) {
        log(`❌ 版本 ${version} 已存在，请更新版本号`, 'red')
        return false
      } else {
        log(`✅ 新版本 ${version}，可以发布`, 'green')
      }
    } catch (error) {
      log(`⚠️  无法获取现有版本信息`, 'yellow')
    }
  }

  // 检查 dist 目录是否存在
  const distPath = path.join(packagePath, 'dist')
  if (!fs.existsSync(distPath)) {
    log(`❌ dist 目录不存在，请先构建: ${packageName}`, 'red')
    return false
  }

  // 发布包
  try {
    execCommand('npm publish --access public', packagePath)
    log(`✅ ${fullPackageName}@${version} 发布成功!`, 'green')
    return true
  } catch (error) {
    log(`❌ ${fullPackageName} 发布失败`, 'red')
    return false
  }
}

function main() {
  log('🚀 开始批量发布 IIP UI Vue3 包...', 'bright')

  // 检查 npm 登录状态
  checkNpmLogin()

  // 确保所有包都已构建
  log('\n🔨 构建所有包...', 'bright')
  execCommand('pnpm build:all')

  // 跳过测试（避免 watch 模式卡住）
  log('\n🧪 跳过测试步骤...', 'yellow')

  // 按顺序发布包
  log('\n📦 开始发布包...', 'bright')
  let successCount = 0

  for (const packageName of packages) {
    if (publishPackage(packageName)) {
      successCount++
    } else {
      log(`❌ 停止发布，${packageName} 包发布失败`, 'red')
      process.exit(1)
    }
  }

  // 发布完成
  log(`\n🎉 发布完成! 成功发布 ${successCount}/${packages.length} 个包`, 'green')
  log('\n📋 发布的包:', 'bright')
  packages.forEach(pkg => {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', 'packages', pkg, 'package.json'), 'utf8')
    )
    log(`  • ${packageJson.name}@${packageJson.version}`, 'cyan')
  })

  log('\n🔗 验证安装:', 'bright')
  log('  npm install @iip-ui/components @iip-ui/theme', 'cyan')

  log('\n📚 下一步:', 'bright')
  log('  1. 在 GitHub 创建 release 标签', 'yellow')
  log('  2. 更新文档站点', 'yellow')
  log('  3. 通知团队新版本发布', 'yellow')
}

if (require.main === module) {
  main()
}

module.exports = { publishPackage, checkNpmLogin }
