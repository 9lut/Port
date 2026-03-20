'use client';

import { useEffect, useState } from 'react';
import { ArrowDownIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { TypeAnimation } from 'react-type-animation';
import Image from 'next/image';
import { RetroGrid } from './ui/retro-grid';

interface Skill {
  id: string;
  name: string;
  icon_url: string;
}

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projectCount, setProjectCount] = useState<number>(0);

  useEffect(() => {
    setMounted(true);

    const fetchData = async () => {
      try {
        // Fetch Skills
        const skillsRes = await fetch('/api/skills');
        if (skillsRes.ok) {
          const data = await skillsRes.json();
          setSkills(data.slice(0, 5));
        }

        // Fetch Projects for count
        const projectsRes = await fetch('/api/projects');
        if (projectsRes.ok) {
          const data = await projectsRes.json();
          setProjectCount(data.projects?.length || 0);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!mounted) return null;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500 via-sky-700 to-indigo-900">
        <RetroGrid speedSec={25} />
      </div>

      {/* Radial glow overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_60%_40%,rgba(56,189,248,0.18),transparent)]" />

      {/* Animated particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              width: `${Math.random() > 0.7 ? 3 : 2}px`,
              height: `${Math.random() > 0.7 ? 3 : 2}px`,
              background: `rgba(255,255,255,${0.15 + Math.random() * 0.25})`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2.5 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Content grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-16 pb-10 lg:pt-0 lg:pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-12 items-end lg:items-center">

          {/* ── Image column (top on mobile, right on desktop) ── */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative">
              <div
                className="
      relative z-10 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl
      w-48 h-48
      sm:w-56 sm:h-56
      md:w-64 md:h-64
      lg:w-80 lg:h-80
      xl:w-96 xl:h-96
    "
              >
                <Image
                  src="/Lutfee.png"
                  alt="Profile"
                  fill
                  priority
                  sizes="(min-width:1280px) 24rem, (min-width:1024px) 20rem, (min-width:768px) 16rem, (min-width:640px) 14rem, 12rem"
                  className="object-cover"
                />
              </div>

              {/* Glow ขนาดย่อให้เข้ากับรูปที่เล็กลง */}
              <div
                className="
      absolute -inset-1 sm:-inset-2 md:-inset-2
      bg-gradient-to-r from-sky-500 to-sky-600
      rounded-3xl blur-xl opacity-50 animate-pulse
    "
              />

              {/* Floating Tech Badges */}
              {skills.map((skill, index) => {
                const positions = [
                  { top: '-5%', left: '-5%', delay: '0s' },
                  { top: '15%', right: '-10%', delay: '1s' },
                  { bottom: '10%', right: '-5%', delay: '2s' },
                  { bottom: '-5%', left: '10%', delay: '3s' },
                  { top: '40%', left: '-12%', delay: '4s' },
                ];

                const pos = positions[index % positions.length];

                return (
                  <div
                    key={skill.id}
                    className="absolute z-20 bg-white/10 backdrop-blur-md border border-white/20 p-2 sm:p-2.5 md:p-3 rounded-2xl shadow-xl transition-transform cursor-default"
                    style={pos}
                  >
                    {skill.icon_url ? (
                      <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 relative flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={skill.icon_url}
                          alt={skill.name}
                          className="w-full h-full object-contain z-10"
                          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) {
                              fallback.style.display = 'flex';
                            }
                          }}
                        />
                        <div
                          className="hidden absolute inset-0 w-full h-full bg-gradient-to-br from-sky-400 to-blue-500 items-center justify-center text-white text-xs sm:text-sm font-bold rounded-lg z-0"
                        >
                          {skill.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                    ) : (
                      <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center">
                        <span className="text-white text-xs sm:text-sm font-bold">
                          {skill.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Text column ── */}
          <div className="order-2 lg:order-1 space-y-4 lg:space-y-6 text-center lg:text-left mt-6 lg:mt-0">

            {/* Eyebrow tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5
                            bg-white/10 backdrop-blur-sm border border-white/20
                            rounded-full text-sky-200 text-xs sm:text-sm font-medium
                            tracking-widest uppercase mx-auto lg:mx-0">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse inline-block" />
              Available for work
            </div>

            <h1 className="text-white">
              <div className="text-base sm:text-lg md:text-xl font-light text-white/70 mb-1 tracking-wide">
                Hello, I&apos;m
              </div>
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold
                              bg-gradient-to-r from-white via-sky-100 to-indigo-200
                              bg-clip-text text-transparent leading-tight tracking-tight">
                Lutfee Dorloh
              </div>
            </h1>

            {/* Animated role */}
            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl
                            text-sky-200 font-semibold
                            h-8 sm:h-10 flex items-center justify-center lg:justify-start">
              <span className="text-white/40 mr-2 text-2xl leading-none">/</span>
              <TypeAnimation
                sequence={[
                  'Full Stack Developer', 2200,
                  'UI/UX Designer', 2200,
                  'Software Engineer', 2200,
                  'Creative Thinker', 2200,
                ]}
                wrapper="span"
                speed={52}
                repeat={Infinity}
              />
            </div>

            <p className="text-sm sm:text-base md:text-lg text-white/70
                          max-w-md leading-relaxed mx-auto lg:mx-0
                          font-anuphan px-2 sm:px-0">
              Driven by a passion for building stunning, practical, and user-friendly
              applications. Join me in creating wonders that inspire.
            </p>

            {/* Stats row */}
            <div className="flex justify-center lg:justify-start gap-6 sm:gap-8 pt-1">
              {[
                { value: '1+', label: 'Years exp.' },
                { value: `${projectCount}+`, label: 'Projects' },
                { value: '100%', label: 'Passion' },
              ].map((s) => (
                <div key={s.label} className="text-center lg:text-left">
                  <div className="text-xl sm:text-2xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-white/50 uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-1">
              <button
                onClick={() => scrollToSection('featured')}
                className="cursor-pointer group
                           px-7 py-3.5 sm:py-4
                           bg-white text-sky-800
                           rounded-full font-bold text-sm sm:text-base
                           hover:bg-sky-50
                           transform hover:scale-105 active:scale-95
                           transition-all duration-200
                           shadow-[0_4px_24px_rgba(255,255,255,0.25)]
                           font-anuphan flex items-center justify-center gap-2"
              >
                View My Work
                <ArrowDownIcon className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
              </button>

              <button
                className="cursor-pointer group
                           px-7 py-3.5 sm:py-4
                           border border-white/30 text-white
                           rounded-full font-semibold text-sm sm:text-base
                           hover:bg-white/10 active:bg-white/5
                           backdrop-blur-sm transition-all duration-200
                           flex items-center justify-center gap-2"
              >
                <DocumentArrowDownIcon className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                Download CV
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}