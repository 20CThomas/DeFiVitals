'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from "framer-motion";
import Image from 'next/image';
import Link from 'next/link';

interface ChainProtocol {
  name: string;
  logo: string;
  category: string;
  tvl: number;
  change_24h: number;
  change_7d?: number;
}

interface SolanaData {
  id: string;
  name: string;
  tvl: number;
  change_24h: number;
  change_7d: number;
  marketCap?: number;
  mcapToTvl?: number;
  protocols: ChainProtocol[];
  logo: string;
  tokenSymbol: string;
}

// Helper function to format numbers
function formatValue(value: number): string {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
}

export default function SolanaPage() {
  const [solanaData, setSolanaData] = useState<SolanaData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/chains/solana');
        if (!response.ok) {
          throw new Error('Failed to fetch Solana data');
        }
        const data = await response.json();
        setSolanaData(data);
      } catch (error) {
        console.error('Error fetching Solana data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-y-auto p-4">
            <div className="container mx-auto px-4 py-8 space-y-8">
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <div className="container mx-auto px-4 py-8 space-y-8">
            <div className="flex items-center gap-4">
              <Link href="/chains">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                Solana
              </h1>
            </div>
            
            {solanaData ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-background/50 border-border/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Total Value Locked</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatValue(solanaData.tvl)}</div>
                      <p className={`text-sm ${solanaData.change_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {solanaData.change_24h >= 0 ? '+' : ''}{solanaData.change_24h.toFixed(2)}% (24h)
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-background/50 border-border/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">7-Day Change</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${solanaData.change_7d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {solanaData.change_7d >= 0 ? '+' : ''}{solanaData.change_7d.toFixed(2)}%
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-background/50 border-border/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Active Protocols</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{solanaData.protocols?.length || 0}</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-background/50 border-border/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Token</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center gap-2">
                      <Image
                        src={solanaData.logo}
                        alt="Solana logo"
                        width={24}
                        height={24}
                        className="rounded-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-logo.png';
                        }}
                      />
                      <div className="text-2xl font-bold">{solanaData.tokenSymbol || 'SOL'}</div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold mb-4">Top Protocols on Solana</h2>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {solanaData.protocols && solanaData.protocols.length > 0 ? (
                      solanaData.protocols.slice(0, 9).map((protocol, index) => (
                        <motion.div
                          key={`${protocol.name}-${index}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <Card className="bg-background/50 border-border/50 hover:border-border transition-colors">
                            <CardContent className="p-6">
                              <div className="flex items-center gap-4 mb-4">
                                <Image
                                  src={protocol.logo}
                                  alt={`${protocol.name} logo`}
                                  width={40}
                                  height={40}
                                  className="rounded-full"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/placeholder-logo.png';
                                  }}
                                />
                                <div>
                                  <h3 className="font-semibold">{protocol.name}</h3>
                                  <p className="text-sm text-muted-foreground">{protocol.category}</p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">TVL</p>
                                  <p className="font-semibold">{formatValue(protocol.tvl)}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">24h Change</p>
                                  <p className={`font-semibold ${protocol.change_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {protocol.change_24h >= 0 ? '+' : ''}{protocol.change_24h.toFixed(2)}%
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))
                    ) : (
                      <div className="col-span-3 text-center py-8 text-muted-foreground">
                        No protocols data available
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-center mt-8">
                  <a 
                    href="https://defillama.com/chain/Solana" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                  >
                    View more on DeFi Llama <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Failed to load Solana data
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
