export class SolanaPriceHelper {
  private static LOCAL_API_URL = "/api/price"; // Proxy route for external API calls

  // Log detailed errors
  private static logError(error: any, tokenId: string): void {
    console.error(`Error fetching ${tokenId} price:`, error);
  }

  // Fetch from the local API proxy
  private static async fetchFromLocalApi(tokenId: string, tokenAddress: string): Promise<number | null> {
    try {
      console.log(`Fetching price for ${tokenId} from local API route`);
      // Construct the URL with both `tokenId` and `tokenAddress`
      const response = await fetch(`${this.LOCAL_API_URL}/${tokenId}/${tokenAddress}`);      
      // Check if response is okay before parsing
      if (!response.ok) {
        console.error(`Error fetching from local API: ${response.status} ${response.statusText}`);
        return null;
      }
  
      // Parse JSON and handle response structure carefully
      const data = await response.json();
      return data.price || null; // Access price directly from the response
    } catch (error) {
      this.logError(error, tokenId);
      return null;
    }
  }

  // Function to get token price using the local proxy API
  public static async getTokenPriceInUSD(tokenId: string, tokenAddress: string): Promise<number> {
    const price = await this.fetchFromLocalApi(tokenId, tokenAddress); // Attempt local API proxy first    
    if (price === null) {
      console.error(`Failed to fetch price for ${tokenId} from local API proxy.`);
      return 0; // Return 0 if the local API proxy fails
    }

    console.log(`Successfully fetched ${tokenId} price: $${price}`);
    return price;
  }

  // Convert token amount to its USD equivalent
  public static async convertTokenToUSDC(
    tokenId: string,
    tokenAddress: string,
    tokenAmount: number
  ): Promise<number> {
    try {
      const tokenPrice = await this.getTokenPriceInUSD(tokenId, tokenAddress);
      return tokenAmount * tokenPrice;
    } catch (error) {
      console.error(`Error converting ${tokenId} to USDC:`, error);
      return 0;
    }
  }
}
