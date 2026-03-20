import { NextRequest, NextResponse } from 'next/server';
import { adminDb, timestampToString } from '@/lib/firestore-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function DELETE(
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

    const { id } = await params;
    
    // Check if document exists
    const docRef = adminDb.collection('education').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Education not found' },
        { status: 404 }
      );
    }
    
    // Delete the document
    await docRef.delete();
    
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting education:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    const docRef = adminDb.collection('education').doc(id);

    await docRef.update({
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
      updated_at: FieldValue.serverTimestamp(),
    });

    const updated = await docRef.get();
    const data = updated.data() || {};

    const education = {
      id: updated.id,
      ...data,
      start_date: timestampToString(data.start_date),
      end_date: timestampToString(data.end_date),
      created_at: timestampToString(data.created_at),
      updated_at: timestampToString(data.updated_at),
    };

    return NextResponse.json(education);
  } catch (err) {
    console.error('Error updating education:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
