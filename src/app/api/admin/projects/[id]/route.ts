import { NextResponse } from 'next/server';
import { adminDb, timestampToString } from '@/lib/firestore-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { error: 'Firestore not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { id } = await params;
    
    const docRef = adminDb.collection('projects').doc(id);
    
    await docRef.update({
      title: body.title,
      description: body.description || '',
      long_description: body.long_description || '',
      demo_url: body.demo_url || null,
      github_url: body.github_url || null,
      image_url: body.image_url || null,
      thumbnail_url: body.thumbnail_url || null,
      gallery_images: body.gallery_images || [],
      main_image_index: body.main_image_index !== undefined ? body.main_image_index : 0,
      tech_stack: body.tech_stack || body.technologies_used || [],
      tags: body.tags || [],
      status: body.status || 'completed',
      is_featured: body.is_featured || false,
      is_published: body.is_published !== undefined ? body.is_published : true,
      display_order: body.display_order || 0,
      start_date: body.start_date || null,
      end_date: body.end_date || null,
      updated_at: FieldValue.serverTimestamp()
    });

    const updatedDoc = await docRef.get();
    const data = updatedDoc.data();

    const project = {
      id: updatedDoc.id,
      ...data,
      start_date: timestampToString(data?.start_date),
      end_date: timestampToString(data?.end_date),
      created_at: timestampToString(data?.created_at),
      updated_at: timestampToString(data?.updated_at),
    };

    return NextResponse.json(project);
  } catch (err) {
    console.error('Error updating project:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { error: 'Firestore not configured' },
        { status: 503 }
      );
    }

    const { id } = await params;
    
    await adminDb
      .collection('projects')
      .doc(id)
      .delete();

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('Error deleting project:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
