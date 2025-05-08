'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { Search, SortAsc, SortDesc, Info } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';
import Link from 'next/link';

// Define chain data type
interface Chain {
  id: string;
  name: string;
  tvl: number;
  change_24h: number;
  change_7d: number;
  protocols: number;
  logo: string;
  tokenSymbol: string;
}

interface ChainResponse {
  id?: string;
  name: string;
  tvl?: number;
  change_24h?: number;
  change_7d?: number;
  protocols?: number | { length: number };
  logo?: string;
  tokenSymbol?: string;
}

type SortOption = 'tvl' | 'change_24h' | 'change_7d' | 'name' | 'protocols';
type SortDirection = 'asc' | 'desc';

const SORT_DESCRIPTIONS = {
  tvl: "Total Value Locked in the chain",
  change_24h: "24-hour change in TVL",
  change_7d: "7-day change in TVL",
  name: "Chain name",
  protocols: "Number of protocols on the chain"
};

// Mock data for chains
const MOCK_CHAINS: Chain[] = [
  {
    id: '1',
    name: 'Ethereum',
    tvl: 42500000000,
    change_24h: -2.3,
    change_7d: 5.1,
    protocols: 349,
    logo: 'https://defillama.com/chain-icons/rsz_ethereum.jpg',
    tokenSymbol: 'ETH'
  },
  {
    id: '2',
    name: 'Tron',
    tvl: 7200000000,
    change_24h: 0.8,
    change_7d: -1.2,
    protocols: 42,
    logo: 'https://defillama.com/chain-icons/rsz_tron.jpg',
    tokenSymbol: 'TRX'
  },
  {
    id: '3',
    name: 'Binance',
    tvl: 5100000000,
    change_24h: -1.5,
    change_7d: -3.7,
    protocols: 247,
    logo: 'https://defillama.com/chain-icons/rsz_binance.jpg',
    tokenSymbol: 'BNB'
  },
  {
    id: '4',
    name: 'Arbitrum',
    tvl: 3800000000,
    change_24h: 1.2,
    change_7d: 8.4,
    protocols: 163,
    logo: 'https://defillama.com/chain-icons/rsz_arbitrum.jpg',
    tokenSymbol: 'ARB'
  },
  {
    id: '5',
    name: 'Solana',
    tvl: 2650000000,
    change_24h: 3.4,
    change_7d: 15.2,
    protocols: 83,
    logo: 'https://defillama.com/chain-icons/rsz_solana.jpg',
    tokenSymbol: 'SOL'
  },
  {
    id: '6',
    name: 'Polygon',
    tvl: 2350000000,
    change_24h: -0.7,
    change_7d: 2.9,
    protocols: 177,
    logo: 'https://defillama.com/chain-icons/rsz_polygon.jpg',
    tokenSymbol: 'MATIC'
  },
  {
    id: '7',
    name: 'Avalanche',
    tvl: 1980000000,
    change_24h: 0.2,
    change_7d: 4.5,
    protocols: 145,
    logo: 'https://defillama.com/chain-icons/rsz_avalanche.jpg',
    tokenSymbol: 'AVAX'
  },
  {
    id: '8',
    name: 'Optimism',
    tvl: 1750000000,
    change_24h: 2.1,
    change_7d: 9.8,
    protocols: 93,
    logo: 'https://defillama.com/chain-icons/rsz_optimism.jpg',
    tokenSymbol: 'OP'
  },
  {
    id: '9',
    name: 'Base',
    tvl: 830000000,
    change_24h: 5.6,
    change_7d: 21.3,
    protocols: 54,
    logo: 'https://defillama.com/chain-icons/rsz_base.jpg',
    tokenSymbol: 'ETH'
  },
  {
    id: '10',
    name: 'Sui',
    tvl: 610000000,
    change_24h: 8.2,
    change_7d: 17.9,
    protocols: 34,
    logo: 'https://defillama.com/chain-icons/rsz_sui.jpg',
    tokenSymbol: 'SUI'
  }
];

// Add this function at the top level, after imports
function formatValue(value: number): string {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
}

// Add this component at the top level
function ChainCard({ chain }: { chain: Chain }) {
  // Determine if this chain has a dedicated page
  const hasDedicatedPage = ['Solana', 'Polygon'].includes(chain.name);
  
  // Create the card content
  const cardContent = (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg transform group-hover:scale-105 transition-transform duration-300" />
      <Card className="relative overflow-hidden backdrop-blur-sm bg-background/50 border-border/50 group-hover:border-border/80 transition-colors">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-sm" />
              <Image
                src={chain.logo}
                alt={`${chain.name} logo`}
                width={48}
                height={48}
                className="relative rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-logo.png';
                }}
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{chain.name}</h2>
              <p className="text-sm text-muted-foreground">{chain.tokenSymbol}</p>
            </div>
            <div className="ml-auto text-right">
              <p className={`text-lg font-semibold ${chain.change_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {chain.change_24h >= 0 ? '+' : ''}{chain.change_24h.toFixed(2)}%
              </p>
              <p className="text-sm text-muted-foreground">24h Change</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">TVL</p>
              <p className="text-2xl font-bold text-foreground">{formatValue(chain.tvl)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">7d Change</p>
              <p className={`text-2xl font-bold ${chain.change_7d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {chain.change_7d >= 0 ? '+' : ''}{chain.change_7d.toFixed(2)}%
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">Active Protocols</p>
              <p className="text-lg font-semibold text-foreground">{chain.protocols}</p>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                style={{ width: `${Math.min(100, (chain.protocols / 400) * 100)}%` }}
              />
            </div>
          </div>
          
          {hasDedicatedPage && (
            <div className="mt-4 text-center">
              <Link 
                href={`/chains/${chain.name.toLowerCase()}`}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                View Details
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
  
  // If the chain has a dedicated page, wrap it in a Link
  if (hasDedicatedPage) {
    return cardContent;
  }
  
  return cardContent;
}

export default function ChainsPage() {
  const [chains, setChains] = useState<Chain[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('tvl');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [visibleCount, setVisibleCount] = useState(9);
  const [loadMoreAmount, setLoadMoreAmount] = useState<string>('9');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch real chain data
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch all chains data
        const response = await fetch('/api/chains');
        if (!response.ok) {
          throw new Error('Failed to fetch chain data');
        }
        const allChains = await response.json();
        
        // Fetch specific data for Solana and Polygon
        const [solanaRes, polygonRes] = await Promise.all([
          fetch('/api/chains/solana'),
          fetch('/api/chains/polygon')
        ]);
        
        // Process the data
        let chainData = [...MOCK_CHAINS]; // Start with mock data as fallback
        
        if (response.ok && allChains.length > 0) {
          // Replace with real data if available
          chainData = allChains.map((chain: ChainResponse) => ({
            id: chain.id || chain.name.toLowerCase(),
            name: chain.name,
            tvl: chain.tvl || 0,
            change_24h: chain.change_24h || 0,
            change_7d: chain.change_7d || 0,
            protocols: chain.protocols || 0,
            logo: chain.logo || `https://defillama.com/chain-icons/rsz_${chain.name.toLowerCase()}.jpg`,
            tokenSymbol: chain.tokenSymbol || ''
          }));
        }
        
        // Enhance Solana data if available
        if (solanaRes.ok) {
          const solanaData = await solanaRes.json();
          const solanaIndex = chainData.findIndex(c => c.name.toLowerCase() === 'solana');
          
          if (solanaIndex >= 0 && solanaData) {
            chainData[solanaIndex] = {
              ...chainData[solanaIndex],
              tvl: solanaData.tvl || chainData[solanaIndex].tvl,
              change_24h: solanaData.change_24h || chainData[solanaIndex].change_24h,
              change_7d: solanaData.change_7d || chainData[solanaIndex].change_7d,
              protocols: solanaData.protocols?.length || chainData[solanaIndex].protocols
            };
          }
        }
        
        // Enhance Polygon data if available
        if (polygonRes.ok) {
          const polygonData = await polygonRes.json();
          const polygonIndex = chainData.findIndex(c => c.name.toLowerCase() === 'polygon');
          
          if (polygonIndex >= 0 && polygonData) {
            chainData[polygonIndex] = {
              ...chainData[polygonIndex],
              tvl: polygonData.tvl || chainData[polygonIndex].tvl,
              change_24h: polygonData.change_24h || chainData[polygonIndex].change_24h,
              change_7d: polygonData.change_7d || chainData[polygonIndex].change_7d,
              protocols: polygonData.protocols?.length || chainData[polygonIndex].protocols
            };
          }
        }
        
        setChains(chainData);
      } catch (error) {
        console.error('Error fetching chain data:', error);
        // Fallback to mock data
        setChains(MOCK_CHAINS);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter and sort chains
  const filteredChains = chains
    .filter(chain => {
      const searchLower = searchQuery.toLowerCase();
      return (
        chain.name.toLowerCase().includes(searchLower) ||
        chain.tokenSymbol.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'tvl':
          comparison = b.tvl - a.tvl;
          break;
        case 'change_24h':
          comparison = b.change_24h - a.change_24h;
          break;
        case 'change_7d':
          comparison = b.change_7d - a.change_7d;
          break;
        case 'protocols':
          comparison = b.protocols - a.protocols;
          break;
        default:
          return 0;
      }
      return sortDirection === 'desc' ? comparison : -comparison;
    });

  const visibleChains = filteredChains.slice(0, visibleCount);
  const hasMore = visibleCount < filteredChains.length;

  const handleLoadMore = () => {
    const increment = loadMoreAmount === 'all' 
      ? filteredChains.length 
      : Math.min(parseInt(loadMoreAmount, 10), filteredChains.length - visibleCount);
    setVisibleCount(prev => prev + increment);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
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
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                  Blockchain Networks
                </h1>
                <p className="text-muted-foreground mt-2">
                  Explore and analyze different blockchain networks and their metrics
                </p>
              </div>
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search chains..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-muted-foreground"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Select
                          value={sortBy}
                          onValueChange={(value: SortOption) => setSortBy(value)}
                        >
                          <SelectTrigger className="w-[180px] bg-background/50 border-border">
                            <SelectValue placeholder="Sort by">
                              <div className="flex items-center gap-2">
                                {sortBy.charAt(0).toUpperCase() + sortBy.slice(1).replace('_', ' ')}
                                <Info className="w-4 h-4" />
                              </div>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(SORT_DESCRIPTIONS).map(([key, description]) => (
                              <SelectItem key={key} value={key}>
                                <div className="flex items-center gap-2">
                                  {key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TooltipTrigger>
                      <TooltipContent side="right" align="start" sideOffset={10} className="max-w-[250px]">
                        <p>{SORT_DESCRIPTIONS[sortBy]}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc')}
                          className="bg-background/50 border-border"
                        >
                          {sortDirection === 'desc' ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" align="center">
                        {sortDirection === 'desc' ? 'High to Low' : 'Low to High'}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {isLoading
                  ? Array.from({ length: 9 }).map((_, index) => (
                      <motion.div
                        key={`skeleton-${index}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="relative group">
                          <Card className="relative overflow-hidden bg-background/50 border-border/50">
                            <CardContent className="p-6 space-y-6">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
                                <div className="space-y-2 flex-1">
                                  <div className="h-5 w-24 bg-muted rounded animate-pulse" />
                                  <div className="h-4 w-12 bg-muted rounded animate-pulse" />
                                </div>
                                <div className="space-y-2">
                                  <div className="h-5 w-16 bg-muted rounded animate-pulse" />
                                  <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <div className="h-4 w-8 bg-muted rounded animate-pulse" />
                                  <div className="h-8 w-20 bg-muted rounded animate-pulse" />
                                </div>
                                <div className="space-y-2">
                                  <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                                  <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                                  <div className="h-4 w-8 bg-muted rounded animate-pulse" />
                                </div>
                                <div className="h-2 bg-muted rounded-full" />
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </motion.div>
                    ))
                  : filteredChains.slice(0, visibleCount).map((chain) => (
                      <motion.div
                        key={chain.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChainCard chain={chain} />
                      </motion.div>
                    ))}
              </AnimatePresence>
            </div>

            {!isLoading && visibleCount < filteredChains.length && (
              <div className="flex justify-center mt-8 gap-4">
                <Select
                  value={loadMoreAmount}
                  onValueChange={setLoadMoreAmount}
                >
                  <SelectTrigger className="w-[120px] bg-background/50 border-border">
                    <SelectValue>{loadMoreAmount} More</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 More</SelectItem>
                    <SelectItem value="6">6 More</SelectItem>
                    <SelectItem value="9">9 More</SelectItem>
                  </SelectContent>
                </Select>

                <Button 
                  onClick={handleLoadMore} 
                  variant="outline" 
                  className="bg-background/50 border-border"
                >
                  Load More
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
} 