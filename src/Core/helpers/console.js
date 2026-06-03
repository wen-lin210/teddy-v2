/**
* @author      Nhatcoder
* @version     2.0.0
* @homeurl     https://github.com/nhatcoder2003/gbot
* @author_url  https://www.facebook.com/vuminhnhat10092003
*/
/**
* Vietnamese:
*- Vui lòng không xóa dòng này
*- Đây là động lực giúp tôi cung cấp nhưng sản miễn phí và chất lượng tới cộng đồng
*- Bất kỳ hành động sửa đổi nào sẽ ảnh hưởng tới mã nguồn hoặc dẫn tới bạn bị cấm sử dụng tiện ích dòng lệnh của alphabot
*- Bản quyền © 2023 Nhatcoder2k3
* -----------------------------------
* English:
*- Please do not delete this line
*- This is my motivation to provide free and quality products to the community
*- Any modification will affect the source code or lead to you being banned from using the alphabot command line utility
*- Copyright © 2023 Nhatcoder2k3
*/
import chalk from 'chalk';

// Icons cho mỗi loại log
const icons = {
  info: '✓',
  warn: '⚠',
  error: '✖',
  system: '●',
  success: '✔',
  loading: '⏳',
  refresh: '↻'
};

// Hàm tiện ích để tạo box cho message quan trọng
const createBox = (message, color = chalk.cyan) => {
  const lines = message.split('\n');
  const maxLength = Math.max(...lines.map(l => l.length));
  const border = '─'.repeat(maxLength + 4);
  
  console.log(color('┌' + border + '┐'));
  lines.forEach(line => {
    const padding = ' '.repeat(maxLength - line.length);
    console.log(color('│  ') + chalk.white(line) + padding + color('  │'));
  });
  console.log(color('└' + border + '┘'));
};

const logger = {
  info: (message) => {
    console.log(
      chalk.bold.green(`${icons.info} INFO `) + 
      chalk.gray('│ ') + 
      chalk.white(message)
    );
  },
  
  warn: (message) => {
    console.log(
      chalk.bold.yellow(`${icons.warn} WARN `) + 
      chalk.gray('│ ') + 
      chalk.white(message)
    );
  },
  
  error: (message) => {
    console.log(
      chalk.bold.red(`${icons.error} ERROR`) + 
      chalk.gray('│ ') + 
      chalk.white(message)
    );
  },
  
  system: (message) => {
    console.log(
      chalk.bold.blue(`${icons.system} SYS  `) + 
      chalk.gray('│ ') + 
      chalk.white(message)
    );
  },
  
  success: (message) => {
    console.log(
      chalk.bold.greenBright(`${icons.success} OK   `) + 
      chalk.gray('│ ') + 
      chalk.white(message)
    );
  },
  
  loading: (message) => {
    console.log(
      chalk.bold.cyan(`${icons.loading} LOAD `) + 
      chalk.gray('│ ') + 
      chalk.white(message)
    );
  },
  
  custom: (message, type, color = chalk.cyan) => {
    const colorFn = typeof color === 'function' ? color : chalk.hex(color.replace(/\\x1b\[\d+m/g, ''));
    console.log(
      colorFn(`● ${type.toUpperCase().padEnd(5)}`) + 
      chalk.gray('│ ') + 
      chalk.white(message)
    );
  },
  
  // Thêm các tiện ích mới
  divider: (char = '─', length = 60) => {
    console.log(chalk.gray(char.repeat(length)));
  },
  
  box: createBox,
  
  header: (title) => {
    console.log();
    console.log(chalk.bold.cyan('┏' + '━'.repeat(title.length + 4) + '┓'));
    console.log(chalk.bold.cyan('┃  ') + chalk.white.bold(title) + chalk.bold.cyan('  ┃'));
    console.log(chalk.bold.cyan('┗' + '━'.repeat(title.length + 4) + '┛'));
    console.log();
  }
};

export default logger;