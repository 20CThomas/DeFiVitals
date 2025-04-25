import axios from 'axios';
import { 
  fetchAggregatedData, 
  fetchHistoricalData, 
  fetchProtocols, 
  fetchChainProtocols,
  AggregatedData,
  ChartData,
  Protocol,
  ChainProtocol
} from './dataService';
import { 
  cacheData, 
  getCachedData, 
  saveChainProtocols, 
  getChainProtocols 
} from './firestoreService';

// Cache keys
const AGGREGATED_DATA_KEY = 'aggregated_data';
const HISTORICAL_DATA_KEY = 'historical_data';
const PROTOCOLS_KEY = 'protocols';
const CHAIN_PROTOCOLS_KEY = 'chain_protocols';

/**
 * Fetches aggregated data with Firestore caching
 */
export async function fetchAggregatedDataWithCache(
  chain: 'Ethereum' | 'Bitcoin' | 'Solana' | 'Polygon' = 'Ethereum'
): Promise<AggregatedData> {
  try {
    // Try to get data from cache first
    const cacheKey = `${AGGREGATED_DATA_KEY}_${chain.toLowerCase()}`;
    console.log(`🔍 Checking Firestore cache for key: ${cacheKey}`);
    const cachedData = await getCachedData<AggregatedData>(cacheKey);
    
    if (cachedData) {
      console.log(`✅ CACHE HIT: Using cached aggregated data for ${chain}`);
      console.log(`📊 Cache data summary: ${cachedData.totalProtocols} protocols, $${Math.round(cachedData.totalTvl).toLocaleString()} TVL`);
      return cachedData;
    }
    
    // If not in cache, fetch from API
    console.log(`❌ CACHE MISS: Fetching fresh aggregated data for ${chain} from API`);
    const data = await fetchAggregatedData(chain);
    
    // Cache the result
    console.log(`💾 Saving data to Firestore cache with key: ${cacheKey}`);
    await cacheData(cacheKey, data);
    console.log(`✅ Successfully cached data in Firestore`);
    
    return data;
  } catch (error) {
    console.error(`Error in fetchAggregatedDataWithCache for ${chain}:`, error);
    // If cache fails, fall back to direct API call
    return fetchAggregatedData(chain);
  }
}

/**
 * Fetches historical data with Firestore caching
 */
export async function fetchHistoricalDataWithCache(
  days: number = 90, 
  chain: 'Ethereum' | 'Bitcoin' | 'Solana' | 'Polygon' = 'Ethereum'
): Promise<ChartData> {
  try {
    // Try to get data from cache first
    const cacheKey = `${HISTORICAL_DATA_KEY}_${chain.toLowerCase()}_${days}`;
    const cachedData = await getCachedData<ChartData>(cacheKey);
    
    if (cachedData) {
      console.log(`Using cached historical data for ${chain} (${days} days)`);
      return cachedData;
    }
    
    // If not in cache, fetch from API
    console.log(`Fetching fresh historical data for ${chain} (${days} days)`);
    const data = await fetchHistoricalData(days, chain);
    
    // Cache the result
    await cacheData(cacheKey, data);
    
    return data;
  } catch (error) {
    console.error(`Error in fetchHistoricalDataWithCache for ${chain}:`, error);
    // If cache fails, fall back to direct API call
    return fetchHistoricalData(days, chain);
  }
}

/**
 * Fetches protocols with Firestore caching
 */
export async function fetchProtocolsWithCache(): Promise<Protocol[]> {
  try {
    // Try to get data from cache first
    const cachedData = await getCachedData<Protocol[]>(PROTOCOLS_KEY);
    
    if (cachedData) {
      console.log('Using cached protocols data');
      return cachedData;
    }
    
    // If not in cache, fetch from API
    console.log('Fetching fresh protocols data');
    const data = await fetchProtocols();
    
    // Cache the result
    await cacheData(PROTOCOLS_KEY, data);
    
    return data;
  } catch (error) {
    console.error('Error in fetchProtocolsWithCache:', error);
    // If cache fails, fall back to direct API call
    return fetchProtocols();
  }
}

/**
 * Fetches chain protocols with Firestore caching
 */
export async function fetchChainProtocolsWithCache(chainName: string): Promise<ChainProtocol[]> {
  try {
    // Try to get data from Firestore first
    const firestoreData = await getChainProtocols(chainName);
    
    if (firestoreData) {
      console.log(`Using stored chain protocols for ${chainName}`);
      return firestoreData;
    }
    
    // If not in Firestore, fetch from API
    console.log(`Fetching fresh chain protocols for ${chainName}`);
    const data = await fetchChainProtocols(chainName);
    
    // Store in Firestore
    await saveChainProtocols(chainName, data);
    
    return data;
  } catch (error) {
    console.error(`Error in fetchChainProtocolsWithCache for ${chainName}:`, error);
    // If Firestore fails, fall back to direct API call
    return fetchChainProtocols(chainName);
  }
}
