interface Chain {
  name: string;
  symbol: string;
  logo: string;
  change24h: number;
  change7d: number;
  tvl: string;
  activeProtocols: number;
}

interface ChainCardProps {
  chain: Chain;
}

export function ChainCard({ chain }: ChainCardProps) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg transform group-hover:scale-105 transition-transform duration-300"></div>
      <div className="rounded-xl border text-card-foreground shadow relative overflow-hidden backdrop-blur-sm bg-background/50 border-border/50 group-hover:border-border transition-colors">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-sm"></div>
              <img
                alt={`${chain.name} logo`}
                src={chain.logo}
                className="relative rounded-full w-12 h-12"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{chain.name}</h2>
              <p className="text-sm text-muted-foreground">{chain.symbol}</p>
            </div>
            <div className="ml-auto text-right">
              <p className={`text-lg font-semibold ${
                chain.change24h > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {chain.change24h > 0 ? '+' : ''}{chain.change24h}%
              </p>
              <p className="text-sm text-muted-foreground">24h Change</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">TVL</p>
              <p className="text-2xl font-bold text-foreground">{chain.tvl}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">7d Change</p>
              <p className={`text-2xl font-bold ${
                chain.change7d > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {chain.change7d > 0 ? '+' : ''}{chain.change7d}%
              </p>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">Active Protocols</p>
              <p className="text-lg font-semibold text-foreground">{chain.activeProtocols}</p>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                style={{ width: `${(chain.activeProtocols / 400) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 