type Chain = 'ETH' | 'BTC';

interface ChainSelectorProps {
  selectedChain: Chain;
  onChainSelect: (chain: Chain) => void;
}

export function ChainSelector({ selectedChain, onChainSelect }: ChainSelectorProps) {
  return (
    <div className="flex space-x-2">
      <button
        onClick={() => onChainSelect('ETH')}
        className={`inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 rounded-md px-3 text-xs ${
          selectedChain === 'ETH'
            ? 'bg-primary text-primary-foreground shadow hover:bg-primary/90'
            : 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground'
        }`}
      >
        ETH
      </button>
      <button
        onClick={() => onChainSelect('BTC')}
        className={`inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 rounded-md px-3 text-xs ${
          selectedChain === 'BTC'
            ? 'bg-primary text-primary-foreground shadow hover:bg-primary/90'
            : 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground'
        }`}
      >
        BTC
      </button>
    </div>
  );
} 