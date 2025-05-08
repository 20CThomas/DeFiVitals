// Temporarily disabled while migrating to data service
export const getCachedData = async (key: string) => {
  return null;
};

export const setCachedData = async (key: string, data: any) => {
  return null;
};

export const clearCache = async () => {
  return null;
};

// Cache keys
export const CACHE_KEYS = {
  CHAINS: 'chains',
  CHAIN_PROTOCOLS: (chain: string) => `chain_protocols_${chain}`,
  PROTOCOLS: 'protocols',
  LIQUID_STAKING: 'liquid_staking'
}; 