import { NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";
import { setSolanaEnvironment, getSolanaEndpoint, SolanaEnvironment } from "@/lib/config";
import { fetchAssetsByOwner, searchAssetsByOwner, Asset, Grouping } from "@/lib/fetchAssets";
import knownScamAddresses from "@/lib/scamAddresses";

interface ProcessedNFT {
  id: string;
  name: string;
  image: string;
  description: string;
  collection: string;
  isVerified: boolean;
  isScam: boolean; // New field for scam detection
  solPrice?: number;
}

function isScamNFT(nft: ProcessedNFT, scamList: string[]): boolean {
  // Check if the collection is in the known scam list, if the image is missing, or if the name contains "airdrop" or "claim"
  return (
    scamList.includes(nft.collection) ||
    !nft.image ||
    (nft.name.toLowerCase().includes("airdrop") || nft.name.toLowerCase().includes("claim"))
  );
}

function isScamByMint(mint: string, scamMintList: string[]): boolean {
  return scamMintList.includes(mint);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const publicKeyParam = searchParams.get("publicKey");
  const fetchNFTsParam = searchParams.get("fetchNFTs") === "true";
  const HELIUS_API_KEY_2 = process.env.HELIUS_API_KEY_2 || '';

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

    // Fetch SPL Token accounts
    const standardTokenAccounts = await connection.getParsedTokenAccountsByOwner(
      publicKey,
      { programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") }
    );

    console.log(`Found ${standardTokenAccounts.value.length} standard token accounts.`);

    const tokens = standardTokenAccounts.value.map(({ account }) => {
      const info = account.data.parsed.info;
      const mint = info.mint;
      const balance = info.tokenAmount.uiAmount || 0;
      return { mint, balance };
    });

    let nfts: ProcessedNFT[] = [];
    if (fetchNFTsParam) {
      try {
        const response: Asset[] = await searchAssetsByOwner(HELIUS_API_KEY_2, publicKeyParam, 1000);

        if (Array.isArray(response)) {
          nfts = response.map((item: Asset) => {
            const collection = item.grouping.find((group: Grouping) => group.group_key === 'collection')?.group_value || 'N/A';
            const isVerified = item.creators?.some(creator => creator.verified) || false;

            const nft: ProcessedNFT = {
              id: item.id,
              name: item.content?.metadata?.name || 'Unknown',
              image: item.content?.links?.image || '',
              description: item.content?.metadata?.description || 'No description available',
              collection,
              isVerified,
              isScam: false, // Initial value, to be set below
              solPrice: 0
            };

            // Check if the NFT is a scam            
            nft.isScam = isScamNFT(nft, knownScamAddresses) || isScamByMint(item.id, knownScamAddresses);

            return nft;
          });

          console.log(`Fetched ${nfts.length} NFTs.`);
        } else {
          console.error("Expected an array, but received:", response);
        }
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      }
    }

    // Filter out scam NFTs
    const verifiedNfts = nfts.filter(nft => nft.isVerified && !nft.isScam);

    // Return SOL balance, tokens, and verified NFT data
    return NextResponse.json({ solBalance, tokens, nfts: verifiedNfts });
  } catch (error) {
    console.error("Error fetching data from Solana:", error);
    return NextResponse.json(
      { error: "Failed to fetch Solana data" },
      { status: 500 }
    );
  }
}
