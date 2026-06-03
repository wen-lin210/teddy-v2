/**
 * Memory Information Tool
 * Hiển thị thông tin memory usage của bot với UI đẹp
 */

import memoryOptimizer from '../../src/Core/helpers/memoryOptimizer.js';
import { isTermux } from '../../src/Core/helpers/runtime.js';
import chalk from 'chalk';

console.clear();
console.log();

// Header với box đẹp
console.log(chalk.cyan.bold('┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓'));
console.log(chalk.cyan.bold('┃') + '  ' + chalk.white.bold('📊 ALPHABOT - THÔNG TIN BỘ NHỚ') + '              ' + chalk.cyan.bold('┃'));
console.log(chalk.cyan.bold('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛'));
console.log();

// Platform info
const platform = isTermux ? '📱 Termux (Android)' : '💻 Desktop/Server';
console.log(chalk.blue('  🖥️  Environment: ') + chalk.white(platform));
console.log(chalk.blue('  ⚙️  Node:        ') + chalk.white(process.version));
console.log();
console.log(chalk.gray('━'.repeat(52)));
console.log();

const usage = memoryOptimizer.getMemoryUsage();

// Hàm tạo thanh tiến trình
const createBar = (percentage, width = 30) => {
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  
  let color = chalk.green;
  if (percentage > 70) color = chalk.yellow;
  if (percentage > 90) color = chalk.red;
  
  return color(bar) + ' ' + color(`${percentage.toFixed(1)}%`);
};

// Heap Memory với thanh tiến trình
const heapPercent = Math.round((usage.heapUsed / usage.heapTotal) * 100);
console.log(chalk.magenta.bold('  💾 Heap Memory'));
console.log(chalk.gray('  ├─ ') + 'Used:    ' + chalk.cyan(`${usage.heapUsed} MB`));
console.log(chalk.gray('  ├─ ') + 'Total:   ' + chalk.white(`${usage.heapTotal} MB`));
console.log(chalk.gray('  └─ ') + 'Usage:   ' + createBar(heapPercent));
console.log();

// External & RSS
console.log(chalk.yellow.bold('  🗂️  Other Memory'));
console.log(chalk.gray('  ├─ ') + 'External: ' + chalk.cyan(`${usage.external} MB`));
console.log(chalk.gray('  └─ ') + 'RSS:      ' + chalk.cyan(`${usage.rss} MB`));
console.log();

console.log(chalk.gray('━'.repeat(52)));
console.log();

// Status với icon và màu
if (heapPercent < 60) {
  console.log(chalk.green.bold('  ✅ STATUS: Tốt'));
  console.log(chalk.gray('  ├─ ') + 'Bộ nhớ hoạt động bình thường');
  console.log(chalk.gray('  └─ ') + 'Không cần thao tác gì thêm');
} else if (heapPercent < 80) {
  console.log(chalk.yellow.bold('  ⚠️  STATUS: Trung bình'));
  console.log(chalk.gray('  ├─ ') + 'Bộ nhớ đang ở mức cao');
  console.log(chalk.gray('  └─ ') + chalk.cyan('Khuyến nghị: Theo dõi thường xuyên'));
} else {
  console.log(chalk.red.bold('  ❌ STATUS: Cao - Cần cleanup'));
  console.log(chalk.gray('  ├─ ') + 'Bộ nhớ sử dụng quá cao!');
  console.log(chalk.gray('  └─ ') + chalk.cyan('Chạy: npm run cleanup'));
}

console.log();

// Cache info nếu có
try {
  const stats = memoryOptimizer.getStats();
  console.log(chalk.gray('━'.repeat(52)));
  console.log();
  console.log(chalk.blue.bold('  📦 CACHE & DETAILS'));
  console.log(chalk.gray('  ├─ ') + 'Array Buffers: ' + chalk.white(`${(stats.arrayBuffers / 1024 / 1024).toFixed(2)} MB`));
  console.log(chalk.gray('  └─ ') + 'Heap Limit:    ' + chalk.white(`${(stats.heapLimit / 1024 / 1024).toFixed(2)} MB`));
  console.log();
} catch (e) {
  // Stats không khả dụng
}

// Recommendations
if (heapPercent > 70 || usage.heapUsed > 400) {
  console.log(chalk.gray('━'.repeat(52)));
  console.log();
  console.log(chalk.yellow.bold('  💡 KHUYẾN NGHỊ:'));
  console.log(chalk.gray('  • ') + 'Run: ' + chalk.cyan('npm run cleanup'));
  console.log(chalk.gray('  • ') + 'Restart bot để giải phóng memory');
  if (isTermux) {
    console.log(chalk.gray('  • ') + 'Đóng các app khác trên Termux');
    console.log(chalk.gray('  • ') + 'Tắt bớt features trong config');
  }
  console.log();
}

console.log(chalk.gray('━'.repeat(52)));
console.log();
if (global.client) {
  console.log('\n📦 CACHE INFO:');
  if (global.client.cooldowns) {
    console.log(`  • Cooldowns:     ${global.client.cooldowns.size} users`);
  }
  if (global.client.replies) {
    console.log(`  • Reply Events:  ${global.client.replies.size}`);
  }
  if (global.client.reactions) {
    console.log(`  • React Events:  ${global.client.reactions.size}`);
  }
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// Termux specific info
if (isTermux) {
  console.log('\n📱 TERMUX TIPS:');
  console.log('  • Khuyến nghị: Giữ heap usage < 350MB');
  console.log('  • Nếu cao: Restart bot hoặc cleanup cache');
  console.log('  • Monitor: Chạy script này thường xuyên');
}

// GC info
if (global.gc) {
  console.log('\n🗑️  GARBAGE COLLECTION:');
  console.log('  • Status:        ✅ Available');
  console.log('  • Run manual:    global.gc() in console');
} else {
  console.log('\n🗑️  GARBAGE COLLECTION:');
  console.log('  • Status:        ⚠️  Not exposed');
  console.log('  • Enable with:   --expose-gc flag');
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Uptime
const uptime = process.uptime();
const hours = Math.floor(uptime / 3600);
const minutes = Math.floor((uptime % 3600) / 60);
const seconds = Math.floor(uptime % 60);

console.log(`⏱️  Uptime: ${hours}h ${minutes}m ${seconds}s\n`);

// Export for potential API use
export default {
  usage,
  heapPercent,
  uptime,
  isTermux
};
