import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const parentDir = path.dirname(__dirname);

// Import the Express app from web-gui/server.js
import('../web-gui/server.js').then((module) => {
  // The module.default or module.app should be the Express app
}).catch(err => {
  console.error('Failed to import server:', err);
});

export default express.static(path.join(parentDir, 'web-gui', 'public'));
