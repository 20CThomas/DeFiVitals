'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, getDoc, Timestamp, deleteDoc } from 'firebase/firestore';

export default function CacheTestPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [cacheData, setCacheData] = useState<any[]>([]);

  // Test writing to the cache collection
  const testWriteCache = async () => {
    try {
      setStatus('loading');
      setMessage('Testing cache write to Firestore...');

      // Create a test cache entry
      const cacheKey = `test_cache_${Date.now()}`;
      const cacheRef = doc(db, 'cache', cacheKey);
      
      // Data to cache
      const testData = {
        message: 'Test cache entry',
        number: Math.floor(Math.random() * 1000),
        isTest: true
      };
      
      // Write to cache
      await setDoc(cacheRef, {
        data: testData,
        timestamp: Timestamp.now()
      });
      
      // Verify the write
      const verifySnap = await getDoc(cacheRef);
      
      if (verifySnap.exists()) {
        setMessage(`Success! Cache entry written with key: ${cacheKey}`);
        setStatus('success');
        
        // Refresh cache data
        fetchCacheData();
      } else {
        setMessage('Error: Failed to verify cache write');
        setStatus('error');
      }
    } catch (error) {
      console.error('Error testing cache write:', error);
      setMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
      setStatus('error');
    }
  };

  // Fetch all cache entries
  const fetchCacheData = async () => {
    try {
      setStatus('loading');
      setMessage('Fetching cache data...');
      
      const cacheCollection = collection(db, 'cache');
      const querySnapshot = await getDocs(cacheCollection);
      
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setCacheData(data);
      
      if (data.length > 0) {
        setMessage(`Found ${data.length} cache entries`);
      } else {
        setMessage('No cache entries found');
      }
      
      setStatus('success');
    } catch (error) {
      console.error('Error fetching cache data:', error);
      setMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
      setStatus('error');
    }
  };

  // Clear all cache entries
  const clearCache = async () => {
    try {
      setStatus('loading');
      setMessage('Clearing cache data...');
      
      const cacheCollection = collection(db, 'cache');
      const querySnapshot = await getDocs(cacheCollection);
      
      const deletePromises = querySnapshot.docs.map(document => 
        deleteDoc(doc(db, 'cache', document.id))
      );
      
      await Promise.all(deletePromises);
      
      setMessage('All cache entries cleared successfully');
      setCacheData([]);
      setStatus('success');
    } catch (error) {
      console.error('Error clearing cache data:', error);
      setMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <div className="container mx-auto px-4 py-8 space-y-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              Firestore Cache Test
            </h1>
            <p className="text-muted-foreground mb-8">
              This page specifically tests the cache collection in Firestore. If you don't see the cache collection in your Firebase console, this will help diagnose the issue.
            </p>
            
            <Card className="w-full mx-auto">
              <CardHeader>
                <CardTitle>Firestore Cache Collection Test</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center gap-4">
                  <Button 
                    onClick={testWriteCache} 
                    disabled={status === 'loading'}
                    variant="default"
                  >
                    {status === 'loading' ? 'Testing...' : 'Test Cache Write'}
                  </Button>
                  
                  <Button 
                    onClick={fetchCacheData}
                    disabled={status === 'loading'}
                    variant="outline"
                  >
                    Fetch Cache Data
                  </Button>
                  
                  <Button 
                    onClick={clearCache}
                    disabled={status === 'loading' || cacheData.length === 0}
                    variant="destructive"
                  >
                    Clear Cache
                  </Button>
                </div>
                
                {message && (
                  <div className={`p-3 rounded-md text-center ${
                    status === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                    status === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 
                    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {message}
                  </div>
                )}
                
                <div>
                  <h3 className="font-medium mb-2">Cache Data in Firestore:</h3>
                  {cacheData.length > 0 ? (
                    <div className="border rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cache Key</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Data</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Timestamp</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                          {cacheData.map((item) => (
                            <tr key={item.id}>
                              <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{item.id}</td>
                              <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                                <pre className="text-xs overflow-auto max-w-xs">
                                  {JSON.stringify(item.data, null, 2)}
                                </pre>
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                                {item.timestamp ? new Date(item.timestamp.toDate()).toLocaleString() : 'N/A'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
                      No cache data found. Click the "Test Cache Write" button to create a cache entry, or "Fetch Cache Data" to check for existing entries.
                    </div>
                  )}
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mt-6">
                  <h3 className="font-medium mb-2">Troubleshooting Firestore Cache:</h3>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Click "Test Cache Write" to explicitly create a cache entry</li>
                    <li>Click "Fetch Cache Data" to retrieve all cache entries</li>
                    <li>Check your Firebase console to see if the 'cache' collection appears</li>
                    <li>If the cache collection doesn't appear in Firebase console, check for permission/rule issues</li>
                    <li>If you see data here but not in Firebase console, try refreshing the console</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
