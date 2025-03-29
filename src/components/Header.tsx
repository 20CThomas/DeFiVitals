"use client";

import Link from "next/link";
import { Button } from "./ui/button";

export function Header() {
  return (
    <header className="border-b border-zinc-800 sticky top-0 bg-zinc-950 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">DL</span>
            </div>
            <span className="text-white font-bold text-lg hidden md:inline-block">DeFiVitals</span>
          </Link>

          <nav className="ml-8 hidden md:flex items-center gap-6">
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
              Overview
            </Button>
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
              Chains
            </Button>
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
              Fees
            </Button>
          </nav>
        </div>

        <div>
          <Button variant="default" size="sm">
            Sign In
          </Button>
        </div>
      </div>
    </header>
  );
}
