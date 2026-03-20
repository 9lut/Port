import { withAuth } from 'next-auth/middleware';

export default withAuth(
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        
        // เฉพาะ admin routes ต้องมี token
        if (pathname.startsWith('/admin')) {
          console.log('Admin access check:', { hasToken: !!token, path: pathname });
          return !!token;
        }
        
        // อนุญาตทุก route อื่น
        return true;
      },
    },
    pages: {
      signIn: '/auth/login',
    },
  }
);

export const config = {
  matcher: ['/admin/:path*']
};

// ใช้ middleware ง่าย ๆ แทน
// import { NextResponse } from 'next/server';

// export function middleware() {
//   // ไม่ทำอะไรเลย ปล่อยให้ผ่านหมด
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/admin/:path*']
// };
