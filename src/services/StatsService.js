import { statisticsService } from './appwriteService';

const CACHE_KEY = 'fyleo:stats:v1';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const formatNumber = (num) => {
  if (typeof num !== 'number') return '0';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(num);
};

const getCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (Date.now() - (data.timestamp || 0) > CACHE_TTL_MS) return null;
    return data.value;
  } catch {
    return null;
  }
};

const setCache = (value) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), value }));
  } catch {}
};

export const StatsService = {
  async getFormattedStatsWithCache() {
    // Try cache first
    const cached = getCache();
    if (cached) return cached;

    try {
      const stats = await statisticsService.getPlatformStats();
      const result = {
        users: {
          number: formatNumber(stats.totalUsers || 0),
          label: ''
        },
        files: {
          number: formatNumber(stats.totalMaterials || 0),
          label: ''
        }
      };
      setCache(result);
      return result;
    } catch (e) {
      // Fallback safe shape
      return {
        users: { number: '0', label: '' },
        files: { number: '0', label: '' }
      };
    }
  }
};

export default StatsService;
