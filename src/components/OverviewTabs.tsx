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

  const handleTabChange = (value: string) => {
    if (value === 'chains') {
      router.push('/chains');
    } else if (value === 'fees') {
      router.push('/fees');
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
            DeFi Overview
          </h1>
          <p className="text-zinc-400 mt-2">
            Track and analyze DeFi metrics across protocols and chains
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/chains')}
            className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
          >
            Chains
          </button>
          <button
            onClick={() => router.push('/fees')}
            className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
          >
            Fees
          </button>
        </div>
      </div>

      <ChainOverview />
    </div>
  );
} 