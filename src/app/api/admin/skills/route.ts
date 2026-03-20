import { NextRequest, NextResponse } from 'next/server';
import { adminDb, timestampToString } from '@/lib/firestore-admin';
import { FieldValue } from 'firebase-admin/firestore';

// GET /api/admin/skills
export async function GET() {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { error: 'Firestore not configured' },
        { status: 503 }
      );
    }

    const snapshot = await adminDb
      .collection('skills')
      .orderBy('display_order', 'asc')
      .get();

    const skills = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        created_at: timestampToString(data.created_at),
        updated_at: timestampToString(data.updated_at),
      };
    });

    return NextResponse.json({ skills });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/skills
export async function POST(request: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { error: 'Firestore not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();

    const docRef = await adminDb.collection('skills').add({
      name: body.name,
      level: body.level,
      category: body.category,
      icon_url: body.icon_url || null,
      color: body.color || null,
      description: body.description || '',
      display_order: body.display_order || 1,
      is_featured: body.is_featured ?? false,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    });

    const created = await docRef.get();
    const data = created.data() || {};

    const skill = {
      id: created.id,
      ...data,
      created_at: timestampToString(data.created_at),
      updated_at: timestampToString(data.updated_at),
    };

    return NextResponse.json({ skill }, { status: 201 });
  } catch (error) {
    console.error('Error creating skill:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
