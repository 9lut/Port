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
      .collection('experience')
      .orderBy('display_order', 'asc')
      .get();

    const experiences = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        start_date: timestampToString(data.start_date),
        end_date: timestampToString(data.end_date),
        created_at: timestampToString(data.created_at),
        updated_at: timestampToString(data.updated_at),
      };
    });

    return NextResponse.json(experiences);
  } catch (err) {
    console.error('Error fetching experiences:', err);
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

    const docRef = await adminDb.collection('experience').add({
      company: body.company,
      position: body.position,
      description: body.description,
      start_date: body.start_date || null,
      end_date: body.end_date || null,
      is_current: body.is_current || false,
      location: body.location || null,
      skills_used: body.skills_used || [],
      is_published: body.is_published ?? true,
      display_order: body.display_order || 1,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    });

    const created = await docRef.get();
    const data = created.data() || {};

    const experience = {
      id: created.id,
      ...data,
      start_date: timestampToString(data.start_date),
      end_date: timestampToString(data.end_date),
      created_at: timestampToString(data.created_at),
      updated_at: timestampToString(data.updated_at),
    };

    return NextResponse.json(experience, { status: 201 });
  } catch (err) {
    console.error('Error creating experience:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
