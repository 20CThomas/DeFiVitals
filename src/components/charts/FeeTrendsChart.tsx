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
  Scale,
  ScaleOptionsByType,
  CoreScaleOptions,
  Tick
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

  const chartData: ChartData<'line'> = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Total Fees',
        data: data.map(item => item.fees),
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
        data: data.map(item => item.revenue),
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
    interaction: {
      intersect: false,
      mode: 'index',
    },
    scales: {
      x: {
        grid: {
          display: false,
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: timeFrame === 'daily' ? 1 : timeFrame === 'weekly' ? 7 : 10,
        },
      },
      y: {
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        beginAtZero: true,
        ticks: {
          color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
          callback: function(this: Scale<CoreScaleOptions>, value: number | string) {
            const numValue = typeof value === 'number' ? value : parseFloat(value);
            if (numValue >= 1e6) return `$${(numValue / 1e6).toFixed(1)}M`;
            if (numValue >= 1e3) return `$${(numValue / 1e3).toFixed(1)}K`;
            return `$${numValue}`;
          },
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        titleColor: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
        bodyColor: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function(context: TooltipItem<'line'>) {
            const value = context.raw as number;
            if (value >= 1e6) return `${context.dataset.label}: $${(value / 1e6).toFixed(2)}M`;
            if (value >= 1e3) return `${context.dataset.label}: $${(value / 1e3).toFixed(2)}K`;
            return `${context.dataset.label}: $${value.toFixed(2)}`;
          },
        },
      },
    },
  };

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <Line data={chartData} options={options} />
    </div>
  );
} 