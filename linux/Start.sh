#!/bin/bash
set -euo pipefail

# Kiểm tra nếu đang chạy trên Termux
if [ -n "${TERMUX_VERSION:-}" ]; then
    echo "Đang chạy trên Termux, áp dụng tối ưu..."
    
    # Dọn dẹp cache trước khi start
    node Tools/Maintenance/cleanup.js
    
    # Kiểm tra bộ nhớ khả dụng
    if command -v free &> /dev/null; then
        free -h
    fi
    
    # Set NODE_OPTIONS cho Termux
    export NODE_OPTIONS="--max-old-space-size=512"
fi

clear
node nhatcoder.js