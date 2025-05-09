import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeeDistributionChart } from './charts/FeeDistributionChart';
import { FeeTrendsChart } from './charts/FeeTrendsChart';
import { TopProtocolsChart } from './charts/TopProtocolsChart';

type TimeFrameType = 'daily' | 'weekly' | 'monthly' | 'cumulative';

export function FeesOverview() {
  const [timeframe, setTimeframe] = useState<TimeFrameType>('daily');

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
    trends: Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric'
        }),
        value: Math.random() * 1000000 + 500000
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
        <Tabs 
          defaultValue="daily" 
          value={timeframe} 
          onValueChange={(value) => setTimeframe(value as TimeFrameType)}
        >
          <TabsList className="bg-muted w-full">
            <TabsTrigger value="daily" className="flex-1">Daily</TabsTrigger>
            <TabsTrigger value="weekly" className="flex-1">Weekly</TabsTrigger>
            <TabsTrigger value="monthly" className="flex-1">Monthly</TabsTrigger>
            <TabsTrigger value="cumulative" className="flex-1">Total</TabsTrigger>
          </TabsList>
        </Tabs>
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
          <FeeTrendsChart data={mockData.trends} />
        </CardContent>
      </Card>
    </div>
  );
} 