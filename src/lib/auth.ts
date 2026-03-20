import { getServerSession } from 'next-auth';
import { authConfig } from './auth-config';
import { redirect } from 'next/navigation';

export async function getSession() {
  return await getServerSession(authConfig);
}

export async function getUser() {
  const session = await getSession();
  return session?.user || null;
}

export async function requireAuth() {
  const session = await getSession();
  
  if (!session?.user) {
    redirect('/auth/login');
  }
  
  return session.user;
}

export async function isAdmin() {
  const session = await getSession();
  // ในที่นี้เราจะถือว่าทุก user ที่ล็อกอินได้คือ admin
  // สามารถเพิ่มตรรกะเพิ่มเติมได้ เช่น ตรวจจาก database หรือ role
  return !!session?.user;
}
