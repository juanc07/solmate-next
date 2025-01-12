import {NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// 'GET' request handler
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ address: string}> }  
): Promise<NextResponse> {
  const { address } = await context.params;

  console.log(`check token address: ${address}`);

  try {
    const response = await axios.get(`https://tokens.jup.ag/token/${address}`);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(`Failed to fetch token data for ${address}:`, error.message);
    return NextResponse.json(
      { error: 'Failed to fetch token data' },
      { status: error.response?.status || 500 }
    );
  }
}
