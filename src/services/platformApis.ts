import axios from 'axios';

// Lido API interfaces
interface LidoAPRResponse {
  data: {
    apr: number;
    sinceTimestamp: number;
    untilTimestamp: number;
  };
}

interface LidoWithdrawalQueueResponse {
  data: {
    estimatedTimeSeconds: number;
    currentQueueLength: number;
    currentQueueETH: number;
  };
}

interface LidoRewardHistoryResponse {
  data: {
    totalRewards: number;
    rewardsInFiat: number;
    currency: string;
    items: Array<{
      blockNumber: number;
      blockTime: string;
      amount: string;
      amountInFiat: number;
      type: string;
    }>;
  };
}

// Updated Lido metrics interface
interface LidoMetrics {
  stakingAPR: number;
  withdrawalTimeHours: number;
  queuedETH: number;
  queueLength: number;
  dailyRewardRate: number;
}

// Function to fetch Lido metrics
export async function fetchLidoMetrics(): Promise<LidoMetrics> {
  try {
    const [aprResponse, withdrawalResponse] = await Promise.all([
      fetch('https://eth-api.lido.fi/v1/protocol/steth/apr/sma'),
      fetch('https://wq-api.lido.fi/v2/request-time/calculate')
    ]);

    const aprData = await aprResponse.json();
    const withdrawalData = await withdrawalResponse.json();

    return {
      stakingAPR: aprData.data.smaApr || 0,
      withdrawalTimeHours: (withdrawalData.data?.estimatedTimeSeconds || 0) / 3600, // Convert seconds to hours, handle undefined
      queuedETH: withdrawalData.data?.queuedEth || 0,
      queueLength: withdrawalData.data?.queueLength || 0,
      dailyRewardRate: (aprData.data.smaApr || 0) / 365
    };
  } catch (error) {
    console.error('Error fetching Lido metrics:', error);
    return {
      stakingAPR: 0,
      withdrawalTimeHours: 24,
      queuedETH: 0,
      queueLength: 0,
      dailyRewardRate: 0
    };
  }
}

// Function to calculate Lido-specific metrics
export function calculateLidoHealthMetrics(metrics: LidoMetrics): {
  stakingRatio: number;
  liquidityDepth: number;
  utilizationRate: number;
  averageSlippage: number;
  withdrawalTime: number;
} {
  // Calculate metrics based on real Lido data
  const stakingRatio = Math.min(0.95, metrics.stakingAPR / 10); // Normalize APR to a ratio
  const utilizationRate = metrics.queuedETH / (metrics.queuedETH + 100000); // Assume 100k ETH buffer
  
  return {
    stakingRatio,
    liquidityDepth: metrics.queuedETH,
    utilizationRate,
    averageSlippage: 0.001, // Default value, would need DEX data for accuracy
    withdrawalTime: metrics.withdrawalTimeHours
  };
}

// Rocket Pool interfaces and functions remain placeholder until we get their API info
interface RocketPoolStats {
  rethSupply: number;
  effectiveStake: number;
  stakingPoolETH: number;
  totalValueLocked: number;
  rethPrice: number;
  stakingAPR: number;
}

interface RocketPoolNodeMetrics {
  totalNodeOperators: number;
  activeValidators: number;
  pendingValidators: number;
  averageUtilization: number;
}

// Placeholder until we get Rocket Pool API info
export async function fetchRocketPoolMetrics(): Promise<{
  stats: RocketPoolStats;
  nodeMetrics: RocketPoolNodeMetrics;
}> {
  throw new Error('Rocket Pool API integration not yet implemented');
}

export function calculateRocketPoolMetrics(
  stats: RocketPoolStats,
  nodeMetrics: RocketPoolNodeMetrics
) {
  return {
    stakingRatio: stats.effectiveStake / stats.totalValueLocked,
    liquidityDepth: stats.stakingPoolETH,
    utilizationRate: nodeMetrics.averageUtilization,
    averageSlippage: 0.003,
    withdrawalTime: 24
  };
}

// Define interface for normalized metrics
interface NormalizedMetrics {
  stakingRatio: number;
  liquidityDepth: number;
  utilizationRate: number;
  averageSlippage: number;
  withdrawalTime: number;
}

// Helper function to normalize metrics across platforms
export function normalizeMetrics(metrics: Partial<NormalizedMetrics>): NormalizedMetrics {
  return {
    stakingRatio: Math.min(Math.max(metrics.stakingRatio ?? 0, 0), 1),
    liquidityDepth: Math.max(metrics.liquidityDepth ?? 0, 0),
    utilizationRate: Math.min(Math.max(metrics.utilizationRate ?? 0, 0), 1),
    averageSlippage: Math.min(Math.max(metrics.averageSlippage ?? 0, 0), 0.1),
    withdrawalTime: Math.max(metrics.withdrawalTime ?? 0, 0)
  };
} 