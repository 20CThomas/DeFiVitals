"use client";

import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { OverviewTabs } from "@/components/OverviewTabs";
import { Footer } from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>
          <OverviewTabs />
        </main>
        <Footer className="mt-auto" />
      </div>
    </div>
  );
}
