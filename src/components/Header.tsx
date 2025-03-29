"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const pathname = usePathname();
  
  return (
    <header className="border-b border-zinc-800 bg-zinc-950">
      <div className="flex h-16 items-center gap-4 px-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="DeFiVitals Logo"
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="text-lg font-semibold">DeFiVitals</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 ml-8">
          <Link href="/" className={pathname === "/" ? "text-white" : "text-zinc-400 hover:text-white"}>
            Overview
          </Link>
          <Link href="/chains" className={pathname === "/chains" ? "text-white" : "text-zinc-400 hover:text-white"}>
            Chains
          </Link>
          <Link href="/fees" className={pathname === "/fees" ? "text-white" : "text-zinc-400 hover:text-white"}>
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
