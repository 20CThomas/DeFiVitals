'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TestData {
  id: string;
  message: string;
  timestamp: {
    toDate: () => Date;
  };
}

export function FirebaseTest() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [testData, setTestData] = useState<TestData[]>([]);

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

      setMessage(`Document written with ID: ${docRef.id}`);
      setStatus('success');
      
      // Fetch test data
      await fetchTestData();
    } catch (error) {
      console.error('Error testing Firestore:', error);
      setMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
      setStatus('error');
    }
  };

  // Function to fetch test data
  const fetchTestData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'test'));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        message: doc.data().message,
        timestamp: doc.data().timestamp
      })) as TestData[];
      setTestData(data);
    } catch (error) {
      console.error('Error fetching test data:', error);
    }
  };

  // Fetch test data on component mount
  useEffect(() => {
    fetchTestData();
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Firebase Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <Button 
            onClick={testFirestore} 
            disabled={status === 'loading'}
            variant={status === 'success' ? 'default' : status === 'error' ? 'destructive' : 'outline'}
          >
            {status === 'loading' ? 'Testing...' : 'Test Firebase Connection'}
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
        
        {testData.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Test Data in Firestore:</h3>
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
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{item.id.substring(0, 8)}...</td>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{item.message}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                        {item.timestamp ? new Date(item.timestamp.toDate()).toLocaleString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
