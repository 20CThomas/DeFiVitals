"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  
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
            <Link href="/" passHref>
              <Button 
                variant={pathname === "/" ? "default" : "ghost"} 
                size="sm" 
                className={pathname === "/" ? "" : "text-zinc-400 hover:text-white"}
              >
                Overview
              </Button>
            </Link>
            <Link href="/chains" passHref>
              <Button 
                variant={pathname === "/chains" ? "default" : "ghost"} 
                size="sm" 
                className={pathname === "/chains" ? "" : "text-zinc-400 hover:text-white"}
              >
                Chains
              </Button>
            </Link>
            <Link href="/fees" passHref>
              <Button 
                variant={pathname === "/fees" ? "default" : "ghost"} 
                size="sm" 
                className={pathname === "/fees" ? "" : "text-zinc-400 hover:text-white"}
              >
                Fees
              </Button>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button variant="default" size="sm">
            Sign In
          </Button>
        </div>
      </div>
    </header>
  );
}
