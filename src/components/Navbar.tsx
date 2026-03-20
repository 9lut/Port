'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { socialConfig } from '@/config/social';
import {
  HomeIcon,
  UserIcon,
  BriefcaseIcon,
  EnvelopeIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

// Simple SVG icons for social media
const GitHubIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" clipRule="evenodd" />
  </svg>
);

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);

      // ตรวจสอบ active section เฉพาะในหน้าแรก
      if (pathname === '/') {
        const sections = ['about', 'featured'];
        const navbarHeight = 80;

        for (const sectionId of sections) {
          const element = document.getElementById(sectionId);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= navbarHeight && rect.bottom > navbarHeight) {
              setActiveSection(sectionId);
              break;
            }
          }
        }

        // ถ้าอยู่ด้านบนสุด ให้เป็น home
        if (window.scrollY < 100) {
          setActiveSection('');
        }
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  const navItems = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'About', href: '#about', icon: UserIcon },
    { name: 'Projects', href: '#featured', icon: BriefcaseIcon },
    { name: 'Contact', href: '/contact', icon: EnvelopeIcon },
  ];

  const handleNavClick = (href: string, e?: React.MouseEvent) => {
    // ถ้าเป็น section link และอยู่ในหน้าแรก
    if (href.startsWith('#') && pathname === '/') {
      e?.preventDefault();
      const sectionId = href.substring(1);
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 80; // ระยะห่างจาก navbar
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      }
      setIsOpen(false);
    } else if (href.startsWith('#')) {
      // ถ้าอยู่หน้าอื่น ให้ไปหน้าแรกก่อน แล้วเลื่อนไปยัง section
      window.location.href = `/${href}`;
    }
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/' && activeSection === '';
    }
    if (href.startsWith('#')) {
      const sectionId = href.substring(1);
      return pathname === '/' && activeSection === sectionId;
    }
    return pathname === href;
  };

  return (
    <nav
      className={[
        'fixed inset-x-0 top-0 z-50',
        'h-16',
        'transition-all duration-300',
        scrolled
          ? 'bg-white/85 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 shadow-md border-b border-black/10'
          : 'bg-transparent backdrop-blur-0 border-b border-transparent',
      ].join(' ')}
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex h-full items-center justify-between">
          {/* Brand */}
          <Link href="/" className="text-3xl flex items-center group">
            <span
              className={[
                'font-medium tracking-tight transition-colors',
                scrolled ? 'text-gray-900' : 'text-white',
              ].join(' ')}
            >
              Lutfee()
            </span>
            <span className={scrolled ? 'text-sky-400 text-3xl' : 'text-sky-300 text-3xl'}>;</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(item.href, e)}
                  className={[
                    'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                    isActive(item.href)
                      ? (scrolled
                        ? 'bg-indigo-100 text-sky-400 ring-1 ring-indigo-200'
                        : 'bg-white/15 text-white ring-1 ring-white/20')
                      : (scrolled
                        ? 'text-gray-700 hover:text-sky-400 hover:bg-gray-100'
                        : 'text-white/90 hover:text-white hover:bg-white/10'),
                  ].join(' ')}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2 ml-2 border-l border-gray-300/30 pl-4">
              <a
                href={socialConfig.github}
                target="_blank"
                rel="noopener noreferrer"
                className={[
                  'p-2 rounded-lg transition-all hover:scale-110',
                  scrolled
                    ? 'text-gray-700 hover:text-sky-400 hover:bg-gray-100'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                ].join(' ')}
                aria-label="GitHub"
              >
                <GitHubIcon className="h-5 w-5" />
              </a>

              <a
                href={socialConfig.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={[
                  'p-2 rounded-lg transition-all hover:scale-110',
                  scrolled
                    ? 'text-gray-700 hover:text-sky-400 hover:bg-gray-100'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                ].join(' ')}
                aria-label="LinkedIn"
              >
                <LinkedInIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* (Optional) Admin action — แสดงเฉพาะอยู่ในเส้นทาง admin */}
          {pathname.includes('admin') && (
            <Link
              href="/auth/login"
              className={[
                'hidden md:inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all',
                'bg-gradient-to-r from-sky-400 to-sky-500 text-white hover:from-sky-500 hover:to-sky-600',
                'shadow-sm hover:shadow',
              ].join(' ')}
            >
              Admin
            </Link>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            className={[
              'md:hidden p-2 rounded-lg transition-colors',
              scrolled ? 'text-gray-800 hover:bg-gray-100' : 'text-white hover:bg-white/10',
            ].join(' ')}
          >
            {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        className={[
          'md:hidden absolute left-0 w-full transition-all duration-300',
          isOpen ? 'top-16 opacity-100' : 'top-12 -translate-y-4 pointer-events-none opacity-0',
        ].join(' ')}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-black/10 bg-white/90 supports-[backdrop-filter]:bg-white/85 backdrop-blur-md shadow-lg overflow-hidden">
            <div className="py-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    handleNavClick(item.href, e);
                    setIsOpen(false);
                  }}
                  className={[
                    'flex items-center gap-3 px-4 py-3 text-base font-medium transition-colors',
                    isActive(item.href)
                      ? 'bg-indigo-50 text-sky-400 border-l-4 border-sky-500'
                      : 'text-gray-800 hover:text-sky-400 hover:bg-gray-50',
                  ].join(' ')}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              ))}

              {/* Social Links สำหรับมือถือ */}
              <div className="border-t border-gray-200 mt-2 pt-2">
                <div className="px-4 py-2">
                  <p className="text-sm font-medium text-gray-500 mb-3">Follow me</p>
                  <div className="flex gap-4">
                    <a
                      href={socialConfig.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-700 hover:text-sky-400 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="p-2 rounded-lg bg-gray-100 hover:bg-sky-50 transition-colors">
                        <GitHubIcon className="h-5 w-5" />
                      </div>
                      <span className="font-medium">GitHub</span>
                    </a>

                    <a
                      href={socialConfig.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-700 hover:text-sky-400 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="p-2 rounded-lg bg-gray-100 hover:bg-sky-50 transition-colors">
                        <LinkedInIcon className="h-5 w-5" />
                      </div>
                      <span className="font-medium">LinkedIn</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
