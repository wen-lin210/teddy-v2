import '../Tools/Maintenance/cleanup.js';
import { } from 'dotenv/config';
import {
  writeFileSync
} from 'fs';
import {
  resolve as resolvePath
} from 'path';
import logger from './Core/helpers/console.js';
import { isTermux, runtimeIntervals, tryForceGC } from './Core/helpers/runtime.js';
import projectPaths from './Core/helpers/projectPaths.js';
import nvFca from '../vendor/nv-fca/index.js';
import handleListen from './Handlers/listen.js';
import environments from './Core/helpers/environments.get.js';
import _init_var from './Core/_init.js';
import {
  execSync
} from 'child_process';
import {
  initDatabase,
  updateJSON,
  updateMONGO,
  _Threads,
  _Users
} from './Handlers/database.js';

process.stdout.write(
  String.fromCharCode(27) + "]0;" + "Gbot" + String.fromCharCode(7)
);

process.on('unhandledRejection', (reason, p) => {
  console.error(reason, 'Unhandled Rejection at Promise', p);
});

process.on('uncaughtException', (err, origin) => {
  logger.error("Uncaught Exception: " + err + ": " + origin);
});

function safeShutdown(exitCode = 0) {
  if (typeof global.shutdown === 'function') {
    return global.shutdown();
  }
  process.exit(exitCode);
}

// Xử lý tất cả tín hiệu tắt
['SIGINT', 'SIGTERM', 'SIGHUP'].forEach(signal => {
  process.on(signal, () => {
    logger.system(getLang('build.start.exit'));
    safeShutdown(0);
  });
});

global.resources = new Object({
  Lyrics: projectPaths.resourcesLyrics,
  Storage: projectPaths.resourcesData
});
async function start() {
  try {
    logger.loading('Khởi tạo biến môi trường...');
    await _init_var();
    logger.success(getLang('build.start.varLoaded'));

    logger.loading('Kết nối database...');
    await initDatabase();
    logger.success('Database đã sẵn sàng');

    global.updateJSON = updateJSON;
    global.updateMONGO = updateMONGO;
    global.controllers = {
      Threads: _Threads,
      Users: _Users
    }

    logger.divider();
    await booting(logger);
  } catch (err) {
    logger.error(err);
    return safeShutdown(1);
  }
}

function booting(logger) {
  return new Promise((resolve, reject) => {
    logger.loading(getLang('build.booting.logging'));

    loginState()
      .then(async api => {
        global.api = api;
        global.botID = api.getCurrentUserID();
        logger.success(getLang('build.booting.logged', { botID }));
        logger.divider();

        refreshState();
        if (global.config.REFRESH) autoReloadApplication();

        global.listenMqtt = api.listenMqtt(await handleListen());
        refreshMqtt();

        resolve();
      })
      .catch(err => {
        reject(err);
      })
  });
}

function refreshState() {
  const refreshInterval = runtimeIntervals.appStateRefreshMs;

  global.refreshState = setInterval(() => {
    logger.custom(getLang('build.refreshState'), 'REFRESH');
    const newAppState = global.api.getAppState();

    // Termux: không beautify JSON để giảm kích thước file
    const jsonFormat = isTermux ? 0 : 2;

    // Cập nhật writeFileSync
    const appstatePath = resolvePath(global.config.APPSTATE_PATH);

    writeFileSync(appstatePath, JSON.stringify(newAppState, null, jsonFormat), 'utf8');

    // Force GC sau khi write để giải phóng memory
    if (isTermux) tryForceGC();
  }, refreshInterval);
}

function refreshMqtt() {
  const refreshInterval = runtimeIntervals.mqttRefreshMs;

  global.refreshMqtt = setInterval(async () => {
    logger.custom(getLang('build.refreshMqtt'), 'REFRESH');
    global.listenMqtt.stopListening();
    global.listenMqtt = global.api.listenMqtt(await handleListen());

    // Force GC sau khi refresh MQTT
    if (isTermux) tryForceGC();
  }, refreshInterval);
}

function autoReloadApplication() {
  setTimeout(() => global.restart(),
    global.config.REFRESH);
}

function loginState() {
  const { APPSTATE_PATH, APPSTATE_PROTECTION } = global.config;

  return new Promise((resolve, reject) => {
    global.modules.get('checkAppstate')(APPSTATE_PATH, APPSTATE_PROTECTION)
      .then(appState => {
        const options = global.config.FCA_OPTIONS;
        const login = nvFca?.login;

        if (typeof login !== 'function') {
          reject(new Error('nv-fca export không hợp lệ: thiếu hàm login'));
          return;
        }

        login(appState, options, (error, api) => {
          if (error) {
            reject(error.error || error);
            return;
          }

          console.log('Đăng nhập thành công!');
          resolve(api);
        });
      })
      .catch(err => {
        reject(err);
      });
  });
}

start();