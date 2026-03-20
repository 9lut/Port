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

    // ดึงข้อมูลทั้งหมดแล้ว filter และ sort ใน memory (ไม่ต้องใช้ composite index)
    const educationSnapshot = await adminDb
      .collection('education')
      .get();

    const allEducations = educationSnapshot.docs.map(doc => {
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

    // Filter และ sort ใน memory
    const educations = allEducations
      .filter((edu) => (edu as Record<string, unknown>).is_published === true)
      .sort((a, b) => 
        ((a as Record<string, unknown>).display_order as number || 0) - 
        ((b as Record<string, unknown>).display_order as number || 0)
      );

    return NextResponse.json(educations);
  } catch (error) {
    console.error('Error fetching educations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
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

    const newDoc = {
      institution: body.institution,
      degree: body.degree,
      field_of_study: body.field_of_study,
      grade: body.grade || null,
      description: body.description || null,
      start_date: body.start_date || null,
      end_date: body.end_date || null,
      is_current: body.is_current,
      location: body.location || null,
      is_published: body.is_published,
      display_order: body.display_order,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    };

    const docRef = await adminDb.collection('education').add(newDoc);
    const added = await docRef.get();

    return NextResponse.json(
      { id: added.id, ...added.data() },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating education:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
