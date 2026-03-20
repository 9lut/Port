'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const returnUrl = searchParams.get('returnUrl') || searchParams.get('redirectedFrom') || '/admin';
  const errorParam = searchParams.get('error');

  // แสดงข้อความ error จาก URL parameters
  useEffect(() => {
    if (errorParam === 'unauthorized') {
      setMessage('คุณไม่มีสิทธิ์เข้าถึงระบบแอดมิน');
    } else if (errorParam === 'session_expired') {
      setMessage('เซสชั่นหมดอายุ กรุณาเข้าสู่ระบบใหม่');
    } else if (errorParam === 'CredentialsSignin') {
      setMessage('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }
  }, [errorParam]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      console.log('🔐 Starting Firebase authentication...');
      
      // 1. Authenticate with Firebase Client SDK
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('✅ Firebase authentication successful:', user.email);
      
      // 2. Get Firebase ID token (for future use if needed)
      await user.getIdToken();
      
      console.log('🎫 Got Firebase ID token');
      
      // 3. Sign in with NextAuth using the Firebase credentials
      // Note: We're passing the email and a dummy password since we already verified with Firebase
      const result = await signIn('credentials', {
        email: user.email,
        password: 'firebase-authenticated', // This won't be checked since we verified above
        redirect: false,
      });

      if (result?.error) {
        setMessage('เกิดข้อผิดพลาดในการสร้างเซสชัน');
        console.error('❌ NextAuth session creation failed:', result.error);
      } else if (result?.ok) {
        setMessage('เข้าสู่ระบบสำเร็จ! กำลังเปลี่ยนหน้า...');
        console.log('✅ NextAuth session created successfully');
        
        // Redirect to the return URL
        setTimeout(() => {
          console.log('🔄 Redirecting to:', returnUrl);
          router.push(returnUrl);
        }, 1000);
      }
    } catch (error: unknown) {
      console.error('❌ Login error:', error);
      const err = error as { code?: string; message?: string };
      
      // Handle Firebase-specific errors
      if (err.code === 'auth/user-not-found') {
        setMessage('ไม่พบผู้ใช้นี้ในระบบ');
      } else if (err.code === 'auth/wrong-password') {
        setMessage('รหัสผ่านไม่ถูกต้อง');
      } else if (err.code === 'auth/invalid-email') {
        setMessage('รูปแบบอีเมลไม่ถูกต้อง');
      } else if (err.code === 'auth/too-many-requests') {
        setMessage('มีการพยายามเข้าสู่ระบบมากเกินไป กรุณารอสักครู่');
      } else {
        setMessage('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50">
      <div className="flex min-h-screen">
        {/* Left Side - Decorative */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-sky-500 to-cyan-600 items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative text-center text-white px-8">
            <h1 className="text-5xl font-bold mb-6">Admin Panel</h1>
            <p className="text-xl opacity-90 mb-8">
              Manage your portfolio and content
            </p>
          </div>
          {/* Decorative Elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full"></div>
          <div className="absolute top-1/2 left-0 w-16 h-16 bg-white/10 rounded-full -translate-x-8"></div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-700">
                Login
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Manage your portfolio and content
              </p>
            </div>

            {/* Form */}
            <form className="mt-8 space-y-6" onSubmit={handleAuth}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-colors"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      className="appearance-none relative block w-full px-3 py-3 pr-12 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-colors"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer z-20 hover:scale-110 transition-transform duration-200"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowPassword(!showPassword);
                      }}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-sky-600 transition-colors" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400 hover:text-sky-600 transition-colors" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {message && (
                <div className={`p-4 rounded-lg text-sm ${message.includes('สำเร็จ') || message.includes('โปรดตรวจสอบ')
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                  {message}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] cursor-pointer"
                >
                  {loading ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null}
                  {loading
                    ? 'Logging in...'
                    : 'Login'
                  }
                </button>
              </div>
            </form>

            {/* Back to home */}
            <div className="text-center">
              <Link
                href="/"
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
