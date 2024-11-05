import { v4 as uuidv4 } from 'uuid';
import { ITokenAccount,TokenAccountsResponse } from './interfaces/tokenAccount';
import { IAsset } from './interfaces/asset';

function generateRequestId(): string {
    return uuidv4();
}

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

// Define the body structure for the API request
interface ApiRequestBody {
    jsonrpc: string;
    id: string;
    method: string;
    params?: any; // Optional parameters based on your request
}

// Use a function to get tokens by owner
export async function getTokenAccounts(apiKey: string, ownerAddress: string, limitCount: number): Promise<ITokenAccount[]> {
    const requestId = generateRequestId();
    const response = await fetch(`https://mainnet.helius-rpc.com/?api-key=${apiKey}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: requestId,
            method: 'getTokenAccounts',
            params: {
                page: 1, // Starts at 1
                limit: limitCount,
                displayOptions: {
                    showZeroBalance: false,
                },
                owner: ownerAddress,
            },
        }),
    });

    // Handle the response
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    const getTokenAccountsResponse: TokenAccountsResponse = data.result;

    // Check for errors in the response and handle accordingly
    if (!getTokenAccountsResponse || getTokenAccountsResponse.total === 0 || !getTokenAccountsResponse.token_accounts) {
        console.warn(`No token accounts found for owner: ${ownerAddress}`);
        return [];
    }

    // Return the array of token accounts
    return getTokenAccountsResponse.token_accounts;
}


// Use a generic type for searchAssetsByOwner
export async function searchAssetsByOwner(apiKey: string, ownerAddress: string, limitCount: number): Promise<IAsset[]> {
    const requestId = generateRequestId();
    const response = await fetch(`https://mainnet.helius-rpc.com/?api-key=${apiKey}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: requestId,
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

    const data: HeliusResponse<{ items: IAsset[] }> = await response.json();

    // Check for errors in the response and handle accordingly
    if (data.error) {
        throw new Error(`API Error: ${data.error.message}`);
    }

    return data.result?.items || [];
}


export async function getAssetsByOwner(apiKey: string, ownerAddress: string, limitCount: number): Promise<IAsset[]> {
    const requestId = generateRequestId();
    const response = await fetch(`https://mainnet.helius-rpc.com/?api-key=${apiKey}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: requestId,
            method: 'getAssetsByOwner',
            params: {
                ownerAddress: ownerAddress,
                displayOptions: {
                    showFungible: true,
                    showNativeBalance: true,
                },
                page: 1, // Starts at 1
                limit: limitCount,
            },
        }),
    });

    // Handle the response
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }

    const data: HeliusResponse<{ items: IAsset[] }> = await response.json();

    // Check for errors in the response and handle accordingly
    if (data.error) {
        throw new Error(`API Error: ${data.error.message}`);
    }

    return data.result?.items || [];
}
