import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface FeeTrendsProps {
  data: {
    date: string;
    fees: number;
    revenue: number;
  }[];
}

export function FeeTrendsChart({ data }: FeeTrendsProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="date" 
          stroke="#9CA3AF"
          tick={{ fill: '#9CA3AF' }}
        />
        <YAxis 
          stroke="#9CA3AF"
          tick={{ fill: '#9CA3AF' }}
          tickFormatter={(value: number) => `$${(value / 1e6).toFixed(0)}M`}
        />
        <Tooltip
          formatter={(value: number) => [`$${(value / 1e6).toFixed(2)}M`, 'Amount']}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="fees" 
          stroke="#3B82F6" 
          strokeWidth={2}
          dot={false}
          name="Total Fees"
        />
        <Line 
          type="monotone" 
          dataKey="revenue" 
          stroke="#10B981" 
          strokeWidth={2}
          dot={false}
          name="Protocol Revenue"
        />
      </LineChart>
    </ResponsiveContainer>
  );
} 