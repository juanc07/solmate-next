import { NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";
import { setSolanaEnvironment, getSolanaEndpoint, SolanaEnvironment } from "@/lib/config";
import { fetchAssetsByOwner, searchAssetsByOwner, Asset, Grouping } from "@/lib/fetchAssets";

// Define the type for the NFTs being returned
interface ProcessedNFT {
  id: string;
  name: string;
  image: string;
  description: string;
  collection: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const publicKeyParam = searchParams.get("publicKey");
  const fetchNFTsParam = searchParams.get("fetchNFTs") === "true"; // Check if fetchNFTs param is passed and set to "true"
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

    let nfts: ProcessedNFT[] = [];
    if (fetchNFTsParam) {
      try {
        // Ensure the response is typed correctly as an array of Asset
        const response: Asset[] = await searchAssetsByOwner(HELIUS_API_KEY_2, publicKeyParam, 5);

        // Check if the response is an array and map it
        if (Array.isArray(response)) {
          nfts = response.map((item: Asset) => ({
            id: item.id,
            name: item.content?.metadata?.name || 'Unknown',
            image: item.content?.links?.image || '',
            description: item.content?.metadata?.description || 'No description available',
            collection: item.grouping.find((group: Grouping) => group.group_key === 'collection')?.group_value || 'N/A',
          }));
          console.log(`Fetched ${nfts.length} NFTs.`);
        } else {
          console.error("Expected an array, but received:", response);
        }

      } catch (error) {
        console.error("Error fetching NFTs:", error);
      }
    }

    // Return SOL balance, ordinary tokens, and NFT data
    return NextResponse.json({ solBalance, tokens, nfts });
  } catch (error) {
    console.error("Error fetching data from Solana:", error);
    return NextResponse.json(
      { error: "Failed to fetch Solana data" },
      { status: 500 }
    );
  }
}
