import { NextRequest, NextResponse } from 'next/server';

// This route is deprecated.
// Images are now provided via external URLs (e.g. Google Drive) instead of uploading.

export async function POST(_request: NextRequest) {
  return NextResponse.json(
    {
      error: 'Simple-upload API has been deprecated. Please provide an external image URL (e.g. Google Drive) instead.',
      deprecated: true,
    },
    { status: 410 }
  );
}
