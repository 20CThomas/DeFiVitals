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
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg transform group-hover:scale-105 transition-transform duration-300" />
      <Card className="relative overflow-hidden backdrop-blur-sm bg-zinc-900/50 border-zinc-800/50 group-hover:border-zinc-700/50 transition-colors">
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
              <h2 className="text-xl font-semibold text-white">{chain.name}</h2>
              <p className="text-sm text-zinc-400">{chain.tokenSymbol}</p>
            </div>
            <div className="ml-auto text-right">
              <p className={`text-lg font-semibold ${chain.change_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {chain.change_24h >= 0 ? '+' : ''}{chain.change_24h.toFixed(2)}%
              </p>
              <p className="text-sm text-zinc-400">24h Change</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-zinc-400 mb-1">TVL</p>
              <p className="text-2xl font-bold text-white">{formatValue(chain.tvl)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-400 mb-1">7d Change</p>
              <p className={`text-2xl font-bold ${chain.change_7d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {chain.change_7d >= 0 ? '+' : ''}{chain.change_7d.toFixed(2)}%
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-zinc-400">Active Protocols</p>
              <p className="text-lg font-semibold text-white">{chain.protocols}</p>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                style={{ width: `${Math.min(100, (chain.protocols / 400) * 100)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
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
    // Simulate loading data
    const fetchData = async () => {
      setIsLoading(true);
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      setChains(MOCK_CHAINS);
      setIsLoading(false);
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
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-900 to-zinc-950">
        <Header />
        <div className="container mx-auto px-4 py-8 space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                Blockchain Networks
              </h1>
              <p className="text-zinc-400 mt-2">
                Explore and analyze different blockchain networks and their metrics
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search chains..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-500"
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
                        <SelectTrigger className="w-[180px] bg-zinc-900/50 border-zinc-800">
                          <SelectValue placeholder="Sort by..." />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(SORT_DESCRIPTIONS).map(([key, description]) => (
                            <SelectItem key={key} value={key}>
                              <div className="flex items-center gap-2">
                                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                                <Info className="w-4 h-4" />
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-[300px] z-[100]">
                      <p>{SORT_DESCRIPTIONS[sortBy]}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc')}
                  className="relative group bg-zinc-900/50 border-zinc-800"
                >
                  {sortDirection === 'desc' ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            <motion.div 
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              layout
            >
              {visibleChains.map((chain, index) => (
                <motion.div
                  key={chain.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ChainCard chain={chain} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {hasMore && (
            <div className="flex justify-center mt-8 gap-4">
              <Select
                value={loadMoreAmount}
                onValueChange={setLoadMoreAmount}
              >
                <SelectTrigger className="w-[120px] bg-zinc-900/50 border-zinc-800">
                  <SelectValue placeholder="Load..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 More</SelectItem>
                  <SelectItem value="6">6 More</SelectItem>
                  <SelectItem value="9">9 More</SelectItem>
                  <SelectItem value="all">Show All</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={handleLoadMore}
                className="px-8 bg-zinc-900/50 border-zinc-800"
              >
                Load More
              </Button>
            </div>
          )}

          {filteredChains.length === 0 && (
            <div className="text-center text-zinc-400 py-8">
              No chains found matching your search.
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 