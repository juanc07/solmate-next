// Define the expected response structure
export interface HeliusResponse<T> {
    jsonrpc: string;
    id: string;
    result?: T; // result can be optional in case of an error
    error?: {
        code: number;
        message: string;
    }; // Define error structure
}

// Define the expected structure of the assets (modify according to your needs)
export interface Asset {
    interface: string; // e.g., 'V1_NFT'
    id: string; // Asset ID
    content: object; // Assuming content is an object. Define it further based on actual structure.
    authorities: string[]; // Assuming authorities is an array of strings
    compression: object; // Define structure based on actual data
    grouping: string[]; // Assuming grouping is an array of strings
    royalty: object; // Define structure based on actual data
    creators: string[]; // Assuming creators is an array of strings
    ownership: object; // Define structure based on actual data
    supply: object; // Define structure based on actual data
    mutable: boolean;
    burnt: boolean;
}

// Define the body structure for the API request
interface ApiRequestBody {
    jsonrpc: string;
    id: string;
    method: string;
    params?: any; // Optional parameters based on your request
}

// Use a function to fetch assets by owner
export async function fetchAssetsByOwner(apiKey: string, ownerAddress: string): Promise<Asset[]> {
    const response = await fetch(`https://mainnet.helius-rpc.com/?api-key=${apiKey}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: 'my-id',
            method: 'getAssetsByOwner',
            params: {
                ownerAddress: ownerAddress,
                displayOptions: {
                    showFungible: true,
                },
                page: 1, // Starts at 1
                limit: 1000,
            },
        }),
    });

    // Handle the response
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }

    const data: HeliusResponse<Asset[]> = await response.json();

    // Check for errors in the response and handle accordingly
    if (data.error) {
        throw new Error(`API Error: ${data.error.message}`);
    }

    // Ensure that the result is an array before returning
    //return Array.isArray(data.result) ? data.result : []; // Return an empty array if result is not an array
    return data.result || [];
}

/*
The options for tokenType include:

fungible : Returns all fungible tokens.

nonFungible: Returns all NFTs (compressed and regular NFTs).

regularNFT : Returns only the regular NFTs.

compressedNFT: Returns only the compressed NFTs.

all : Returns all the tokens.
*/

// Use a generic type for searchAssetsByOwner
export async function searchAssetsByOwner<T>(apiKey: string, ownerAddress: string): Promise<T[]> {
    const response = await fetch(`https://mainnet.helius-rpc.com/?api-key=${apiKey}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: 'my-id',
            method: 'searchAssets',
            params: {
                ownerAddress: ownerAddress,
                tokenType: 'nonFungible',
                displayOptions: {
                    showNativeBalance: true,
                }
            },
        }),
    });

    // Handle the response
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }

    const data: HeliusResponse<T[]> = await response.json();

    // Check for errors in the response and handle accordingly
    if (data.error) {
        throw new Error(`API Error: ${data.error.message}`);
    }

    // Ensure that the result is an array before returning
    //return Array.isArray(data.result) ? data.result : []; // Return an empty array if result is not an array
    return data.result || [];
}
