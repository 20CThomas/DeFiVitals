import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface FeeData extends Record<string, unknown> {
  date: string;
  fees: number;
  revenue: number;
}

interface FeeTrendsProps {
  data: FeeData[];
}

export function FeeTrendsChart({ data }: FeeTrendsProps) {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer>
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
            tickFormatter={(value: string | number) => {
              const numValue = typeof value === 'string' ? parseFloat(value) : value;
              return `$${(numValue / 1e6).toFixed(0)}M`;
            }}
          />
          <Tooltip
            formatter={(value: string | number, name?: string) => {
              const numValue = typeof value === 'string' ? parseFloat(value) : value;
              return [`$${(numValue / 1e6).toFixed(2)}M`, name || 'Amount'];
            }}
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
    </div>
  );
} 