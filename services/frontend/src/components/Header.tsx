"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const pathname = usePathname();
  
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="flex h-16 items-center gap-4 px-4 max-w-7xl mx-auto">
        <nav className="flex items-center gap-6">
          <Link 
            href="/" 
            className={`relative py-4 ${
              pathname === "/" 
                ? "text-zinc-900 dark:text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-500" 
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            Overview
          </Link>
          <Link 
            href="/chains" 
            className={`relative py-4 ${
              pathname === "/chains" 
                ? "text-zinc-900 dark:text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-500" 
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            Chains
          </Link>
          <Link 
            href="/fees" 
            className={`relative py-4 ${
              pathname === "/fees" 
                ? "text-zinc-900 dark:text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-500" 
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            Fees
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <ThemeToggle />
          <Button variant="outline" className="h-8">
            Sign In
          </Button>
        </div>
      </div>
    </header>
  );
}
