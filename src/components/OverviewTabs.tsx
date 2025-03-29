'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, SortAsc, SortDesc, Info } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ChainOverview } from './EthereumOverview';
import { Protocols } from './Protocols';
import { useRouter } from 'next/navigation';

interface OverviewTabsProps {
  defaultTab?: string;
}

export function OverviewTabs({ defaultTab = 'overview' }: OverviewTabsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (value: string) => {
    if (value === 'chains') {
      router.push('/chains');
    } else if (value === 'fees') {
      router.push('/fees');
    } else {
      setActiveTab(value);
    }
  };

  return (
    <Tabs defaultValue={defaultTab} onValueChange={handleTabChange} className="w-full">
      <div className="border-b border-zinc-800 mb-6">
        <TabsList className="bg-transparent border-b-0">
          <TabsTrigger 
            value="overview"
            className={`px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none ${
              activeTab === 'overview' ? 'text-white font-medium' : 'text-zinc-400'
            }`}
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="chains"
            className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none text-zinc-400"
          >
            Chains
          </TabsTrigger>
          <TabsTrigger 
            value="fees"
            className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none text-zinc-400"
          >
            Fees
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="overview" className="mt-0">
        <ChainOverview />
      </TabsContent>

      <TabsContent value="chains" className="mt-0">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-3xl font-bold">Blockchain Networks</h1>
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search chains..."
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Select>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Sort by..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tvl">TVL</SelectItem>
                          <SelectItem value="change_24h">24h Change</SelectItem>
                          <SelectItem value="change_7d">7d Change</SelectItem>
                          <SelectItem value="protocols">Protocols</SelectItem>
                        </SelectContent>
                      </Select>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="z-[100]">
                      <p>Sort chains by selected metric</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button variant="outline" size="icon">
                  <SortDesc className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Card className="p-6 bg-zinc-900 border-zinc-800">
            <CardHeader className="p-0 pb-4">
              <CardTitle>Click one of the links in the header to view the Chains page</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-zinc-400">
                The Chains tab is now a fully functional page. Navigate to <Button variant="link" className="p-0 h-auto" asChild>
                  <a href="/chains">Chains Page</a>
                </Button> to see all available blockchain networks with detailed metrics.
              </p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="fees" className="mt-0">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-3xl font-bold">Protocol Fees & Revenue</h1>
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search protocols..."
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Select>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Sort by..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dailyFees">Daily Fees</SelectItem>
                          <SelectItem value="weeklyFees">Weekly Fees</SelectItem>
                          <SelectItem value="monthlyFees">Monthly Fees</SelectItem>
                          <SelectItem value="totalFees">Total Fees</SelectItem>
                        </SelectContent>
                      </Select>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="z-[100]">
                      <p>Sort protocols by selected fee metric</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button variant="outline" size="icon">
                  <SortDesc className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Card className="p-6 bg-zinc-900 border-zinc-800">
            <CardHeader className="p-0 pb-4">
              <CardTitle>Click one of the links in the header to view the Fees page</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-zinc-400">
                The Fees tab is now a fully functional page. Navigate to <Button variant="link" className="p-0 h-auto" asChild>
                  <a href="/fees">Fees Page</a>
                </Button> to see detailed protocol fee analytics and metrics.
              </p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
} 