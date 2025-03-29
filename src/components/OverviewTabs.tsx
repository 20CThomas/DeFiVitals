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
import { useRouter } from 'next/navigation';

interface OverviewTabsProps {
  defaultTab?: string;
}

export function OverviewTabs({ defaultTab = 'overview' }: OverviewTabsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'chains') {
      router.push('/chains');
    } else if (value === 'fees') {
      router.push('/fees');
    }
  };

  return (
    <div className="w-full space-y-8">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
          DeFi Overview
        </h1>
        <p className="text-zinc-400 mt-2">
          Track and analyze DeFi metrics across protocols and chains
        </p>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="bg-transparent border-b border-zinc-800 w-full justify-start h-auto p-0">
          <TabsTrigger
            value="overview"
            className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none rounded-none"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="chains"
            className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none rounded-none"
          >
            Chains
          </TabsTrigger>
          <TabsTrigger
            value="fees"
            className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none rounded-none"
          >
            Fees
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <ChainOverview />
        </TabsContent>
      </Tabs>
    </div>
  );
} 