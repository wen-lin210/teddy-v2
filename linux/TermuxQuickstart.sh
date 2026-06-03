#!/bin/bash
# Quick Start script cho Termux
# Tự động setup và optimize bot cho môi trường Android

echo "🚀 ALPHABOT TERMUX - QUICK START"
echo "================================"
echo ""

# Check if running on Termux
if [ -z "${TERMUX_VERSION}" ]; then
    echo "⚠️  Cảnh báo: Không phát hiện Termux"
    echo "Script này được tối ưu cho Termux"
    echo ""
fi

# Step 1: Check Node.js
echo "📌 Bước 1/5: Kiểm tra Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js chưa được cài đặt"
    echo "Vui lòng cài đặt: pkg install nodejs-lts -y"
    exit 1
fi
echo "✅ Node.js: $(node -v)"
echo ""

# Step 2: Check packages
echo "📌 Bước 2/5: Kiểm tra packages..."
if [ ! -d "node_modules" ]; then
    echo "📦 Đang cài đặt packages (có thể mất 5-10 phút)..."
    export NODE_OPTIONS="--max-old-space-size=512"
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Lỗi khi cài đặt packages"
        exit 1
    fi
fi
echo "✅ Packages đã sẵn sàng"
echo ""

# Step 3: Apply Termux optimization
echo "📌 Bước 3/5: Áp dụng tối ưu cho Termux..."
node Tools/Termux/apply-termux-optimization.js
if [ $? -ne 0 ]; then
    echo "❌ Lỗi khi apply optimization"
    exit 1
fi
echo ""

# Step 4: Cleanup
echo "📌 Bước 4/5: Dọn dẹp cache..."
node Tools/Maintenance/cleanup.js
echo ""

# Step 5: Check appstate
echo "📌 Bước 5/5: Kiểm tra appstate..."
if [ ! -f "appstate.json" ]; then
    echo "⚠️  Chưa có appstate.json"
    echo "Bạn cần đăng nhập trước khi start bot"
    echo ""
    read -p "Bạn có muốn đăng nhập ngay bây giờ? (y/n): " answer
    if [ "$answer" = "y" ] || [ "$answer" = "Y" ]; then
        node login.js
    else
        echo ""
        echo "Chạy lệnh sau để đăng nhập:"
        echo "  npm run login"
        echo ""
        exit 0
    fi
fi
echo "✅ Appstate đã tồn tại"
echo ""

# All done
echo "✨ Setup hoàn tất!"
echo ""
echo "📖 Các lệnh hữu ích:"
echo "  npm start          - Khởi động bot"
echo "  npm run cleanup    - Dọn cache thủ công"
echo "  npm run termux     - Áp dụng lại optimization"
echo "  npm run memory     - Xem thông tin memory"
echo ""
echo "📚 Đọc thêm: Docs/Termux/TERMUX_OPTIMIZATION.md"
echo ""
read -p "Bạn có muốn khởi động bot ngay bây giờ? (y/n): " start_now
if [ "$start_now" = "y" ] || [ "$start_now" = "Y" ]; then
    echo ""
    echo "🚀 Đang khởi động bot..."
    npm start
fi
