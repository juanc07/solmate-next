// Define the interface for token extensions (optional)
export interface TokenExtensions {
    transfer_fee_amount?: {
        withheld_amount: number;
    };
}

// Define the interface for individual token accounts
export interface ITokenAccount {
    address: string; // The address of the token account
    mint: string; // The mint address of the token
    owner: string; // The owner of the token account
    amount: number; // The amount of tokens in the account
    delegated_amount: number; // The delegated amount of tokens (if any)
    frozen: boolean; // Whether the token account is frozen
    token_extensions?: TokenExtensions; // Optional extensions related to the token
}


// Define the response structure for the token accounts
export interface TokenAccountsResponse {
    total: number; // Total number of token accounts
    limit: number; // Limit of token accounts returned per page
    page: number; // Current page number
    token_accounts: ITokenAccount[]; // Array of token accounts
}