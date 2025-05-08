import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ProtocolData extends Record<string, unknown> {
  name: string;
  fees: number;
  revenue: number;
}

interface TopProtocolsProps {
  data: ProtocolData[];
}

export function TopProtocolsChart({ data }: TopProtocolsProps) {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer>
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
    </div>
  );
} 