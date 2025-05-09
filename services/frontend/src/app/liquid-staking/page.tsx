import { LiquidStaking } from '@/components/LiquidStaking';
import { Sidebar } from '@/components/Sidebar';

export default function LiquidStakingPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <LiquidStaking />
        </div>
      </main>
    </div>
  );
} 