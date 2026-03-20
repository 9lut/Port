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

    const docRef = adminDb.collection('experience').doc(id);

    await docRef.update({
      company: body.company,
      position: body.position,
      description: body.description,
      start_date: body.start_date || null,
      end_date: body.end_date || null,
      is_current: body.is_current,
      location: body.location || null,
      skills_used: body.skills_used || [],
      is_published: body.is_published,
      display_order: body.display_order,
      updated_at: FieldValue.serverTimestamp(),
    });

    const updated = await docRef.get();
    const data = updated.data() || {};

    const experience = {
      id: updated.id,
      ...data,
      start_date: timestampToString(data.start_date),
      end_date: timestampToString(data.end_date),
      created_at: timestampToString(data.created_at),
      updated_at: timestampToString(data.updated_at),
    };

    return NextResponse.json(experience);
  } catch (err) {
    console.error('Error updating experience:', err);
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

    await adminDb.collection('experience').doc(id).delete();

    return NextResponse.json({ message: 'Experience deleted successfully' });
  } catch (err) {
    console.error('Error deleting experience:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
