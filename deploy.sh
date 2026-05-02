#!/bin/bash
#============================================================
# 个人网站一键部署脚本
# 用法: bash deploy.sh 用户名@服务器IP
# 示例: bash deploy.sh root@123.45.67.89
#============================================================

set -e

# ========== 配置 ==========
REMOTE=$1
REMOTE_DIR="/var/www/my-website"
NGINX_CONF="/etc/nginx/conf.d/my-website.conf"

if [ -z "$REMOTE" ]; then
  echo "❌ 请提供服务器地址！"
  echo "用法: bash deploy.sh 用户名@服务器IP"
  echo "示例: bash deploy.sh root@123.45.67.89"
  exit 1
fi

echo ""
echo "🚀 开始部署个人网站..."
echo "   目标服务器: $REMOTE"
echo "   远程目录:   $REMOTE_DIR"
echo ""

# Step 1: 构建
echo "📦 [1/4] 构建生产版本..."
npm run build
echo "   ✅ 构建完成"

# Step 2: 服务器初始化（安装 Nginx、创建目录）
echo ""
echo "🔧 [2/4] 初始化服务器环境..."
ssh $REMOTE bash -s <<'INIT_EOF'
  # root 用户不需要 sudo；普通用户必须可用 sudo
  if [ "$(id -u)" -eq 0 ]; then
    SUDO=""
  elif command -v sudo &> /dev/null; then
    SUDO="sudo"
  else
    echo "❌ 当前用户非 root 且未安装 sudo，无法自动初始化服务器"
    exit 1
  fi

  # 检测包管理器并安装 Nginx
  if ! command -v nginx &> /dev/null; then
    echo "   安装 Nginx..."
    if command -v apt &> /dev/null; then
      $SUDO apt update -qq && $SUDO apt install -y -qq nginx
    elif command -v yum &> /dev/null; then
      $SUDO yum install -y -q epel-release && $SUDO yum install -y -q nginx
    elif command -v dnf &> /dev/null; then
      $SUDO dnf install -y -q nginx
    else
      echo "❌ 无法自动安装 Nginx，请手动安装后重试"
      exit 1
    fi
  fi
  echo "   ✅ Nginx 已就绪"

  # 创建网站目录
  $SUDO mkdir -p /var/www/my-website
  $SUDO chown -R $(whoami):$(whoami) /var/www/my-website
INIT_EOF
echo "   ✅ 服务器环境就绪"

# Step 3: 上传文件
echo ""
echo "📤 [3/4] 上传文件到服务器..."
scp -r dist/* $REMOTE:$REMOTE_DIR/
echo "   ✅ 文件上传完成"

# Step 4: 配置 Nginx
echo ""
echo "⚙️  [4/4] 配置 Nginx..."
ssh $REMOTE bash -s <<'NGINX_EOF'
  # root 用户不需要 sudo；普通用户必须可用 sudo
  if [ "$(id -u)" -eq 0 ]; then
    SUDO=""
  elif command -v sudo &> /dev/null; then
    SUDO="sudo"
  else
    echo "❌ 当前用户非 root 且未安装 sudo，无法配置 Nginx"
    exit 1
  fi

  # 写入 Nginx 配置
  $SUDO tee /etc/nginx/conf.d/my-website.conf > /dev/null <<'CONF'
server {
    listen 6666;
    server_name _;

    root /var/www/my-website;
    index index.html;

    # Vue Router - 所有路径回退到 index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源长期缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip 压缩
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1024;
}
CONF

  # 测试配置
  $SUDO nginx -t

  # 启动或重载 Nginx
  if $SUDO systemctl is-active --quiet nginx; then
    $SUDO nginx -s reload
  else
    $SUDO systemctl enable nginx
    $SUDO systemctl start nginx
  fi
NGINX_EOF

echo ""
echo "============================================"
echo "🎉 部署完成！"
echo ""
echo "   访问地址: http://$(echo $REMOTE | cut -d@ -f2):6666"
echo ""
echo "   后续更新只需再次运行:"
echo "   bash deploy.sh $REMOTE"
echo "============================================"
