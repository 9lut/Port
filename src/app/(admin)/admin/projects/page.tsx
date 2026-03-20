'use client';

import { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import Image from 'next/image';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PhotoIcon,
  CodeBracketIcon,
  XMarkIcon,
  FunnelIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { Skeleton } from "@/components/ui/skeleton";
import { Project, ProjectFormData } from '@/types/project';
import { findMatchingIcon, getIconUrl } from '@/components/DevIconPicker';

const initialFormData: ProjectFormData = {
  title: '',
  description: '',
  demo_url: '',
  github_url: '',
  images: [],
  technologies_used: [],
  project_category: 'Web',
  is_featured: false
};


export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
  const [newTechnology, setNewTechnology] = useState<string>('');
  const [newImageUrl, setNewImageUrl] = useState<string>('');

  // Delete Confirmation State
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // New state for filtering and pagination
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Project categories
  const projectCategories = ['Web', 'Mobile', 'IoT', 'AI', 'Desktop', 'Game', 'API', 'Other'];

  useEffect(() => {
    fetchProjects();
  }, []);

  // Get all unique categories from projects
  const getAllCategories = () => {
    const allCategories = projects.map(project => project.project_category || 'Other');
    return ['all', ...Array.from(new Set(allCategories)).sort()];
  };

  // Filter and search projects
  const getFilteredProjects = () => {
    let filtered = projects;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project =>
        project.project_category === selectedCategory
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.technologies_used && project.technologies_used.some(tech =>
          tech.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
    }

    return filtered;
  };

  // Get paginated projects
  const getPaginatedProjects = () => {
    const filtered = getFilteredProjects();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  // Get total pages
  const getTotalPages = () => {
    const filtered = getFilteredProjects();
    return Math.ceil(filtered.length / itemsPerPage);
  };

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, itemsPerPage]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/admin/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log('Submitting project:', {
        isEdit: !!editingProject,
        projectId: editingProject?.id
      });

      // Always use POST method, but include id for updates
      const requestBody = editingProject
        ? { ...formData, id: editingProject.id }
        : formData;

      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      console.log('Submit response:', result);

      if (response.ok && result.success) {
        console.log('Project saved successfully');
        await fetchProjects();
        handleCloseModal();
      } else {
        console.error('Failed to save project:', result.error);
        alert('Failed to save project: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error saving project. Please try again.');
    }
  };

  const promptDelete = (id: string) => {
    setProjectToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);

    try {
      console.log('Deleting project with ID:', projectToDelete);
      const response = await fetch(`/api/admin/projects?id=${projectToDelete}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log('Project deleted successfully');
        await fetchProjects();
        setIsConfirmModalOpen(false);
        setProjectToDelete(null);
      } else {
        console.error('Failed to delete project:', result.error);
        alert('Failed to delete project: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      description: project.description || '',
      demo_url: project.demo_url || '',
      github_url: project.github_url || '',
      images: project.images || [],
      technologies_used: project.technologies_used || [],
      project_category: project.project_category || 'Web',
      is_featured: project.is_featured ?? project.display_show ?? false
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setFormData(initialFormData);
    setNewTechnology('');
    setNewImageUrl('');
  };

  const handleAddImageUrl = () => {
    let trimmedUrl = newImageUrl.trim();
    
    // Auto-convert Google Drive links to direct image links
    try {
      if (trimmedUrl.includes('drive.google.com')) {
        // Matches https://drive.google.com/file/d/FILE_ID/view...
        const fileMatch = trimmedUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (fileMatch && fileMatch[1]) {
          trimmedUrl = `https://lh3.googleusercontent.com/d/${fileMatch[1]}`;
        } else {
          // Matches https://drive.google.com/open?id=FILE_ID
          const urlObj = new URL(trimmedUrl);
          const id = urlObj.searchParams.get('id');
          if (id) {
            trimmedUrl = `https://lh3.googleusercontent.com/d/${id}`;
          }
        }
      }
    } catch (e) {
      console.error("Error transforming URL:", e);
    }

    if (trimmedUrl && !formData.images.includes(trimmedUrl) && formData.images.length < 5) {
      setFormData({
        ...formData,
        images: [...formData.images, trimmedUrl]
      });
      setNewImageUrl('');
    }
  };

  const handleAddImageUrlEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddImageUrl();
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const handleAddTechnology = () => {
    const trimmedTech = newTechnology.trim();
    if (trimmedTech && !formData.technologies_used.includes(trimmedTech)) {
      setFormData({
        ...formData,
        technologies_used: [...formData.technologies_used, trimmedTech]
      });
      setNewTechnology('');
    }
  };

  const handleAddTechnologyEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTechnology();
    }
  };

  const handleRemoveTechnology = (index: number) => {
    setFormData({
      ...formData,
      technologies_used: formData.technologies_used.filter((_, i) => i !== index)
    });
  };



  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 md:p-6 border border-blue-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64 rounded-xl" />
            <Skeleton className="h-4 w-32 rounded-md" />
          </div>
          <Skeleton className="h-12 w-40 rounded-xl" />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 md:p-6 space-y-4 md:space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <Skeleton className="h-10 w-64 rounded-xl" />
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex justify-between items-center p-4 border rounded-xl">
                  <div className="flex gap-4 items-center w-full">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-1/3 rounded-md" />
                      <Skeleton className="h-3 w-1/2 rounded-md" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 md:p-6 border border-blue-100">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">Projects Management</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                {projects.length} Total Projects
              </span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 md:px-6 md:py-3 rounded-xl flex items-center justify-center gap-2 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 text-sm md:text-base"
          >
            <PlusIcon className="h-4 w-4 md:h-5 md:w-5" />
            <span className="hidden sm:inline">Add New Project</span>
            <span className="sm:hidden">Add Project</span>
          </motion.button>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-xl p-3 md:p-4 border border-gray-200 shadow-sm">
        <div className="flex flex-col gap-4">
          {/* Search and Technology Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Category Filter */}
            <div className="relative sm:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-auto pl-4 pr-8 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
              >
                {getAllCategories().map((category: string) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Items Per Page and Results */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3 text-sm">
              <span className="text-gray-600">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-gray-600">entries</span>
            </div>

            {/* Results Summary */}
            <div className="text-sm text-gray-600">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span>
                  Showing {getPaginatedProjects().length} of {getFilteredProjects().length}
                  {selectedCategory !== 'all' && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                      {selectedCategory}
                    </span>
                  )}
                </span>
                <span className="hidden sm:inline text-gray-400">•</span>
                <span>Total: {projects.length} projects</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Display */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Featured
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Links
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getPaginatedProjects().map((project, index) => (
                <motion.tr
                  key={project.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-4">
                      {/* Project Thumbnail */}
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                        {project.images && project.images.length > 0 ? (
                          <Image
                            src={project.images[0]}
                            alt={project.title}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <PhotoIcon className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      {/* Project Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
                          {project.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                          {project.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      {project.project_category || 'Other'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${project.is_featured || project.display_show
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                      {project.is_featured || project.display_show ? 'Featured' : 'Standard'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      {project.demo_url && (
                        <a
                          href={project.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          <EyeIcon className="h-4 w-4" />
                          Demo
                        </a>
                      )}
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 font-medium"
                        >
                          <CodeBracketIcon className="h-4 w-4" />
                          Code
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">
                      {new Date(project.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(project)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="Edit project"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => promptDelete(project.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Delete project"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden divide-y divide-gray-200">
          {getPaginatedProjects().map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-3">
                {/* Project Image */}
                <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                  {project.images && project.images.length > 0 ? (
                    <Image
                      src={project.images[0]}
                      alt={project.title}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <PhotoIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Project Content */}
                <div className="flex-1 min-w-0">
                  {/* Title and Actions */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0 mr-2">
                      <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                        {project.description}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(project)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="Edit project"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => promptDelete(project.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Delete project"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Category and Featured Status */}
                  <div className="mb-3 flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      {project.project_category || 'Other'}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${project.is_featured || project.display_show
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                      {project.is_featured || project.display_show ? '⭐ Featured' : 'Standard'}
                    </span>
                  </div>

                  {/* Technologies */}
                  {project.technologies_used && project.technologies_used.length > 0 && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {project.technologies_used.slice(0, 3).map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies_used.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600">
                            +{project.technologies_used.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Links and Date */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                      {project.demo_url && (
                        <a
                          href={project.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          <EyeIcon className="h-4 w-4" />
                          Demo
                        </a>
                      )}
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 font-medium"
                        >
                          <CodeBracketIcon className="h-4 w-4" />
                          Code
                        </a>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(project.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {getTotalPages() > 1 && (
        <div className="bg-white rounded-xl border border-gray-200 px-3 md:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, getFilteredProjects().length)} of {getFilteredProjects().length} results
            </div>
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
              </button>

              {/* Page Numbers */}
              <div className="flex gap-1">
                {Array.from({ length: getTotalPages() }, (_, i) => i + 1).map((page) => {
                  // For mobile, show fewer pages (using CSS classes instead of JS)
                  const showPage =
                    page === 1 ||
                    page === getTotalPages() ||
                    (page >= currentPage - 1 && page <= currentPage + 1);

                  if (!showPage) {
                    // Show ellipsis for gaps
                    if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <span key={page} className="px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-500">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }

                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, getTotalPages()))}
                disabled={currentPage === getTotalPages()}
                className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="hidden sm:inline">Next</span>
                <span className="sm:hidden">Next</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {getPaginatedProjects().length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 md:p-12 border border-blue-100 mx-4 md:mx-0">
            <div className="mx-auto w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 md:mb-6">
              {getFilteredProjects().length === 0 && projects.length > 0 ? (
                <FunnelIcon className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
              ) : (
                <PhotoIcon className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
              )}
            </div>

            {getFilteredProjects().length === 0 && projects.length > 0 ? (
              /* No results for current filter */
              <>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
                <p className="text-sm md:text-base text-gray-600 mb-6 max-w-md mx-auto px-4">
                  No projects match your current filters. Try adjusting your search terms or technology filters.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                    }}
                    className="cursor-pointer px-4 md:px-6 py-2.5 md:py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 text-sm md:text-base"
                  >
                    Clear filters
                  </button>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="cursor-pointer px-4 md:px-6 py-2.5 md:py-3 border border-blue-600 text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-all duration-200 text-sm md:text-base"
                  >
                    Add new project
                  </button>
                </div>
              </>
            ) : (
              /* No projects at all */
              <>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">No projects yet</h3>
                <p className="text-sm md:text-base text-gray-600 mb-6 max-w-md mx-auto px-4">
                  Start building your portfolio by adding your first project. Showcase your skills and creativity!
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsModalOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-sm md:text-base"
                >
                  Create your first project
                </motion.button>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />

      {/* Modal */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-slate-950/20 backdrop-blur-md flex items-center justify-center p-2 md:p-4 z-50"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="bg-white rounded-xl md:rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] md:max-h-[90vh] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 md:px-6 py-3 md:py-4 border-b border-blue-100">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                    {editingProject ? 'Edit Project' : 'Create New Project'}
                  </h2>
                  <p className="text-xs md:text-sm text-gray-600 mt-1">
                    {editingProject ? 'Update your project details' : 'Add a new project to your portfolio'}
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="cursor-pointer p-1.5 md:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <XMarkIcon className="h-5 w-5 md:h-6 md:w-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(95vh-80px)] md:max-h-[calc(90vh-80px)]">
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                {/* Project Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                    placeholder="Enter your project title"
                    required
                  />
                </div>

                {/* Project Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none text-sm md:text-base"
                    placeholder="Describe your project, its purpose, and key features"
                    required
                  />
                </div>

                {/* Project Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Images
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    Add direct links to your project images (e.g. Google Drive, Imgur). Maximum 5 images.
                  </p>

                  {/* Add new image URL */}
                  <div className="flex gap-2 md:gap-3 mb-4">
                    <input
                      type="url"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      onKeyDown={handleAddImageUrlEnter}
                      placeholder="https://example.com/image.png"
                      className="flex-1 px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handleAddImageUrl}
                      disabled={!newImageUrl.trim() || formData.images.length >= 5}
                      className="px-4 md:px-6 py-2.5 md:py-3 bg-blue-600 text-white rounded-lg md:rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm md:text-base"
                    >
                      Add
                    </motion.button>
                  </div>

                  {/* Display added images */}
                  {formData.images.length > 0 ? (
                    <Reorder.Group 
                      axis="y" 
                      values={formData.images} 
                      onReorder={(newOrder) => setFormData({...formData, images: newOrder})}
                      className="space-y-2 bg-gray-50 rounded-xl p-3 border border-gray-200 list-none"
                    >
                      {formData.images.map((url, index) => (
                        <Reorder.Item 
                          key={url} 
                          value={url}
                          className="relative flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-200 shadow-sm cursor-grab active:cursor-grabbing group hover:border-blue-300 transition-colors"
                          whileDrag={{ scale: 1.02, zIndex: 50, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
                        >
                          <div className="flex-shrink-0 text-gray-400 group-hover:text-blue-500 transition-colors">
                            <Bars3Icon className="h-5 w-5" />
                          </div>
                          
                          <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden bg-gray-100 border border-gray-100">
                            <Image
                              src={url}
                              alt={`Preview ${index + 1}`}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                              unoptimized
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                if (!target.src.includes('placehold.co')) {
                                  target.src = `https://placehold.co/100x100/f8fafc/94a3b8?text=Error`;
                                }
                              }}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-500 mb-0.5">Image {index + 1}</p>
                            <p className="text-[10px] text-gray-400 truncate max-w-[200px] md:max-w-xs">{url}</p>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  ) : (
                    <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                      <div className="mb-2">
                        <PhotoIcon className="h-8 w-8 mx-auto text-gray-200" />
                      </div>
                      No image URLs added yet.
                    </div>
                  )}
                </div>

                {/* Project Category and Display Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Category *
                    </label>
                    <select
                      value={formData.project_category}
                      onChange={(e) => setFormData({ ...formData, project_category: e.target.value })}
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                      required
                    >
                      {projectCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="display_show"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="display_show" className="ml-3 text-sm font-medium text-gray-700">
                      <span className="font-semibold">Feature this project</span>
                      <p className="text-xs text-gray-500 mt-1">Show in homepage highlights</p>
                    </label>
                  </div>
                </div>

                {/* URLs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Demo URL
                    </label>
                    <input
                      type="url"
                      value={formData.demo_url || ''}
                      onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                      placeholder="https://your-demo.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={formData.github_url || ''}
                      onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                      placeholder="https://github.com/username/repo"
                    />
                  </div>
                </div>

                {/* Technologies Used */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Technologies Used
                  </label>

                  {/* Add new technology */}
                  <div className="flex gap-2 md:gap-3 mb-4">
                    <input
                      type="text"
                      value={newTechnology}
                      onChange={(e) => setNewTechnology(e.target.value)}
                      onKeyDown={handleAddTechnologyEnter}
                      placeholder="e.g. React, TypeScript"
                      className="flex-1 px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handleAddTechnology}
                      disabled={!newTechnology.trim()}
                      className="px-4 md:px-6 py-2.5 md:py-3 bg-blue-600 text-white rounded-lg md:rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm md:text-base"
                    >
                      Add
                    </motion.button>
                  </div>

                  {/* Display added technologies */}
                  {formData.technologies_used.length > 0 ? (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg md:rounded-xl p-3 md:p-4 border border-blue-100">
                      <div className="flex flex-wrap gap-1.5 md:gap-2">
                        {formData.technologies_used.map((tech, index) => {
                          const matched = findMatchingIcon(tech);
                          return (
                            <motion.span
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="group inline-flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 md:py-2 bg-white border border-blue-200 rounded-lg text-xs md:text-sm text-gray-700 hover:border-blue-300 hover:shadow-sm transition-all duration-200"
                            >
                              {matched && (
                                <img
                                  src={getIconUrl(matched.icon.name, matched.variant)}
                                  alt={tech}
                                  className="w-3.5 h-3.5 md:w-4 md:h-4 object-contain"
                                  onError={(e) => (e.currentTarget.style.display = 'none')}
                                />
                              )}
                              <span className="font-medium">{tech}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveTechnology(index)}
                                className="cursor-pointer ml-1.5 md:ml-2 text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <XMarkIcon className="h-3 w-3 md:h-4 md:w-4" />
                              </button>
                            </motion.span>
                          );
                        })}
                      </div>
                      <p className="text-xs text-blue-600 mt-3 font-medium">
                        {formData.technologies_used.length} technolog{formData.technologies_used.length === 1 ? 'y' : 'ies'} added
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-6 md:py-8 text-gray-400 text-xs md:text-sm border-2 border-dashed border-gray-200 rounded-lg md:rounded-xl bg-gray-50">
                      <div className="mb-2">
                        <CodeBracketIcon className="h-6 w-6 md:h-8 md:w-8 mx-auto text-gray-300" />
                      </div>
                      No technologies added yet. Start typing above to add some!
                    </div>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 md:pt-6 border-t border-gray-100">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 md:px-6 py-2.5 md:py-3 text-gray-700 bg-gray-100 rounded-lg md:rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium text-sm md:text-base order-2 sm:order-1"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="cursor-pointer px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg md:rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg text-sm md:text-base order-1 sm:order-2"
                  >
                    {editingProject ? 'Update Project' : 'Create Project'}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
