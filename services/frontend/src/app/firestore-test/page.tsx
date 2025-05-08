'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, Timestamp, deleteDoc, doc, setDoc } from 'firebase/firestore';

interface TestData {
  id: string;
  message: string;
  timestamp: {
    toDate: () => Date;
  };
}

export default function FirestoreTestPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [testData, setTestData] = useState<TestData[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  // Check Firestore connection
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const testRef = doc(db, 'test', 'connection-test');
        await setDoc(testRef, { timestamp: Timestamp.now() });
        await deleteDoc(testRef);
        setConnectionStatus('connected');
      } catch (error) {
        console.error('Firestore connection error:', error);
        setConnectionStatus('disconnected');
        setMessage(`Connection error: ${error instanceof Error ? error.message : String(error)}`);
      }
    };

    checkConnection();
  }, []);

  // Function to test writing to Firestore
  const testFirestore = async () => {
    try {
      setStatus('loading');
      setMessage('Testing Firestore connection...');

      // Add a document to a test collection
      const docRef = await addDoc(collection(db, 'test'), {
        message: 'Hello from DeFiVitals!',
        timestamp: Timestamp.now()
      });

      setMessage(`Success! Document written with ID: ${docRef.id}`);
      setStatus('success');
      setConnectionStatus('connected');
      
      // Refresh test data
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Error testing Firestore:', error);
      setMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
      setStatus('error');
      setConnectionStatus('disconnected');
    }
  };

  // Function to clear test data
  const clearTestData = async () => {
    try {
      setStatus('loading');
      setMessage('Clearing test data...');
      
      const querySnapshot = await getDocs(collection(db, 'test'));
      const deletePromises = querySnapshot.docs.map(document => 
        deleteDoc(doc(db, 'test', document.id))
      );
      
      await Promise.all(deletePromises);
      
      setMessage('All test data cleared successfully');
      setStatus('success');
      
      // Refresh test data
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Error clearing test data:', error);
      setMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
      setStatus('error');
    }
  };

  // Function to fetch test data
  const fetchTestData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'test'));
      const data = querySnapshot.docs.map(document => ({
        id: document.id,
        message: document.data().message,
        timestamp: document.data().timestamp
      })) as TestData[];
      setTestData(data);
    } catch (error) {
      console.error('Error fetching test data:', error);
    }
  };

  // Fetch test data on component mount or when refreshKey changes
  useEffect(() => {
    fetchTestData();
  }, [refreshKey]);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <div className="container mx-auto px-4 py-8 space-y-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              Firestore Test
            </h1>
            <p className="text-muted-foreground mb-8">
              This page tests your Firebase and Firestore connection. If the test is successful, you'll see data appear in the table below.
            </p>
            
            <Card className="w-full mx-auto">
              <CardHeader>
                <CardTitle>Firebase Connection Test</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center gap-4">
                  <Button 
                    onClick={testFirestore} 
                    disabled={status === 'loading'}
                    variant={status === 'success' ? 'default' : status === 'error' ? 'destructive' : 'outline'}
                  >
                    {status === 'loading' ? 'Testing...' : 'Test Firebase Connection'}
                  </Button>
                  
                  <Button 
                    onClick={clearTestData}
                    disabled={status === 'loading' || testData.length === 0}
                    variant="outline"
                  >
                    Clear Test Data
                  </Button>
                </div>

                <div className={`p-3 rounded-md text-center ${
                  connectionStatus === 'connected' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  connectionStatus === 'disconnected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  Connection Status: {connectionStatus === 'checking' ? 'Checking...' : 
                                   connectionStatus === 'connected' ? 'Connected' : 
                                   'Disconnected'}
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
                  <h3 className="font-medium mb-2">Test Data in Firestore:</h3>
                  {testData.length > 0 ? (
                    <div className="border rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Message</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Timestamp</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                          {testData.map((item) => (
                            <tr key={item.id}>
                              <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{item.id}</td>
                              <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{item.message}</td>
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
                      No test data found. Click the "Test Firebase Connection" button to create some.
                    </div>
                  )}
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mt-6">
                  <h3 className="font-medium mb-2">How to Verify Firestore is Working:</h3>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Click the "Test Firebase Connection" button above</li>
                    <li>If successful, you'll see a success message and data will appear in the table</li>
                    <li>Check your Firebase console to see the test collection with the new document</li>
                    <li>Visit the main page of your app and check browser console logs for cache hits/misses</li>
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
