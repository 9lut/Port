// export interface Project {
//   id: string;
//   title: string;
//   description: string;
//   long_description?: string;
//   demo_url?: string | null;
//   github_url?: string | null;
//   image_url?: string | null;
//   thumbnail_url?: string | null;
//   gallery_images?: string[];
//   main_image_index?: number;
//   tech_stack: string[];
//   tags?: string[];
//   status?: 'completed' | 'in_progress' | 'planned';
//   is_featured?: boolean;
//   is_published?: boolean;
//   display_order?: number;
//   start_date?: string | null;
//   end_date?: string | null;
//   created_at: string;
//   updated_at: string;

//   images?: string[];
//   technologies_used?: string[];
//   project_category?: string;
//   display_show?: boolean;
// }

// export interface CreateProjectRequest {
//   title: string;
//   description: string;
//   long_description?: string;
//   demo_url?: string | null;
//   github_url?: string | null;
//   image_url?: string | null;
//   thumbnail_url?: string | null;
//   gallery_images?: string[]; // 🆕 รูปภาพหลายรูป
//   main_image_index?: number; // 🆕 Index ของรูปหลัก
//   tech_stack?: string[];
//   tags?: string[];
//   status?: 'completed' | 'in_progress' | 'planned';
//   is_featured?: boolean;
//   is_published?: boolean;
//   display_order?: number;
//   start_date?: string | null;
//   end_date?: string | null;
// }

// export interface UpdateProjectRequest {
//   title?: string;
//   description?: string;
//   long_description?: string;
//   demo_url?: string | null;
//   github_url?: string | null;
//   image_url?: string | null;
//   thumbnail_url?: string | null;
//   gallery_images?: string[]; // 🆕 รูปภาพหลายรูป
//   main_image_index?: number; // 🆕 Index ของรูปหลัก
//   tech_stack?: string[];
//   tags?: string[];
//   status?: 'completed' | 'in_progress' | 'planned';
//   is_featured?: boolean;
//   is_published?: boolean;
//   display_order?: number;
//   start_date?: string | null;
//   end_date?: string | null;
// }


export interface Project {
  id: string;
  title: string;
  description: string;
  demo_url: string;
  github_url: string;
  created_at: string;
  updated_at: string;
  images: string[];
  technologies_used: string[];
  project_category: string;
  display_show?: boolean;
  is_featured?: boolean;
}

export interface ProjectFormData {
  title: string;
  description: string;
  demo_url: string;
  github_url: string;
  images: string[];
  technologies_used: string[];
  project_category: string;
  is_featured: boolean;
}

