import { NextRequest, NextResponse } from 'next/server';
import { adminDb, timestampToString } from '@/lib/firestore-admin';
import { FieldValue } from 'firebase-admin/firestore';

// PUT /api/admin/skills/[id]
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

    const docRef = adminDb.collection('skills').doc(id);

    await docRef.update({
      name: body.name,
      level: body.level,
      category: body.category,
      icon_url: body.icon_url || null,
      color: body.color || null,
      description: body.description || '',
      display_order: body.display_order || 1,
      is_featured: body.is_featured ?? false,
      updated_at: FieldValue.serverTimestamp(),
    });

    const updated = await docRef.get();
    const data = updated.data() || {};

    const skill = {
      id: updated.id,
      ...data,
      created_at: timestampToString(data.created_at),
      updated_at: timestampToString(data.updated_at),
    };

    return NextResponse.json({ skill });
  } catch (error) {
    console.error('Error updating skill:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/skills/[id]
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

    await adminDb.collection('skills').doc(id).delete();

    return NextResponse.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
