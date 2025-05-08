'use client';

import { FirebaseConnectionTest } from '@/components/FirebaseConnectionTest';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

export default function FirebaseTestPage() {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <div className="container mx-auto px-4 py-8 space-y-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              Firebase Test
            </h1>
            <p className="text-muted-foreground mb-8">
              This page tests your Firebase connection. Check the browser console for detailed logs.
            </p>
            
            <FirebaseConnectionTest />
          </div>
        </main>
      </div>
    </div>
  );
}
