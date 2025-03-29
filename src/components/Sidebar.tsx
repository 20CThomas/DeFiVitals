"use client";

import Link from "next/link";
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { BarChart, Home, LineChart } from 'lucide-react';

export function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("w-64 border-r border-zinc-800 p-4 flex flex-col", className)}>
      <div className="flex items-center gap-2 px-2 py-1.5">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500">
          <span className="text-white font-bold text-sm">DL</span>
        </div>
        <span className="font-semibold">DeFiVitals</span>
      </div>

      <div className="flex-1 mt-8">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Navigation</h2>
          <div className="space-y-1">
            <Link href="/" passHref>
              <Button variant="ghost" className="w-full justify-start">
                <Home className="mr-2 h-4 w-4" />
                Overview
              </Button>
            </Link>
            <Link href="/protocols" passHref>
              <Button variant="ghost" className="w-full justify-start">
                <BarChart className="mr-2 h-4 w-4" />
                Protocols
              </Button>
            </Link>
            <Link href="/liquid-staking" passHref>
              <Button variant="ghost" className="w-full justify-start">
                <LineChart className="mr-2 h-4 w-4" />
                Liquid Staking
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
