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

// Define nested structures based on the actual data format
export interface Content {
    $schema?: string;
    json_uri: string;
    files: Array<{
        uri: string;
        cdn_uri: string;
        mime: string;
    }>;
    metadata: {
        name: string;
        description: string;
        symbol?: string;
        token_standard?: string;
        attributes: Array<{
            value: string;
            trait_type: string;
        }>;
    };
    links: {
        image: string;
        animation_url?: string;
        external_url?: string;
    };
}

export interface Compression {
    eligible: boolean;
    compressed: boolean;
    data_hash: string;
    creator_hash: string;
    asset_hash: string;
    tree: string;
    seq: number;
    leaf_id: number;
}

export interface Royalty {
    royalty_model: string;
    target?: string | null;
    percent: number;
    basis_points: number;
    primary_sale_happened: boolean;
    locked: boolean;
}

export interface Creator {
    address: string;
    share: number;
    verified: boolean;
}

export interface Ownership {
    frozen: boolean;
    delegated: boolean;
    delegate?: string | null;
    ownership_model: string;
    owner: string;
}

export interface Supply {
    print_max_supply: number;
    print_current_supply: number;
    edition_nonce?: number | null;
}

export interface Grouping {
    group_key: string;
    group_value: string;
}

// Define the structure of the assets
export interface Asset {
    interface: string; // e.g., 'V1_NFT'
    id: string; // Asset ID
    content: Content; // Structured content object
    authorities: Array<{
        address: string;
        scopes: string[];
    }>;
    compression: Compression; // Structured compression object
    grouping: Grouping[]; // Array of groupings
    royalty: Royalty; // Structured royalty object
    creators: Creator[]; // Array of creator objects
    ownership: Ownership; // Structured ownership object
    supply: Supply; // Structured supply object
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

    const data: HeliusResponse<{ items: Asset[] }> = await response.json();

    // Check for errors in the response and handle accordingly
    if (data.error) {
        throw new Error(`API Error: ${data.error.message}`);
    }

    return data.result?.items || [];
}

// Use a generic type for searchAssetsByOwner
export async function searchAssetsByOwner(apiKey: string, ownerAddress: string, limitCount: number): Promise<Asset[]> {
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
                page: 1, // Starts at 1
                limit: limitCount,
            },
        }),
    });

    // Handle the response
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }

    const data: HeliusResponse<{ items: Asset[] }> = await response.json();

    // Check for errors in the response and handle accordingly
    if (data.error) {
        throw new Error(`API Error: ${data.error.message}`);
    }

    return data.result?.items || [];
}
