import { NextRequest, NextResponse } from "next/server";

//const JUPITER_API_URL = "https://price.jup.ag/v6/price";
const JUPITER_API_URL = "https://api.jup.ag/price/v2";
const COINGECKO_API_URL = "https://api.coingecko.com/api/v3/simple/price";
const WSOL_ID = "So11111111111111111111111111111111111111112"; // Wrapped SOL ID

// Fetch price from Jupiter API
async function getPriceFromJupiter(tokenAddress: string): Promise<number | null> {
  try {
    console.log(`Fetching price for ${tokenAddress} from Jupiter API`);
    const response = await fetch(`${JUPITER_API_URL}?ids=${tokenAddress}`);

    // Check if response is okay before parsing
    if (!response.ok) {
      console.error(`Error fetching from Jupiter API: ${response.status} ${response.statusText}`);
      return null;
    }

    // Parse JSON and handle response structure
    const data = await response.json();
    console.log(`Fetching price for ${tokenAddress} from Jupiter API got price: ${data?.data?.[tokenAddress]?.price}`);
    return data?.data?.[tokenAddress]?.price || null;
  } catch (error) {
    console.error(`Error fetching ${tokenAddress} price from Jupiter:`, error);
    return null;
  }
}


// Fetch price from CoinGecko API
async function getPriceFromCoinGecko(token: string): Promise<number | null> {
  const COIN_GECKO_API_KEY = process.env.COIN_GECKO_API_KEY || '';
  try {
    console.warn(`Falling back to CoinGecko API for ${token}`);
    const response = await fetch(
      `${COINGECKO_API_URL}?ids=${token.toLowerCase()}&vs_currencies=usd`,
      {
        method: "GET", // Specify the request method (optional, defaults to GET)
        headers: {
          Accept: "application/json", // Set the Accept header
          "x-cg-pro-api-key": COIN_GECKO_API_KEY, // Replace with your actual API key
        },
      }
    );

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('CoinGecko API returned non-JSON response');
      return null;
    }

    const data = await response.json();
    return data[token.toLowerCase()]?.usd || null;
  } catch (error) {
    console.error(`Error fetching price for ${token} from CoinGecko:`, error);
    return null;
  }
}

// 'GET' request handler with fallback logic
export async function GET(
  req: NextRequest,
  { params }: { params: { token: string; tokenAddress: string } }
): Promise<NextResponse> {
  const { token, tokenAddress } = params;

  console.log(`GET token price API called with Token: ${token}, Mint Address: ${tokenAddress}`);

  // First, try to fetch the price from Jupiter
  let price = await getPriceFromJupiter(tokenAddress);

  if (price === null && token === "SOL") {
    //console.warn(`Jupiter API failed for ${token}. Trying WSOL ID...`);
    price = await getPriceFromJupiter(WSOL_ID);
  }

  // If Jupiter fails, try to fetch the price from CoinGecko
  if (price === null) {
    console.warn(`Jupiter API failed for ${token}. Falling back to CoinGecko.`);
    price = await getPriceFromCoinGecko(token);
  }

  // If both Jupiter and CoinGecko fail, return an error
  if (price === null) {
    console.error(`Failed to fetch price for ${token} from both Jupiter and CoinGecko.`);
    return NextResponse.json(
      { error: 'Failed to fetch price data from all sources' },
      { status: 500 }
    );
  }
  return NextResponse.json({ mint_address: tokenAddress, price });
}
