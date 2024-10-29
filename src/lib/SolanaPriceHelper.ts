export class SolanaPriceHelper {
  private static LOCAL_API_URL = "/api/price"; // Proxy route for external API calls
  private static JUPITER_API_URL = "https://price.jup.ag/v6/price";
  private static COINGECKO_API_URL = "https://api.coingecko.com/api/v3/simple/price";
  private static WSOL_ID = "So11111111111111111111111111111111111111112"; // Wrapped SOL ID

  // Log detailed errors
  private static logError(error: any, tokenId: string) {
    console.error(`Error fetching ${tokenId} price:`, error);
  }

  // Fetch from the local API proxy
  private static async fetchFromLocalApi(tokenId: string): Promise<number | null> {
    try {
      console.log(`Fetching price for ${tokenId} from local API route`);
      const response = await fetch(`${this.LOCAL_API_URL}/${tokenId}`);
      const data = await response.json();
      return data[tokenId]?.usd || null;
    } catch (error) {
      this.logError(error, tokenId);
      return null;
    }
  }

  // Fetch price from Jupiter API
  private static async fetchFromJupiter(tokenId: string): Promise<number | null> {
    try {
      console.log(`Fetching price for ${tokenId} from Jupiter API`);
      const response = await fetch(`${this.JUPITER_API_URL}?ids=${tokenId}`);
      const data = await response.json();
      return data?.data?.[tokenId]?.price || null;
    } catch (error) {
      this.logError(error, tokenId);
      return null;
    }
  }

  // Fetch price from CoinGecko API
  private static async fetchFromCoinGecko(tokenId: string): Promise<number | null> {
    try {
      console.log(`Fetching price for ${tokenId} from CoinGecko API`);
      const response = await fetch(
        `${this.COINGECKO_API_URL}?ids=${tokenId.toLowerCase()}&vs_currencies=usd`
      );
      const data = await response.json();
      return data[tokenId.toLowerCase()]?.usd || null;
    } catch (error) {
      this.logError(error, tokenId);
      return null;
    }
  }

  // Smart function to get token price with fallback logic
  public static async getTokenPriceInUSD(tokenId: string): Promise<number> {
    let price = await this.fetchFromLocalApi(tokenId); // Attempt local API proxy first

    if (price === null) {
      console.warn(`Local API failed for ${tokenId}. Falling back to Jupiter.`);
      price = await this.fetchFromJupiter(tokenId);
    }

    if (price === null && tokenId === "SOL") {
      console.warn(`Jupiter API failed for ${tokenId}. Trying WSOL ID...`);
      price = await this.fetchFromJupiter(this.WSOL_ID);
    }

    if (price === null) {
      console.warn(`Jupiter API failed. Falling back to CoinGecko.`);
      price = await this.fetchFromCoinGecko(tokenId);
    }

    if (price === null) {
      console.error(`Failed to fetch price for ${tokenId} from all sources.`);
      return 0; // Return 0 if all APIs fail
    }

    console.log(`Successfully fetched ${tokenId} price: $${price}`);
    return price;
  }

  // Convert token amount to its USD equivalent
  public static async convertTokenToUSDC(
    tokenId: string,
    tokenAmount: number
  ): Promise<number> {
    try {
      const tokenPrice = await this.getTokenPriceInUSD(tokenId);
      return tokenAmount * tokenPrice;
    } catch (error) {
      console.error(`Error converting ${tokenId} to USDC:`, error);
      return 0;
    }
  }
}
