'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TopProtocolsChartProps {
  data: {
    name: string;
    fees: number;
    revenue: number;
  }[];
}

export function TopProtocolsChart({ data }: TopProtocolsChartProps) {
  const formatValue = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${value.toFixed(1)}`;
  };

  const chartData: ChartData<'bar'> = {
    labels: data.map(item => item.name),
    datasets: [
      {
        label: 'Fees',
        data: data.map(item => item.fees),
        backgroundColor: 'rgba(136, 132, 216, 0.8)',
        borderColor: 'rgba(136, 132, 216, 1)',
        borderWidth: 1,
      },
      {
        label: 'Revenue',
        data: data.map(item => item.revenue),
        backgroundColor: 'rgba(130, 202, 157, 0.8)',
        borderColor: 'rgba(130, 202, 157, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      y: {
        ticks: {
          callback: (value) => {
            if (typeof value === 'number') return formatValue(value);
            return value;
          },
          color: 'rgb(156, 163, 175)',
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
      },
      x: {
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
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
            return `${context.dataset.label}: ${formatValue(value)}`;
          },
        },
      },
    },
  };

  return (
    <div className="h-[300px] w-full p-4 rounded-lg bg-white dark:bg-zinc-900 shadow-lg">
      <Bar data={chartData} options={options} />
    </div>
  );
} 