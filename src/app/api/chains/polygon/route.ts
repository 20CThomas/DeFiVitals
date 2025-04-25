import { NextResponse } from 'next/server';
import { fetchChainData, fetchChainProtocols } from '@/services/dataService';

export async function GET() {
  try {
    const chainData = await fetchChainData();
    const polygonData = chainData.find(
      (chain) => chain.name.toLowerCase() === 'polygon'
    );
    
    if (!polygonData) {
      return NextResponse.json({ error: 'Polygon data not found' }, { status: 404 });
    }
    
    // Get Polygon protocols
    const protocols = await fetchChainProtocols('polygon');
    
    // Combine chain data with protocols
    const result = {
      ...polygonData,
      protocols
    };
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching Polygon data:', error);
    return NextResponse.json({ error: 'Failed to fetch Polygon data' }, { status: 500 });
  }
}
