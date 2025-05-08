import { db } from '@/lib/firebase';
import { collection, doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

interface CacheEntry<T> {
  data: T;
  timestamp: Timestamp;
}

export async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    const cacheRef = doc(db, 'cache', key);
    const cacheDoc = await getDoc(cacheRef);

    if (!cacheDoc.exists()) {
      return null;
    }

    const cacheData = cacheDoc.data() as CacheEntry<T>;
    const now = Date.now();
    const cacheTime = cacheData.timestamp.toDate().getTime();

    // Check if cache is still valid
    if (now - cacheTime > CACHE_DURATION) {
      return null;
    }

    return cacheData.data;
  } catch (error) {
    console.error('Error reading from cache:', error);
    return null;
  }
}

export async function setCachedData<T>(key: string, data: T): Promise<void> {
  try {
    const cacheRef = doc(db, 'cache', key);
    await setDoc(cacheRef, {
      data,
      timestamp: Timestamp.now()
    });
  } catch (error) {
    console.error('Error writing to cache:', error);
  }
}

// Cache keys
export const CACHE_KEYS = {
  CHAINS: 'chains',
  CHAIN_PROTOCOLS: (chain: string) => `chain_protocols_${chain}`,
  PROTOCOLS: 'protocols',
  LIQUID_STAKING: 'liquid_staking'
}; 