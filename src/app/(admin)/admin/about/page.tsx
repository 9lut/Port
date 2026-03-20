'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CalendarIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  EyeIcon,
  EyeSlashIcon,
  WrenchScrewdriverIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import DevIconPicker from '@/components/DevIconPicker';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { Skeleton } from "@/components/ui/skeleton";

// Skills types
interface Skill {
  id: string;
  name: string;
  icon_url: string;  // matches Firestore field name
  level: string; // Basic | Intermediate | Advance
  created_at: string;
  updated_at: string;
}

interface SkillFormData {
  name: string;
  icon_url: string;  // matches Firestore field name
  level: string;
}

// Experience types
interface Experience {
  id: number;
  company: string;
  position: string;
  description: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  location?: string;
  skills_used: string[];
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface ExperienceFormData {
  company: string;
  position: string;
  description: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  location: string;
  skills_used: string[];
  is_published: boolean;
  display_order: number;
}

// Education types
interface Education {
  id: number;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  location?: string;
  description?: string;
  grade?: string;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface EducationFormData {
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  location: string;
  description: string;
  grade: string;
  is_published: boolean;
  display_order: number;
}

// Story types
interface Story {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface StoryFormData {
  title: string;
  content: string;
  excerpt: string;
  is_published: boolean;
  display_order: number;
}

const initialSkillFormData: SkillFormData = {
  name: '',
  icon_url: '',
  level: 'Basic',
};

const initialEducationFormData: EducationFormData = {
  institution: '',
  degree: '',
  field_of_study: '',
  start_date: '',
  end_date: '',
  is_current: false,
  location: '',
  description: '',
  grade: '',
  is_published: true,
  display_order: 1,
};

const initialExperienceFormData: ExperienceFormData = {
  company: '',
  position: '',
  description: '',
  start_date: '',
  end_date: '',
  is_current: false,
  location: '',
  skills_used: [],
  is_published: true,
  display_order: 1
};

const initialStoryFormData: StoryFormData = {
  title: '',
  content: '',
  excerpt: '',
  is_published: false,
  display_order: 1
};

export default function AboutAdmin() {
  const [activeTab, setActiveTab] = useState<'skills' | 'experience' | 'education' | 'story'>('skills');

  // Skills state
  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillFormData, setSkillFormData] = useState<SkillFormData>(initialSkillFormData);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);

  // Experience state
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [experienceFormData, setExperienceFormData] = useState<ExperienceFormData>(initialExperienceFormData);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  // Unified Delete Confirmation State
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: 'skill' | 'experience' | 'education' | 'story' | null;
    id: string | number | null;
    isDeleting: boolean;
  }>({
    isOpen: false,
    type: null,
    id: null,
    isDeleting: false
  });

  const handleConfirmDelete = async () => {
    const { type, id } = deleteModal;
    if (!type || id === null) return;
    
    setDeleteModal(prev => ({ ...prev, isDeleting: true }));
    try {
      if (type === 'skill') {
         const res = await fetch(`/api/admin/skills/${id}`, { method: 'DELETE' });
         if (!res.ok) throw new Error('Failed');
         await fetchSkills();
      } else if (type === 'experience') {
         const res = await fetch(`/api/admin/experience/${id}`, { method: 'DELETE' });
         if (!res.ok) throw new Error('Failed');
         await fetchExperiences();
      } else if (type === 'education') {
         const res = await fetch(`/api/education/${id}`, { method: 'DELETE' });
         if (!res.ok) throw new Error('Failed');
         await fetchEducations();
      } else if (type === 'story') {
         const res = await fetch(`/api/admin/my-story/${id}`, { method: 'DELETE' });
         if (!res.ok) throw new Error('Failed');
         await fetchStories();
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      alert(`Error deleting ${type}`);
    } finally {
      setDeleteModal({ isOpen: false, type: null, id: null, isDeleting: false });
    }
  };

  // Education state
  const [educations, setEducations] = useState<Education[]>([]);
  const [educationFormData, setEducationFormData] = useState<EducationFormData>(initialEducationFormData);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);

  // Story state
  const [stories, setStories] = useState<Story[]>([]);
  const [storyFormData, setStoryFormData] = useState<StoryFormData>(initialStoryFormData);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const levels = [
    { value: 'Basic', label: 'Basic', color: 'bg-green-500' },
    { value: 'Intermediate', label: 'Intermediate', color: 'bg-yellow-500' },
    { value: 'Advance', label: 'Advance', color: 'bg-red-500' },
  ];

  const tabs = [
    { id: 'skills', label: 'Skills', icon: WrenchScrewdriverIcon },
    { id: 'experience', label: 'Experience', icon: BriefcaseIcon },
    { id: 'education', label: 'Education', icon: AcademicCapIcon },
    { id: 'story', label: 'My Story', icon: BookOpenIcon },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (activeTab === 'skills') {
          await fetchSkills();
        } else if (activeTab === 'experience') {
          await fetchExperiences();
        } else if (activeTab === 'education') {
          await fetchEducations();
        } else if (activeTab === 'story') {
          await fetchStories();
        }
      } catch (error) {
        console.error(`Error fetching ${activeTab}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  // Skills functions
  const fetchSkills = async () => {
    try {
      const res = await fetch('/api/admin/skills');
      if (!res.ok) {
        console.error('Error fetching skills:', await res.text());
        return;
      }
      const data = await res.json();
      // API returns { skills }
      setSkills(data.skills || []);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const handleSkillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!skillFormData.name || !skillFormData.level) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const url = editingSkill
        ? `/api/admin/skills/${editingSkill.id}`
        : '/api/admin/skills';

      const method = editingSkill ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: skillFormData.name,
          icon_url: skillFormData.icon_url || null,
          level: skillFormData.level,
          // sensible defaults for required admin API fields
          category: 'general',
          color: '#000000',
          description: '',
          display_order: editingSkill ? undefined : 1,
          is_featured: false,
        }),
      });

      if (!res.ok) {
        console.error('Error saving skill:', await res.text());
        alert('Error saving skill');
        return;
      }

      await fetchSkills();
      handleCloseSkillModal();
    } catch (error) {
      console.error('Error saving skill:', error);
      alert('Error saving skill');
    }
  };

  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setSkillFormData({
      name: skill.name,
      icon_url: skill.icon_url || '',
      level: skill.level || 'Basic',
    });
    setIsSkillModalOpen(true);
  };

  const handleDeleteSkill = async (id: string) => {
    setDeleteModal({ isOpen: true, type: 'skill', id, isDeleting: false });
  };

  const handleCloseSkillModal = () => {
    setIsSkillModalOpen(false);
    setEditingSkill(null);
    setSkillFormData(initialSkillFormData);
  };

  // Experience functions
  const fetchExperiences = async () => {
    try {
      const res = await fetch('/api/admin/experience');
      if (!res.ok) {
        console.error('Error fetching experiences:', await res.text());
        return;
      }
      const data = await res.json();
      setExperiences(data || []);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    }
  };

  const handleExperienceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!experienceFormData.company || !experienceFormData.position || !experienceFormData.start_date) {
      alert('Please fill in all required fields');
      return;
    }

    try {
  const url = editingExperience
    ? `/api/admin/experience/${editingExperience.id}`
    : '/api/admin/experience';

  const method = editingExperience ? 'PUT' : 'POST';

  const payload = {
    ...experienceFormData,
    end_date: experienceFormData.is_current ? null : experienceFormData.end_date || null,
  };

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.error('Error saving experience:', await res.text());
    alert('Error saving experience');
    return;
  }

      await fetchExperiences();
      handleCloseExperienceModal();
    } catch (error) {
      console.error('Error saving experience:', error);
      alert('Error saving experience');
    }
  };

  const handleEditExperience = (experience: Experience) => {
    setEditingExperience(experience);
    setExperienceFormData({
      company: experience.company,
      position: experience.position,
      description: experience.description,
      start_date: experience.start_date,
      end_date: experience.end_date || '',
      is_current: experience.is_current,
      location: experience.location || '',
      skills_used: experience.skills_used,
      is_published: experience.is_published,
      display_order: experience.display_order
    });
    setIsExperienceModalOpen(true);
  };

  const handleDeleteExperience = async (id: number) => {
    setDeleteModal({ isOpen: true, type: 'experience', id, isDeleting: false });
  };

  const handleCloseExperienceModal = () => {
    setIsExperienceModalOpen(false);
    setEditingExperience(null);
    setExperienceFormData(initialExperienceFormData);
    setSkillInput('');
  };

  const toggleExperiencePublished = async (experience: Experience) => {
    try {
      const res = await fetch(`/api/admin/experience/${experience.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...experience,
          is_published: !experience.is_published,
        }),
      });

      if (!res.ok) {
        console.error('Error updating experience:', await res.text());
        alert('Error updating experience');
        return;
      }

      await fetchExperiences();
    } catch (error) {
      console.error('Error updating experience:', error);
      alert('Error updating experience');
    }
  };

  const addSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!experienceFormData.skills_used.includes(skillInput.trim())) {
        setExperienceFormData({
          ...experienceFormData,
          skills_used: [...experienceFormData.skills_used, skillInput.trim()]
        });
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setExperienceFormData({
      ...experienceFormData,
      skills_used: experienceFormData.skills_used.filter(s => s !== skill)
    });
  };

  // Education functions
  const fetchEducations = async () => {
    try {
      const res = await fetch('/api/education');
      if (!res.ok) {
        console.error('Error fetching educations:', await res.text());
        return;
      }
      const data = await res.json();
      setEducations(data || []);
    } catch (error) {
      console.error('Error fetching educations:', error);
    }
  };

  const handleEducationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!educationFormData.institution || !educationFormData.degree || !educationFormData.field_of_study || !educationFormData.start_date) {
      alert('Please fill in all required fields');
      return;
    }

    try {
  const url = editingEducation
    ? `/api/education/${editingEducation.id}`
    : '/api/education';

  const method = editingEducation ? 'PUT' : 'POST';

  const payload = {
    ...educationFormData,
    end_date: educationFormData.is_current ? null : educationFormData.end_date || null,
  };

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.error('Error saving education:', await res.text());
    alert('Error saving education');
    return;
  }

      await fetchEducations();
      handleCloseEducationModal();
    } catch (error) {
      console.error('Error saving education:', error);
      alert('Error saving education');
    }
  };

  const handleEditEducation = (education: Education) => {
    setEditingEducation(education);
    setEducationFormData({
      institution: education.institution,
      degree: education.degree,
      field_of_study: education.field_of_study,
      start_date: education.start_date,
      end_date: education.end_date || '',
      is_current: education.is_current,
      location: education.location || '',
      description: education.description || '',
      grade: education.grade || '',
      is_published: education.is_published,
      display_order: education.display_order,
    });
    setIsEducationModalOpen(true);
  };

  const handleDeleteEducation = async (id: number) => {
    setDeleteModal({ isOpen: true, type: 'education', id, isDeleting: false });
  };

  const handleCloseEducationModal = () => {
    setIsEducationModalOpen(false);
    setEditingEducation(null);
    setEducationFormData(initialEducationFormData);
  };

  const toggleEducationPublished = async (education: Education) => {
    try {
      const res = await fetch(`/api/education/${education.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...education,
          is_published: !education.is_published,
        }),
      });

      if (!res.ok) {
        console.error('Error updating education:', await res.text());
        alert('Error updating education');
        return;
      }

      await fetchEducations();
    } catch (error) {
      console.error('Error updating education:', error);
      alert('Error updating education');
    }
  };

  // Story functions
  const fetchStories = async () => {
    const response = await fetch('/api/admin/my-story');
    if (response.ok) {
      const data = await response.json();
      setStories(data);
    }
  };

  const handleStorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingStory
        ? `/api/admin/my-story/${editingStory.id}`
        : '/api/admin/my-story';

      const method = editingStory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(storyFormData),
      });

      if (response.ok) {
        await fetchStories();
        handleCloseStoryModal();
      }
    } catch (error) {
      console.error('Error saving story:', error);
    }
  };

  const handleEditStory = (story: Story) => {
    setEditingStory(story);
    setStoryFormData({
      title: story.title,
      content: story.content,
      excerpt: story.excerpt,
      is_published: story.is_published,
      display_order: story.display_order
    });
    setIsStoryModalOpen(true);
  };

  const handleDeleteStory = async (id: number) => {
    setDeleteModal({ isOpen: true, type: 'story', id, isDeleting: false });
  };

  const handleCloseStoryModal = () => {
    setIsStoryModalOpen(false);
    setEditingStory(null);
    setStoryFormData(initialStoryFormData);
  };

  const toggleStoryPublished = async (story: Story) => {
    try {
      const response = await fetch(`/api/admin/my-story/${story.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...story,
          is_published: !story.is_published
        }),
      });
      if (response.ok) {
        await fetchStories();
      }
    } catch (error) {
      console.error('Error toggling story status:', error);
    }
  };

  // Helper functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  const calculateDuration = (startDate: string, endDate?: string) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());

    if (months < 12) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      if (remainingMonths === 0) {
        return `${years} year${years !== 1 ? 's' : ''}`;
      } else {
        return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
      }
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'Basic':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Advance':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
               <div>
                 <Skeleton className="h-8 w-48 rounded-xl mb-2" />
                 <Skeleton className="h-4 w-64 rounded-md" />
               </div>
               <div className="flex gap-4">
                 <Skeleton className="h-10 w-24 rounded-lg" />
                 <Skeleton className="h-10 w-24 rounded-lg" />
                 <Skeleton className="h-10 w-24 rounded-lg" />
                 <Skeleton className="h-10 w-24 rounded-lg" />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                       <Skeleton className="h-12 w-12 rounded-xl mb-4" />
                       <Skeleton className="h-6 w-32 rounded-md" />
                       <Skeleton className="h-8 w-16 rounded-md" />
                       <div className="pt-4 border-t border-gray-100">
                          <Skeleton className="h-4 w-40 rounded-md" />
                       </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
               <div className="flex justify-between items-center">
                 <Skeleton className="h-6 w-40 rounded-md" />
                 <Skeleton className="h-10 w-32 rounded-lg" />
               </div>
               <div className="space-y-4">
                 {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 items-center p-4 border border-gray-50 rounded-xl">
                       <Skeleton className="h-12 w-12 rounded-lg" />
                       <div className="space-y-2 flex-1">
                          <Skeleton className="h-5 w-48 rounded-md" />
                          <Skeleton className="h-4 w-32 rounded-md" />
                       </div>
                       <Skeleton className="h-8 w-20 rounded-md" />
                    </div>
                 ))}
               </div>
            </div>
        </div>
    );
  }

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">About Management</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your skills, experience, and personal story</p>
            </div>
            
            {/* Mobile Add Button */}
            <div className="sm:hidden">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (activeTab === 'skills') setIsSkillModalOpen(true);
                  else if (activeTab === 'experience') setIsExperienceModalOpen(true);
                  else if (activeTab === 'education') setIsEducationModalOpen(true);
                  else if (activeTab === 'story') setIsStoryModalOpen(true);
                }}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg"
              >
                <PlusIcon className="h-5 w-5" />
                Add New {activeTab === 'skills' ? 'Skill' : activeTab === 'experience' ? 'Experience' : activeTab === 'education' ? 'Education' : 'Story'}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile-First Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
          {/* Mobile Dropdown Tab */}
          <div className="block sm:hidden">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as 'skills' | 'experience' | 'education' | 'story')}
              className="w-full px-4 py-4 bg-white border-0 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden sm:block border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'skills' | 'experience' | 'education' | 'story')}
                    className={`flex-1 py-4 px-6 border-b-2 font-medium text-sm flex items-center justify-center gap-2 transition-all ${activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="hidden lg:inline">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Desktop Add Button */}
          <div className="hidden sm:flex justify-end p-4 bg-gray-50">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (activeTab === 'skills') setIsSkillModalOpen(true);
                else if (activeTab === 'experience') setIsExperienceModalOpen(true);
                else if (activeTab === 'education') setIsEducationModalOpen(true);
                else if (activeTab === 'story') setIsStoryModalOpen(true);
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-700 shadow-md"
            >
              <PlusIcon className="h-5 w-5" />
              Add {activeTab === 'skills' ? 'Skill' : activeTab === 'experience' ? 'Experience' : activeTab === 'education' ? 'Education' : 'Story'}
            </motion.button>
          </div>
        </div>

        {/* Skills Tab Content */}
        {activeTab === 'skills' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Mobile Skills List */}
            <div className="block sm:hidden space-y-3">
              {skills.map((skill) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {skill.icon_url ? (
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={skill.icon_url} 
                            alt={skill.name}
                            className="w-8 h-8 object-contain"
                            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `<div class="w-8 h-8 bg-gray-300 rounded flex items-center justify-center text-gray-600 text-xs font-semibold">${skill.name.charAt(0).toUpperCase()}</div>`;
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-lg">
                            {skill.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{skill.name}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getLevelBadgeColor(skill.level)}`}>
                          {skill.level}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-2">
                      <button
                        onClick={() => handleEditSkill(skill)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="Edit skill"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Delete skill"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Desktop Skills Grid */}
            <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {skills.map((skill) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {skill.icon_url ? (
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={skill.icon_url} 
                            alt={skill.name}
                            className="w-8 h-8 object-contain"
                            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `<div class="w-8 h-8 bg-gray-300 rounded flex items-center justify-center text-gray-600 text-xs font-semibold">${skill.name.charAt(0).toUpperCase()}</div>`;
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {skill.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900">{skill.name}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getLevelBadgeColor(skill.level)}`}>
                          {skill.level}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => handleEditSkill(skill)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      title="Edit skill"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                      title="Delete skill"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {skills.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <WrenchScrewdriverIcon className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No skills found</h3>
                <p className="text-gray-500 mb-4 text-sm sm:text-base">Get started by adding your first skill.</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsSkillModalOpen(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  Add Your First Skill
                </motion.button>
              </div>
            )}
          </div>
        )}

        {/* Experience Tab Content */}
        {activeTab === 'experience' && (
          <div className="space-y-4">
            {experiences.map((experience) => (
              <motion.div
                key={experience.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow"
              >
                {/* Mobile Layout */}
                <div className="block sm:hidden space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <BriefcaseIcon className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{experience.position}</h3>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 mb-2">
                        <BuildingOfficeIcon className="h-4 w-4 flex-shrink-0" />
                        <span className="font-medium truncate">{experience.company}</span>
                      </div>
                      {experience.location && (
                        <div className="text-sm text-gray-500 mb-2">📍 {experience.location}</div>
                      )}
                    </div>
                    
                    <div className="flex gap-1 ml-2">
                      <button
                        onClick={() => handleEditExperience(experience)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteExperience(experience.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <button
                      onClick={() => toggleExperiencePublished(experience)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-full font-medium ${experience.is_published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                        }`}
                    >
                      {experience.is_published ? (
                        <>
                          <EyeIcon className="h-3 w-3" />
                          Published
                        </>
                      ) : (
                        <>
                          <EyeSlashIcon className="h-3 w-3" />
                          Draft
                        </>
                      )}
                    </button>
                    {experience.is_current && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                        Current
                      </span>
                    )}
                    <span className="text-gray-500">Order: {experience.display_order}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CalendarIcon className="h-4 w-4" />
                    <span>
                      {formatDate(experience.start_date)} - {experience.is_current ? 'Present' : formatDate(experience.end_date!)}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span>{calculateDuration(experience.start_date, experience.end_date)}</span>
                  </div>

                  <p className="text-gray-700 text-sm leading-relaxed">{experience.description}</p>

                  {(experience.skills_used?.length ?? 0) > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {(experience.skills_used ?? []).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:block">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <BriefcaseIcon className="h-5 w-5 text-blue-600" />
                        <h3 className="text-xl font-semibold text-gray-900">{experience.position}</h3>
                        <span className="text-sm text-gray-500">Order: {experience.display_order}</span>
                        <button
                          onClick={() => toggleExperiencePublished(experience)}
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${experience.is_published
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-600'
                            }`}
                        >
                          {experience.is_published ? (
                            <>
                              <EyeIcon className="h-3 w-3" />
                              Published
                            </>
                          ) : (
                            <>
                              <EyeSlashIcon className="h-3 w-3" />
                              Draft
                            </>
                          )}
                        </button>
                        {experience.is_current && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                            Current
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-2 text-gray-700">
                          <BuildingOfficeIcon className="h-4 w-4" />
                          <span className="font-medium">{experience.company}</span>
                        </div>
                        {experience.location && (
                          <span className="text-gray-500">📍 {experience.location}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <CalendarIcon className="h-4 w-4" />
                        <span>
                          {formatDate(experience.start_date)} - {experience.is_current ? 'Present' : formatDate(experience.end_date!)}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span>{calculateDuration(experience.start_date, experience.end_date)}</span>
                      </div>

                      <p className="text-gray-700 mb-3">{experience.description}</p>

                      {(experience.skills_used?.length ?? 0) > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {(experience.skills_used ?? []).map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleEditExperience(experience)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteExperience(experience.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {experiences.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No experience entries</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding your first work experience.</p>
              </div>
            )}
          </div>
        )}

        {/* Education Tab Content */}
        {activeTab === 'education' && (
          <div className="space-y-4">
            {educations.map((education) => (
              <motion.div
                key={education.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{education.degree}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        education.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {education.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-indigo-600 font-medium mb-2">{education.institution}</p>
                    <p className="text-gray-600 mb-2">{education.field_of_study}</p>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      {new Date(education.start_date).toLocaleDateString()} - {
                        education.is_current ? 'Present' : 
                        education.end_date ? new Date(education.end_date).toLocaleDateString() : 'N/A'
                      }
                    </div>
                    {education.location && (
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <BuildingOfficeIcon className="w-4 h-4 mr-1" />
                        {education.location}
                      </div>
                    )}
                    {education.grade && (
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Grade:</strong> {education.grade}
                      </div>
                    )}
                    {education.description && (
                      <p className="text-gray-600 text-sm">{education.description}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => toggleEducationPublished(education)}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      title={education.is_published ? 'Unpublish' : 'Publish'}
                    >
                      {education.is_published ? (
                        <EyeIcon className="w-4 h-4" />
                      ) : (
                        <EyeSlashIcon className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleEditEducation(education)}
                      className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteEducation(education.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {educations.length === 0 && !isLoading && (
              <div className="text-center py-12 text-gray-500">
                <AcademicCapIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No education records found</p>
              </div>
            )}
          </div>
        )}

        {/* Story Tab Content */}
        {activeTab === 'story' && (
          <div className="space-y-4">
            {stories.map((story) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{story.title}</h3>
                      <span className="text-sm text-gray-500">Order: {story.display_order}</span>
                      <button
                        onClick={() => toggleStoryPublished(story)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${story.is_published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                          }`}
                      >
                        {story.is_published ? (
                          <>
                            <EyeIcon className="h-3 w-3" />
                            Published
                          </>
                        ) : (
                          <>
                            <EyeSlashIcon className="h-3 w-3" />
                            Draft
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-gray-600 mb-3">{story.excerpt}</p>
                    <div className="text-sm text-gray-500">
                      Content length: {story.content.length} characters
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      {new Date(story.updated_at).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleEditStory(story)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteStory(story.id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {story.content}
                  </p>
                </div>
              </motion.div>
            ))}

            {stories.length === 0 && (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 text-gray-400 mb-4">📖</div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No story sections</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating your first story section.</p>
              </div>
            )}
          </div>
        )}

        {/* Skills Modal */}
        {isSkillModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-slate-950/20 backdrop-blur-md flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-2xl max-h-[95vh] overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 sm:px-6 py-4 border-b border-blue-100">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                      {editingSkill ? 'Edit Skill' : 'Add New Skill'}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      {editingSkill ? 'Update skill information' : 'Add a new skill to your portfolio'}
                    </p>
                  </div>
                  <button
                    onClick={handleCloseSkillModal}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-xl transition-all duration-200"
                  >
                    <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-80px)]">
                <form onSubmit={handleSkillSubmit} className="space-y-4 sm:space-y-6">
                  {/* Skill Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skill Name *
                    </label>
                    <input
                      type="text"
                      value={skillFormData.name}
                      onChange={(e) => setSkillFormData({ ...skillFormData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., React, TypeScript, Python"
                      required
                    />
                  </div>

                  {/* Icon Picker */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon
                    </label>
                    <DevIconPicker
                      value={skillFormData.icon_url}
                      onChange={(url) => setSkillFormData({ ...skillFormData, icon_url: url })}
                      skillName={skillFormData.name}
                    />
                  </div>

                  {/* Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skill Level *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {levels.map((level) => (
                        <button
                          key={level.value}
                          type="button"
                          onClick={() => setSkillFormData({ ...skillFormData, level: level.value })}
                          className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                            skillFormData.level === level.value
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${level.color}`}></div>
                          <span className="font-medium text-sm">{level.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handleCloseSkillModal}
                      className="w-full sm:w-auto px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg"
                    >
                      {editingSkill ? 'Update Skill' : 'Create Skill'}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Experience Modal */}
        {isExperienceModalOpen && (
          <div className="fixed inset-0 bg-slate-950/20 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {editingExperience ? 'Edit Experience' : 'Add New Experience'}
                </h2>
                <button
                  onClick={handleCloseExperienceModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleExperienceSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position / Job Title
                    </label>
                    <input
                      type="text"
                      value={experienceFormData.position}
                      onChange={(e) => setExperienceFormData({ ...experienceFormData, position: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      value={experienceFormData.company}
                      onChange={(e) => setExperienceFormData({ ...experienceFormData, company: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={experienceFormData.location}
                      onChange={(e) => setExperienceFormData({ ...experienceFormData, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Bangkok, Thailand"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Display Order
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={experienceFormData.display_order}
                      onChange={(e) => setExperienceFormData({ ...experienceFormData, display_order: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={experienceFormData.start_date}
                      onChange={(e) => setExperienceFormData({ ...experienceFormData, start_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={experienceFormData.end_date}
                      onChange={(e) => setExperienceFormData({ ...experienceFormData, end_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={experienceFormData.is_current}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={experienceFormData.description}
                    onChange={(e) => setExperienceFormData({ ...experienceFormData, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your responsibilities and achievements..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skills Used
                  </label>
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={addSkill}
                    placeholder="Type skill and press Enter"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {experienceFormData.skills_used.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full flex items-center gap-1"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_current"
                      checked={experienceFormData.is_current}
                      onChange={(e) => setExperienceFormData({ ...experienceFormData, is_current: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_current" className="ml-2 block text-sm text-gray-900">
                      This is my current position
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_published"
                      checked={experienceFormData.is_published}
                      onChange={(e) => setExperienceFormData({ ...experienceFormData, is_published: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900">
                      Publish this experience
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseExperienceModal}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingExperience ? 'Update' : 'Create'} Experience
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Education Modal */}
        {isEducationModalOpen && (
          <div className="fixed inset-0 bg-slate-950/20 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingEducation ? 'Edit Education' : 'Add Education'}
                  </h2>
                  <button
                    onClick={() => setIsEducationModalOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleEducationSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Institution *
                    </label>
                    <input
                      type="text"
                      value={educationFormData.institution}
                      onChange={(e) => setEducationFormData({...educationFormData, institution: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Degree *
                    </label>
                    <input
                      type="text"
                      value={educationFormData.degree}
                      onChange={(e) => setEducationFormData({...educationFormData, degree: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Field of Study *
                  </label>
                  <input
                    type="text"
                    value={educationFormData.field_of_study}
                    onChange={(e) => setEducationFormData({...educationFormData, field_of_study: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={educationFormData.start_date}
                      onChange={(e) => setEducationFormData({...educationFormData, start_date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={educationFormData.end_date}
                      onChange={(e) => setEducationFormData({...educationFormData, end_date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={educationFormData.is_current}
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="education-current"
                    checked={educationFormData.is_current || false}
                    onChange={(e) => setEducationFormData({ ...educationFormData, is_current: e.target.checked })}
                    className="h-4 w-4 bg-gray-900 border-gray-700 rounded text-cyan-500 focus:ring-cyan-500"
                  />
                  <label htmlFor="education-current" className="ml-2 block text-sm text-gray-300">
                    Currently studying here
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={educationFormData.location}
                      onChange={(e) => setEducationFormData({...educationFormData, location: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grade/GPA
                    </label>
                    <input
                      type="text"
                      value={educationFormData.grade}
                      onChange={(e) => setEducationFormData({...educationFormData, grade: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={educationFormData.description}
                    onChange={(e) => setEducationFormData({...educationFormData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="education-published"
                      checked={educationFormData.is_published}
                      onChange={(e) => setEducationFormData({...educationFormData, is_published: e.target.checked})}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="education-published" className="ml-2 text-sm text-gray-700">
                      Published
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={educationFormData.display_order}
                      onChange={(e) => setEducationFormData({...educationFormData, display_order: parseInt(e.target.value) || 1})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setIsEducationModalOpen(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingEducation ? 'Update' : 'Add'} Education
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Story Modal */}
        {isStoryModalOpen && (
          <div className="fixed inset-0 bg-slate-950/20 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {editingStory ? 'Edit Story Section' : 'Add New Story Section'}
                </h2>
                <button
                  onClick={handleCloseStoryModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleStorySubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={storyFormData.title}
                      onChange={(e) => setStoryFormData({ ...storyFormData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Display Order
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={storyFormData.display_order}
                      onChange={(e) => setStoryFormData({ ...storyFormData, display_order: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Excerpt (Short Summary)
                  </label>
                  <textarea
                    value={storyFormData.excerpt}
                    onChange={(e) => setStoryFormData({ ...storyFormData, excerpt: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="A brief summary of this story section"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    value={storyFormData.content}
                    onChange={(e) => setStoryFormData({ ...storyFormData, content: e.target.value })}
                    rows={12}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Write your story content here..."
                    required
                  />
                  <div className="text-sm text-gray-500 mt-1">
                    {storyFormData.content.length} characters
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_story_published"
                    checked={storyFormData.is_published}
                    onChange={(e) => setStoryFormData({ ...storyFormData, is_published: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_story_published" className="ml-2 block text-sm text-gray-900">
                    Publish this story section
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseStoryModal}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingStory ? 'Update' : 'Create'} Story Section
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Unified Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal(prev => ({ ...prev, isOpen: false }))}
          onConfirm={handleConfirmDelete}
          title={`Delete ${deleteModal.type ? deleteModal.type.charAt(0).toUpperCase() + deleteModal.type.slice(1) : 'Item'}`}
          message={`Are you sure you want to delete this ${deleteModal.type}? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
          isLoading={deleteModal.isDeleting}
        />
      </div>
  );
}
