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

    // ดึงข้อมูลทั้งหมดแล้ว filter และ sort ใน memory (ไม่ต้องใช้ composite index)
    const experienceSnapshot = await adminDb
      .collection('experience')
      .get();

    const allExperiences = experienceSnapshot.docs.map(doc => {
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
    const experiences = allExperiences
      .filter((exp) => (exp as Record<string, unknown>).is_published === true)
      .sort((a, b) => 
        ((a as Record<string, unknown>).display_order as number || 0) - 
        ((b as Record<string, unknown>).display_order as number || 0)
      );

    return NextResponse.json(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
