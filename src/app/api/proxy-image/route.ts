import { NextRequest, NextResponse } from 'next/server';

const isProduction = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
const baseUrl = isProduction
  ? 'https://solmate-next.vercel.app'
  : 'http://localhost:3000';

const DEFAULT_IMAGES: { [key: string]: string } = {
  token: `${baseUrl}/images/token/default-token.png`,
  nft: `${baseUrl}/images/nft/default-nft.webp`,
  other: `${baseUrl}/images/nft/default-nft.webp`,
};

export async function GET(req: NextRequest) {
  const imageUrl = req.nextUrl.searchParams.get('url');
  const type = req.nextUrl.searchParams.get('type') || 'other';

  if (!imageUrl) {
    return NextResponse.json({ error: 'URL query parameter is missing' }, { status: 400 });
  }

  try {
    // Use AbortController to set a fetch timeout for resource efficiency
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      signal: controller.signal,
    });

    clearTimeout(timeout); // Clear the timeout if fetch is successful

    if (!response.ok) {
      console.error(`Failed to fetch image from URL: ${imageUrl}`);
      return fetchDefaultImage(type);
    }

    const contentType = response.headers.get('Content-Type');
    if (!contentType || !contentType.startsWith('image/')) {
      console.error(`Invalid Content-Type for URL: ${imageUrl} - Content-Type: ${contentType}`);
      return fetchDefaultImage(type);
    }

    // Stream the image directly for memory efficiency
    const imageStream = response.body;

    return new NextResponse(imageStream, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Optional caching for 24 hours
      },
    });
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error('Fetch aborted due to timeout');
    } else {
      console.error('Error fetching image:', error);
    }
    return fetchDefaultImage(type);
  }
}

// Helper function to fetch the default image based on type
async function fetchDefaultImage(type: string): Promise<NextResponse> {
  const defaultImageUrl = DEFAULT_IMAGES[type] || DEFAULT_IMAGES['other'];

  try {
    const fallbackResponse = await fetch(defaultImageUrl);
    const fallbackBuffer = await fallbackResponse.arrayBuffer();
    const fallbackContentType = fallbackResponse.headers.get('Content-Type') || 'image/jpeg';

    return new NextResponse(fallbackBuffer, {
      headers: {
        'Content-Type': fallbackContentType,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (fallbackError) {
    console.error('Error fetching fallback image:', fallbackError);
    return NextResponse.json(
      { error: 'Failed to fetch both main and fallback images' },
      { status: 500 }
    );
  }
}
