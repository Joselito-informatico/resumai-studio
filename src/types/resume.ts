export type SocialLink = {
  network: string;
  username: string;
  url: string;
};

export type ResumeBasics = {
  name: string;
  label: string;
  email: string;
  image?: string;
  phone: string;
  website?: string;
  summary: string;
  location?: {
    city: string;
    country: string;
  };
  profiles: SocialLink[];
};

export type ResumeSectionItem = {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
  tags?: string[];
};

// CORRECCIÓN: Añadidos 'languages' y 'courses'
export type ResumeSection = {
  id: string;
  title: string;
  type: 'experience' | 'education' | 'projects' | 'skills' | 'custom' | 'languages' | 'courses';
  layout: 'main' | 'sidebar';
  items: ResumeSectionItem[];
};

export type ResumeSettings = {
  theme: 'modern' | 'classic';
  paperSize: 'A4' | 'Letter';
  density: 'compact' | 'normal' | 'spacious';
  font: 'sans' | 'serif' | 'mono';
  atsMode: boolean;
  accentColor: string;
};

export type ResumeData = {
  settings: ResumeSettings;
  basics: ResumeBasics;
  sections: ResumeSection[];
};