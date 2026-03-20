'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
      const pathname = usePathname();
      const isAdminRoute = pathname.startsWith('/admin');
      const isAuthRoute = pathname.startsWith('/auth');

      // Don't show Navbar and Footer for admin and auth routes
      if (isAdminRoute || isAuthRoute) {
            return <>{children}</>;
      }

      return (
            <>
                  <Navbar />
                  {children}
                  <Footer />
            </>
      );
}
