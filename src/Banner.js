/**
* @author      Nhatcoder
* @version     2.0.0
* @homeurl     https://github.com/nhatcoder2003/gbot-war
* @author_url  https://www.facebook.com/vuminhnhat10092003
*/
import { readFileSync } from 'fs';
import chalk from 'chalk';
import gradient from 'gradient-string';
import { isTermux } from './Core/helpers/runtime.js';

export default () => {
  const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));
  const version = packageJson.version || '1.0.0';
  
  // ASCII Art Logo với gradient đẹp
  const logo = `
 ╔═══════════════════════════════════════════════════════════╗
 ║                                                           ║
 ║     █▀█ █   █▀█ █ █ █▀█ █▀▄ █▀█ ▀█▀                     ║
 ║     █▀█ █   █▀▀ █▀█ █▀█ █▀▄ █▄█  █                      ║
 ║     ▀ ▀ ▀▀▀ ▀   ▀ ▀ ▀▀▀ ▀▀  ▀▀▀  ▀                      ║
 ║                                                           ║
 ║              🤖 ALPHABOT V2 - By Nhat Vu                 ║
 ║                                                           ║
 ╚═══════════════════════════════════════════════════════════╝
`;

  console.log(gradient.cristal(logo));
  
  // System info với thiết kế tối giản
  const divider = chalk.gray('━'.repeat(59));
  const platform = isTermux ? '📱 Termux' : '💻 Desktop';
  const nodeVersion = process.version;
  
  console.log(divider);
  console.log(chalk.cyan('  Version:  ') + chalk.white.bold(`v${version}`));
  console.log(chalk.cyan('  Platform: ') + chalk.white.bold(platform));
  console.log(chalk.cyan('  Runtime:  ') + chalk.white.bold(`Node ${nodeVersion}`));
  console.log(divider);
  console.log();
}