'use client';

import { useState, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Project } from '@/types/project';
import {
  ArrowLeftIcon,
  EyeIcon,
  CodeBracketIcon,
  TagIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Skeleton } from "@/components/ui/skeleton";
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { findMatchingIcon, getIconUrl } from '@/components/DevIconPicker';

export default function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const resolvedParams = use(params);

  useEffect(() => {
    const fetchProject = async (slugParam: string) => {
      try {
        const response = await fetch(`/api/projects/by-slug/${slugParam}`);
        const data = await response.json();
        console.log("Fetched Project Data:", data);
        if (response.ok && data.project) {
          setProject(data.project);
        } else {
          router.push('/404');
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        router.push('/404');
      } finally {
        setLoading(false);
      }
    };
    if (resolvedParams.slug) fetchProject(resolvedParams.slug);
  }, [resolvedParams.slug, router]);

  if (loading || !project) {
    return (
      <div className="min-h-screen bg-white">
        {/* Skeleton Header - เลียนแบบ Gradient Header ของจริง */}
        <div className="relative pt-16 pb-32 px-6 md:px-12 lg:px-24 bg-slate-200 overflow-hidden">
          <div className="max-w-5xl mx-auto relative z-10">
            {/* Back button skeleton */}
            <Skeleton className="h-4 w-32 mb-8 bg-slate-300" />

            <div className="grid lg:grid-cols-3 gap-8 items-end">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex gap-3">
                  <Skeleton className="h-6 w-20 rounded-full bg-slate-300" />
                  <Skeleton className="h-6 w-24 bg-slate-300" />
                </div>
                {/* Title skeleton */}
                <Skeleton className="h-12 w-3/4 md:w-1/2 bg-slate-300" />
                {/* Description skeleton */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full bg-slate-300" />
                  <Skeleton className="h-4 w-5/6 bg-slate-300" />
                </div>
              </div>
              {/* Buttons skeleton */}
              <div className="flex flex-col gap-3">
                <Skeleton className="h-10 w-full rounded-xl bg-slate-300" />
                <Skeleton className="h-10 w-full rounded-xl bg-slate-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Skeleton Carousel - ปรับขนาดตาม aspect-[21/9] ที่เราตั้งไว้ */}
        <section className="px-6 md:px-12 lg:px-24 -mt-20 relative z-20">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="w-full aspect-[4/3] md:aspect-[21/9] rounded-3xl shadow-xl border-[4px] border-white bg-slate-200" />
          </div>
        </section>

        {/* Skeleton Content Below */}
        <main className="max-w-4xl mx-auto px-6 py-12 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-4">
            <Skeleton className="h-7 w-40 bg-slate-200" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full bg-slate-100" />
              <Skeleton className="h-4 w-full bg-slate-100" />
              <Skeleton className="h-4 w-3/4 bg-slate-100" />
            </div>
          </div>
          <div className="lg:col-span-4">
            <Skeleton className="h-48 w-full rounded-2xl bg-slate-100" />
          </div>
        </main>
      </div>
    );
  }

  const allImages = project.images ?? [];
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % allImages.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);

  return (
    <div className="min-h-screen bg-white font-anuphan selection:bg-sky-200">
      {/* 1. Header Section - ปรับ Padding ให้กระชับขึ้น */}
      <header className="relative pt-16 pb-32 px-6 md:px-12 lg:px-24 bg-gradient-to-br from-sky-600 via-sky-500 to-blue-600 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <Link href="/projects" className="inline-flex items-center text-sm font-medium text-sky-100 hover:text-white transition-colors mb-8 group">
            <ArrowLeftIcon className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Projects
          </Link>

          <div className="grid lg:grid-cols-3 gap-8 items-end">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold uppercase tracking-wider">
                  <TagIcon className="w-3 h-3 mr-1.5" />
                  {project.project_category || 'Project'}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">{project.title}</h1>
              <p className="text-base md:text-lg text-sky-50 leading-relaxed max-w-2xl font-light opacity-90">{project.description}</p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
              {project.demo_url && (
                <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-sky-700 bg-white hover:bg-sky-50 rounded-xl transition-all shadow-lg active:scale-95">
                  <EyeIcon className="w-4 h-4 mr-2" /> Live Preview
                </a>
              )}
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-white bg-sky-700/40 border border-white/30 backdrop-blur-md hover:bg-sky-700/60 rounded-xl transition-all active:scale-95">
                  <CodeBracketIcon className="w-4 h-4 mr-2" /> Source Code
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 2. Compact Carousel Section - ลดขนาดให้พอดีตา */}
      <section className="px-6 md:px-12 lg:px-24 -mt-20 relative z-20">
        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-[4/3] md:aspect-[21/9] bg-slate-50 rounded-3xl shadow-2xl shadow-black/10 overflow-hidden group border-[4px] border-white">

            <div className="relative w-full h-full overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full flex items-center justify-center bg-slate-100"
                >
                  <Zoom zoomMargin={20}>
                    <img
                      src={allImages[currentIndex]}
                      alt={`${project.title} image ${currentIndex + 1}`}
                      className="w-full h-full object-cover bg-white"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.src.includes('placehold.co')) {
                          target.src = `https://placehold.co/800x600/f8fafc/94a3b8?text=Project+Image+${currentIndex + 1}`;
                        }
                      }}
                    />
                  </Zoom>
                </motion.div>
              </AnimatePresence>

              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 text-slate-800 shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeftIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 text-slate-800 shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                </>
              )}

              <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/40 backdrop-blur-md text-white text-[10px] font-bold rounded-full z-10">
                {currentIndex + 1} / {allImages.length}
              </div>
            </div>
          </div>

          {allImages.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-4">
              {allImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-1 transition-all rounded-full ${currentIndex === i ? 'w-6 bg-sky-500' : 'w-1.5 bg-slate-200 hover:bg-slate-300'}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. Detail Content Section - จัดให้ดูสะอาดตา */}
      <main className="max-w-4xl mx-auto px-6 py-12 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <h2 className="text-xl font-bold text-slate-900 mb-5 flex items-center">
            <span className="w-1.5 h-6 bg-sky-500 rounded-full mr-3"></span>
            About this project
          </h2>
          <div className="prose prose-slate max-w-none whitespace-pre-wrap text-slate-600 leading-relaxed font-anuphan font-light text-sm md:text-base">
            {project.description}
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 sticky top-8">
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-4">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies_used?.map((tech, idx) => {
                const matched = findMatchingIcon(tech);
                return (
                  <span key={idx} className="inline-flex items-center gap-2 px-3 py-1.5 bg-white text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 shadow-sm hover:border-sky-300 transition-all group/tech">
                    {matched && (
                      <img
                        src={getIconUrl(matched.icon.name, matched.variant)}
                        alt={tech}
                        className="w-4 h-4 object-contain filter grayscale group-hover/tech:grayscale-0 transition-all"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    )}
                    {tech}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}