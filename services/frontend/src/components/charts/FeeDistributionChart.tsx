import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface FeeDistributionData extends Record<string, unknown> {
  name: string;
  value: number;
  color: string;
}

interface FeeDistributionProps {
  data: FeeDistributionData[];
}

export function FeeDistributionChart({ data }: FeeDistributionProps) {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer>
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
            formatter={(value: string | number, name?: string) => {
              const numValue = typeof value === 'string' ? parseFloat(value) : value;
              return [`$${(numValue / 1e6).toFixed(2)}M`, name || 'Fees'];
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
} 