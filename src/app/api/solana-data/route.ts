import { NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";
import { setSolanaEnvironment, getSolanaEndpoint, SolanaEnvironment } from "@/lib/config";
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplTokenMetadata, fetchDigitalAsset, fetchAllDigitalAssetByOwner, fetchAllDigitalAssetWithTokenByOwner, DigitalAssetWithToken } from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey as UmiPublicKey } from '@metaplex-foundation/umi'
import { INFT } from "@/lib/interfaces/nft";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const publicKeyParam = searchParams.get("publicKey");
  const fetchNFTsParam = searchParams.get("fetchNFTs") === "true"; // Check if fetchNFTs param is passed and set to "true"

  if (!publicKeyParam) {
    return NextResponse.json(
      { error: "Public key is required" },
      { status: 400 }
    );
  }

  try {
    const env = process.env.NEXT_PUBLIC_SOLANA_ENV || "mainnet-beta";
    setSolanaEnvironment(env as SolanaEnvironment);
    console.log(`Using Solana environment: ${env}`);

    const publicKey = new PublicKey(publicKeyParam);
    const connection = new Connection(getSolanaEndpoint());

    // Fetch SOL balance
    const balance = await connection.getBalance(publicKey);
    const solBalance = balance / 1e9; // Convert lamports to SOL

    let nftData: INFT[] = [];

    // Fetch standard SPL Token accounts
    const standardTokenAccounts = await connection.getParsedTokenAccountsByOwner(
      publicKey,
      { programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") } // SPL Token Program
    );

    console.log(`Found ${standardTokenAccounts.value.length} standard token accounts.`);

    const tokens = standardTokenAccounts.value.map(({ account }) => {
      const info = account.data.parsed.info;
      const mint = info.mint;
      const balance = info.tokenAmount.uiAmount || 0;

      return { mint, balance };
    });


    if (fetchNFTsParam) {
      // Fetch NFT metadata for each NFT mint
      const umi = createUmi(getSolanaEndpoint()).use(mplTokenMetadata());

      //const assets = await fetchAllDigitalAssetByOwner(umi, publicKeyParam as UmiPublicKey)
      //console.log("check assets : ", assets);

      const assetTokens: DigitalAssetWithToken[] = await fetchAllDigitalAssetWithTokenByOwner(umi, publicKeyParam as UmiPublicKey);

      // Filter NFTs from the asset tokens
      const nftFromAssetTokens = assetTokens
        .filter(({ token, mint }) => {
          // Check for NFTs based on the amount and decimals
          const amount = token.amount; // The amount from the token object
          const decimals = mint.decimals; // The decimals from the mint object

          // NFT conditions: amount should be greater than or equal to 1, and decimals should be 0
          return amount >= BigInt(1) && decimals === 0; // Use BigInt constructor
        })
        .map(({ mint }) => mint.publicKey); // Map to get the public key of the mint

      console.log(`Found ${nftFromAssetTokens.length} NFT token accounts from nftFromAssetTokens.`);
      console.log("check catch nft: ", nftFromAssetTokens);

      // Fetch NFT accounts from the custom NFT program
      /*const nftTokenAccounts = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        { programId: new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb") } // Custom NFT program
      );

      console.log(`Found ${nftTokenAccounts.value.length} NFT token accounts from custom program.`);

      const nftMintsFromCustom = nftTokenAccounts.value
        .filter(({ account }) => {
          const info = account.data.parsed.info;
          //console.log("custom nft : ", info);
          // Check for NFTs in the custom program
          return info.tokenAmount.amount === '1' && info.tokenAmount.decimals === 0; // NFT conditions
        })
        .map(({ account }) => account.data.parsed.info.mint);*/


      for (const mint of nftFromAssetTokens) {
        try {
          const asset = await fetchDigitalAsset(umi, mint);
          console.log("check meta data from metaplex:==>> ", asset);
          if (asset) {
            console.log(`Fetched metadata for mint: ${mint}`);

            nftData.push({
              mintAddress: mint,
              balance: 1, // NFTs have a fixed balance of 1
              type: "nft",
              name: asset.metadata.name || "Unnamed NFT",
              uri: asset.metadata.uri || "No URI found",
              collection: asset.metadata.symbol || "Unknown",
              updateAuthority: asset.metadata.updateAuthority,
              sellerFeeBasisPoints: asset.metadata.sellerFeeBasisPoints,
              isMutable: asset.metadata.isMutable,
              editionNonce: asset.metadata.editionNonce?.__option === 'Some' ?
                asset.metadata.editionNonce.value :
                undefined, // Get the value of editionNonce if it exists                
              primarySaleHappened: asset.metadata.primarySaleHappened,
            });
          }
        } catch (nftFetchError) {
          console.error(`Failed to fetch NFT data for mint: ${mint}`, nftFetchError);
        }
      }
    }

    // Return SOL balance, ordinary tokens, and NFT data
    return NextResponse.json({ solBalance, tokens, nfts: nftData });
  } catch (error) {
    console.error("Error fetching data from Solana:", error);
    return NextResponse.json(
      { error: "Failed to fetch Solana data" },
      { status: 500 }
    );
  }
}
