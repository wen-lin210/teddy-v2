/**
 * Memory Optimizer cho Termux
 * Giúp quản lý bộ nhớ tốt hơn trên thiết bị Android
 */
import { isTermux, tryForceGC } from './runtime.js';

// Cache cho thread và user data
const dataCache = new Map();
const CACHE_TTL = 300000; // 5 phút

/**
 * Get cached data với TTL
 */
export function getCachedData(key) {
  const cached = dataCache.get(key);
  if (!cached) return null;
  
  if (Date.now() - cached.timestamp > CACHE_TTL) {
    dataCache.delete(key);
    return null;
  }
  
  return cached.data;
}

/**
 * Set cached data
 */
export function setCachedData(key, data) {
  dataCache.set(key, {
    data,
    timestamp: Date.now()
  });
  
  // Termux: Giới hạn cache size
  if (isTermux && dataCache.size > 100) {
    const oldestKey = dataCache.keys().next().value;
    dataCache.delete(oldestKey);
  }
}

/**
 * Clear old cache
 */
export function clearOldCache() {
  const now = Date.now();
  for (const [key, value] of dataCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      dataCache.delete(key);
    }
  }
}

/**
 * Force garbage collection nếu có
 */
export function forceGC() {
  return tryForceGC();
}

/**
 * Get memory usage
 */
export function getMemoryUsage() {
  const usage = process.memoryUsage();
  return {
    heapUsed: Math.round(usage.heapUsed / 1024 / 1024),
    heapTotal: Math.round(usage.heapTotal / 1024 / 1024),
    rss: Math.round(usage.rss / 1024 / 1024),
    external: Math.round(usage.external / 1024 / 1024)
  };
}

/**
 * Auto cleanup khi memory cao
 */
export function autoMemoryCleanup() {
  if (!isTermux) return;
  
  const interval = 600000; // 10 phút
  setInterval(() => {
    const usage = getMemoryUsage();
    
    // Nếu heap used > 400MB, clear cache và force GC
    if (usage.heapUsed > 400) {
      clearOldCache();
      forceGC();
      console.log(`[Memory] Cleaned up. Current: ${usage.heapUsed}MB`);
    }
  }, interval);
}

/**
 * Optimize string operations
 */
export function optimizeString(str) {
  if (!str || typeof str !== 'string') return str;
  // Trim và dedupe whitespace
  return str.trim().replace(/\s+/g, ' ');
}

export default {
  getCachedData,
  setCachedData,
  clearOldCache,
  forceGC,
  getMemoryUsage,
  autoMemoryCleanup,
  optimizeString,
  isTermux
};
