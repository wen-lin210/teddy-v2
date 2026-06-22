const HOUR_IN_MS = 60 * 60 * 1000;

export const isTermux = Boolean(process.env.PREFIX?.includes('com.termux'));

export const runtimeIntervals = {
  appStateRefreshMs: isTermux ? 24 * HOUR_IN_MS : 12 * HOUR_IN_MS,
  mqttRefreshMs: isTermux ? 4 * HOUR_IN_MS : 2 * HOUR_IN_MS,
};

export function tryForceGC() {
  if (typeof global.gc !== 'function') {
    return false;
  }

  try {
    global.gc();
    return true;
  } catch (_) {
    return false;
  }
}

export default {
  isTermux,
  runtimeIntervals,
  tryForceGC,
};
