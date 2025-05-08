import { NextResponse } from 'next/server';
import { fetchProtocols } from '@/services/dataService';

export async function GET() {
  try {
    const protocols = await fetchProtocols();
    return NextResponse.json(protocols);
  } catch (error) {
    console.error('Error fetching protocols:', error);
    return NextResponse.json({ error: 'Failed to fetch protocols' }, { status: 500 });
  }
} 