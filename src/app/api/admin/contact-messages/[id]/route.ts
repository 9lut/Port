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

    const docRef = adminDb.collection('contact_messages').doc(id);

    await docRef.update({
      is_read: body.is_read,
      is_starred: body.is_starred,
      replied_at: body.replied_at || null,
      updated_at: FieldValue.serverTimestamp(),
    });

    const updated = await docRef.get();
    const data = updated.data() || {};

    const message = {
      id: updated.id,
      ...data,
      created_at: timestampToString(data.created_at),
      updated_at: timestampToString(data.updated_at),
    };

    return NextResponse.json(message);
  } catch (err) {
    console.error('Error updating contact message:', err);
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

    await adminDb.collection('contact_messages').doc(id).delete();

    return NextResponse.json({ message: 'Contact message deleted successfully' });
  } catch (err) {
    console.error('Error deleting contact message:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
