'use client';

import { useEffect, useState } from 'react';
import HeroSection from '@/components/HeroSection';
import ThreeDScrollSkills from '@/components/ThreeDScrollSkills';
import HomeAboutSection from '@/components/HomeAboutSection';
import FeaturedProjects from '@/components/FeaturedProjects';
import { ChevronUpIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [progress, setProgress] = useState(0); // ความก้าวหน้าการสกอลล์ (0 → 1)
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const p = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      setProgress(p);
      setShow(scrollTop > 200);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference * (1 - progress);

  return (
    <main className="min-h-screen">
      <HeroSection />
      <div id="about">
        <HomeAboutSection />
      </div>
      <ThreeDScrollSkills />
      <div id="featured">
        <FeaturedProjects />
      </div>

      {/* Back to Top Button */}
      <button
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`cursor-pointer fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 
                    transition-all duration-300 
                    ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      >
        <span className="relative grid place-items-center w-14 h-14 rounded-full bg-white/80 backdrop-blur-md shadow-lg ring-1 ring-sky-200 hover:shadow-xl">
          {/* วงแหวน progress */}
          <svg className="absolute inset-0 -rotate-90" width="56" height="56">
            <circle cx="28" cy="28" r={radius} stroke="#e2e8f0" strokeWidth="4" fill="none" />
            <circle
              cx="28"
              cy="28"
              r={radius}
              stroke="url(#gradientStroke)"
              strokeWidth="4"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={dashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 120ms linear' }}
            />
            <defs>
              <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" /> {/* sky-400 */}
                <stop offset="100%" stopColor="#0284c7" /> {/* sky-600 */}
              </linearGradient>
            </defs>
          </svg>

          <ChevronUpIcon className="w-6 h-6 text-sky-700 relative z-10" />
        </span>
      </button>
    </main>
  );
}
