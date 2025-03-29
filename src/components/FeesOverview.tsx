import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FeeDistributionChart } from './charts/FeeDistributionChart';
import { FeeTrendsChart } from './charts/FeeTrendsChart';
import { TopProtocolsChart } from './charts/TopProtocolsChart';

export function FeesOverview() {
  const [timeframe, setTimeframe] = useState('7D');

  // This would be replaced with real data from your API
  const mockData = {
    distribution: [
      { name: 'Lending', value: 1200000, color: '#3B82F6' },
      { name: 'DEX', value: 800000, color: '#10B981' },
      { name: 'Derivatives', value: 600000, color: '#6366F1' },
      { name: 'Liquid Staking', value: 400000, color: '#8B5CF6' },
      { name: 'Yield', value: 300000, color: '#EC4899' },
      { name: 'RWA', value: 200000, color: '#F59E0B' }
    ],
    trends: Array.from({ length: 90 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (89 - i));
      return {
        date: date.toLocaleDateString(),
        totalFees: Math.random() * 1000000 + 500000,
        totalRevenue: Math.random() * 800000 + 300000
      };
    }),
    topProtocols: [
      { name: 'Uniswap', fees: 1000000, revenue: 800000 },
      { name: 'Aave', fees: 800000, revenue: 600000 },
      { name: 'dYdX', fees: 600000, revenue: 400000 },
      { name: 'Curve', fees: 400000, revenue: 300000 },
      { name: 'GMX', fees: 300000, revenue: 200000 }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7D">7D</SelectItem>
            <SelectItem value="30D">30D</SelectItem>
            <SelectItem value="90D">90D</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Fee Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <FeeDistributionChart data={mockData.distribution} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Protocols</CardTitle>
          </CardHeader>
          <CardContent>
            <TopProtocolsChart data={mockData.topProtocols} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fee Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <FeeTrendsChart data={mockData.trends} timeFrame={timeframe} />
        </CardContent>
      </Card>
    </div>
  );
} 