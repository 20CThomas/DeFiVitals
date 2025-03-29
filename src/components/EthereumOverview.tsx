"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  ChevronDown,
  Download,
  ExternalLink,
  Filter,
  Star,
  BarChart3,
  Clock,
  Bookmark
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchAggregatedData, fetchHistoricalData, AggregatedData, ChartData } from '../services/dataService';
import { formatNumber, formatPercentage, formatCurrency, Currency } from '../utils/formatters';
import { Line } from 'react-chartjs-2';
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
  ChartOptions,
  Scale,
  ScaleOptionsByType,
  CoreScaleOptions,
  Tick
} from 'chart.js';
import { ThemeToggle } from './ThemeToggle';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

type Chain = 'Ethereum' | 'Bitcoin';

export function ChainOverview() {
  const [chain, setChain] = useState<Chain>('Ethereum');
  const [data, setData] = useState<AggregatedData | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [timeframe, setTimeframe] = useState<number>(90);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('USD');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [aggregatedData, historicalData] = await Promise.all([
          fetchAggregatedData(chain),
          fetchHistoricalData(timeframe, chain)
        ]);
        setData(aggregatedData);
        setChartData(historicalData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [chain, timeframe]);

  const getChartOptions = (label: string): ChartOptions<'line'> => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(17, 17, 17, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#3b82f6',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            if (label === 'Ratio') {
              return `${label}: ${value.toFixed(2)}`;
            }
            return `${label}: ${formatNumber(value)}`;
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear',
        beginAtZero: false,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#71717a',
          callback: function(value) {
            if (label === 'Ratio') {
              return Number(value).toFixed(2);
            }
            return formatNumber(Number(value));
          }
        }
      },
      x: {
        type: 'category',
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#71717a',
          maxRotation: 45,
          minRotation: 45,
          maxTicksLimit: 8
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  });

  const getChartData = (type: 'tvl' | 'marketCap' | 'ratio') => {
    if (!chartData) return null;

    const dataPoints = chartData[type];
    if (!dataPoints || dataPoints.length === 0) {
      console.log(`No data points available for ${type}`);
      return null;
    }

    console.log(`Processing ${type} data:`, {
      totalPoints: dataPoints.length,
      firstPoint: dataPoints[0],
      lastPoint: dataPoints[dataPoints.length - 1]
    });

    const processedData = dataPoints
      .map(point => {
        let value: number;
        switch (type) {
          case 'tvl':
            value = point.tvl;
            break;
          case 'marketCap':
            value = point.marketCap;
            break;
          case 'ratio':
            value = point.ratio;
            break;
          default:
            value = 0;
        }

        if (value === null || value === undefined || isNaN(value) || value <= 0) {
          console.log(`Invalid value for ${type}:`, value);
          return null;
        }

        return {
          x: point.date,
          y: value
        };
      })
      .filter(point => point !== null);

    console.log(`Processed ${type} data:`, {
      validPoints: processedData.length,
      firstPoint: processedData[0],
      lastPoint: processedData[processedData.length - 1]
    });

    return {
      labels: processedData.map(item => item.x),
      datasets: [
        {
          label: type === 'ratio' ? 'Market Cap/TVL Ratio' : 
                 type === 'marketCap' ? 'Market Cap' : 
                 'Total Value Locked',
          data: processedData,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 1,
          pointHitRadius: 10,
          borderWidth: 2
        }
      ]
    };
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (!data) {
    return <div className="text-center p-4">No data available</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            <Button
              variant={chain === 'Ethereum' ? "default" : "outline"}
              size="sm"
              onClick={() => setChain('Ethereum')}
            >
              ETH
            </Button>
            <Button
              variant={chain === 'Bitcoin' ? "default" : "outline"}
              size="sm"
              onClick={() => setChain('Bitcoin')}
            >
              BTC
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {/* TODO: Implement overview functionality */}}
            >
              Overview
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {/* TODO: Implement chains functionality */}}
            >
              Chains
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {/* TODO: Implement fees functionality */}}
            >
              Fees
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedCurrency} onValueChange={(value: Currency) => setSelectedCurrency(value)}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="EUR">EUR (€)</SelectItem>
              <SelectItem value="GBP">GBP (£)</SelectItem>
              <SelectItem value="JPY">JPY (¥)</SelectItem>
              <SelectItem value="CNY">CNY (¥)</SelectItem>
            </SelectContent>
          </Select>
          <ThemeToggle />
        </div>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="border-b border-zinc-800 px-6">
          <div className="flex flex-col space-y-4">
            <Tabs defaultValue="tvl" className="w-full">
              <div className="flex justify-between items-center mb-4">
                <TabsList className="bg-zinc-800">
                  <TabsTrigger value="tvl">TVL</TabsTrigger>
                  <TabsTrigger value="marketCap">Market Cap</TabsTrigger>
                  <TabsTrigger value="ratio">Market Cap/TVL</TabsTrigger>
                </TabsList>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`text-xs ${timeframe === 7 ? 'bg-zinc-800' : ''}`}
                    onClick={() => setTimeframe(7)}
                  >
                    7D
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`text-xs ${timeframe === 30 ? 'bg-zinc-800' : ''}`}
                    onClick={() => setTimeframe(30)}
                  >
                    30D
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`text-xs ${timeframe === 90 ? 'bg-zinc-800' : ''}`}
                    onClick={() => setTimeframe(90)}
                  >
                    90D
                  </Button>
                </div>
              </div>

              <CardContent className="pt-6">
                <TabsContent value="tvl" className="h-[400px] relative">
                  {chartData?.tvl && chartData.tvl.length > 0 ? (
                    <Line 
                      options={getChartOptions('TVL')} 
                      data={getChartData('tvl')!} 
                      height={400}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-500">
                      No TVL data available
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="marketCap" className="h-[400px] relative">
                  {chartData?.marketCap && chartData.marketCap.length > 0 ? (
                    <Line 
                      options={getChartOptions('Market Cap')} 
                      data={getChartData('marketCap')!} 
                      height={400}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-500">
                      No Market Cap data available
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="ratio" className="h-[400px] relative">
                  {chartData?.ratio && chartData.ratio.length > 0 ? (
                    <Line 
                      options={getChartOptions('Ratio')} 
                      data={getChartData('ratio')!} 
                      height={400}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-500">
                      No Ratio data available
                    </div>
                  )}
                </TabsContent>
              </CardContent>
            </Tabs>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value Locked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(data.totalTvl, selectedCurrency)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(data.averageChange1d)} from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Protocols</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalProtocols}</div>
            <p className="text-xs text-muted-foreground">
              Active protocols on {chain}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{chain} Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(data.tokenPrice, selectedCurrency)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(data.priceChange24h)} from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Cap/TVL</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.marketCapTvlRatio.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Current ratio
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Top Protocols by TVL</h2>
        <div className="grid gap-4">
          {data.protocols.slice(0, 10).map((protocol) => (
            <Card key={protocol.name}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{protocol.name}</h3>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                      TVL: {formatNumber(protocol.tvl, selectedCurrency)}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatPercentage(protocol.change_1d)} 24h
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatPercentage(protocol.change_7d)} 7d
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}