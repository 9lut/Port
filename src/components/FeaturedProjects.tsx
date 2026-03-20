'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Project } from '@/types/project';
import { CodeBracketIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { Skeleton } from "@/components/ui/skeleton";
import { findMatchingIcon, getIconUrl } from '@/components/DevIconPicker';

function TiltProjectCard({ project, index }: { project: Project; index: number }) {
      const x = useMotionValue(0);
      const y = useMotionValue(0);

      const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
      const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

      const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
      const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

      const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;

            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const xPct = mouseX / width - 0.5;
            const yPct = mouseY / height - 0.5;

            x.set(xPct);
            y.set(yPct);
      };

      const handleMouseLeave = () => {
            x.set(0);
            y.set(0);
      };

      return (
            <div style={{ perspective: "1000px" }}>
                  <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        style={{
                              rotateX,
                              rotateY,
                              transformStyle: "preserve-3d",
                        }}
                        className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden relative"
                  >
                        {/* Project Image */}
                        <div style={{ transform: "translateZ(30px)" }} className="relative h-48 overflow-hidden bg-white">
                              {project.images && project.images.length > 0 ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                          src={project.images[0]}
                                          alt={project.title}
                                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                          }}
                                    />
                              ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-sky-100 to-blue-200 flex items-center justify-center">
                                          <CodeBracketIcon className="w-16 h-16 text-sky-600" />
                                    </div>
                              )}

                              {/* Category Badge */}
                              {project.project_category && (
                                    <div className="absolute top-3 left-3">
                                          <span className="px-3 py-1 bg-black/70 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                                                {project.project_category}
                                          </span>
                                    </div>
                              )}
                        </div>

                        {/* Project Content */}
                        <div style={{ transform: "translateZ(40px)" }} className="p-6 bg-white relative z-10 h-full">
                              <h3 className="text-xl font-bold line-clamp-2 text-gray-900 mb-3 group-hover:text-sky-600 transition-colors duration-200">
                                    {project.title}
                              </h3>
                              <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                                    {project.description}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                    {project.technologies_used?.slice(0, 3).map((tech: string, index: number) => {
                                          const matched = findMatchingIcon(tech);
                                          return (
                                                <span
                                                      key={index}
                                                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-sky-50 to-blue-50 text-sky-700 border border-sky-200 rounded-xl text-xs font-semibold hover:from-sky-100 hover:to-blue-100 transition-all duration-200 cursor-default"
                                                >
                                                      {matched && (
                                                            <img
                                                                  src={getIconUrl(matched.icon.name, matched.variant)}
                                                                  alt={tech}
                                                                  className="w-3.5 h-3.5 object-contain"
                                                                  onError={(e) => (e.currentTarget.style.display = 'none')}
                                                            />
                                                      )}
                                                      {tech}
                                                </span>
                                          );
                                    })}
                                    {(project.technologies_used?.length || 0) > 3 && (
                                          <span className="text-xs px-2 py-1 bg-gradient-to-r from-gray-50 to-slate-50 text-gray-600 border border-gray-200 rounded-xl text-center font-semibold cursor-default">
                                                +{(project.technologies_used?.length || 0) - 3}
                                          </span>
                                    )}
                              </div>

                              {/* Action Buttons */}
                              <div className="mt-6 flex items-end justify-end">
                                    <Link
                                          href={`/projects/${project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                          className="inline-flex items-center text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors duration-200 group/link before:absolute before:inset-0"
                                    >
                                          Details
                                          <ArrowRightIcon className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform duration-200" />
                                    </Link>
                              </div>
                        </div>
                  </motion.div>
            </div>
      );
}

export default function FeaturedProjects() {
      const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
            const fetchFeaturedProjects = async () => {
                  try {
                        const response = await fetch('/api/projects');
                        const data = await response.json();
                        if (response.ok && data.projects) {
                              const featured = data.projects
                                    .filter((project: Project) => project.display_show || project.is_featured);
                              setFeaturedProjects(featured);
                        }
                  } catch (error) {
                        console.error('Error fetching featured projects:', error);
                  } finally {
                        setLoading(false);
                  }
            };

            fetchFeaturedProjects();
      }, []);

      if (loading) {
            return (
                  <section className="py-20 bg-gradient-to-br from-sky-50 via-white to-blue-50">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                              <div className="text-center mb-16">
                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                          Featured Projects
                                    </h2>
                                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                          Showcasing my most impactful and innovative work
                                    </p>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {[1, 2, 3].map((i) => (
                                          <div key={i} className="bg-white rounded-2xl shadow-lg border border-slate-100 p-4">
                                                <Skeleton className="h-48 w-full rounded-xl mb-6" />
                                                <div className="space-y-3">
                                                      <Skeleton className="h-6 w-3/4 rounded-md" />
                                                      <div className="grid grid-cols-4 gap-2 pt-2">
                                                            <Skeleton className="h-8 w-full rounded-xl" />
                                                            <Skeleton className="h-8 w-full rounded-xl" />
                                                            <Skeleton className="h-8 w-full rounded-xl" />
                                                      </div>
                                                </div>
                                                <div className="mt-6 flex justify-end">
                                                      <Skeleton className="h-8 w-24 rounded-md" />
                                                </div>
                                          </div>
                                    ))}
                              </div>
                        </div>
                  </section>
            );
      }

      if (featuredProjects.length === 0) {
            return null; // Don't show section if no featured projects
      }

      return (
            <section className="py-20 bg-gradient-to-br from-sky-50 via-white to-blue-50">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Section Header */}
                        <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.6 }}
                              className="text-center mb-16"
                        >
                              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                    Featured Projects
                              </h2>
                              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                    Showcasing my most impactful and innovative work
                              </p>
                        </motion.div>

                        {/* Projects Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                              {featuredProjects.map((project, index) => (
                                    <TiltProjectCard key={project.id} project={project} index={index} />
                              ))}
                        </div>

                        {/* View All Projects Button */}
                        <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.6, delay: 0.3 }}
                              className="text-center mt-12"
                        >
                              <Link
                                    href="/projects"
                                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                              >
                                    View All Projects
                                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                              </Link>
                        </motion.div>
                  </div>
            </section>
      );
}
