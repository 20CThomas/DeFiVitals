import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface FeeDistributionProps {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
}

export function FeeDistributionChart({ data }: FeeDistributionProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [`$${(value / 1e6).toFixed(2)}M`, 'Fees']}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
} 