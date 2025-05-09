import axios from 'axios';

export type DataType = 'totalFees' | 'dailyFees' | 'totalRevenue' | 'dailyRevenue';

export interface ProtocolFee {
  id: string;
  name: string;
  logo: string;
  category: string;
  chains: string[];
  dailyFees: number;
  weeklyFees: number;
  monthlyFees: number;
  totalFees: number;
  dailyRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  totalRevenue: number;
  date: string;
}

export interface HistoricalDataPoint {
  timestamp: number;
  value: number;
  breakdown?: Record<string, number>;
}

interface ApiResponse {
  totalDataChart: Array<[number, number]>;
  totalDataChartBreakdown: Array<[number, Record<string, number>]>;
  protocols: Array<{
    name: string;
    logo: string;
    chains: string[];
    total24h: number;
    total7d: number;
    total30d: number;
    totalAllTime: number;
  }>;
}

export const fetchFeesData = async (dataType: DataType = 'dailyFees', includeHistorical: boolean = false): Promise<{
  protocols: ProtocolFee[];
  historicalData?: HistoricalDataPoint[];
}> => {
  try {
    const response = await axios.get<ApiResponse>('https://api.llama.fi/overview/fees', {
      params: {
        excludeTotalDataChart: !includeHistorical,
        excludeTotalDataChartBreakdown: !includeHistorical,
        dataType
      }
    });
    
    if (!response.data || !response.data.protocols) {
      throw new Error('Invalid API response structure');
    }
    
    const protocols = response.data.protocols.map(protocol => ({
      id: protocol.name.toLowerCase().replace(/\s+/g, '-'),
      name: protocol.name,
      logo: protocol.logo,
      category: getProtocolCategory(protocol.name),
      chains: protocol.chains,
      dailyFees: protocol.total24h,
      weeklyFees: protocol.total7d,
      monthlyFees: protocol.total30d,
      totalFees: protocol.totalAllTime,
      dailyRevenue: protocol.total24h * 0.3,
      weeklyRevenue: protocol.total7d * 0.3,
      monthlyRevenue: protocol.total30d * 0.3,
      totalRevenue: protocol.totalAllTime * 0.3,
      date: new Date().toISOString().split('T')[0]
    }));

    let historicalData: HistoricalDataPoint[] | undefined;
    if (includeHistorical && response.data.totalDataChart) {
      historicalData = response.data.totalDataChart.map(([timestamp, value]) => ({
        timestamp,
        value,
        breakdown: response.data.totalDataChartBreakdown?.find(([t]) => t === timestamp)?.[1]
      }));
    }

    return {
      protocols,
      historicalData
    };
  } catch (error) {
    console.error('Error fetching fees data:', error);
    throw error;
  }
};

// Helper function to determine protocol category
function getProtocolCategory(name: string): string {
  const categoryMap: Record<string, string> = {
    'Uniswap': 'DEX',
    'Compound': 'Lending',
    'Balancer': 'DEX',
    'OpenSea': 'NFT Marketplace',
    'Bitcoin': 'Chain',
    'Ethereum': 'Chain',
    'Polygon': 'Chain',
    'Tron': 'Chain',
    'Gnosis': 'Chain',
    'Celo': 'Chain',
    'Doge': 'Chain',
    'Fuse': 'Chain',
    'Litecoin': 'Chain',
    'Near': 'Chain',
    'Rootstock': 'Chain',
    'WBTC': 'Bridge',
    'Sky Lending': 'Lending',
    'GhostMarket': 'NFT Marketplace',
    'AO': 'Other'
  };

  return categoryMap[name] || 'Other';
}

// Helper function to determine protocol chains
function getProtocolChains(name: string): string[] {
  const chainMap: Record<string, string[]> = {
    'Uniswap': ['Ethereum', 'Arbitrum', 'Optimism', 'Polygon'],
    'Compound': ['Ethereum'],
    'Balancer': ['Ethereum'],
    'OpenSea': ['Ethereum'],
    'Bitcoin': ['Bitcoin'],
    'Ethereum': ['Ethereum'],
    'Polygon': ['Polygon'],
    'Tron': ['Tron'],
    'Gnosis': ['Gnosis'],
    'Celo': ['Celo'],
    'Doge': ['Dogecoin'],
    'Fuse': ['Fuse'],
    'Litecoin': ['Litecoin'],
    'Near': ['Near'],
    'Rootstock': ['Rootstock'],
    'WBTC': ['Ethereum', 'Bitcoin'],
    'Sky Lending': ['Ethereum'],
    'GhostMarket': ['Ethereum'],
    'AO': ['Ethereum']
  };

  return chainMap[name] || ['Ethereum'];
}

export const fetchChainFeesData = async (chain: string, dataType: DataType = 'dailyFees') => {
  try {
    const response = await axios.get(`/overview/fees/${chain}`, {
      params: {
        excludeTotalDataChart: true,
        excludeTotalDataChartBreakdown: true,
        dataType
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching fees data for chain ${chain}:`, error);
    throw error;
  }
};

export const fetchProtocolFeesData = async (protocol: string, dataType: DataType = 'dailyFees') => {
  try {
    const response = await axios.get(`/summary/fees/${protocol}`, {
      params: {
        dataType
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching fees data for protocol ${protocol}:`, error);
    throw error;
  }
}; 