'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { LiquidStakingPlatform, fetchLiquidStakingPlatforms } from '@/services/dataService';
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

type SortOption = 'score' | 'tvl' | 'change24h' | 'stakingRatio' | 'liquidityDepth' | 'utilizationRate';
type SortDirection = 'asc' | 'desc';

const SORT_DESCRIPTIONS = {
  score: "Overall health score based on multiple metrics including liquidity, utilization, and stability",
  tvl: "Total Value Locked - The total amount of assets locked in the protocol",
  change24h: "24-hour change in TVL",
  stakingRatio: "Ratio of staked tokens to total supply - Higher is generally better",
  liquidityDepth: "Depth of liquidity pools - Indicates ability to handle large transactions",
  utilizationRate: "How efficiently the protocol's assets are being used"
};

export function LiquidStaking() {
  const [platforms, setPlatforms] = useState<LiquidStakingPlatform[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('score');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [visibleCount, setVisibleCount] = useState(8);
  const [loadMoreAmount, setLoadMoreAmount] = useState<string>('10');

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-500'; // Bright green for excellent
    if (score >= 80) return 'bg-green-600'; // Slightly darker green for very good
    if (score >= 70) return 'bg-lime-500'; // Lime for good
    if (score >= 60) return 'bg-yellow-500'; // Yellow for above average
    if (score >= 50) return 'bg-yellow-600'; // Darker yellow for average
    if (score >= 40) return 'bg-orange-500'; // Orange for below average
    if (score >= 30) return 'bg-orange-600'; // Darker orange for poor
    if (score >= 20) return 'bg-red-500'; // Red for very poor
    return 'bg-red-700'; // Dark red for critical
  };

  const getHealthScoreOpacity = (score: number) => {
    // Increase base opacity for better visibility
    const baseOpacity = 0.8;
    const variableOpacity = 0.2;
    return baseOpacity + (variableOpacity * (score / 100));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchLiquidStakingPlatforms();
        setPlatforms(data || []);
      } catch (error) {
        console.error('Error fetching platforms:', error);
        setPlatforms([]);
      }
    };
    fetchData();
  }, []);

  // Filter and sort platforms
  const filteredPlatforms = (platforms || [])
    .filter(platform => {
      if (!platform?.name || !platform?.chain) return false;
      const searchLower = searchQuery.toLowerCase();
      return (
        platform.name.toLowerCase().includes(searchLower) ||
        platform.chain.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'score':
          comparison = (b.healthScore || 0) - (a.healthScore || 0);
          break;
        case 'tvl':
          comparison = (b.tvl || 0) - (a.tvl || 0);
          break;
        case 'change24h':
          comparison = (b.change24h || 0) - (a.change24h || 0);
          break;
        case 'stakingRatio':
          comparison = (b.stakingRatio || 0) - (a.stakingRatio || 0);
          break;
        case 'liquidityDepth':
          comparison = (b.liquidityDepth || 0) - (a.liquidityDepth || 0);
          break;
        case 'utilizationRate':
          comparison = (b.utilizationRate || 0) - (a.utilizationRate || 0);
          break;
        default:
          return 0;
      }
      return sortDirection === 'desc' ? comparison : -comparison;
    });

  const visiblePlatforms = filteredPlatforms.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPlatforms.length;

  const handleLoadMore = () => {
    const increment = loadMoreAmount === 'all' 
      ? filteredPlatforms.length 
      : Math.min(parseInt(loadMoreAmount, 10), filteredPlatforms.length - visibleCount);
    setVisibleCount(prev => prev + increment);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold">Liquid Staking Platforms</h1>
        <div className="flex gap-4 items-center mr-4">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search platforms..."
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
                <TooltipContent 
                  side="right" 
                  className="max-w-[300px] z-[100]"
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
              className="relative group"
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
          className="grid gap-6 md:grid-cols-2"
          layout
        >
          {visiblePlatforms.map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="p-6 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <Image
                      src={platform.logo}
                      alt={`${platform.name} logo`}
                      width={48}
                      height={48}
                      className="rounded-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-logo.png';
                      }}
                    />
                    <div>
                      <h2 className="text-xl font-semibold">{platform.name}</h2>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">{platform.chain}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className={`text-sm font-medium ${platform.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {platform.change24h >= 0 ? '+' : ''}{platform.change24h?.toFixed(2)}% 24h
                    </div>
                    <div 
                      className={`ml-4 w-12 h-12 rounded-full flex items-center justify-center ${getHealthScoreColor(platform.healthScore)}`}
                      style={{ opacity: getHealthScoreOpacity(platform.healthScore) }}
                    >
                      <span className="text-white font-bold">{platform.healthScore}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">TVL</p>
                    <p className="text-lg font-semibold">${(platform.tvl / 1e9).toFixed(2)}B</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                      Recommended Staking Ratio
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="inline-block w-4 h-4 ml-1 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-[300px] p-2">
                            <p>Our recommended ratio of tokens that should be staked based on protocol type and market conditions. For liquid staking protocols, we recommend 30-70% to balance liquidity needs with staking rewards. Lower ratios may indicate underutilization while higher ratios could impact liquidity.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </p>
                    <p className="text-lg font-semibold">{(platform.stakingRatio * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Liquidity Depth</p>
                    <p className="text-lg font-semibold">${(platform.liquidityDepth / 1e9).toFixed(2)}B</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Utilization Rate</p>
                    <p className="text-lg font-semibold">{(platform.utilizationRate * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Avg. Slippage</p>
                    <p className="text-lg font-semibold">{(platform.averageSlippage * 100).toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Withdrawal Time</p>
                    <p className="text-lg font-semibold">{platform.withdrawalTime}h</p>
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
                  max={filteredPlatforms.length - visibleCount}
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

      {filteredPlatforms.length === 0 && (
        <div className="text-center text-zinc-500 dark:text-zinc-400 py-8">
          No platforms found matching your search.
        </div>
      )}
    </div>
  );
} 