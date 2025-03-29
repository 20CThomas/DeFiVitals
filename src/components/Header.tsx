"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  
  return (
    <header className="border-b border-zinc-800 bg-zinc-950">
      <div className="flex h-16 items-center gap-4 px-4">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="DeFiVitals Logo"
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="text-lg font-semibold">DeFiVitals</span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="outline" className="h-8">
            Sign In
          </Button>
        </div>
      </div>
    </header>
  );
}
