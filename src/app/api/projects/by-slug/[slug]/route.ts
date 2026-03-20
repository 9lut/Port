import { NextRequest, NextResponse } from 'next/server';
import { adminDb, timestampToString } from '@/lib/firestore-admin';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(_request: NextRequest, { params }: Props) {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { error: 'Firestore not configured' },
        { status: 503 }
      );
    }

    const { slug } = await params;
    
    // Fetch all projects to find the matching slug
    const snapshot = await adminDb.collection('projects').get();
    
    let targetProject = null;
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      const generatedSlug = data.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      if (generatedSlug === slug) {
        targetProject = {
          id: doc.id,
          ...data,
          images: data.gallery_images?.length > 0 ? data.gallery_images : (data.image_url ? [data.image_url] : []),
          technologies_used: data.tech_stack || data.technologies_used || [],
          created_at: timestampToString(data.created_at),
          updated_at: timestampToString(data.updated_at),
        };
      }
    });

    if (!targetProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ project: targetProject });
  } catch (error: unknown) {
    console.error('GET /api/projects/by-slug/[slug] error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
