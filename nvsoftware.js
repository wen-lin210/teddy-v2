import { readFileSync } from 'fs';
import { spawn } from 'child_process';
import {} from 'dotenv/config';
import logger from './src/Core/helpers/console.js';
import environments from './src/Core/helpers/environments.get.js';
import Banner from './src/Banner.js';
import { isTermux, tryForceGC } from './src/Core/helpers/runtime.js';
import projectPaths from './src/Core/helpers/projectPaths.js';

const config = JSON.parse(readFileSync(projectPaths.configMain));
const _1_MINUTE = 60000;
let restartCount = 0;

console.clear();

if (process.version.slice(1).split('.')[0] < 16) {
  logger.error("Alphabot requires Node 16 or higher. Please update your version of Node.");
  process.exit(0);
}

async function main() {
  await Banner();
  
  logger.divider('═', 59);
  logger.system('Khởi động Alphabot...');
  logger.divider('═', 59);
  console.log();
  
  // Tối ưu cho Termux: giảm memory flags, tăng max old space
  const nodeArgs = isTermux 
    ? ['--max-old-space-size=512', '--expose-gc', 'src/Alphabot.js']
    : ['--trace-warnings', '--experimental-import-meta-resolve', '--expose-gc', 'src/Alphabot.js'];
  
  const child = spawn('node', nodeArgs, {
    cwd: process.cwd(),
    stdio: 'inherit',
    env: process.env
  });

  child.on("close", async (code) => {
    handleRestartCount();
    if (code !== 0 && restartCount < 3) {
      console.log();
      logger.divider();
      logger.error(`Lỗi không xác định - Mã lỗi: ${code}`);
      logger.loading("Đang khởi động lại sau 3 giây...");
      logger.divider();
      await new Promise(resolve => setTimeout(resolve, 3000));
      tryForceGC();
      main();
    } else {
      console.log();
      logger.divider();
      logger.error("Bot đã dừng hoạt động");
      logger.divider();
      process.exit();
    }
  });
}

function handleRestartCount() {
  restartCount++;
  setTimeout(() => {
    restartCount--;
  }, _1_MINUTE);
}

main();