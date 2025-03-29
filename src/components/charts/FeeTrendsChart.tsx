'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartData,
  ChartOptions,
  TooltipItem,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTheme } from 'next-themes';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TrendData {
  date: string;
  fees: number;
  revenue: number;
}

interface FeeTrendsChartProps {
  data: TrendData[];
  timeFrame: 'daily' | 'weekly' | 'monthly' | 'cumulative';
}

export function FeeTrendsChart({ data, timeFrame }: FeeTrendsChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Filter and format data based on timeFrame
  let filteredData = [...data];
  const chartData: ChartData<'line'> = {
    labels: filteredData.map(item => item.date),
    datasets: [
      {
        label: 'Total Fees',
        data: filteredData.map(item => item.fees),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
      {
        label: 'Protocol Revenue',
        data: filteredData.map(item => item.revenue),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDark ? '#e4e4e7' : '#27272a',
          font: {
            family: 'Inter, sans-serif',
            size: 12,
          },
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: isDark ? '#18181b' : '#ffffff',
        titleColor: isDark ? '#e4e4e7' : '#27272a',
        bodyColor: isDark ? '#a1a1aa' : '#52525b',
        borderColor: isDark ? '#27272a' : '#e4e4e7',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        boxPadding: 4,
        callbacks: {
          label: function(tooltipItem: TooltipItem<'line'>) {
            let label = tooltipItem.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (tooltipItem.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(tooltipItem.parsed.y);
            }
            return label;
          }
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          color: isDark ? '#27272a' : '#e4e4e7',
        },
        ticks: {
          color: isDark ? '#a1a1aa' : '#71717a',
        },
      },
      y: {
        grid: {
          color: isDark ? '#27272a' : '#e4e4e7',
        },
        ticks: {
          color: isDark ? '#a1a1aa' : '#71717a',
          callback: function(tickValue: number | string) {
            const value = typeof tickValue === 'string' ? parseFloat(tickValue) : tickValue;
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
              notation: 'compact',
              compactDisplay: 'short',
            }).format(value);
          },
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  return (
    <div className="h-[400px] w-full">
      <Line data={chartData} options={options} />
    </div>
  );
} 