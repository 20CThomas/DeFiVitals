import axios from 'axios';
import {
  fetchLidoMetrics,
  fetchRocketPoolMetrics,
  calculateLidoHealthMetrics,
  calculateRocketPoolMetrics,
  normalizeMetrics,
} from './platformApis';

export const USE_MOCK_DATA = false; // Set to false to use real API data

export interface ProtocolData {
  name: string;
  tvl: number;
  change_1h: number;
  change_1d: number;
  change_7d: number;
  change_1m: number;
}

export interface AggregatedData {
  protocols: ProtocolData[];
  totalTvl: number;
  totalProtocols: number;
  averageChange1h: number;
  averageChange1d: number;
  averageChange7d: number;
  averageChange1m: number;
  marketCapTvlRatio: number;
  tokenPrice: number;
  priceChange24h: number;
}

export interface HistoricalDataPoint {
  date: string;
  tvl: number;
  marketCap: number;
  ratio: number;
}

export interface ChartData {
  tvl: HistoricalDataPoint[];
  marketCap: HistoricalDataPoint[];
  ratio: HistoricalDataPoint[];
}

interface DefiLlamaProtocol {
  id: string;
  name: string;
  logo: string;
  chain: string;
  category?: string;
  tvl: number;
  marketCap?: number;
  mcap?: number;  // Add mcap field as it's used in the API response
  change_1h?: number;
  change_1d?: number;
  change_7d?: number;
  change_1m?: number;
  stablecoin?: boolean;
}

// Update the response type to be an array
type DefiLlamaResponse = DefiLlamaProtocol[];

const DEFILLAMA_API_BASE = 'https://api.llama.fi';
const DIA_API_BASE = 'https://api.diadata.org/v1';

// Cache for protocol data
let protocolDataCache: DefiLlamaProtocol[] | null = null;
let lastProtocolFetch: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

interface DefiLlamaPriceResponse {
  coins: {
    [key: string]: {
      price: number;
      symbol: string;
      timestamp: number;
      confidence: number;
    };
  };
}

interface DiaPriceResponse {
  Symbol: string;
  Name: string;
  Price: number;
  PriceYesterday: number;
  VolumeYesterdayUSD: number;
  Time: string;
  LastTrade: string;
}

type Currency = 'ETH' | 'BTC';

async function fetchDefiLlamaPrice(currency: Currency): Promise<number> {
  try {
    // Use the correct API endpoint for prices
    const coinId = currency === 'ETH' ? 'coingecko:ethereum' : 'coingecko:bitcoin';
    const response = await axios.get<DefiLlamaPriceResponse>(`https://coins.llama.fi/prices/current/${coinId}`);
    
    // Log the response for debugging
    console.log('DeFi Llama price response:', response.data);
    
    // Extract price from the response
    const price = response.data.coins[coinId]?.price || 0;
    return price;
  } catch (error) {
    console.error(`Error fetching DeFi Llama ${currency} price:`, error);
    return 0;
  }
}

// We'll use only DeFi Llama prices as they are more accurate and up-to-date
async function fetchTokenPrice(currency: Currency): Promise<number> {
  try {
    return await fetchDefiLlamaPrice(currency);
  } catch (error) {
    console.error(`Error fetching ${currency} price:`, error);
    return 0;
  }
}

export async function fetchAggregatedData(chain: 'Ethereum' | 'Bitcoin' = 'Ethereum'): Promise<AggregatedData> {
  try {
    // Check if we need to refresh the cache
    const now = Date.now();
    if (!protocolDataCache || now - lastProtocolFetch > CACHE_DURATION) {
      const defillamaData = await axios.get<DefiLlamaResponse>(`${DEFILLAMA_API_BASE}/protocols`);
      protocolDataCache = defillamaData.data;
      lastProtocolFetch = now;
    }

    // Fetch price data for the selected chain
    const currency: Currency = chain === 'Ethereum' ? 'ETH' : 'BTC';
    const tokenPrice = await fetchTokenPrice(currency);

    // Process DeFi Llama data
    const protocols: ProtocolData[] = [];
    let totalTvl = 0;
    let totalMarketCap = 0;
    let totalChange1h = 0;
    let totalChange1d = 0;
    let totalChange7d = 0;
    let totalChange1m = 0;
    let count = 0;

    // Debug logging for protocol filtering
    console.log('Processing protocols for chain:', chain);
    console.log('Total protocols before filtering:', protocolDataCache.length);

    // First pass: collect all valid protocols
    const validProtocols = protocolDataCache.filter((protocol) => {
      const isMatchingChain = chain === 'Bitcoin' 
        ? (protocol.chain === 'Bitcoin' || protocol.chain === 'BTC')
        : protocol.chain === chain;

      return isMatchingChain && protocol.tvl > 0;
    });

    // Create a map to track wrapped/bridged tokens to avoid double counting
    const wrappedProtocols = new Set([
      'Binance Bitcoin',
      'Coinbase BTC',
      'Core Bitcoin Bridge'
    ]);

    // Create a map to track protocols that might be using wrapped tokens
    const derivativeProtocols = new Set([
      'Babylon',
      'Function',
      'Lombard',
      'exSat Credit Staking'
    ]);

    let wrappedTvl = 0;
    let derivativeTvl = 0;
    let nativeTvl = 0;

    // Second pass: process the valid protocols
    validProtocols.forEach((protocol) => {
      count++;

      // Calculate TVL and changes
      const tvl = Math.abs(protocol.tvl || 0);
      const mcap = protocol.marketCap || 0;
      const change1h = protocol.change_1h || 0;
      const change1d = protocol.change_1d || 0;
      const change7d = protocol.change_7d || 0;
      const change1m = protocol.change_1m || 0;

      // Skip WBTC for Bitcoin chain as it's an Ethereum token
      if (chain === 'Bitcoin' && protocol.name === 'WBTC') {
        console.log('Skipping WBTC as it is an Ethereum token');
        return;
      }

      // Categorize TVL
      if (wrappedProtocols.has(protocol.name)) {
        wrappedTvl += tvl;
        console.log('Wrapped protocol:', protocol.name, formatNumber(tvl));
      } else if (derivativeProtocols.has(protocol.name)) {
        derivativeTvl += tvl;
        console.log('Derivative protocol:', protocol.name, formatNumber(tvl));
      } else {
        nativeTvl += tvl;
        console.log('Native protocol:', protocol.name, formatNumber(tvl));
      }

      // Add to total TVL based on category
      totalTvl = wrappedTvl + nativeTvl;

      totalMarketCap += mcap;
      totalChange1h += change1h;
      totalChange1d += change1d;
      totalChange7d += change7d;
      totalChange1m += change1m;

      protocols.push({
        name: protocol.name,
        tvl,
        change_1h: change1h,
        change_1d: change1d,
        change_7d: change7d,
        change_1m: change1m
      });
    });

    // Debug logging for final totals
    console.log('TVL Breakdown:', {
      wrappedTvl: formatNumber(wrappedTvl),
      derivativeTvl: formatNumber(derivativeTvl),
      nativeTvl: formatNumber(nativeTvl),
      totalTvl: formatNumber(totalTvl)
    });

    // Calculate averages and ratios
    const averageChange1h = count > 0 ? totalChange1h / count : 0;
    const averageChange1d = count > 0 ? totalChange1d / count : 0;
    const averageChange7d = count > 0 ? totalChange7d / count : 0;
    const averageChange1m = count > 0 ? totalChange1m / count : 0;
    const marketCapTvlRatio = totalTvl > 0 ? totalMarketCap / totalTvl : 0;

    return {
      protocols: protocols.sort((a, b) => b.tvl - a.tvl), // Sort by TVL descending
      totalTvl,
      totalProtocols: count,
      averageChange1h,
      averageChange1d,
      averageChange7d,
      averageChange1m,
      marketCapTvlRatio,
      tokenPrice,
      priceChange24h: averageChange1d
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
    } else {
      console.error('Non-Axios Error:', error);
    }
    throw error;
  }
}

interface DefiLlamaTvlDataPoint {
  date: string | number;  // API can return either string or number
  totalLiquidityUSD: number | null;  // The API returns totalLiquidityUSD instead of tvl
}

export async function fetchHistoricalData(days: number = 90, chain: 'Ethereum' | 'Bitcoin' = 'Ethereum'): Promise<ChartData> {
  try {
    // Fetch TVL data for the specified chain
    const tvlResponse = await axios.get<DefiLlamaTvlDataPoint[]>(`${DEFILLAMA_API_BASE}/charts/${chain}`);
    
    console.log('Raw TVL Response:', {
      status: tvlResponse.status,
      dataLength: tvlResponse.data?.length,
      samplePoint: tvlResponse.data?.[0],
      chain
    });

    if (!tvlResponse.data || !Array.isArray(tvlResponse.data)) {
      throw new Error('Invalid response format from DeFi Llama API');
    }

    // Calculate the cutoff date
    const cutoffDate = Date.now() - (days * 24 * 60 * 60 * 1000);

    // Process and validate each data point
    const validDataPoints = tvlResponse.data
      .filter(point => {
        if (!point || point.totalLiquidityUSD === null || point.totalLiquidityUSD === undefined) {
          return false;
        }

        // Convert date to timestamp (DeFi Llama returns Unix timestamps in seconds)
        const timestamp = typeof point.date === 'string' 
          ? parseInt(point.date, 10) * 1000 
          : point.date * 1000;

        // Filter out invalid dates and TVL values
        return timestamp >= cutoffDate && 
               !isNaN(timestamp) && 
               typeof point.totalLiquidityUSD === 'number' && 
               !isNaN(point.totalLiquidityUSD) && 
               point.totalLiquidityUSD > 0;
      })
      .map(point => {
        const timestamp = typeof point.date === 'string' 
          ? parseInt(point.date, 10) * 1000 
          : point.date * 1000;

        // We know totalLiquidityUSD is valid from the filter
        const tvl = point.totalLiquidityUSD as number;
        // Estimate market cap as a multiple of TVL (this is a simplified approximation)
        const marketCap = tvl * 1.5; // Using 1.5 as a conservative estimate
        const ratio = marketCap / tvl;

        const dateStr = new Date(timestamp).toISOString().split('T')[0]; // Format as YYYY-MM-DD

        return {
          date: dateStr,
          tvl,
          marketCap,
          ratio
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    console.log('Processed data points:', {
      total: validDataPoints.length,
      first: validDataPoints[0],
      last: validDataPoints[validDataPoints.length - 1]
    });

    // Return the data in the correct format
    const chartData: ChartData = {
      tvl: validDataPoints,
      marketCap: validDataPoints,
      ratio: validDataPoints
    };

    return chartData;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    throw error;
  }
}

// Function to format numbers with appropriate suffixes
export function formatNumber(num: number): string {
  if (num >= 1e9) {
    return `$${(num / 1e9).toFixed(2)}b`;
  } else if (num >= 1e6) {
    return `$${(num / 1e6).toFixed(2)}m`;
  } else if (num >= 1e3) {
    return `$${(num / 1e3).toFixed(2)}k`;
  }
  return `$${num.toFixed(2)}`;
}

// Function to format percentage changes
export function formatPercentageChange(change: number): string {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
}

export interface LiquidStakingPlatform {
  id: string;
  name: string;
  logo: string;
  chain: string;
  tvl: number;
  stakingRatio: number;  // Ratio of staked tokens to total supply
  liquidityDepth: number;  // Depth of liquidity pools
  utilizationRate: number;  // How much of the liquidity is being used
  averageSlippage: number;  // Average slippage in trades
  withdrawalTime: number;  // Time to withdraw in hours
  healthScore: number;  // 0-100 score based on our metrics
  healthColor: 'black' | 'red' | 'yellow' | 'green';  // Color indicator
  healthIntensity: number;  // 0-1 for color brightness
  change24h: number;
  change7d: number;
}

// Add cache variables
const platformsCache: LiquidStakingPlatform[] | null = null;
const lastFetchTime = 0;

// Function to calculate health score (0-100)
function calculateHealthScore(platform: Partial<LiquidStakingPlatform> & { tvl: number }): number {
  const weights = {
    stakingRatio: 0.25,
    liquidityDepth: 0.30,
    utilizationRate: 0.25,
    averageSlippage: 0.10,
    withdrawalTime: 0.10
  };

  let score = 0;

  // Staking ratio (higher is better, up to a point)
  if (platform.stakingRatio !== undefined) {
    const optimalRatio = 0.65; // Optimal staking ratio
    const maxDeviation = 0.6; // Maximum allowed deviation from optimal
    const ratioDiff = Math.min(Math.abs(platform.stakingRatio - optimalRatio) / maxDeviation, 1);
    score += (1 - ratioDiff) * weights.stakingRatio * 100;
  } else {
    // Default score component if data is missing
    score += 0.5 * weights.stakingRatio * 100;
  }

  // Liquidity depth (higher is better)
  if (platform.liquidityDepth !== undefined && platform.tvl > 0) {
    const depthRatio = Math.min(platform.liquidityDepth / platform.tvl, 1);
    score += depthRatio * weights.liquidityDepth * 100;
  } else {
    // Default score component if data is missing
    score += 0.5 * weights.liquidityDepth * 100;
  }

  // Utilization rate (optimal around 70%)
  if (platform.utilizationRate !== undefined) {
    const optimal = 0.7;
    const maxDeviation = 0.6; // Maximum allowed deviation from optimal
    const diff = Math.min(Math.abs(platform.utilizationRate - optimal) / maxDeviation, 1);
    score += (1 - diff) * weights.utilizationRate * 100;
  } else {
    // Default score component if data is missing
    score += 0.5 * weights.utilizationRate * 100;
  }

  // Average slippage (lower is better)
  if (platform.averageSlippage !== undefined) {
    const maxAcceptableSlippage = 0.01; // 1%
    const normalizedSlippage = Math.max(0, 1 - (platform.averageSlippage / maxAcceptableSlippage));
    score += normalizedSlippage * weights.averageSlippage * 100;
  } else {
    // Default score component if data is missing
    score += 0.5 * weights.averageSlippage * 100;
  }

  // Withdrawal time (lower is better, max 1 week)
  if (platform.withdrawalTime !== undefined) {
    const maxTime = 168; // 1 week in hours
    const normalizedTime = Math.max(0, 1 - (platform.withdrawalTime / maxTime));
    score += normalizedTime * weights.withdrawalTime * 100;
  } else {
    // Default score component if data is missing
    score += 0.5 * weights.withdrawalTime * 100;
  }

  // Apply a random factor to create more variety in scores (±10%)
  const randomFactor = 0.9 + (Math.random() * 0.2); // Between 0.9 and 1.1
  
  // Apply randomization but ensure score stays in 0-100 range
  const finalScore = Math.max(5, Math.min(100, score * randomFactor));
  
  // Ensure score is between 0 and 100
  return Math.round(finalScore);
}

// Function to determine health color and intensity
function getHealthIndicators(score: number): { color: LiquidStakingPlatform['healthColor']; intensity: number } {
  if (score >= 80) {
    return { color: 'green', intensity: Math.min(1, (score - 80) / 20 + 0.5) };
  } else if (score >= 60) {
    return { color: 'yellow', intensity: Math.min(1, (score - 60) / 20 + 0.5) };
  } else if (score >= 40) {
    return { color: 'red', intensity: Math.min(1, (score - 40) / 20 + 0.5) };
  } else {
    return { color: 'black', intensity: Math.min(1, score / 40 + 0.3) };
  }
}

export async function fetchLiquidStakingPlatforms(): Promise<LiquidStakingPlatform[]> {
  try {
    // Fetch real data from DeFi Llama
    const response = await axios.get(`${DEFILLAMA_API_BASE}/protocols`);
    const allProtocols: DefiLlamaProtocol[] = response.data;

    // Filter for liquid staking protocols and ensure TVL > 0
    const liquidStakingProtocols = allProtocols.filter(protocol => {
      return (
        protocol.category?.toLowerCase().includes('liquid staking') &&
        protocol.tvl > 0 && // Ensure TVL is greater than 0
        !protocol.stablecoin // Exclude stablecoin protocols
      );
    });

    // Transform and enrich the data
    const platforms: LiquidStakingPlatform[] = await Promise.all(
      liquidStakingProtocols.map(async (protocol) => {
        // Fetch additional metrics if available
        let additionalMetrics = {
          stakingRatio: 0,
          liquidityDepth: 0,
          utilizationRate: 0,
          averageSlippage: 0,
          withdrawalTime: 24, // Default 24 hours
        };

        // Try to fetch platform-specific metrics
        try {
          if (protocol.name.toLowerCase().includes('lido')) {
            const lidoMetrics = await fetchLidoMetrics();
            additionalMetrics = calculateLidoHealthMetrics(lidoMetrics);
          } else if (protocol.name.toLowerCase().includes('rocket')) {
            try {
              const rocketMetrics = await fetchRocketPoolMetrics();
              additionalMetrics = calculateRocketPoolMetrics(rocketMetrics.stats, rocketMetrics.nodeMetrics);
            } catch {
              // Use default metrics if Rocket Pool API fails
              additionalMetrics = {
                stakingRatio: 0.6, // Conservative estimate
                liquidityDepth: protocol.tvl * 0.4, // Assume 40% of TVL is liquid
                utilizationRate: 0.7, // Conservative estimate
                averageSlippage: 0.002,
                withdrawalTime: 24
              };
            }
          } else {
            // For other protocols, calculate estimated metrics based on TVL
            additionalMetrics = {
              stakingRatio: 0.5, // Conservative default
              liquidityDepth: protocol.tvl * 0.3, // Assume 30% of TVL is liquid
              utilizationRate: 0.6, // Conservative default
              averageSlippage: 0.003,
              withdrawalTime: 24
            };
          }
        } catch (error) {
          console.error(`Error fetching metrics for ${protocol.name}:`, error);
        }

        // Calculate health score
        const healthScore = calculateHealthScore({
          ...additionalMetrics,
          tvl: protocol.tvl
        });

        // Get health indicators
        const healthIndicators = getHealthIndicators(healthScore);

        return {
          id: protocol.id,
          name: protocol.name,
          logo: protocol.logo || '/placeholder-logo.png',
          chain: protocol.chain,
          tvl: protocol.tvl,
          stakingRatio: additionalMetrics.stakingRatio,
          liquidityDepth: additionalMetrics.liquidityDepth,
          utilizationRate: additionalMetrics.utilizationRate,
          averageSlippage: additionalMetrics.averageSlippage,
          withdrawalTime: additionalMetrics.withdrawalTime,
          healthScore,
          healthColor: healthIndicators.color,
          healthIntensity: healthIndicators.intensity,
          change24h: protocol.change_1d || 0,
          change7d: protocol.change_7d || 0
        };
      })
    );

    // Sort by TVL descending and ensure all values are valid
    return platforms
      .filter(platform => 
        platform.tvl > 0 && 
        platform.stakingRatio > 0 && 
        platform.liquidityDepth > 0
      )
      .sort((a, b) => b.tvl - a.tvl);

  } catch (error) {
    console.error('Error fetching liquid staking platforms:', error);
    return [];
  }
}

export interface Protocol {
  id: string;
  name: string;
  logo: string;
  category: string;
  tvl: number;
  change_24h: number;
  marketCap: number;
  mcapTvlRatio: number;
}

export async function fetchProtocols(): Promise<Protocol[]> {
  try {
    const response = await fetch('https://api.llama.fi/protocols');
    const data: DefiLlamaProtocol[] = await response.json();
    
    return data.map((protocol) => {
      // Get market cap from either marketCap or mcap field
      const marketCap = protocol.marketCap || protocol.mcap || 0;
      
      // Calculate MCap/TVL ratio for sorting
      const mcapTvlRatio = protocol.tvl > 0 ? marketCap / protocol.tvl : 0;
      
      return {
        id: protocol.id,
        name: protocol.name,
        logo: protocol.logo,
        category: protocol.category || 'Uncategorized',
        tvl: protocol.tvl,
        change_24h: protocol.change_1d || 0,
        marketCap,
        mcapTvlRatio
      };
    }).sort((a, b) => b.tvl - a.tvl); // Default sort by TVL
  } catch (error) {
    console.error('Error fetching protocols:', error);
    return [];
  }
}

const DEFILLAMA_API = 'https://api.llama.fi';

export async function fetchChainTVL() {
  try {
    const response = await axios.get(`${DEFILLAMA_API}/v2/chains`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chain TVL:', error);
    return [];
  }
}

interface ChainTVLData {
  gecko_id: string;
  name: string;
  tokenSymbol?: string;
  logo?: string;
  tvl: number;
  change_24h?: number;
  change_7d?: number;
  protocols?: number;
}

interface ChainMarketCapData {
  gecko_id: string;
  mcap: number;
}

export async function fetchChainData() {
  try {
    // Fetch TVL data
    const tvlResponse = await axios.get<ChainTVLData[]>(`${DEFILLAMA_API}/v2/chains`);
    const tvlData = tvlResponse.data;

    // Fetch market cap data
    const mcapResponse = await axios.get<ChainMarketCapData[]>(`${DEFILLAMA_API}/v2/chains/market-cap`);
    const mcapData = mcapResponse.data;

    // Combine the data
    const combinedData = tvlData
      .filter((chain: ChainTVLData) => chain && typeof chain.tvl === 'number') // Filter out invalid TVL entries
      .map((chain: ChainTVLData) => {
        const mcapInfo = mcapData.find((m: ChainMarketCapData) => m.gecko_id === chain.gecko_id);
        const mcap = mcapInfo?.mcap || 0;
        const tvl = Math.max(0, chain.tvl || 0); // Ensure TVL is never negative
        
        return {
          id: chain.gecko_id || chain.name.toLowerCase(),
          name: chain.name,
          tokenSymbol: chain.tokenSymbol || '',
          logo: chain.logo || '/placeholder-logo.png',
          tvl,
          change_24h: chain.change_24h || 0,
          change_7d: chain.change_7d || 0,
          marketCap: mcap,
          mcapToTvl: tvl > 0 ? mcap / tvl : 0,
          protocols: chain.protocols || 0
        };
      })
      .sort((a, b) => b.marketCap - a.marketCap); // Sort by market cap

    return combinedData;
  } catch (error) {
    console.error('Error fetching chain data:', error);
    return [];
  }
} 