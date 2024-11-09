export function shuffleArray<T>(array: T[]): T[] {
    // Fisher-Yates (Knuth) Shuffle algorithm
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to return a greeting message
export function greetPerson(personName: string): string {
    return `Hi, ${personName}!`;
}

// Helper function to obfuscate the public key
export const obfuscatePublicKey = (key: string): string => {
    const start = key.slice(0, 4); // First 4 characters
    const end = key.slice(-4); // Last 4 characters
    return `${start}...${end}`; // Obfuscated version
};

// Helper function to sanitize URLs by removing sensitive parts (like API keys)
export const sanitizeUrl = (url: string): string => {
    try {
        const urlObj = new URL(url);
        if (urlObj.searchParams.has('api-key')) {
            urlObj.searchParams.delete('api-key'); // Remove API key
        }
        return urlObj.toString();
    } catch (error) {
        console.error('Invalid URL:', error);
        return url;
    }
};

export const sanitizeImageUrl = (url:string) => {
    try {
      return new URL(url).toString();
    } catch (error) {
      console.error("Invalid URL provided:", url);
      return "/images/token/default-token.png"; // Fallback image path
    }
  };

  // Utility: Format large numbers into 'M' (Million) or 'B' (Billion)
  export const formatLargeNumber = (num: number | string): string => {
    const parsedNum = typeof num === 'string' ? parseFloat(num) : num;
  
    if (isNaN(parsedNum) || parsedNum < 0) {
      return '0.00'; // Handle non-numeric or negative cases
    }
  
    if (parsedNum >= 1_000_000_000_000_000_000) {
      return `${(parsedNum / 1_000_000_000_000_000_000).toFixed(1)}Q`; // Quintillion
    } else if (parsedNum >= 1_000_000_000_000) {
      return `${(parsedNum / 1_000_000_000_000).toFixed(1)}T`; // Trillion
    } else if (parsedNum >= 1_000_000_000) {
      return `${(parsedNum / 1_000_000_000).toFixed(1)}B`; // Billion
    } else if (parsedNum >= 1_000_000) {
      return `${(parsedNum / 1_000_000).toFixed(1)}M`; // Million
    } else if (parsedNum >= 1_000) {
      return `${(parsedNum / 1_000).toFixed(1)}K`; // Thousand
    }
  
    return parsedNum.toFixed(2); // Default formatting for smaller numbers
  };


  export const truncateString = (value: string, maxLength: number): string => {
    if (value.length <= maxLength) return value;
    
    const frontChars = Math.floor((maxLength - 3) / 2);
    const backChars = Math.ceil((maxLength - 3) / 2);
    
    return `${value.slice(0, frontChars)}...${value.slice(-backChars)}`;
  };
  

  export const normalizeAmount = (amount: number, decimals: number): number => {
    return amount / Math.pow(10, decimals);
  };