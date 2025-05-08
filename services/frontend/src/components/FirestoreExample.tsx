'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fetchProtocolsWithCache } from '@/services/firebaseDataService';
import { saveFavorite, removeFavorite, getUserFavorites } from '@/services/firestoreService';
import { Protocol } from '@/services/dataService';
import { Bookmark, BookmarkCheck } from 'lucide-react';

// This is a placeholder - in a real app, you'd get this from authentication
const DEMO_USER_ID = 'demo-user';

export function FirestoreExample() {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Fetch protocols using the cached version
        const protocolsData = await fetchProtocolsWithCache();
        setProtocols(protocolsData.slice(0, 5)); // Just show top 5 for demo
        
        // Get user favorites from Firestore
        const userFavorites = await getUserFavorites(DEMO_USER_ID);
        setFavorites(userFavorites);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);
  
  // Toggle favorite status
  const toggleFavorite = async (protocolId: string) => {
    try {
      if (favorites.includes(protocolId)) {
        // Remove from favorites
        await removeFavorite(DEMO_USER_ID, protocolId);
        setFavorites(favorites.filter(id => id !== protocolId));
      } else {
        // Add to favorites
        await saveFavorite(DEMO_USER_ID, protocolId);
        setFavorites([...favorites, protocolId]);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setError('Failed to update favorites');
    }
  };
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Firestore Example</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Firestore Example</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500 text-center p-4">{error}</div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Firestore Example - Favorite Protocols</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          This example demonstrates using Firestore to save user favorites. Click the bookmark icon to add/remove a protocol from your favorites.
        </p>
        
        <div className="space-y-4">
          {protocols.map(protocol => (
            <div key={protocol.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h3 className="font-medium">{protocol.name}</h3>
                <p className="text-sm text-muted-foreground">{protocol.category}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-medium">${protocol.tvl.toLocaleString()}</p>
                  <p className={`text-sm ${protocol.change_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {protocol.change_24h >= 0 ? '+' : ''}{protocol.change_24h.toFixed(2)}%
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => toggleFavorite(protocol.id)}
                  title={favorites.includes(protocol.id) ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {favorites.includes(protocol.id) ? (
                    <BookmarkCheck className="h-5 w-5 text-blue-500" />
                  ) : (
                    <Bookmark className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
