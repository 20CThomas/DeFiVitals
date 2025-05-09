'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Protocol, fetchProtocols } from '@/services/dataService';
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
import { Sidebar } from '@/components/Sidebar';
import Image from 'next/image';

type SortOption = 'tvl' | 'change_24h' | 'marketCap' | 'name' | 'category' | 'mcap_tvl';
type SortDirection = 'asc' | 'desc';

const SORT_DESCRIPTIONS = {
  tvl: "Total Value Locked in the protocol",
  change_24h: "24-hour change in TVL",
  marketCap: "Market capitalization of the protocol",
  name: "Protocol name",
  category: "Protocol category",
  mcap_tvl: "Market Cap to TVL ratio - Higher ratios may indicate overvaluation"
};

export default function ProtocolsPage() {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('tvl');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [visibleCount, setVisibleCount] = useState(21); // Show 21 protocols initially (3 rows of 3)
  const [loadMoreAmount, setLoadMoreAmount] = useState<string>('21');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchProtocols();
        setProtocols(data || []);
      } catch (error) {
        console.error('Error fetching protocols:', error);
        setProtocols([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatValue = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  // Filter and sort protocols
  const filteredProtocols = (protocols || [])
    .filter(protocol => {
      if (!protocol?.name) return false;
      const searchLower = searchQuery.toLowerCase();
      return (
        protocol.name.toLowerCase().includes(searchLower) ||
        (protocol.category || '').toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = (a.name || '').localeCompare(b.name || '');
          break;
        case 'category':
          comparison = (a.category || '').localeCompare(b.category || '');
          break;
        case 'tvl':
          comparison = (b.tvl || 0) - (a.tvl || 0);
          break;
        case 'change_24h':
          comparison = (b.change_24h || 0) - (a.change_24h || 0);
          break;
        case 'marketCap':
          comparison = (b.marketCap || 0) - (a.marketCap || 0);
          break;
        case 'mcap_tvl':
          const ratioA = a.tvl ? (a.marketCap || 0) / a.tvl : 0;
          const ratioB = b.tvl ? (b.marketCap || 0) / b.tvl : 0;
          comparison = ratioB - ratioA;
          break;
        default:
          return 0;
      }
      return sortDirection === 'desc' ? comparison : -comparison;
    });

  const visibleProtocols = filteredProtocols.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProtocols.length;

  const handleLoadMore = () => {
    const increment = loadMoreAmount === 'all' 
      ? filteredProtocols.length 
      : Math.min(parseInt(loadMoreAmount, 10), filteredProtocols.length - visibleCount);
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
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-8 space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-3xl font-bold">DeFi Protocols</h1>
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search protocols..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Select
                        value={sortBy}
                        onValueChange={(value: SortOption) => setSortBy(value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Sort by..." />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(SORT_DESCRIPTIONS).map(([key, description]) => (
                            <SelectItem key={key} value={key} className="pr-8">
                              <div className="flex items-center justify-between w-full">
                                <span>{key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}</span>
                                <Info className="ml-2 w-4 h-4 cursor-help" />
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TooltipTrigger>
                    <TooltipContent 
                      side="right" 
                      align="start" 
                      className="z-[100]"
                      sideOffset={5}
                    >
                      <p>{SORT_DESCRIPTIONS[sortBy]}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc')}
                  className="relative group mr-4"
                >
                  {sortDirection === 'desc' ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {sortDirection === 'desc' ? 'High to Low' : 'Low to High'}
                  </span>
                </Button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            <motion.div 
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              layout
            >
              {visibleProtocols.map((protocol, index) => (
                <motion.div
                  key={protocol.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="p-6 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-4 mb-4">
                      <Image
                        src={protocol.logo}
                        alt={`${protocol.name} logo`}
                        width={48}
                        height={48}
                        className="rounded-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-logo.png';
                        }}
                      />
                      <div>
                        <h2 className="text-xl font-semibold">{protocol.name}</h2>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{protocol.category}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">TVL</p>
                        <p className="text-lg font-semibold">${(protocol.tvl / 1e9).toFixed(2)}B</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">24h Change</p>
                        <p className={`text-lg font-semibold ${protocol.change_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {protocol.change_24h >= 0 ? '+' : ''}{protocol.change_24h.toFixed(2)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Market Cap</p>
                        <p className="text-lg font-semibold">${(protocol.marketCap / 1e9).toFixed(2)}B</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">MCap/TVL</p>
                        <p className="text-lg font-semibold">{protocol.mcapTvlRatio.toFixed(2)}</p>
                      </div>
                    </div>
                  </Card>
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
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Load..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 More</SelectItem>
                  <SelectItem value="20">20 More</SelectItem>
                  <SelectItem value="50">50 More</SelectItem>
                  <SelectItem value="all">Show All</SelectItem>
                  <SelectItem value="custom">
                    <input
                      type="number"
                      min="1"
                      max={filteredProtocols.length - visibleCount}
                      className="w-20 px-2 py-1 border rounded"
                      onChange={(e) => setLoadMoreAmount(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={handleLoadMore}
                className="px-8"
              >
                Load More
              </Button>
            </div>
          )}

          {filteredProtocols.length === 0 && (
            <div className="text-center text-zinc-500 dark:text-zinc-400 py-8">
              No protocols found matching your search.
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 