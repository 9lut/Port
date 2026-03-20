'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { signOut } from 'next-auth/react';
import { useRequireAuth } from '@/hooks/useAuth';
import {
  HomeIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading } = useRequireAuth();

  const handleLogout = async () => {
    try {
      await signOut({
        callbackUrl: '/auth/login',
        redirect: true,
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // แสดง loading state ขณะตรวจสอบ auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // ถ้ายังไม่ได้ login ให้แสดงข้อความ
  if (!user) {
    console.log('AdminLayout: No user, should redirect soon');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">กำลังเปลี่ยนเส้นทางไปยังหน้าเข้าสู่ระบบ...</p>
        </div>
      </div>
    );
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: HomeIcon },
    { name: 'About', href: '/admin/about', icon: AcademicCapIcon },
    { name: 'Projects', href: '/admin/projects', icon: BookOpenIcon },
    { name: 'Contact Messages', href: '/admin/contacts', icon: ChatBubbleLeftRightIcon },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-sky-400 to-sky-600">
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-white hover:text-gray-200"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-8">
          <div className="px-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                    ${active
                      ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-sky-700 hover:text-gray-900'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className={`
                    mr-3 h-5 w-5 transition-colors
                    ${active ? 'text-white' : 'text-white group-hover:text-white'}
                  `} />
                  {item.name}
                  {active && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-sky-400 to-sky-500 rounded-lg -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* User section */}
          <div className="bg-gradient-to-r from-sky-600 to-sky-700 absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <UserCircleIcon className="w-8 h-8 text-white" />
              <div>
                <p className="text-sm font-medium text-white">
                  {user.name || user.email?.split('@')[0] || 'Admin User'}
                </p>
                <p className="text-xs text-white">{user.email}</p>
              </div>
            </div>
            <div className="space-y-1">
              <Link
                href="/"
                className="bg-gradient-to-r from-gray-300 to-gray-400 flex items-center w-full px-3 py-2 text-sm text-white rounded-lg hover:bg-red-50 transition-colors"
              >
                <ArrowLeftOnRectangleIcon className="w-4 h-4 mr-2" />
                Back to Site
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 flex items-center w-full px-3 py-2 text-sm text-white rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
              >
                <ArrowLeftOnRectangleIcon className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="md:ml-64">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-gray-500 hover:text-gray-700"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {new Date().toLocaleDateString('th-TH', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
