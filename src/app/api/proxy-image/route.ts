// app/api/proxy-image/route.ts
import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_DOMAINS = ['localhost', '127.0.0.1','solmate-next.vercel.app'];

function isDomainAllowed(url: string): boolean {
  try {
    const domain = new URL(url).hostname;
    return ALLOWED_DOMAINS.includes(domain);
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  const imageUrl = req.nextUrl.searchParams.get('url');

  if (!imageUrl) {
    return new NextResponse('URL query parameter is missing', { status: 400 });
  }

  if (!isDomainAllowed(imageUrl)) {
    return new NextResponse('URL is not allowed', { status: 403 });
  }

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return new NextResponse('Failed to fetch image', { status: response.status });
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('Content-Type') || 'application/octet-stream';

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
      },
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    return new NextResponse('Error fetching image', { status: 500 });
  }
}
