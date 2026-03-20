import { NextRequest, NextResponse } from 'next/server';
import { adminDb, timestampToString } from '@/lib/firestore-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function GET() {
  try {
    console.log('Admin Projects GET: Starting with Firestore');
    
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
        start_date: timestampToString(data.start_date),
        end_date: timestampToString(data.end_date),
        created_at: timestampToString(data.created_at),
        updated_at: timestampToString(data.updated_at),
      };
    });

    console.log('Admin Projects GET: Query result', { 
      projectsCount: projects.length
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Admin Projects GET: Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Admin Projects POST: Starting request');
    
    if (!adminDb) {
      return NextResponse.json(
        { error: 'Firestore not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();
    console.log('Admin Projects POST: Request body', body);

    // Check if this is an update (has id) or create (no id)
    if (body.id) {
      // Update existing project
      const docRef = adminDb.collection('projects').doc(body.id);
      
      await docRef.update({
        title: body.title,
        description: body.description || '',
        demo_url: body.demo_url || null,
        github_url: body.github_url || null,
        gallery_images: body.images || body.gallery_images || [],
        technologies_used: body.technologies_used || body.tech_stack || [],
        project_category: body.project_category || 'Web',
        tags: body.tags || [],
        status: body.status || 'completed',
        is_featured: body.is_featured || false,
        is_published: body.is_published !== undefined ? body.is_published : true,
        display_order: body.display_order || 0,
        start_date: body.start_date || null,
        end_date: body.end_date || null,
        updated_at: FieldValue.serverTimestamp()
      });

      const updatedDoc = await docRef.get();
      const data = updatedDoc.data();

      console.log('Admin Projects POST: Update result', {
        success: true,
        id: updatedDoc.id
      });

      return NextResponse.json({ 
        success: true, 
        data: {
          id: updatedDoc.id,
          ...data,
          images: data?.gallery_images || [],
          start_date: timestampToString(data?.start_date),
          end_date: timestampToString(data?.end_date),
          created_at: timestampToString(data?.created_at),
          updated_at: timestampToString(data?.updated_at),
        }
      });
    } else {
      // Create new project
      const docRef = await adminDb.collection('projects').add({
        title: body.title,
        description: body.description || '',
        demo_url: body.demo_url || null,
        github_url: body.github_url || null,
        gallery_images: body.images || body.gallery_images || [],
        technologies_used: body.technologies_used || body.tech_stack || [],
        project_category: body.project_category || 'Web',
        tags: body.tags || [],
        status: body.status || 'completed',
        is_featured: body.is_featured || false,
        is_published: body.is_published !== undefined ? body.is_published : true,
        display_order: body.display_order || 0,
        start_date: body.start_date || null,
        end_date: body.end_date || null,
        created_at: FieldValue.serverTimestamp(),
        updated_at: FieldValue.serverTimestamp()
      });

      const newDoc = await docRef.get();
      const data = newDoc.data();

      console.log('Admin Projects POST: Insert result', {
        success: true,
        id: docRef.id
      });

      return NextResponse.json({ 
        success: true, 
        data: {
          id: docRef.id,
          ...data,
          images: data?.gallery_images || [],
          start_date: timestampToString(data?.start_date),
          end_date: timestampToString(data?.end_date),
          created_at: timestampToString(data?.created_at),
          updated_at: timestampToString(data?.updated_at),
        }
      });
    }

  } catch (error) {
    console.error('Admin Projects POST: Unexpected error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { error: 'Firestore not configured' },
        { status: 503 }
      );
    }

    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Project ID is required' 
      }, { status: 400 });
    }

    console.log('Admin Projects DELETE: Deleting project', id);

    await adminDb
      .collection('projects')
      .doc(id)
      .delete();

    console.log('Admin Projects DELETE: Successfully deleted project', id);
    return NextResponse.json({ 
      success: true 
    });

  } catch (error) {
    console.error('Admin Projects DELETE: Unexpected error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
