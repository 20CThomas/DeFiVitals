declare module '*.json' {
  const value: {
    totalDataChart: Array<{
      date: string;
      dailyFees: number;
      totalFees: number;
      dailyRevenue?: number;
      totalRevenue?: number;
    }>;
    totalDataChartBreakdown: Array<{
      date: string;
      dailyFees: number;
      totalFees: number;
      dailyRevenue?: number;
      totalRevenue?: number;
    }>;
    breakdown24h: Record<string, Record<string, number>>;
    breakdown30d: Record<string, Record<string, number>>;
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
    protocols: Array<{
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
      breakdown24h: Record<string, Record<string, number>>;
      breakdown30d: Record<string, Record<string, number>>;
    }>;
  };
  export default value;
} 