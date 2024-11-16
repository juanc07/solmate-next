import { NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";
import { setSolanaEnvironment, getSolanaEndpoint, SolanaEnvironment } from "@/lib/config";
import { getTokenAccounts, searchAssetsByOwner,getAssetsByOwner} from "@/lib/fetchAssets";
import { IAsset,Grouping } from '@/lib/interfaces/asset';
import { ITokenAccount } from '@/lib/interfaces/tokenAccount';
import knownScamAddresses from "@/lib/scamAddresses";
import {IProcessedNFT} from "@/lib/interfaces/processNft";

function isScamNFT(nft: IProcessedNFT, scamList: string[]): boolean {
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

    // get owner fungitable token using helius api
    const tokensFromAccountHelius: ITokenAccount[] = await getTokenAccounts(HELIUS_API_KEY_2, publicKeyParam, 1000);    

    let nfts: IProcessedNFT[] = [];
    if (fetchNFTsParam) {
      try {
        const response: IAsset[] = await searchAssetsByOwner(HELIUS_API_KEY_2, publicKeyParam, 1000);
        if (Array.isArray(response)) {
          nfts = response.map((item: IAsset) => {
            const collection = item.grouping.find((group: Grouping) => group.group_key === 'collection')?.group_value || 'N/A';
            const isVerified = item.creators?.some(creator => creator.verified) || false;

            const nft: IProcessedNFT = {
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
    //return NextResponse.json({ solBalance, tokens, nfts: verifiedNfts,tokensFromAccountHelius });
    return NextResponse.json({ solBalance, nfts: verifiedNfts,tokensFromAccountHelius });
  } catch (error) {
    console.error("Error fetching data from Solana:", error);
    return NextResponse.json(
      { error: "Failed to fetch Solana data" },
      { status: 500 }
    );
  }
}
