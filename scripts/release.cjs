#!/usr/bin/env node

/**
 * 自动化发布脚本
 * 用法: node scripts/release.js [patch|minor|major]
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const readline = require('readline')

// 颜色输出
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function exec(command, options = {}) {
  log(`执行: ${command}`, 'cyan')
  try {
    return execSync(command, {
      stdio: 'inherit',
      encoding: 'utf8',
      ...options
    })
  } catch (error) {
    log(`命令执行失败: ${command}`, 'red')
    process.exit(1)
  }
}

function question(prompt) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise(resolve => {
    rl.question(prompt, answer => {
      rl.close()
      resolve(answer)
    })
  })
}

async function checkWorkingDirectory() {
  log('🔍 检查工作目录状态...', 'blue')

  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' })
    if (status.trim()) {
      log('❌ 工作目录不干净，请先提交或暂存更改', 'red')
      log('未提交的文件:', 'yellow')
      console.log(status)
      process.exit(1)
    }
    log('✅ 工作目录干净', 'green')
  } catch (error) {
    log('❌ 无法检查 Git 状态', 'red')
    process.exit(1)
  }
}

async function runTests() {
  log('🧪 运行测试...', 'blue')
  exec('pnpm test:all')
  log('✅ 测试通过', 'green')
}

async function buildProject() {
  log('🔨 构建项目...', 'blue')
  exec('pnpm build:all')
  log('✅ 构建完成', 'green')
}

async function updateVersion(versionType) {
  log(`📦 更新版本 (${versionType})...`, 'blue')

  if (!['patch', 'minor', 'major'].includes(versionType)) {
    log('❌ 无效的版本类型，请使用 patch、minor 或 major', 'red')
    process.exit(1)
  }

  exec(`npm version ${versionType}`)

  // 获取新版本号
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  const newVersion = packageJson.version

  log(`✅ 版本已更新到 v${newVersion}`, 'green')
  return newVersion
}

async function updateChangelog(version) {
  log('📝 请手动更新 CHANGELOG.md...', 'yellow')

  const changelogPath = path.join(process.cwd(), 'CHANGELOG.md')
  if (fs.existsSync(changelogPath)) {
    log(`请编辑 ${changelogPath} 文件，添加 v${version} 的更新内容`, 'yellow')

    const shouldContinue = await question('是否已完成 CHANGELOG.md 更新？(y/N): ')
    if (shouldContinue.toLowerCase() !== 'y') {
      log('❌ 请先更新 CHANGELOG.md 后再继续', 'red')
      process.exit(1)
    }
  }
}

async function commitAndTag(version) {
  log('📤 提交更改并创建标签...', 'blue')

  exec('git add .')
  exec(`git commit -m "chore: release v${version}"`)
  exec(`git tag v${version}`)

  log('✅ 更改已提交并创建标签', 'green')
}

async function pushToRemote() {
  log('🚀 推送到远程仓库...', 'blue')
  exec('git push origin main --tags')
  log('✅ 已推送到远程仓库', 'green')
}

async function publishToNpm() {
  log('📦 发布到 npm...', 'blue')

  // 检查 npm 登录状态
  try {
    const whoami = execSync('npm whoami', { encoding: 'utf8' }).trim()
    log(`当前 npm 用户: ${whoami}`, 'cyan')
  } catch (error) {
    log('❌ 未登录 npm，请先运行 npm login', 'red')
    process.exit(1)
  }

  // 发布所有包
  exec('pnpm -r publish')
  log('✅ 发布完成', 'green')
}

async function verifyPublish(version) {
  log('🔍 验证发布结果...', 'blue')

  const packages = ['@bingwu/iip-ui-components', '@bingwu/iip-ui-utils', '@bingwu/iip-ui-theme']

  for (const pkg of packages) {
    try {
      const info = execSync(`npm view ${pkg}@${version} version`, {
        encoding: 'utf8',
        stdio: 'pipe'
      }).trim()

      if (info === version) {
        log(`✅ ${pkg}@${version} 发布成功`, 'green')
      } else {
        log(`❌ ${pkg}@${version} 发布失败`, 'red')
      }
    } catch (error) {
      log(`❌ 无法验证 ${pkg} 的发布状态`, 'red')
    }
  }
}

async function main() {
  const versionType = process.argv[2]

  log('🚀 开始发布流程...', 'magenta')
  log('='.repeat(50), 'magenta')

  try {
    // 1. 检查工作目录
    await checkWorkingDirectory()

    // 2. 确定版本类型
    let finalVersionType = versionType
    if (!finalVersionType) {
      finalVersionType = await question('请选择版本类型 (patch/minor/major): ')
    }

    // 3. 运行测试
    // await runTests()

    // 4. 构建项目
    await buildProject()

    // 5. 更新版本
    const newVersion = await updateVersion(finalVersionType)

    // 6. 更新 CHANGELOG
    await updateChangelog(newVersion)

    // 7. 提交并创建标签
    await commitAndTag(newVersion)

    // 8. 推送到远程
    await pushToRemote()

    // 9. 发布到 npm
    await publishToNpm()

    // 10. 验证发布
    await verifyPublish(newVersion)

    log('='.repeat(50), 'magenta')
    log(`🎉 发布完成！版本: v${newVersion}`, 'green')
    log('='.repeat(50), 'magenta')
  } catch (error) {
    log('❌ 发布过程中出现错误:', 'red')
    console.error(error)
    process.exit(1)
  }
}

// 处理未捕获的异常
process.on('uncaughtException', error => {
  log('❌ 未捕获的异常:', 'red')
  console.error(error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  log('❌ 未处理的 Promise 拒绝:', 'red')
  console.error('Promise:', promise, 'Reason:', reason)
  process.exit(1)
})

if (require.main === module) {
  main()
}
