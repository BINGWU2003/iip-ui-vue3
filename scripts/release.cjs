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

async function selectPackagesToUpdate() {
  log('📎 选择要更新的包:', 'blue')

  const packagesDir = path.join(process.cwd(), 'packages')
  const availablePackages = []

  // 获取所有可用的包
  const packageDirs = fs.readdirSync(packagesDir).filter(dir => {
    const packagePath = path.join(packagesDir, dir)
    const packageJsonPath = path.join(packagePath, 'package.json')

    if (!fs.statSync(packagePath).isDirectory() || !fs.existsSync(packageJsonPath)) {
      return false
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
    if (packageJson.private) {
      return false
    }

    availablePackages.push({
      name: packageJson.name,
      version: packageJson.version,
      path: dir,
      displayName: `${packageJson.name} (v${packageJson.version})`
    })

    return true
  })

  if (availablePackages.length === 0) {
    log('❌ 没有可用的包', 'red')
    process.exit(1)
  }

  // 显示可用的包
  log('\n可用的包:', 'cyan')
  availablePackages.forEach((pkg, index) => {
    log(`  ${index + 1}. ${pkg.displayName}`, 'white')
  })
  log(`  ${availablePackages.length + 1}. 全部包`, 'white')

  const choice = await question(
    `\n请选择要更新的包 (1-${availablePackages.length + 1}, 或用逗号分隔多个选择, 如 1,3): `
  )

  if (choice.trim() === `${availablePackages.length + 1}`) {
    log('✅ 已选择全部包', 'green')
    return availablePackages
  }

  const selectedIndices = choice.split(',').map(s => parseInt(s.trim()) - 1)
  const selectedPackages = []

  for (const index of selectedIndices) {
    if (index >= 0 && index < availablePackages.length) {
      selectedPackages.push(availablePackages[index])
    } else {
      log(`⚠️  无效的选择: ${index + 1}`, 'yellow')
    }
  }

  if (selectedPackages.length === 0) {
    log('❌ 没有选择任何包', 'red')
    process.exit(1)
  }

  log('\n✅ 已选择的包:', 'green')
  selectedPackages.forEach(pkg => {
    log(`  - ${pkg.displayName}`, 'cyan')
  })

  const confirm = await question('\n确认继续? (y/N): ')
  if (confirm.toLowerCase() !== 'y') {
    log('❌ 已取消', 'red')
    process.exit(1)
  }

  return selectedPackages
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

async function updateVersion(versionType, selectedPackages = null) {
  log(`📦 更新版本 (${versionType})...`, 'blue')

  if (!['patch', 'minor', 'major'].includes(versionType)) {
    log('❌ 无效的版本类型，请使用 patch、minor 或 major', 'red')
    process.exit(1)
  }

  let packagesToUpdate = []

  if (selectedPackages && selectedPackages.length > 0) {
    // 使用用户选择的包
    packagesToUpdate = selectedPackages
    log(`将更新 ${packagesToUpdate.length} 个选中的包`, 'cyan')
  } else {
    // 获取所有可用的包
    const packagesDir = path.join(process.cwd(), 'packages')
    const packageDirs = fs.readdirSync(packagesDir).filter(dir => {
      const packagePath = path.join(packagesDir, dir)
      const packageJsonPath = path.join(packagePath, 'package.json')

      if (!fs.statSync(packagePath).isDirectory() || !fs.existsSync(packageJsonPath)) {
        return false
      }

      // 排除 private 包和文档包
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
      if (packageJson.private) {
        log(`跳过私有或文档包: ${packageJson.name}`, 'yellow')
        return false
      }

      return true
    })

    if (packageDirs.length === 0) {
      log('❌ 没有找到需要发布的包', 'red')
      process.exit(1)
    }

    const packagesDir2 = path.join(process.cwd(), 'packages')
    for (const packageDir of packageDirs) {
      const packageJsonPath = path.join(packagesDir2, packageDir, 'package.json')
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
      packagesToUpdate.push({
        name: packageJson.name,
        version: packageJson.version,
        path: packageDir
      })
    }
  }

  let newVersion = ''
  const updatedPackages = []

  for (const pkg of packagesToUpdate) {
    const packagesDir = path.join(process.cwd(), 'packages')
    const packagePath = path.join(packagesDir, pkg.path)
    const packageJsonPath = path.join(packagePath, 'package.json')

    log(`更新包: ${pkg.path}`, 'cyan')

    // 手动更新版本号（避免 npm version 对 workspace 依赖的问题）
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
    const currentVersion = packageJson.version
    const packageVersion = updateVersionNumber(currentVersion, versionType)

    // 更新 package.json 中的版本号
    packageJson.version = packageVersion
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')

    updatedPackages.push({
      name: packageJson.name,
      version: packageVersion,
      path: pkg.path
    })

    // 使用第一个包的版本作为统一版本号
    if (!newVersion) {
      newVersion = packageVersion
    }

    log(`✅ ${packageJson.name} 版本已更新到 v${packageVersion}`, 'green')
  }

  // 回到根目录
  process.chdir(
    process
      .cwd()
      .replace(/packages\/[^/]+$/, '')
      .replace(/packages$/, '')
  )

  // 显示更新摘要
  log('\n📋 版本更新摘要:', 'blue')
  updatedPackages.forEach(pkg => {
    log(`  ${pkg.name}: v${pkg.version}`, 'cyan')
  })

  // 更新包之间的依赖关系
  await updatePackageDependencies(updatedPackages)

  // 更新主包（根目录）的版本号
  const mainPackageVersion = await updateMainPackageVersion()

  return mainPackageVersion
}

function updateVersionNumber(currentVersion, versionType) {
  const parts = currentVersion.split('.').map(Number)

  switch (versionType) {
    case 'patch':
      parts[2]++
      break
    case 'minor':
      parts[1]++
      parts[2] = 0
      break
    case 'major':
      parts[0]++
      parts[1] = 0
      parts[2] = 0
      break
    default:
      throw new Error(`无效的版本类型: ${versionType}`)
  }

  return parts.join('.')
}

async function updateMainPackageVersion() {
  log('📦 更新主包版本号...', 'blue')

  const mainPackageJsonPath = path.join(process.cwd(), 'package.json')
  const mainPackageJson = JSON.parse(fs.readFileSync(mainPackageJsonPath, 'utf8'))

  const currentVersion = mainPackageJson.version
  const newVersion = updateVersionNumber(currentVersion, 'patch')

  mainPackageJson.version = newVersion
  fs.writeFileSync(mainPackageJsonPath, JSON.stringify(mainPackageJson, null, 2) + '\n')

  log(`✅ 主包版本已更新: ${currentVersion} -> ${newVersion}`, 'green')
  return newVersion
}

async function updatePackageDependencies(updatedPackages) {
  log('🔗 更新包依赖关系...', 'blue')

  const packagesDir = path.join(process.cwd(), 'packages')
  const packageVersionMap = new Map()

  // 构建版本映射
  updatedPackages.forEach(pkg => {
    packageVersionMap.set(pkg.name, pkg.version)
  })

  // 更新所有包的依赖（包括 docs 包）
  const allPackageDirs = fs.readdirSync(packagesDir).filter(dir => {
    const packagePath = path.join(packagesDir, dir)
    return (
      fs.statSync(packagePath).isDirectory() &&
      fs.existsSync(path.join(packagePath, 'package.json'))
    )
  })

  for (const packageDir of allPackageDirs) {
    const packageJsonPath = path.join(packagesDir, packageDir, 'package.json')
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
    let hasUpdates = false

    // 更新 dependencies
    if (packageJson.dependencies) {
      for (const [depName, depVersion] of Object.entries(packageJson.dependencies)) {
        if (packageVersionMap.has(depName)) {
          const newVersion = packageVersionMap.get(depName)
          const newDepVersion = `^${newVersion}`
          if (depVersion !== newDepVersion) {
            packageJson.dependencies[depName] = newDepVersion
            hasUpdates = true
            log(`  更新 ${packageJson.name} 中的依赖: ${depName} -> ^${newVersion}`, 'cyan')
          }
        }
      }
    }

    // 更新 devDependencies
    if (packageJson.devDependencies) {
      for (const [depName, depVersion] of Object.entries(packageJson.devDependencies)) {
        if (packageVersionMap.has(depName)) {
          const newVersion = packageVersionMap.get(depName)
          const newDepVersion = `^${newVersion}`
          if (depVersion !== newDepVersion) {
            packageJson.devDependencies[depName] = newDepVersion
            hasUpdates = true
            log(`  更新 ${packageJson.name} 中的开发依赖: ${depName} -> ^${newVersion}`, 'cyan')
          }
        }
      }
    }

    // 如果有更新，写入文件
    if (hasUpdates) {
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')
      log(`✅ 已更新 ${packageJson.name} 的依赖关系`, 'green')
    }
  }

  log('✅ 包依赖关系更新完成', 'green')
}

async function getUpdatedPackagesInfo() {
  const packagesDir = path.join(process.cwd(), 'packages')
  const packageDirs = fs.readdirSync(packagesDir).filter(dir => {
    const packagePath = path.join(packagesDir, dir)
    const packageJsonPath = path.join(packagePath, 'package.json')

    if (!fs.statSync(packagePath).isDirectory() || !fs.existsSync(packageJsonPath)) {
      return false
    }

    // 排除 private 包和文档包
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
    if (packageJson.private) {
      return false
    }

    return true
  })

  const packages = []
  for (const packageDir of packageDirs) {
    const packageJsonPath = path.join(packagesDir, packageDir, 'package.json')
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

    packages.push({
      name: packageJson.name,
      version: packageJson.version,
      path: packageDir
    })
  }

  return packages
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

async function commitAndTag(mainVersion, updatedPackages) {
  log('📤 提交更改并创建标签...', 'blue')

  exec('git add .')

  // 创建更详细的提交信息
  const packageList = updatedPackages.map(pkg => `${pkg.name}@${pkg.version}`).join(', ')

  // 使用临时文件来处理多行提交信息
  const commitMessageFile = path.join(process.cwd(), '.commit-message.tmp')
  const commitMessage = `chore: 发布 v${mainVersion}

更新的包:
${updatedPackages.map(pkg => `- ${pkg.name}: v${pkg.version}`).join('\n')}

包含: ${packageList}`

  fs.writeFileSync(commitMessageFile, commitMessage, 'utf8')

  try {
    exec(`git commit -F "${commitMessageFile}"`)
    exec(`git tag v${mainVersion}`)

    log('✅ 更改已提交并创建标签', 'green')
    log(`标签: v${mainVersion} (使用主包版本)`, 'cyan')
    log(`包含包: ${packageList}`, 'cyan')
  } finally {
    // 清理临时文件
    if (fs.existsSync(commitMessageFile)) {
      fs.unlinkSync(commitMessageFile)
    }
  }
}

async function pushToRemote() {
  log('🚀 推送到远程仓库...', 'blue')
  exec('git push origin master --tags')
  log('✅ 已推送到远程仓库', 'green')
}

async function publishToNpm(updatedPackages = null) {
  log('📦 发布到 npm...', 'blue')

  // 检查 npm 登录状态
  try {
    const whoami = execSync('npm whoami', { encoding: 'utf8' }).trim()
    log(`当前 npm 用户: ${whoami}`, 'cyan')
  } catch (error) {
    log('❌ 未登录 npm，请先运行 npm login', 'red')
    process.exit(1)
  }

  if (updatedPackages && updatedPackages.length > 0) {
    // 发布指定的包
    log(`发布 ${updatedPackages.length} 个选中的包...`, 'cyan')
    const packagesDir = path.join(process.cwd(), 'packages')

    for (const pkg of updatedPackages) {
      const packagePath = path.join(packagesDir, pkg.path)
      log(`发布 ${pkg.name}...`, 'cyan')

      process.chdir(packagePath)
      exec('npm publish')
      process.chdir(
        process
          .cwd()
          .replace(/packages\/[^/]+$/, '')
          .replace(/packages$/, '')
      )

      log(`✅ ${pkg.name} 发布完成`, 'green')
    }
  } else {
    // 发布所有包
    exec('pnpm -r publish')
  }

  log('✅ 发布完成', 'green')
}

async function verifyPublish(version, updatedPackages = null) {
  log('🔍 验证发布结果...', 'blue')

  let packagesToVerify = []

  if (updatedPackages && updatedPackages.length > 0) {
    // 验证指定的包
    packagesToVerify = updatedPackages
    log(`验证 ${packagesToVerify.length} 个已更新的包...`, 'cyan')
  } else {
    // 验证所有包
    const packagesDir = path.join(process.cwd(), 'packages')
    const packageDirs = fs.readdirSync(packagesDir).filter(dir => {
      const packagePath = path.join(packagesDir, dir)
      const packageJsonPath = path.join(packagePath, 'package.json')

      if (!fs.statSync(packagePath).isDirectory() || !fs.existsSync(packageJsonPath)) {
        return false
      }

      // 排除 private 包和文档包
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
      if (packageJson.private) {
        return false
      }

      return true
    })

    for (const packageDir of packageDirs) {
      const packageJsonPath = path.join(packagesDir, packageDir, 'package.json')
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
      packagesToVerify.push({
        name: packageJson.name,
        version: packageJson.version,
        path: packageDir
      })
    }
  }

  const publishedPackages = []

  for (const pkg of packagesToVerify) {
    const packageName = pkg.name
    const packageVersion = pkg.version

    try {
      const info = execSync(`npm view ${packageName}@${packageVersion} version`, {
        encoding: 'utf8',
        stdio: 'pipe'
      }).trim()

      if (info === packageVersion) {
        log(`✅ ${packageName}@${packageVersion} 发布成功`, 'green')
        publishedPackages.push({ name: packageName, version: packageVersion, status: 'success' })
      } else {
        log(`❌ ${packageName}@${packageVersion} 发布失败`, 'red')
        publishedPackages.push({ name: packageName, version: packageVersion, status: 'failed' })
      }
    } catch (error) {
      log(`❌ 无法验证 ${packageName} 的发布状态`, 'red')
      publishedPackages.push({ name: packageName, version: packageVersion, status: 'error' })
    }
  }

  // 显示验证摘要
  log('\n📋 发布验证摘要:', 'blue')
  publishedPackages.forEach(pkg => {
    const statusIcon = pkg.status === 'success' ? '✅' : '❌'
    log(
      `  ${statusIcon} ${pkg.name}@${pkg.version} - ${pkg.status}`,
      pkg.status === 'success' ? 'green' : 'red'
    )
  })

  return publishedPackages
}

async function main() {
  const versionType = process.argv[2]

  log('🚀 开始发布流程...', 'magenta')
  log('='.repeat(50), 'magenta')

  try {
    // 1. 检查工作目录
    await checkWorkingDirectory()

    // 2. 选择要更新的包
    const selectedPackages = await selectPackagesToUpdate()

    // 3. 确定版本类型
    let finalVersionType = versionType
    if (!finalVersionType) {
      finalVersionType = await question('请选择版本类型 (patch/minor/major): ')
    }

    // 4. 运行测试
    // await runTests()
    log('\n🧪 跳过测试步骤...', 'yellow')
    // 5. 构建项目
    await buildProject()

    // 6. 更新版本
    const mainVersion = await updateVersion(finalVersionType, selectedPackages)

    // 6.1 重新构建项目（因为依赖关系可能已更新）
    log('🔄 重新构建项目（依赖更新后）...', 'blue')
    exec('pnpm build:all')
    log('✅ 重新构建完成', 'green')

    // 7. 更新 CHANGELOG
    await updateChangelog(mainVersion)

    // 8. 提交并创建标签
    // 获取更新的包信息（使用已选择的包）
    const updatedPackages = selectedPackages.map(pkg => ({
      name: pkg.name,
      version: pkg.version, // 这里会在 updateVersion 中被更新
      path: pkg.path
    }))

    // 重新获取更新后的版本信息
    const packagesDir = path.join(process.cwd(), 'packages')
    const finalUpdatedPackages = []
    for (const pkg of selectedPackages) {
      const packageJsonPath = path.join(packagesDir, pkg.path, 'package.json')
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
      finalUpdatedPackages.push({
        name: packageJson.name,
        version: packageJson.version,
        path: pkg.path
      })
    }

    await commitAndTag(mainVersion, finalUpdatedPackages)

    // 8. 推送到远程
    await pushToRemote()

    // 10. 发布到 npm
    await publishToNpm(finalUpdatedPackages)

    // 11. 验证发布
    const publishResults = await verifyPublish(mainVersion, finalUpdatedPackages)

    // 检查是否所有包都发布成功
    const failedPackages = publishResults.filter(pkg => pkg.status !== 'success')
    if (failedPackages.length > 0) {
      log(`\n⚠️  注意: ${failedPackages.length} 个包发布失败或验证失败`, 'yellow')
      failedPackages.forEach(pkg => {
        log(`  - ${pkg.name}@${pkg.version}`, 'yellow')
      })
    }

    log('='.repeat(50), 'magenta')
    log(`🎉 发布完成！主版本: v${mainVersion}`, 'green')
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
