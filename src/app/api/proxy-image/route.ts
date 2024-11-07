import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_IMAGES: { [key: string]: string } = {
  token: '/images/token/default-token.png', // Default token image
  nft: '/images/nft/default-nft.webp',       // Default NFT image
  other: '/images/nft/default-nft.webp'        // Default image for other types
};

export async function GET(req: NextRequest) {
  const imageUrl = req.nextUrl.searchParams.get('url');
  const type = req.nextUrl.searchParams.get('type') || 'other'; // Default to "other" if type is missing

  if (!imageUrl) {
    return NextResponse.json(
      { error: 'URL query parameter is missing' },
      { status: 400 }
    );
  }

  if (!type) {
    return NextResponse.json(
      { error: 'type query parameter is missing' },
      { status: 400 }
    );
  }

  try {
    // Attempt to fetch the image from the provided URL
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    // Check if the fetch was successful
    if (!response.ok) {
      console.error(`Failed to fetch image from URL: ${imageUrl}`);
      return fetchDefaultImage(type); // Use default image based on type
    }

    // Validate that the content is an image
    const contentType = response.headers.get('Content-Type');
    if (!contentType || !contentType.startsWith('image/')) {
      console.error(`Invalid Content-Type for URL: ${imageUrl} - Content-Type: ${contentType}`);
      return fetchDefaultImage(type); // Use default image based on type
    }

    // Read the image as an array buffer and return
    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Optional caching
      },
    });
  } catch (error: any) {
    console.error('Error fetching image:', error);
    return fetchDefaultImage(type); // Use default image based on type
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
