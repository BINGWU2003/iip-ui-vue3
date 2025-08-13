#!/bin/bash

# 快速发布脚本
# 用法: ./scripts/quick-release.sh [patch|minor|major]

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 日志函数
log() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# 检查参数
VERSION_TYPE=${1:-""}
if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major)$ ]]; then
    echo "用法: $0 [patch|minor|major]"
    echo ""
    echo "版本类型说明:"
    echo "  patch  - 补丁版本 (1.0.0 -> 1.0.1) - bug 修复"
    echo "  minor  - 次版本 (1.0.0 -> 1.1.0) - 新功能"
    echo "  major  - 主版本 (1.0.0 -> 2.0.0) - 破坏性变更"
    exit 1
fi

echo -e "${PURPLE}🚀 开始快速发布流程...${NC}"
echo "版本类型: $VERSION_TYPE"
echo "=================================================="

# 1. 检查工作目录
log "检查工作目录状态..."
if [[ -n $(git status --porcelain) ]]; then
    error "工作目录不干净，请先提交或暂存更改"
fi
success "工作目录干净"

# 2. 检查当前分支
log "检查当前分支..."
CURRENT_BRANCH=$(git branch --show-current)
if [[ "$CURRENT_BRANCH" != "main" ]]; then
    warning "当前不在 main 分支 (当前: $CURRENT_BRANCH)"
    read -p "是否继续？(y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        error "已取消发布"
    fi
fi

# 3. 拉取最新代码
log "拉取最新代码..."
git pull origin main
success "代码已更新"

# 4. 安装依赖
log "安装依赖..."
pnpm install
success "依赖安装完成"

# 5. 运行测试
log "运行测试..."
if ! pnpm test:all; then
    error "测试失败，请修复后重试"
fi
success "测试通过"

# 6. 构建项目
log "构建项目..."
if ! pnpm build:all; then
    error "构建失败，请检查错误"
fi
success "构建完成"

# 7. 更新版本号
log "更新版本号..."
OLD_VERSION=$(node -p "require('./package.json').version")
npm version $VERSION_TYPE --no-git-tag-version

# 同步更新子包版本
NEW_VERSION=$(node -p "require('./package.json').version")

# 更新 components 包版本
cd packages/components
npm version $NEW_VERSION --no-git-tag-version
cd ../..

success "版本已从 v$OLD_VERSION 更新到 v$NEW_VERSION"

# 8. 提交更改
log "提交更改..."
git add .
git commit -m "chore: release v$NEW_VERSION"
git tag "v$NEW_VERSION"
success "更改已提交并创建标签"

# 9. 推送到远程
log "推送到远程..."
git push origin main --tags
success "已推送到远程"

# 10. 发布到 npm
log "发布到 npm..."

# 检查 npm 登录状态
if ! npm whoami > /dev/null 2>&1; then
    error "未登录 npm，请先运行 npm login"
fi

NPM_USER=$(npm whoami)
log "当前 npm 用户: $NPM_USER"

# 发布包
if ! pnpm -r publish; then
    error "发布失败"
fi
success "发布完成"

# 11. 验证发布
log "验证发布结果..."
sleep 5  # 等待 npm 同步

PACKAGES=("@bingwu/iip-ui-components" "@bingwu/iip-ui-utils" "@bingwu/iip-ui-theme")

for pkg in "${PACKAGES[@]}"; do
    if npm view "$pkg@$NEW_VERSION" version > /dev/null 2>&1; then
        success "$pkg@$NEW_VERSION 发布成功"
    else
        warning "$pkg@$NEW_VERSION 可能还在同步中"
    fi
done

echo "=================================================="
echo -e "${GREEN}🎉 发布完成！${NC}"
echo -e "版本: ${CYAN}v$NEW_VERSION${NC}"
echo -e "标签: ${CYAN}v$NEW_VERSION${NC}"
echo ""
echo "📦 已发布的包:"
for pkg in "${PACKAGES[@]}"; do
    echo "  - $pkg@$NEW_VERSION"
done
echo ""
echo "🔗 相关链接:"
echo "  - npm: https://www.npmjs.com/package/@bingwu/iip-ui-components"
echo "  - GitHub: https://github.com/BINGWU2003/iip-ui-vue3/releases/tag/v$NEW_VERSION"
echo ""
echo "📝 下一步:"
echo "  1. 更新 CHANGELOG.md (如果还没有)"
echo "  2. 发布 GitHub Release"
echo "  3. 通知团队成员"
echo "=================================================="
