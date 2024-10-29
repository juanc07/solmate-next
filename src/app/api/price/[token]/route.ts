import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { token: string } }) {
  const { token } = params;

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${token}&vs_currencies=usd`
    );

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch price" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(`Error fetching price for ${token}:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
