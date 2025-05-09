import { ProtocolData, AggregatedData, ChartData, HistoricalDataPoint } from './dataService';

// Generate random percentage change between -20% and +20%
function generateRandomChange(): number {
  return (Math.random() * 40 - 20);
}

// Generate random TVL between 100M and 100B
function generateRandomTVL(): number {
  return Math.random() * 99.9e9 + 100e6;
}

// List of popular DeFi protocols
const PROTOCOL_NAMES = [
  'Lido',
  'MakerDAO',
  'Uniswap',
  'Aave',
  'Curve',
  'Convex Finance',
  'Compound',
  'Balancer',
  'Synthetix',
  'Yearn Finance',
  'Frax',
  'AAVE',
  'SushiSwap',
  '1inch',
  'GMX'
];

export async function fetchMockAggregatedData(): Promise<AggregatedData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const protocols: ProtocolData[] = PROTOCOL_NAMES.map(name => ({
    name,
    tvl: generateRandomTVL(),
    change_1h: generateRandomChange(),
    change_1d: generateRandomChange(),
    change_7d: generateRandomChange(),
    change_1m: generateRandomChange()
  }));

  // Calculate totals and averages
  const totalTvl = protocols.reduce((sum, p) => sum + p.tvl, 0);
  const totalChange1h = protocols.reduce((sum, p) => sum + p.change_1h, 0);
  const totalChange1d = protocols.reduce((sum, p) => sum + p.change_1d, 0);
  const totalChange7d = protocols.reduce((sum, p) => sum + p.change_7d, 0);
  const totalChange1m = protocols.reduce((sum, p) => sum + p.change_1m, 0);
  const count = protocols.length;

  // Generate mock market cap (slightly higher than TVL)
  const totalMarketCap = totalTvl * (1 + Math.random() * 0.5);
  const marketCapTvlRatio = 1.5; // Mock ratio

  const averageChange1h = totalChange1h / protocols.length;
  const averageChange1d = totalChange1d / protocols.length;
  const averageChange7d = totalChange7d / protocols.length;
  const averageChange1m = totalChange1m / protocols.length;

  // Mock token price data
  const tokenPrice = 2500; // Mock ETH price
  const priceChange24h = averageChange1d; // Use the same change as TVL

  return {
    protocols,
    totalTvl,
    totalProtocols: protocols.length,
    averageChange1h,
    averageChange1d,
    averageChange7d,
    averageChange1m,
    marketCapTvlRatio,
    tokenPrice,
    priceChange24h
  };
}

function generateHistoricalDataPoint(baseValue: number, date: Date): HistoricalDataPoint {
  const randomChange = generateRandomChange() / 100;
  const value = baseValue * (1 + randomChange);
  return {
    date: date.toISOString(),
    tvl: value,
    marketCap: value * (1 + Math.random() * 0.5),
    ratio: 1 + Math.random() * 0.5
  };
}

export async function fetchMockHistoricalData(days: number = 90): Promise<ChartData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const baseTvl = 100e9; // 100B base TVL
  const data: HistoricalDataPoint[] = [];
  const now = new Date();

  // Generate data points for the last N days
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push(generateHistoricalDataPoint(baseTvl, date));
  }

  return {
    tvl: data.map(point => ({ date: point.date, tvl: point.tvl, marketCap: 0, ratio: 0 })),
    marketCap: data.map(point => ({ date: point.date, tvl: 0, marketCap: point.marketCap, ratio: 0 })),
    ratio: data.map(point => ({ date: point.date, tvl: 0, marketCap: 0, ratio: point.ratio }))
  };
} 