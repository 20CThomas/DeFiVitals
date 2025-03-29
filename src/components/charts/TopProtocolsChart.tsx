import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TopProtocolsProps {
  data: {
    name: string;
    fees: number;
    revenue: number;
  }[];
}

export function TopProtocolsChart({ data }: TopProtocolsProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="name" 
          stroke="#9CA3AF"
          tick={{ fill: '#9CA3AF' }}
          interval={0}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis 
          stroke="#9CA3AF"
          tick={{ fill: '#9CA3AF' }}
          tickFormatter={(value) => `$${(value / 1e6).toFixed(0)}M`}
        />
        <Tooltip
          formatter={(value: number) => [`$${(value / 1e6).toFixed(2)}M`, 'Amount']}
        />
        <Legend />
        <Bar 
          dataKey="fees" 
          fill="#3B82F6" 
          name="Total Fees"
        />
        <Bar 
          dataKey="revenue" 
          fill="#10B981" 
          name="Protocol Revenue"
        />
      </BarChart>
    </ResponsiveContainer>
  );
} 