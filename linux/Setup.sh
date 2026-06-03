#!/bin/bash
set -euo pipefail
clear

package="./node_modules"
mode="--starting"

# Kiểm tra nếu đang chạy trên Termux
if [ -n "${TERMUX_VERSION:-}" ]; then
    echo "📱 Phát hiện Termux, chuẩn bị tối ưu..."
    echo "⚙️  Đang kiểm tra bộ nhớ..."
    
    # Set memory limit cho npm
    export NODE_OPTIONS="--max-old-space-size=512"
fi

# Kiểm tra thư mục chứa package
# Nếu chưa tồn tại thì tiến hành cài đặt
if [ -d  "$package" ]
then
    echo "✓ Packages đã được cài đặt"
    npm run start
else
    echo "📦 Tiến hành cài đặt thư viện cho Alphabot..."
    sleep 2
    
    if [ -n "${TERMUX_VERSION:-}" ]; then
        echo "⚠️  Trên Termux, quá trình cài đặt có thể mất 5-10 phút"
        echo "💡 Đảm bảo thiết bị không tắt màn hình trong quá trình cài đặt"
    fi
    
    npm install
    sleep 2
    # Kết thúc kiểm tra
    RED=''
    NC=''
    clear
    node login.js --starting
fi