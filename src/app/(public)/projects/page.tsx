'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Project } from '@/types/project';
import {
      EyeIcon,
      CodeBracketIcon,
      ArrowRightIcon,
      ChevronLeftIcon,
      ChevronRightIcon
} from '@heroicons/react/24/outline';
import { Skeleton } from "@/components/ui/skeleton";
import { findMatchingIcon, getIconUrl } from '@/components/DevIconPicker';

export default function ProjectsPage() {
      const [projects, setProjects] = useState<Project[]>([]);
      const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
      const [loading, setLoading] = useState(true);
      const [selectedCategory, setSelectedCategory] = useState<string>('all');
      const [currentPage, setCurrentPage] = useState(1);
      const projectsPerPage = 6;

      // Extract unique categories from all projects
      const [categories, setCategories] = useState<string[]>(['all']);

      useEffect(() => {
            const fetchProjects = async () => {
                  try {
                        const response = await fetch('/api/projects');
                        const data = await response.json();
                        if (response.ok && data.projects) {
                              setProjects(data.projects);
                              setFilteredProjects(data.projects);

                              // Extract unique project categories
                              const allCategories = new Set<string>();
                              data.projects.forEach((project: Project) => {
                                    if (project.project_category) {
                                          allCategories.add(project.project_category);
                                    }
                              });
                              setCategories(['all', ...Array.from(allCategories).sort()]);
                        }
                  } catch (error) {
                        console.error('Error fetching projects:', error);
                  } finally {
                        setLoading(false);
                  }
            };

            fetchProjects();
      }, []);

      // Filter projects based on category
      useEffect(() => {
            let filtered = projects;

            if (selectedCategory !== 'all') {
                  filtered = projects.filter(project =>
                        project.project_category === selectedCategory
                  );
            }

            setFilteredProjects(filtered);
            setCurrentPage(1); // Reset to first page when filtering
      }, [projects, selectedCategory]);

      // Pagination
      const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
      const startIndex = (currentPage - 1) * projectsPerPage;
      const currentProjects = filteredProjects.slice(startIndex, startIndex + projectsPerPage);

      const goToPage = (page: number) => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
      };

      if (loading) {
            return (
                  <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100">
                        {/* Hero Skeleton */}
                        <section className="bg-gradient-to-br from-sky-500 via-sky-600 to-blue-700 py-16 sm:py-20 lg:py-24">
                              <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
                                    <Skeleton className="h-14 w-3/4 max-w-lg mx-auto rounded-2xl bg-white/20" />
                                    <Skeleton className="h-24 w-full rounded-2xl bg-white/10" />
                              </div>
                        </section>

                        {/* Filter Skeleton */}
                        <div className="bg-white/95 border-b border-sky-200/50 py-4">
                              <div className="max-w-7xl mx-auto px-4 flex justify-center gap-4">
                                    <Skeleton className="h-10 w-24 rounded-full" />
                                    <Skeleton className="h-10 w-32 rounded-full" />
                                    <Skeleton className="h-10 w-28 rounded-full" />
                                    <Skeleton className="h-10 w-24 rounded-full" />
                              </div>
                        </div>

                        {/* Grid Skeleton */}
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {Array.from({ length: 3 }, (_, i) => (
                                          <div key={i} className="bg-white rounded-3xl p-4 shadow-sm">
                                                <Skeleton className="h-56 w-full rounded-2xl mb-6" />
                                                <div className="px-2 space-y-4">
                                                      <Skeleton className="h-6 w-1/4 rounded-md" />
                                                      <Skeleton className="h-8 w-3/4 rounded-md" />
                                                      <div className="grid grid-cols-3 gap-2 py-4 border-t border-sky-100 mt-4">
                                                            <Skeleton className="h-4 w-full rounded-md" />
                                                            <Skeleton className="h-4 w-full rounded-md" />
                                                            <Skeleton className="h-4 w-full rounded-md" />
                                                      </div>
                                                </div>
                                          </div>
                                    ))}
                              </div>
                        </div>
                  </div>
            );
      }

      return (
            <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 font-anuphan">
                  {/* Page Header */}
                  <section className="relative bg-gradient-to-br from-sky-500 via-sky-600 to-blue-700 py-16 sm:py-20 lg:py-24 overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                        {/* Floating Shapes */}
                        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-bounce"></div>
                        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>

                        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                              <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8 }}
                              >
                                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                                          My <span className="bg-gradient-to-r from-sky-200 to-blue-200 bg-clip-text text-transparent">Projects</span>
                                    </h1>
                                    <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                                          Explore my creative journey through code, design, and innovation.
                                          Each project tells a story of problem-solving and technical excellence.
                                    </p>
                              </motion.div>
                        </div>
                  </section>

                  {/* Modern Filter Section */}
                  <div className="relative bg-white/95 backdrop-blur-md border-b border-sky-200/50 shadow-lg">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                              {/* Mobile Filter */}
                              <div className="block sm:hidden py-4 relative">
                                    <div className="mb-3">
                                          <label className="text-sm font-semibold text-sky-700 mb-2 block">
                                                Select Category
                                          </label>
                                          <select
                                                value={selectedCategory}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                className="w-full px-4 py-3 bg-white border-2 border-sky-200 rounded-xl text-sky-700 font-medium focus:border-sky-400 focus:ring focus:ring-sky-100 transition-all"
                                          >
                                                {categories.map((category) => (
                                                      <option key={category} value={category}>
                                                            {category === "all" ? "All Projects" : category}
                                                      </option>
                                                ))}
                                          </select>
                                    </div>

                                    {/* Mobile Results */}
                                    <div className="flex justify-center">
                                          <div className="bg-sky-50 px-4 py-2 rounded-full border border-sky-200">
                                                <span className="text-sky-700 font-medium text-sm">
                                                      {filteredProjects.length} project
                                                      {filteredProjects.length !== 1 ? "s" : ""} found
                                                </span>
                                          </div>
                                    </div>
                              </div>


                              {/* Desktop Filter */}
                              <div className="hidden sm:block py-6">
                                    <div className="flex items-center justify-between">
                                          <div className="flex items-center space-x-6">
                                                <h3 className="text-xl font-bold text-sky-700">Filter :</h3>
                                                <div className="flex items-center space-x-3">
                                                      {categories.map((category) => (
                                                            <motion.button
                                                                  key={category}
                                                                  onClick={() => setSelectedCategory(category)}
                                                                  whileHover={{ scale: 1.05, y: -2 }}
                                                                  whileTap={{ scale: 0.95 }}
                                                                  className={`
                              px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg
                              ${selectedCategory === category
                                                                              ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white transform -translate-y-1 shadow-sky-200'
                                                                              : 'bg-white text-sky-700 border-2 border-sky-200 hover:border-sky-400 hover:bg-sky-50'
                                                                        }
                            `}
                                                            >
                                                                  {category === 'all' ? 'All Projects' : category}
                                                            </motion.button>
                                                      ))}
                                                </div>
                                          </div>

                                          {/* Desktop Results */}
                                          <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="bg-gradient-to-r from-sky-50 to-blue-50 px-6 py-3 rounded-full border border-sky-200"
                                          >
                                                <div className="flex items-center space-x-2">
                                                      <div className="w-3 h-3 bg-sky-500 rounded-full animate-pulse"></div>
                                                      <span className="text-sky-700 font-semibold">
                                                            {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
                                                      </span>
                                                </div>
                                          </motion.div>
                                    </div>
                              </div>
                        </div>
                  </div>

                  {/* Enhanced Projects Grid */}
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                        {currentProjects.length === 0 ? (
                              <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center py-16 sm:py-20"
                              >
                                    <div className="w-20 h-20 mx-auto mb-6 text-gray-300">
                                          <svg fill="currentColor" viewBox="0 0 20 20" className="w-full h-full">
                                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                          </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No Projects Found</h3>
                                    <p className="text-gray-500 mb-6">Try selecting a different category or view all projects.</p>
                                    <button
                                          onClick={() => setSelectedCategory('all')}
                                          className="px-6 py-3 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-full hover:shadow-lg transition-all font-medium"
                                    >
                                          View All Projects
                                    </button>
                              </motion.div>
                        ) : (
                              <>
                                    {/* Grid Container */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                                          {currentProjects.map((project, index) => (
                                                <motion.div
                                                      key={project.id}
                                                      initial={{ opacity: 0, y: 30 }}
                                                      animate={{ opacity: 1, y: 0 }}
                                                      transition={{ duration: 0.6, delay: index * 0.1 }}
                                                      whileHover={{ y: -5 }}
                                                      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
                                                >
                                                      {/* Project Image */}
                                                      <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                                                            {project.images && project.images.length > 0 ? (
                                                                  <Image
                                                                        src={project.images[0]}
                                                                        alt={project.title}
                                                                        fill
                                                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                                  />
                                                            ) : (
                                                                  <div className="flex items-center justify-center h-full text-gray-400">
                                                                        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                                                                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                                                        </svg>
                                                                  </div>
                                                            )}

                                                            {project.project_category && (
                                                                  <div className="absolute top-3 left-3">
                                                                        <span className="px-3 py-1 bg-black/70 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                                                                              {project.project_category}
                                                                        </span>
                                                                  </div>
                                                            )}

                                                            {/* Overlay */}
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                                            {/* Quick Actions */}
                                                            <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                                                  {project.demo_url && (
                                                                        <a
                                                                              href={project.demo_url}
                                                                              target="_blank"
                                                                              rel="noopener noreferrer"
                                                                              className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                                                                              onClick={(e) => e.stopPropagation()}
                                                                        >
                                                                              <EyeIcon className="w-4 h-4 text-gray-700" />
                                                                        </a>
                                                                  )}
                                                                  {project.github_url && (
                                                                        <a
                                                                              href={project.github_url}
                                                                              target="_blank"
                                                                              rel="noopener noreferrer"
                                                                              className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                                                                              onClick={(e) => e.stopPropagation()}
                                                                        >
                                                                              <CodeBracketIcon className="w-4 h-4 text-gray-700" />
                                                                        </a>
                                                                  )}
                                                            </div>
                                                      </div>

                                                      {/* Project Content */}
                                                      <div className="p-6 flex flex-col flex-grow">
                                                            {/* Content Area - grows to fill space */}
                                                            <div className="flex-grow">
                                                                  {/* Title */}
                                                                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1 group-hover:text-sky-600 transition-colors">
                                                                        {project.title}
                                                                  </h3>

                                                                  {/* Description */}
                                                                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed font-anuphan">
                                                                        {project.description}
                                                                  </p>

                                                                  {/* Technologies Used */}
                                                                  <div className="mb-4">
                                                                        <div className="flex items-center gap-2 flex-wrap">
                                                                              {project.technologies_used?.slice(0, 3).map((tech, index) => {
                                                                                    const matched = findMatchingIcon(tech);
                                                                                    return (
                                                                                          <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-sky-50 to-blue-50 text-sky-700 text-xs font-medium rounded-full border border-sky-200">
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
                                                                                    <span className="text-gray-500 text-xs">
                                                                                          +{(project.technologies_used?.length || 0) - 3} more
                                                                                    </span>
                                                                              )}
                                                                        </div>
                                                                  </div>
                                                            </div>

                                                            {/* Footer - always at bottom */}
                                                            <div className="flex items-center justify-end pt-4 border-t border-gray-100 mt-auto">
                                                                  <Link
                                                                        href={`/projects/${project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                                                        className="inline-flex items-center text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors group/link"
                                                                  >
                                                                        View Details
                                                                        <ArrowRightIcon className="w-4 h-4 ml-1 transform group-hover/link:translate-x-1 transition-transform" />
                                                                  </Link>
                                                            </div>
                                                      </div>
                                                </motion.div>
                                          ))}
                                    </div>

                                    {/* Enhanced Pagination */}
                                    {totalPages > 1 && (
                                          <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 }}
                                                className="flex items-center justify-center mt-10"
                                          >
                                                <div className="flex items-center gap-2 max-w-full overflow-x-auto px-2">

                                                      {/* Previous */}
                                                      <motion.button
                                                            onClick={() => goToPage(currentPage - 1)}
                                                            disabled={currentPage === 1}
                                                            whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
                                                            whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
                                                            className="cursor-pointer flex-shrink-0 inline-flex items-center px-3 py-2 text-xs sm:text-sm text-gray-600 bg-white border border-gray-200 rounded-full disabled:opacity-50"
                                                      >
                                                            <ChevronLeftIcon className="w-4 h-4" />
                                                      </motion.button>

                                                      {/* Page Numbers */}
                                                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                            <motion.button
                                                                  key={page}
                                                                  onClick={() => goToPage(page)}
                                                                  whileTap={{ scale: 0.9 }}
                                                                  className={`
                                                                        cursor-pointer flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm rounded-full
                                                                        ${currentPage === page
                                                                              ? 'bg-sky-500 text-white'
                                                                              : 'bg-white text-sky-600 border border-sky-200'}
                                                                        `}
                                                            >
                                                                  {page}
                                                            </motion.button>
                                                      ))}

                                                      {/* Next */}
                                                      <motion.button
                                                            onClick={() => goToPage(currentPage + 1)}
                                                            disabled={currentPage === totalPages}
                                                            whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
                                                            whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
                                                            className="cursor-pointer flex-shrink-0 inline-flex items-center px-3 py-2 text-xs sm:text-sm text-gray-600 bg-white border border-gray-200 rounded-full disabled:opacity-50"
                                                      >
                                                            <ChevronRightIcon className="w-4 h-4" />
                                                      </motion.button>

                                                </div>
                                          </motion.div>
                                    )}
                              </>
                        )}
                  </div>
            </div>
      );
}