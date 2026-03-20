import { NextResponse } from 'next/server';
import { adminDb, timestampToString } from '@/lib/firestore-admin';

export async function GET() {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { error: 'Firestore not configured' },
        { status: 503 }
      );
    }

    const snapshot = await adminDb
      .collection('contact_info')
      .where('is_active', '==', true)
      .orderBy('display_order', 'asc')
      .get();

    const contactInfo = snapshot.docs.map((doc) => {
      const data = doc.data() || {};
      return {
        id: doc.id,
        ...data,
        created_at: timestampToString(data.created_at),
        updated_at: timestampToString(data.updated_at),
      };
    });

    return NextResponse.json(contactInfo);
  } catch (err) {
    console.error('Error fetching contact info:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
