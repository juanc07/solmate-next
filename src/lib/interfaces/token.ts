export interface IToken {
    mint: string;
    balance: number;
    icon: string; // URL for the token image
    name: string;
    symbol: string;
    usdValue: number;
    decimals: number;
}