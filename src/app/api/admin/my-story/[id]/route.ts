import { NextRequest, NextResponse } from 'next/server';
import { adminDb, timestampToString } from '@/lib/firestore-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function PUT(
  request: NextRequest,
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

    const docRef = adminDb.collection('my_story').doc(id);

    await docRef.update({
      title: body.title,
      content: body.content,
      excerpt: body.excerpt,
      is_published: body.is_published,
      display_order: body.display_order,
      updated_at: FieldValue.serverTimestamp(),
    });

    const updated = await docRef.get();
    const data = updated.data() || {};

    const story = {
      id: updated.id,
      ...data,
      created_at: timestampToString(data.created_at),
      updated_at: timestampToString(data.updated_at),
    };

    return NextResponse.json(story);
  } catch (err) {
    console.error('Error updating story:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
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

    await adminDb.collection('my_story').doc(id).delete();

    return NextResponse.json({ message: 'Story deleted successfully' });
  } catch (err) {
    console.error('Error deleting story:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
