export type TimeFrameType = 'daily' | 'weekly' | 'monthly' | 'cumulative';
export type SortOption = 'dailyFees' | 'weeklyFees' | 'monthlyFees' | 'totalFees' | 'name' | 'category';
export type DataType = 'dailyFees' | 'totalFees';

export interface HistoricalDataPoint {
  timestamp: number;
  value: number;
}

export interface ChartDataPoint {
  date: string;
  dailyFees: number;
  totalFees: number;
  dailyRevenue?: number;
  totalRevenue?: number;
}

export interface BreakdownData {
  [chain: string]: {
    [protocol: string]: number;
  };
}

export interface ProtocolData {
  id: string;
  name: string;
  logo: string;
  category: string;
  chains: string[];
  fees: {
    daily: number;
    weekly: number;
    monthly: number;
    cumulative: number;
  };
  revenue: {
    daily: number;
    weekly: number;
    monthly: number;
    cumulative: number;
  };
  historicalData: HistoricalDataPoint[];
  date: string;
}

export interface ProtocolResponse {
  id?: string;
  defillamaId: string;
  name: string;
  displayName: string;
  logo: string;
  category: string;
  chains: string[];
  total24h: number;
  total48hto24h: number;
  total7d?: number;
  total14dto7d?: number;
  total30d: number;
  total60dto30d: number;
  total1y: number;
  totalAllTime: number;
  average1y: number;
  change_30dover30d: number;
  breakdown24h: null;
  breakdown30d: null;
}

export interface ResponseData {
  totalDataChart: ChartDataPoint[];
  totalDataChartBreakdown: ChartDataPoint[];
  breakdown24h: null;
  breakdown30d: null;
  chain: null;
  allChains: string[];
  total24h: number;
  total48hto24h: number;
  total7d: number;
  total14dto7d: number;
  total30d: number;
  total60dto30d: number;
  total1y: number;
  totalAllTime: number;
  average1y: number;
  change_30dover30d: number;
  protocols: ProtocolResponse[];
} 