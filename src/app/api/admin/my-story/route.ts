import { NextRequest, NextResponse } from 'next/server';
import { adminDb, timestampToString } from '@/lib/firestore-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function GET() {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { error: 'Firestore not configured' },
        { status: 503 }
      );
    }

    const snapshot = await adminDb
      .collection('my_story')
      .orderBy('display_order', 'asc')
      .get();

    const stories = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        created_at: timestampToString(data.created_at),
        updated_at: timestampToString(data.updated_at),
      };
    });

    return NextResponse.json(stories);
  } catch (err) {
    console.error('Error fetching stories:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { error: 'Firestore not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();

    const docRef = await adminDb.collection('my_story').add({
      title: body.title,
      content: body.content,
      excerpt: body.excerpt,
      is_published: body.is_published ?? false,
      display_order: body.display_order || 1,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    });

    const created = await docRef.get();
    const data = created.data() || {};

    const story = {
      id: created.id,
      ...data,
      created_at: timestampToString(data.created_at),
      updated_at: timestampToString(data.updated_at),
    };

    return NextResponse.json(story, { status: 201 });
  } catch (err) {
    console.error('Error creating story:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
