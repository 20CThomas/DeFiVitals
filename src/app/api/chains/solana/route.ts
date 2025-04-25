import { NextResponse } from 'next/server';
import { fetchChainData, fetchChainProtocols } from '@/services/dataService';

export async function GET() {
  try {
    const chainData = await fetchChainData();
    const solanaData = chainData.find(
      (chain) => chain.name.toLowerCase() === 'solana'
    );
    
    if (!solanaData) {
      return NextResponse.json({ error: 'Solana data not found' }, { status: 404 });
    }
    
    // Get Solana protocols
    const protocols = await fetchChainProtocols('solana');
    
    // Combine chain data with protocols
    const result = {
      ...solanaData,
      protocols
    };
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching Solana data:', error);
    return NextResponse.json({ error: 'Failed to fetch Solana data' }, { status: 500 });
  }
}
