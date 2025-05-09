'use client';

import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface FeeDistributionChartProps {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
}

export function FeeDistributionChart({ data }: FeeDistributionChartProps) {
  const chartData: ChartData<'pie'> = {
    labels: data.map(item => item.name),
    datasets: [
      {
        data: data.map(item => item.value),
        backgroundColor: data.map(item => item.color),
        borderColor: data.map(() => 'rgba(255, 255, 255, 0.1)'),
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'rgb(156, 163, 175)',
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            let formattedValue = '';
            if (value >= 1e9) formattedValue = `$${(value / 1e9).toFixed(1)}B`;
            else if (value >= 1e6) formattedValue = `$${(value / 1e6).toFixed(1)}M`;
            else if (value >= 1e3) formattedValue = `$${(value / 1e3).toFixed(1)}K`;
            else formattedValue = `$${value.toFixed(1)}`;
            return `${context.label}: ${formattedValue}`;
          },
        },
      },
    },
  };

  return (
    <div className="h-[300px] w-full p-4 rounded-lg bg-white dark:bg-zinc-900 shadow-lg">
      <Pie data={chartData} options={options} />
    </div>
  );
} 