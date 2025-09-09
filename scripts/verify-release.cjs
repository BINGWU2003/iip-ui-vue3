#!/usr/bin/env node

/**
 * 发布验证脚本
 * 用于验证包是否成功发布到 npm
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

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
  try {
    return execSync(command, {
      encoding: 'utf8',
      stdio: 'pipe',
      ...options
    }).trim()
  } catch (error) {
    return null
  }
}

// 包配置
const packages = [
  {
    name: '@bingwu/iip-ui-components',
    path: 'packages/components'
  },
  {
    name: '@bingwu/iip-ui-utils',
    path: 'packages/utils'
  },
  {
    name: '@bingwu/iip-ui-theme',
    path: 'packages/theme'
  }
]

async function getPackageVersion(packagePath) {
  try {
    const packageJsonPath = path.join(process.cwd(), packagePath, 'package.json')
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
    return packageJson.version
  } catch (error) {
    return null
  }
}

async function checkNpmPackage(packageName, version) {
  log(`检查 ${packageName}@${version}...`, 'blue')

  // 检查包是否存在
  const npmVersion = exec(`npm view ${packageName}@${version} version`)
  if (!npmVersion) {
    log(`❌ ${packageName}@${version} 在 npm 上不存在`, 'red')
    return false
  }

  if (npmVersion !== version) {
    log(`❌ 版本不匹配: 期望 ${version}, 实际 ${npmVersion}`, 'red')
    return false
  }

  // 检查包信息
  const packageInfo = exec(`npm view ${packageName}@${version} --json`)
  if (packageInfo) {
    const info = JSON.parse(packageInfo)
    log(`✅ ${packageName}@${version} 发布成功`, 'green')
    log(`   - 发布时间: ${info.time[version]}`, 'cyan')
    log(`   - 文件数量: ${info.dist.fileCount}`, 'cyan')
    log(`   - 包大小: ${(info.dist.unpackedSize / 1024).toFixed(2)} KB`, 'cyan')
    return true
  }

  return false
}

async function testInstallation(packageName, version) {
  log(`测试安装 ${packageName}@${version}...`, 'blue')

  const testDir = path.join(process.cwd(), 'temp-test-install')

  try {
    // 创建临时目录
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true })
    }
    fs.mkdirSync(testDir)

    // 初始化项目
    execSync('npm init -y', { cwd: testDir, stdio: 'pipe' })

    // 安装包
    execSync(`npm install ${packageName}@${version}`, {
      cwd: testDir,
      stdio: 'pipe'
    })

    // 检查安装结果
    const nodeModulesPath = path.join(
      testDir,
      'node_modules',
      packageName.replace('@bingwu/', '@bingwu/')
    )
    if (fs.existsSync(nodeModulesPath)) {
      log(`✅ ${packageName}@${version} 安装成功`, 'green')

      // 检查主要文件
      const packageJsonPath = path.join(nodeModulesPath, 'package.json')
      if (fs.existsSync(packageJsonPath)) {
        const installedPackage = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
        log(`   - 安装版本: ${installedPackage.version}`, 'cyan')
      }

      return true
    } else {
      log(`❌ ${packageName}@${version} 安装失败`, 'red')
      return false
    }
  } catch (error) {
    log(`❌ 安装测试失败: ${error.message}`, 'red')
    return false
  } finally {
    // 清理临时目录
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true })
    }
  }
}

async function checkDependencies() {
  log('检查包依赖关系...', 'blue')

  const componentsVersion = await getPackageVersion('packages/components')
  const utilsVersion = await getPackageVersion('packages/utils')
  const themeVersion = await getPackageVersion('packages/theme')

  // 检查 components 包的依赖
  const componentsPackageJson = JSON.parse(
    fs.readFileSync('packages/components/package.json', 'utf8')
  )

  const utilsDep = componentsPackageJson.dependencies['@bingwu/iip-ui-utils']
  if (utilsDep && !utilsDep.includes(utilsVersion)) {
    log(`⚠️  components 包的 utils 依赖版本可能不匹配`, 'yellow')
    log(`   - 期望: ^${utilsVersion}`, 'cyan')
    log(`   - 实际: ${utilsDep}`, 'cyan')
  } else {
    log(`✅ 依赖关系正确`, 'green')
  }
}

async function generateReport(results) {
  log('\n📊 发布验证报告', 'magenta')
  log('='.repeat(50), 'magenta')

  let allSuccess = true

  for (const result of results) {
    const status = result.success ? '✅' : '❌'
    const color = result.success ? 'green' : 'red'
    log(`${status} ${result.package}@${result.version}`, color)

    if (!result.success) {
      allSuccess = false
    }
  }

  log('='.repeat(50), 'magenta')

  if (allSuccess) {
    log('🎉 所有包发布验证通过！', 'green')
    log('\n📝 后续步骤:', 'blue')
    log('1. 更新 GitHub Release 说明', 'cyan')
    log('2. 通知团队成员新版本发布', 'cyan')
    log('3. 更新文档站点', 'cyan')
    log('4. 监控用户反馈', 'cyan')
  } else {
    log('❌ 部分包发布验证失败，请检查并重新发布', 'red')
  }

  return allSuccess
}

async function main() {
  log('🔍 开始发布验证...', 'magenta')
  log('='.repeat(50), 'magenta')

  const results = []

  try {
    // 检查依赖关系
    await checkDependencies()
    log('')

    // 验证每个包
    for (const pkg of packages) {
      const version = await getPackageVersion(pkg.path)
      if (!version) {
        log(`❌ 无法获取 ${pkg.name} 的版本信息`, 'red')
        results.push({
          package: pkg.name,
          version: 'unknown',
          success: false
        })
        continue
      }

      // 检查 npm 包
      const npmCheck = await checkNpmPackage(pkg.name, version)

      // 测试安装
      const installCheck = await testInstallation(pkg.name, version)

      results.push({
        package: pkg.name,
        version: version,
        success: npmCheck && installCheck
      })

      log('')
    }

    // 生成报告
    const allSuccess = await generateReport(results)

    process.exit(allSuccess ? 0 : 1)
  } catch (error) {
    log('❌ 验证过程中出现错误:', 'red')
    console.error(error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}
