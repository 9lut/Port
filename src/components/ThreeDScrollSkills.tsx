'use client';

import React, { useRef, useEffect, useState } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useAnimationFrame,
  useMotionValue,
} from 'framer-motion';
import { RetroGrid } from '@/components/ui/retro-grid';

// Manual wrap function to avoid @motionone/utils dependency
const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

interface Skill {
  id: string;
  name: string;
  icon_url: string;
  level: string; // Basic | Intermediate | Advance
}

interface ParallaxProps {
  children: React.ReactNode;
  baseVelocity: number;
}

function ParallaxRow({ children, baseVelocity = 100 }: ParallaxProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  /**
   * This is a magic number for how much of the width of the row we probably want to wrap.
   */
  const x = useTransform(baseX, (v: number) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  /**
   * The number of times to repeat the child text should be enough to fill the screen.
   */
  return (
    <div className="overflow-hidden whitespace-nowrap flex flex-nowrap py-4 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
      <motion.div className="flex flex-nowrap gap-6 sm:gap-10" style={{ x }}>
        {children}
        {children}
        {children}
        {children}
      </motion.div>
    </div>
  );
}

export default function ThreeDScrollSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('/api/skills');
        if (response.ok) {
          const data: Skill[] = await response.json();
          setSkills(data);
        }
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };

    fetchSkills();
  }, []);

  if (skills.length === 0) return null;

  // Split into 2 rows for balanced look
  const midPoint = Math.ceil(skills.length / 2);
  const row1 = skills.slice(0, midPoint);
  const row2 = skills.slice(midPoint);

  return (
    <section className="relative py-24 bg-gradient-to-br from-sky-900 via-sky-950 to-slate-950 overflow-hidden">
      {/* Background - Matched with Hero */}
      <div className="absolute inset-0 opacity-40">
        <RetroGrid speedSec={30} />
      </div>

      {/* Subtle Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.1),transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center lg:text-left">
        <div className="inline-block px-4 py-1.5 mb-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-sky-400 text-xs font-bold tracking-widest uppercase">
          Technology Toolkit
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
          Tech <span className="text-sky-400">Stack</span>
        </h2>
        <p className="text-white/50 max-w-2xl font-anuphan text-lg">
          A collection of tools and frameworks I use to build premium digital experiences.
          Sorted by technical proficiency.
        </p>
      </div>

      <div className="relative flex flex-col gap-12 [perspective:1200px]">
        {/* Row 1: Scrolling Left - Very Subtle Tilt */}
        <div className="[transform:rotateX(5deg)_rotateY(-5deg)]">
          <ParallaxRow baseVelocity={-1.5}>
            {row1.map((skill) => (
              <SkillBadge key={`${skill.id}-r1`} skill={skill} />
            ))}
          </ParallaxRow>
        </div>

        {/* Row 2: Scrolling Right - Opposite Subtle Tilt */}
        <div className="[transform:rotateX(-5deg)_rotateY(5deg)]">
          <ParallaxRow baseVelocity={1.5}>
            {row2.map((skill) => (
              <SkillBadge key={`${skill.id}-r2`} skill={skill} />
            ))}
          </ParallaxRow>
        </div>
      </div>
    </section>
  );
}

function SkillBadge({ skill }: { skill: Skill }) {
  return (
    <div className="group relative flex items-center gap-4 px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] hover:bg-white/10 hover:border-sky-400/30 transition-all duration-500 shadow-2xl">
      <div className="w-10 h-10 sm:w-12 sm:h-12 relative flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
        {skill.icon_url ? (
          <img
            src={skill.icon_url}
            alt={skill.name}
            className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(56,189,248,0.4)]"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-sky-400 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
            {skill.name[0]}
          </div>
        )}
      </div>
      <div>
        <div className="text-white font-bold text-lg sm:text-xl whitespace-nowrap tracking-tight">
          {skill.name}
        </div>
      </div>

      {/* Outer Glow */}
      <div className="absolute inset-0 bg-sky-400/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
    </div>
  );
}
