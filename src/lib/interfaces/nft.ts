export interface INFT {        
    name?: string;                   // Display name of the NFT
    image?: string;    
    solPrice?: number;              // Optional Sol Price    
    mintAddress?: string;            // Mint public key of the NFT    
    collection?: string;            // Collection symbol, if applicable
    category?: string;              // Optional Category    
    uri?: string;                    // Link to the metadata JSON        
    isMutable?: boolean;             // If the metadata can be changed
    balance?: number;                // Balance, usually 1 for NFTs
    type?: "nft";                   // Type identifier    
    updateAuthority?: string;        // Authority that can update metadata
    sellerFeeBasisPoints?: number;   // Royalties    
    editionNonce?: number;          // Edition nonce, if applicable
    primarySaleHappened?: boolean;   // Status of the primary sale
  }