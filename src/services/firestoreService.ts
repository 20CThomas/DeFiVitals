import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  Timestamp,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ProtocolData, ChainProtocol } from './dataService';

// Collection names
const PROTOCOLS_COLLECTION = 'protocols';
const CHAINS_COLLECTION = 'chains';
const CACHE_COLLECTION = 'cache';

// Cache expiration time (in milliseconds)
const CACHE_EXPIRATION = 60 * 60 * 1000; // 1 hour

// Protocol functions
export async function saveProtocol(protocol: ProtocolData): Promise<void> {
  const protocolRef = doc(db, PROTOCOLS_COLLECTION, protocol.name.toLowerCase());
  await setDoc(protocolRef, {
    ...protocol,
    updatedAt: Timestamp.now()
  });
}

export async function getProtocol(name: string): Promise<ProtocolData | null> {
  const protocolRef = doc(db, PROTOCOLS_COLLECTION, name.toLowerCase());
  const protocolSnap = await getDoc(protocolRef);
  
  if (protocolSnap.exists()) {
    return protocolSnap.data() as ProtocolData;
  }
  
  return null;
}

export async function getAllProtocols(): Promise<ProtocolData[]> {
  const protocolsRef = collection(db, PROTOCOLS_COLLECTION);
  const q = query(protocolsRef, orderBy('tvl', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => doc.data() as ProtocolData);
}

// Chain functions
export async function saveChainProtocols(
  chainName: string, 
  protocols: ChainProtocol[]
): Promise<void> {
  const chainRef = doc(db, CHAINS_COLLECTION, chainName.toLowerCase());
  await setDoc(chainRef, {
    name: chainName,
    protocols,
    updatedAt: Timestamp.now()
  });
}

export async function getChainProtocols(chainName: string): Promise<ChainProtocol[] | null> {
  const chainRef = doc(db, CHAINS_COLLECTION, chainName.toLowerCase());
  const chainSnap = await getDoc(chainRef);
  
  if (chainSnap.exists()) {
    const data = chainSnap.data();
    return data.protocols as ChainProtocol[];
  }
  
  return null;
}

// Cache functions
interface CacheItem<T> {
  data: T;
  timestamp: Timestamp;
}

export async function cacheData<T>(key: string, data: T): Promise<void> {
  try {
    console.log(`🔍 DEBUG: Attempting to write to Firestore cache collection: ${CACHE_COLLECTION}`);
    console.log(`🔑 DEBUG: Cache key: ${key}`);
    
    const cacheRef = doc(db, CACHE_COLLECTION, key);
    
    // Add timestamp for cache expiration
    const cacheData = {
      data,
      timestamp: Timestamp.now()
    };
    
    console.log(`💾 DEBUG: Writing cache data to Firestore...`);
    await setDoc(cacheRef, cacheData);
    console.log(`✅ DEBUG: Successfully wrote cache data to Firestore`);
    
    // Verify the write by reading it back
    const verifySnap = await getDoc(cacheRef);
    if (verifySnap.exists()) {
      console.log(`✓ DEBUG: Verified cache write - document exists in Firestore`);
    } else {
      console.error(`❌ DEBUG: Failed to verify cache write - document does not exist in Firestore`);
    }
  } catch (error) {
    console.error(`❌ ERROR writing to Firestore cache:`, error);
    throw error;
  }
}

export async function getCachedData<T>(key: string): Promise<T | null> {
  const cacheRef = doc(db, CACHE_COLLECTION, key);
  const cacheSnap = await getDoc(cacheRef);
  
  if (cacheSnap.exists()) {
    const cacheItem = cacheSnap.data() as CacheItem<T>;
    const now = Date.now();
    const timestamp = cacheItem.timestamp.toMillis();
    
    // Check if cache is still valid
    if (now - timestamp < CACHE_EXPIRATION) {
      return cacheItem.data;
    }
  }
  
  return null;
}

// User favorites
export async function saveFavorite(userId: string, protocolId: string): Promise<void> {
  const favoriteRef = doc(db, `users/${userId}/favorites`, protocolId);
  await setDoc(favoriteRef, {
    protocolId,
    addedAt: Timestamp.now()
  });
}

export async function removeFavorite(userId: string, protocolId: string): Promise<void> {
  const favoriteRef = doc(db, `users/${userId}/favorites`, protocolId);
  await deleteDoc(favoriteRef);
}

export async function getUserFavorites(userId: string): Promise<string[]> {
  const favoritesRef = collection(db, `users/${userId}/favorites`);
  const querySnapshot = await getDocs(favoritesRef);
  
  return querySnapshot.docs.map(doc => doc.id);
}

// User settings
export interface UserSettings {
  preferredChain?: string;
  currency?: string;
  darkMode?: boolean;
  notifications?: boolean;
}

export async function saveUserSettings(userId: string, settings: UserSettings): Promise<void> {
  const settingsRef = doc(db, 'users', userId);
  await updateDoc(settingsRef, {
    settings,
    updatedAt: Timestamp.now()
  });
}

export async function getUserSettings(userId: string): Promise<UserSettings | null> {
  const settingsRef = doc(db, 'users', userId);
  const settingsSnap = await getDoc(settingsRef);
  
  if (settingsSnap.exists()) {
    const data = settingsSnap.data();
    return data.settings as UserSettings;
  }
  
  return null;
}
