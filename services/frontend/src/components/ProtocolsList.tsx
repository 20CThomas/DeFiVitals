'use client';

import { useEffect, useState } from 'react';
import { Protocol } from '@/services/dataService';
import { Card } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, Search } from 'lucide-react';
import Image from 'next/image';

export function ProtocolsList() {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProtocols = async () => {
      try {
        const response = await fetch('/api/protocols');
        const data = await response.json();
        setProtocols(data);
      } catch (error) {
        console.error('Error fetching protocols:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProtocols();
  }, []);

  // Filter protocols based on search query
  const filteredProtocols = protocols.filter(protocol => {
    const searchLower = searchQuery.toLowerCase();
    return (
      protocol.name.toLowerCase().includes(searchLower) ||
      protocol.category.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return <div>Loading protocols...</div>;
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search protocols by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mt-2 text-sm text-zinc-400">
          {filteredProtocols.length} protocols found
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-zinc-400 border-b border-zinc-800">
              <th className="pb-4">Protocol</th>
              <th className="pb-4">Category</th>
              <th className="pb-4 text-right">TVL</th>
              <th className="pb-4 text-right">24h Change</th>
              <th className="pb-4 text-right">Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {filteredProtocols.map((protocol) => (
              <tr key={protocol.id} className="border-b border-zinc-800 last:border-0">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={protocol.logo}
                      alt={protocol.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span className="font-medium">{protocol.name}</span>
                  </div>
                </td>
                <td className="py-4 text-zinc-400">{protocol.category}</td>
                <td className="py-4 text-right">
                  ${(protocol.tvl / 1e9).toFixed(2)}B
                </td>
                <td className="py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {protocol.change_24h >= 0 ? (
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                    )}
                    <span className={protocol.change_24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                      {Math.abs(protocol.change_24h).toFixed(2)}%
                    </span>
                  </div>
                </td>
                <td className="py-4 text-right">
                  ${(protocol.marketCap / 1e9).toFixed(2)}B
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
} 