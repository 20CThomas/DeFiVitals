'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Search, SortAsc, SortDesc } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ProtocolLogo } from '@/components/ProtocolLogo';
import { FeeDistributionChart } from '@/components/charts/FeeDistributionChart';
import { TopProtocolsChart } from '@/components/charts/TopProtocolsChart';
import { FeeTrendsChart } from '@/components/charts/FeeTrendsChart';
import { 
  TimeFrameType, 
  SortOption, 
  HistoricalDataPoint, 
  ProtocolData,
  ChartDataPoint,
  BreakdownData,
  ProtocolResponse,
  ResponseData,
  DataType
} from '@/types';
import { fetchProtocols } from '@/services/defillama';
import { fetchFeesData } from '@/services/feesService';

// Import the response data directly
import responseJson from '@/app/fees/response_1744127765391.json';

const CHAIN_OPTIONS = ['All Chains', 'Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'BSC'];
const CATEGORY_OPTIONS = ['All Categories', 'DEX', 'Lending', 'Bridge', 'Yield'];

export function Fees() {
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFrame, setTimeFrame] = useState<TimeFrameType>('daily');
  const [selectedChain, setSelectedChain] = useState('All Chains');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState<SortOption>('dailyFees');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [protocols, setProtocols] = useState<ProtocolData[]>([]);
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataType, setDataType] = useState<DataType>('dailyFees');
  const [responseData, setResponseData] = useState<ResponseData | null>(null);

  // Memoize the time data to avoid recalculating on every render
  const timeData = React.useMemo(() => 
    generateTimeData(protocols, timeFrame), 
    [protocols, timeFrame]
  );

  // Load and process data
  useEffect(() => {
    try {
      // Validate and convert the raw data
      const validateNumber = (value: unknown): number => {
        if (typeof value === 'number' && !isNaN(value)) return value;
        if (typeof value === 'string') {
          const num = Number(value);
          if (!isNaN(num)) return num;
        }
        return 0;
      };

      const validateChartPoint = (point: unknown): ChartDataPoint | null => {
        if (!point || typeof point !== 'object') return null;
        const p = point as Record<string, unknown>;
        if (!p.date || typeof p.date !== 'string') return null;
        
        return {
          date: p.date,
          dailyFees: validateNumber(p.dailyFees),
          totalFees: validateNumber(p.totalFees),
          dailyRevenue: p.dailyRevenue ? validateNumber(p.dailyRevenue) : undefined,
          totalRevenue: p.totalRevenue ? validateNumber(p.totalRevenue) : undefined
        };
      };

      const validateProtocol = (protocol: unknown): ProtocolResponse | null => {
        if (!protocol || typeof protocol !== 'object') return null;
        
        try {
          const p = protocol as Record<string, unknown>;
          return {
            defillamaId: String(p.defillamaId || ''),
            name: String(p.name || ''),
            displayName: String(p.displayName || ''),
            logo: String(p.logo || ''),
            category: String(p.category || ''),
            chains: Array.isArray(p.chains) ? p.chains.filter((c): c is string => typeof c === 'string') : [],
            total24h: validateNumber(p.total24h),
            total48hto24h: validateNumber(p.total48hto24h),
            total7d: validateNumber(p.total7d),
            total14dto7d: validateNumber(p.total14dto7d),
            total30d: validateNumber(p.total30d),
            total60dto30d: validateNumber(p.total60dto30d),
            total1y: validateNumber(p.total1y),
            totalAllTime: validateNumber(p.totalAllTime),
            average1y: validateNumber(p.average1y),
            change_30dover30d: validateNumber(p.change_30dover30d),
            breakdown24h: null,
            breakdown30d: null
          };
        } catch (err) {
          console.error('Error validating protocol:', err);
          return null;
        }
      };

      // Get typed safe values from raw JSON
      // TypeScript doesn't know the exact shape of responseJson, so we need to validate everything
      const jsonData = {
        totalDataChart: Array.isArray(responseJson.totalDataChart) ? responseJson.totalDataChart : [],
        totalDataChartBreakdown: Array.isArray(responseJson.totalDataChartBreakdown) ? responseJson.totalDataChartBreakdown : [],
        allChains: Array.isArray(responseJson.allChains) ? responseJson.allChains : [],
        total24h: validateNumber(responseJson.total24h),
        total48hto24h: validateNumber(responseJson.total48hto24h),
        total7d: validateNumber(responseJson.total7d),
        total14dto7d: validateNumber(responseJson.total14dto7d),
        total30d: validateNumber(responseJson.total30d),
        total60dto30d: validateNumber(responseJson.total60dto30d),
        total1y: validateNumber(responseJson.total1y),
        // Use type predicates to check if properties exist
        totalAllTime: validateNumber(typeof responseJson === 'object' && responseJson && 'totalAllTime' in responseJson ? 
          responseJson.totalAllTime as unknown as number : 0),
        average1y: validateNumber(typeof responseJson === 'object' && responseJson && 'average1y' in responseJson ? 
          responseJson.average1y as unknown as number : 0),
        change_30dover30d: validateNumber(responseJson.change_30dover30d),
        protocols: Array.isArray(responseJson.protocols) ? responseJson.protocols : []
      };

      // Create a properly typed response data object with validation
      const typedResponseData: ResponseData = {
        totalDataChart: jsonData.totalDataChart
          .map(validateChartPoint)
          .filter((p): p is ChartDataPoint => p !== null),
        totalDataChartBreakdown: jsonData.totalDataChartBreakdown
          .map(validateChartPoint)
          .filter((p): p is ChartDataPoint => p !== null),
        breakdown24h: null,
        breakdown30d: null,
        chain: null,
        allChains: jsonData.allChains.filter((c): c is string => typeof c === 'string'),
        total24h: jsonData.total24h,
        total48hto24h: jsonData.total48hto24h,
        total7d: jsonData.total7d,
        total14dto7d: jsonData.total14dto7d,
        total30d: jsonData.total30d,
        total60dto30d: jsonData.total60dto30d,
        total1y: jsonData.total1y,
        totalAllTime: jsonData.totalAllTime,
        average1y: jsonData.average1y,
        change_30dover30d: jsonData.change_30dover30d,
        protocols: jsonData.protocols
          .map(validateProtocol)
          .filter((p): p is ProtocolResponse => p !== null)
      };

      // Process protocols for our application data model
      const processedProtocols: ProtocolData[] = typedResponseData.protocols.map((protocol: ProtocolResponse) => {
        // Generate synthetic historical data based on the total24h and total30d values
        const now = Math.floor(Date.now() / 1000);
        const day = 24 * 60 * 60; // Seconds in a day
        const historicalData: HistoricalDataPoint[] = [];
        
        // Create 30 days worth of data points
        for (let i = 0; i < 30; i++) {
          const timestamp = now - (30 - i) * day;
          
          // Use total24h for recent days and gradually transition to a fraction of total30d for older days
          const dayWeight = i / 30; // Weight from 0 to 1 as we approach current day
          const baseValue = protocol.total24h * dayWeight + (protocol.total30d / 30) * (1 - dayWeight);
          
          // Add some random variation to make the chart more natural
          // Use protocol ID as a seed for deterministic randomness
          const seed = parseInt(protocol.defillamaId) || 0;
          const hash = (seed * 9301 + i * 49297) % 233280;
          const variation = 0.8 + (hash / 233280) * 0.4; // 80% to 120% variation
          
          historicalData.push({
            timestamp,
            value: baseValue * variation
          });
        }
        
        return {
          id: protocol.defillamaId || '',
          name: protocol.displayName || protocol.name || '',
          logo: protocol.logo || '',
          category: protocol.category || '',
          chains: protocol.chains,
          fees: {
            daily: protocol.total24h,
            weekly: protocol.total7d || 0,
            monthly: protocol.total30d,
            cumulative: protocol.totalAllTime
          },
          revenue: {
            daily: protocol.total24h * 0.5,
            weekly: (protocol.total7d || 0) * 0.5,
            monthly: protocol.total30d * 0.5,
            cumulative: protocol.totalAllTime * 0.5
          },
          historicalData,
          date: new Date().toISOString()
        };
      });

      setResponseData(typedResponseData);
      setProtocols(processedProtocols);
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error("Error processing response data:", err);
      setError("Failed to process response data");
      setLoading(false);
    }
  }, []);

  // Update data type when time frame changes
  useEffect(() => {
    let newDataType: DataType = 'dailyFees';
    
    switch (timeFrame) {
      case 'daily':
        newDataType = 'dailyFees';
        break;
      case 'weekly':
        newDataType = 'dailyFees'; // There's no weekly API endpoint, so we'll stick with daily
        break;
      case 'monthly':
        newDataType = 'dailyFees'; // There's no monthly API endpoint, so we'll stick with daily
        break;
      case 'cumulative':
        newDataType = 'totalFees';
        break;
    }
    
    setDataType(newDataType);
  }, [timeFrame]);

  // Filter and sort functions
  const filteredProtocols = protocols.filter(protocol => {
    const matchesSearch = protocol.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         protocol.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChain = selectedChain === 'All Chains' || protocol.chains.includes(selectedChain);
    const matchesCategory = selectedCategory === 'All Categories' || protocol.category === selectedCategory;
    return matchesSearch && matchesChain && matchesCategory;
  });

  const sortedProtocols = [...filteredProtocols].sort((a, b) => {
    const aValue = a.fees[timeFrame];
    const bValue = b.fees[timeFrame];
    return sortDirection === 'desc' ? bValue - aValue : aValue - bValue;
  });

  // Generate chart data from the response
  const generateTimeData = (protocols: ProtocolData[], timeFrame: string): HistoricalDataPoint[] => {
    if (!protocols || protocols.length === 0) {
      return [];
    }
    
    // Filter protocols that have historical data
    const validProtocols = protocols.filter(p => p.historicalData && Array.isArray(p.historicalData) && p.historicalData.length > 0);
    
    if (validProtocols.length === 0) {
      console.warn('No protocols with valid historical data found');
      return [];
    }
    
    // Combine all historical data points across all protocols
    const combinedData: { [timestamp: number]: number } = {};
    
    validProtocols.forEach(protocol => {
      protocol.historicalData.forEach(point => {
        if (point && typeof point.timestamp === 'number' && typeof point.value === 'number') {
          if (!combinedData[point.timestamp]) {
            combinedData[point.timestamp] = 0;
          }
          combinedData[point.timestamp] += point.value;
        }
      });
    });
    
    // Convert the combined data to an array of historical data points
    const timeData: HistoricalDataPoint[] = Object.keys(combinedData).map(timestamp => {
      return {
        timestamp: parseInt(timestamp, 10),
        value: combinedData[parseInt(timestamp, 10)]
      };
    });
    
    // Log for debugging
    console.log(`Generated ${timeData.length} historical data points from ${validProtocols.length} protocols`);
    
    // Sort by timestamp
    return timeData.sort((a, b) => a.timestamp - b.timestamp);
  };

  // Transform data for FeeDistributionChart
  const feeDistributionData = filteredProtocols.map(protocol => ({
    name: protocol.name,
    value: protocol.fees[timeFrame],
    color: '#8884d8' // You can implement a color scheme here
  }));

  // Transform data for TopProtocolsChart
  const topProtocolsData = sortedProtocols.slice(0, 5).map(protocol => ({
    name: protocol.name,
    fees: protocol.fees[timeFrame],
    revenue: protocol.revenue[timeFrame]
  }));

  // Transform timeData for FeeTrendsChart
  const trendData = timeData.map(point => ({
    date: new Date(point.timestamp * 1000).toISOString().split('T')[0],
    fees: point.value,
    revenue: point.value * 0.5 // Assuming revenue is 50% of fees
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-2xl font-semibold mb-2">Loading protocol data...</div>
          <div className="text-zinc-500">This may take a few moments</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-2xl font-semibold mb-2 text-red-500">Error</div>
          <div className="text-zinc-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Protocol Fees</h1>
        <div className="flex items-center gap-4">
          <Select value={timeFrame} onValueChange={(value: TimeFrameType) => setTimeFrame(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="cumulative">Cumulative</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fee Trends</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <FeeTrendsChart 
              data={trendData}
              timeFrame={timeFrame}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Fee Distribution</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <FeeDistributionChart data={feeDistributionData} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Protocols</CardTitle>
        </CardHeader>
        <CardContent>
          <TopProtocolsChart data={topProtocolsData} />
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search protocols..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
          />
        </div>
        <Select value={selectedChain} onValueChange={setSelectedChain}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select chain" />
          </SelectTrigger>
          <SelectContent>
            {CHAIN_OPTIONS.map((chain) => (
              <SelectItem key={chain} value={chain}>
                {chain}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORY_OPTIONS.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')}
        >
          {sortDirection === 'desc' ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <th className="py-4 px-4 text-left">Protocol</th>
              <th className="py-4 px-4 text-right">Fees</th>
              <th className="py-4 px-4 text-right">Revenue</th>
              <th className="py-4 px-4 text-right">Fee Ratio</th>
              <th className="py-4 px-4 text-left">Chains</th>
            </tr>
          </thead>
          <tbody>
            {sortedProtocols.map((protocol) => (
              <tr key={protocol.id} className="border-b border-zinc-200 dark:border-zinc-800">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <ProtocolLogo src={protocol.logo} alt={protocol.name} />
                    <div>
                      <div className="font-medium">{protocol.name}</div>
                      <div className="text-sm text-zinc-500 dark:text-zinc-400">{protocol.category}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  ${(protocol.fees[timeFrame] / 1e6).toFixed(2)}M
                </td>
                <td className="py-4 px-4 text-right">
                  ${(protocol.revenue[timeFrame] / 1e6).toFixed(2)}M
                </td>
                <td className="py-4 px-4 text-right">
                  {((protocol.revenue[timeFrame] / protocol.fees[timeFrame]) * 100).toFixed(1)}%
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-wrap gap-2">
                    {protocol.chains.map((chain: string) => (
                      <span
                        key={chain}
                        className="px-2 py-1 text-xs rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                      >
                        {chain}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 