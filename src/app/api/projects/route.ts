import { NextRequest, NextResponse } from 'next/server';
import { adminDb, timestampToString } from '@/lib/firestore-admin';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth-config';
import { ProjectFormData } from '@/types/project';
import { FieldValue } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

// GET - ดึงรายการ projects ทั้งหมด
export async function GET() {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { error: 'Firestore not configured' },
        { status: 503 }
      );
    }

    const projectsSnapshot = await adminDb
      .collection('projects')
      .orderBy('created_at', 'desc')
      .get();

    const projects = projectsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        images: data.gallery_images?.length > 0 ? data.gallery_images : (data.image_url ? [data.image_url] : []),
        technologies_used: data.tech_stack || data.technologies_used || [],
        created_at: timestampToString(data.created_at),
        updated_at: timestampToString(data.updated_at),
      };
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - สร้าง project ใหม่ (ต้อง auth)
export async function POST(request: NextRequest) {
  try {
    // ตรวจสอบ session
    const session = await getServerSession(authConfig);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!adminDb) {
      return NextResponse.json(
        { error: 'Firestore not configured' },
        { status: 503 }
      );
    }

    const projectData: ProjectFormData = await request.json();

    // เพิ่ม timestamps
    const newProject = {
      ...projectData,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    };

    const docRef = await adminDb.collection('projects').add(newProject);
    const doc = await docRef.get();
    const data = doc.data();

    const project = {
      id: doc.id,
      ...data,
      created_at: timestampToString(data?.created_at),
      updated_at: timestampToString(data?.updated_at),
    };

    return NextResponse.json({ project }, { status: 201 });
  } catch (error: unknown) {
    console.error('POST /api/projects error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
