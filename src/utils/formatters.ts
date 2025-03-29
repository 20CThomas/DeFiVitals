export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CNY';

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CNY: '¥'
};

export function formatNumber(num: number, currency: Currency = 'USD'): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  
  if (num >= 1e9) {
    return `${symbol}${(num / 1e9).toFixed(2)}B`;
  }
  if (num >= 1e6) {
    return `${symbol}${(num / 1e6).toFixed(2)}M`;
  }
  if (num >= 1e3) {
    return `${symbol}${(num / 1e3).toFixed(2)}K`;
  }
  return `${symbol}${num.toFixed(2)}`;
}

export function formatPercentage(num: number): string {
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
}

export function formatCurrency(amount: number, fromCurrency: Currency, toCurrency: Currency): number {
  // TODO: Implement real exchange rates
  const mockExchangeRates: Record<Currency, number> = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 150.58,
    CNY: 7.23
  };

  return amount * (mockExchangeRates[toCurrency] / mockExchangeRates[fromCurrency]);
} 