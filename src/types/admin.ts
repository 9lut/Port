export interface Skill {
  id: number;
  name: string;
  level: number; // 0-100 
  category: string;
  icon_url?: string;
  color: string; // HEX color
  description?: string;
  years_experience: number;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  story_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  company_name: string;
  position: string;
  start_date: string;
  end_date?: string; // null for current position
  location?: string;
  company_logo_url?: string;
  description?: string;
  achievements: string[];
  technologies: string[];
  is_current: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  sender_name: string;
  sender_email: string;
  subject: string;
  message: string;
  is_read: boolean;
  is_replied: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  tags: string[];
  replied_at?: string;
  created_at: string;
}

export interface ContactInfo {
  id: string;
  type: 'email' | 'phone' | 'address' | 'social';
  label: string;
  value: string;
  icon_name?: string;
  link_url?: string;
  is_public: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Form types for creating/editing
export interface SkillFormData {
  name: string;
  level: number;
  category: string;
  icon_url?: string;
  color: string;
  description?: string;
  years_experience: number;
  is_featured: boolean;
}

export interface StoryFormData {
  title: string;
  content: string;
  image_url?: string;
  is_published: boolean;
}

export interface ExperienceFormData {
  company_name: string;
  position: string;
  start_date: string;
  end_date?: string;
  location?: string;
  company_logo_url?: string;
  description?: string;
  achievements: string[];
  technologies: string[];
  is_current: boolean;
}

export interface ContactInfoFormData {
  type: ContactInfo['type'];
  label: string;
  value: string;
  icon_name?: string;
  link_url?: string;
  is_public: boolean;
}
