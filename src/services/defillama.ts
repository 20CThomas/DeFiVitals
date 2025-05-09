import axios from 'axios';
import { ProtocolData, HistoricalDataPoint } from '@/types';

const DEFILLAMA_API_BASE = 'https://api.llama.fi';

interface ApiResponse {
  protocols: Array<{
  name: string;
  logo: string;
  category: string;
  chains: string[];
    total24h: number;
    total7d: number;
    total30d: number;
    totalAllTime: number;
  }>;
  totalDataChart: Array<[number, number]>;
}

export const fetchProtocols = async (): Promise<ProtocolData[]> => {
  try {
    const response = await axios.get<ApiResponse>(`${DEFILLAMA_API_BASE}/overview/fees`);
    const { protocols, totalDataChart } = response.data;

    // Transform the data into our ProtocolData format
    return protocols.map((protocol) => ({
      id: protocol.name.toLowerCase().replace(/\s+/g, '-'),
            name: protocol.name,
            logo: protocol.logo,
            category: protocol.category,
            chains: protocol.chains,
            fees: {
        daily: protocol.total24h,
        weekly: protocol.total7d,
        monthly: protocol.total30d,
        cumulative: protocol.totalAllTime
            },
            revenue: {
        daily: protocol.total24h * 0.3, // Assuming 30% revenue
        weekly: protocol.total7d * 0.3,
        monthly: protocol.total30d * 0.3,
        cumulative: protocol.totalAllTime * 0.3
      },
      historicalData: totalDataChart.map(([timestamp, value]) => ({
        timestamp,
        value
      })),
      date: new Date().toISOString().split('T')[0]
    }));
  } catch (error) {
    console.error('Error fetching protocols:', error);
    throw error;
  }
}; 