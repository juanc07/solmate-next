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