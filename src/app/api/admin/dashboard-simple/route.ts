import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firestore-admin';

export async function GET() {
  try {
    console.log('Dashboard API (Firestore): Starting request');

    if (!adminDb) {
      console.warn('Dashboard API (Firestore): adminDb not initialized');
      return NextResponse.json({
        skills_count: 0,
        projects_count: 0,
        experience_count: 0,
        story_count: 0,
        unread_messages: 0,
      });
    }

    // Run all count queries in parallel for speed
    const [
      skillsSnap,
      projectsSnap,
      experienceSnap,
      storySnap,
      contactsSnap,
    ] = await Promise.all([
      adminDb.collection('skills').get(),
      adminDb.collection('projects').get(),
      adminDb.collection('experience').get(),
      adminDb.collection('my_story').get(),
      adminDb
        .collection('contact_messages')
        .where('is_read', '==', false)
        .get(),
    ]);

    const dashboardStats = {
      skills_count: skillsSnap.size,
      projects_count: projectsSnap.size,
      experience_count: experienceSnap.size,
      story_count: storySnap.size,
      unread_messages: contactsSnap.size,
    };

    console.log('Dashboard API (Firestore): Final stats', dashboardStats);

    return NextResponse.json(dashboardStats);
  } catch (error) {
    console.error('Dashboard API (Firestore): Unexpected error:', error);

    return NextResponse.json({
      skills_count: 0,
      projects_count: 0,
      experience_count: 0,
      story_count: 0,
      unread_messages: 0,
    });
  }
}
