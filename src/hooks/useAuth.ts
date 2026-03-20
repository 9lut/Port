'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth(redirectTo?: string) {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const loading = status === 'loading';
  const user = session?.user || null;

  useEffect(() => {
    if (!loading && !user && redirectTo) {
      const currentPath = window.location.pathname;
      const loginUrl = `${redirectTo}?redirectedFrom=${encodeURIComponent(currentPath)}`;
      router.push(loginUrl);
    }
  }, [user, loading, router, redirectTo]);

  return { user, loading };
}

export function useRequireAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const loading = status === 'loading';
  const user = session?.user || null;

  // ทำ client-side redirect ถ้าไม่มี session
  useEffect(() => {
    if (!loading && !user) {
      const currentPath = window.location.pathname;
      const loginUrl = `/auth/login?returnUrl=${encodeURIComponent(currentPath)}`;
      console.log('No session, redirecting to:', loginUrl);
      router.push(loginUrl);
    }
  }, [user, loading, router]);

  return { user, loading };
}
