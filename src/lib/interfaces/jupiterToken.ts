export interface IJupiterToken {
    created_at?: string;
    symbol: string;
    name: string;
    address: string;
    logoURI: string;
    decimals: number;
    daily_volume?: number;
    freeze_authority?: string;
    permanent_delegate?: string;
    extensions?: {
      isVerified?: boolean;
    };
    price: number;
  }