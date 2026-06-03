import { readFileSync, writeFileSync, existsSync } from 'fs';
import { isTermux } from '../../src/Core/helpers/runtime.js';
import projectPaths from '../../src/Core/helpers/projectPaths.js';

const configPath = projectPaths.configMain;
const termuxConfigPath = projectPaths.configTermux;

console.log('🔧 ALPHABOT TERMUX OPTIMIZER\n');

if (isTermux) {
  console.log('✅ Phát hiện môi trường Termux');
} else {
  console.log('⚠️  Không phát hiện Termux, vẫn có thể apply config tối ưu');
}

try {
  // Check if termux config exists
  if (!existsSync(termuxConfigPath)) {
    console.error('❌ Không tìm thấy config.termux.json');
    process.exit(1);
  }
  
  // Backup current config
  if (existsSync(configPath)) {
    const backupPath = projectPaths.configMainBackup;
    const currentConfig = readFileSync(configPath, 'utf8');
    writeFileSync(backupPath, currentConfig, 'utf8');
    console.log('💾 Đã backup config hiện tại -> config.main.backup.json');
  }
  
  // Copy termux config
  const termuxConfig = readFileSync(termuxConfigPath, 'utf8');
  const config = JSON.parse(termuxConfig);
  
  // Keep important user settings
  if (existsSync(configPath)) {
    const currentConfig = JSON.parse(readFileSync(configPath, 'utf8'));
    
    // Keep these settings from current config
    if (currentConfig.MODERATORS) config.MODERATORS = currentConfig.MODERATORS;
    if (currentConfig.ABSOLUTES) config.ABSOLUTES = currentConfig.ABSOLUTES;
    if (currentConfig.NAME) config.NAME = currentConfig.NAME;
    if (currentConfig.PREFIX) config.PREFIX = currentConfig.PREFIX;
    if (currentConfig.GBOTWAR_ACTIVE) config.GBOTWAR_ACTIVE = currentConfig.GBOTWAR_ACTIVE;
    if (currentConfig.GBOTWAR_MESSAGE) config.GBOTWAR_MESSAGE = currentConfig.GBOTWAR_MESSAGE;
  }
  
  // Write optimized config
  writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
  console.log('✅ Đã apply config tối ưu cho Termux');
  
  // Show optimization summary
  console.log('\n📊 CÁC TỐI ƯU ĐÃ ÁP DỤNG:');
  console.log('  • Logging: Tắt (LOG_LEVEL = 0)');
  console.log('  • SelfListen: Tắt');
  console.log('  • Webview Dashboard: Tắt');
  console.log('  • Listen Console: Tắt');
  console.log('  • Database Beautify: Tắt');
  console.log('  • RegBox Amount: 50 (giảm từ 100)');
  console.log('  • Refresh Interval: 24h (tăng từ 12h)');
  console.log('  • Notifications: Tắt');
  
  console.log('\n💡 MẸO:');
  console.log('  • Dùng "npm run cleanup" để dọn cache thủ công');
  console.log('  • Đọc Docs/Termux/TERMUX_OPTIMIZATION.md để biết thêm chi tiết');
  console.log('  • Backup được lưu tại config.main.backup.json');
  
  console.log('\n✨ Hoàn tất! Bạn có thể khởi động bot bằng: bash linux/Start.sh\n');
  
} catch (err) {
  console.error('❌ Lỗi:', err.message);
  process.exit(1);
}
