// lib/SolanaPriceHelper.ts
export class SolanaPriceHelper {
    private static API_URL = "https://price.jup.ag/v6/price";
  
    // Fetch token price in USD
    public static async getTokenPriceInUSD(tokenId: string): Promise<number> {
      try {
        const response = await fetch(`${this.API_URL}?ids=${tokenId}`);
        const data = await response.json();
        return data?.data?.[tokenId]?.price || 0;
      } catch (error) {
        console.error(`Error fetching ${tokenId} price:`, error);
        return 0;
      }
    }
  
    // Convert a token value to its equivalent in USDC
    public static async convertTokenToUSDC(
      tokenId: string,
      tokenAmount: number
    ): Promise<number> {
      const tokenPrice = await this.getTokenPriceInUSD(tokenId);
      return tokenAmount * tokenPrice;
    }
  }
  