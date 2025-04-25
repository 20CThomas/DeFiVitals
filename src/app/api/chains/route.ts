import { NextResponse } from 'next/server';
import { fetchChainData } from '@/services/dataService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const chain = searchParams.get('chain');
    
    const chainData = await fetchChainData();
    
    if (chain) {
      // Filter for specific chain if requested
      const filteredData = chainData.filter(
        (item) => item.name.toLowerCase() === chain.toLowerCase()
      );
      return NextResponse.json(filteredData);
    }
    
    return NextResponse.json(chainData);
  } catch (error) {
    console.error('Error fetching chain data:', error);
    return NextResponse.json({ error: 'Failed to fetch chain data' }, { status: 500 });
  }
}
