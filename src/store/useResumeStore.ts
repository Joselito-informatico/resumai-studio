import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ResumeData, ResumeSettings } from '../types/resume';

const INITIAL_DATA: ResumeData = {
  settings: {
    theme: 'modern',
    paperSize: 'A4',
    density: 'compact',
    font: 'sans',
    atsMode: false,
    accentColor: '#2563eb',
  },
  basics: {
    name: "Alex Dev",
    label: "Senior Frontend Architect",
    image: "", 
    email: "alex@resumai.dev",
    phone: "+56 9 1234 5678",
    website: "https://resumai.dev",
    summary: "Arquitecto de software con más de 8 años de experiencia. Experto en React, ecosistema JavaScript y optimización de rendimiento web.",
    location: { city: "Santiago", country: "Chile" },
    profiles: [
      { network: "GitHub", username: "alexdev", url: "https://github.com" },
      { network: "LinkedIn", username: "alex-dev", url: "https://linkedin.com" }
    ]
  },
  sections: [
    {
      id: "exp-1",
      title: "Experiencia Profesional",
      type: "experience",
      layout: "main",
      items: [
        {
          id: "job-1",
          title: "Global Tech Solutions",
          subtitle: "Tech Lead",
          date: "2021 - Presente",
          description: "Liderazgo técnico de un equipo de 10 desarrolladores. Migración de monolito legacy a micro-frontends reduciendo el TTM en un 40%.",
          tags: ["React", "AWS", "Micro-frontends"]
        },
        {
          id: "job-2",
          title: "StartUp Inc",
          subtitle: "Senior Frontend Developer",
          date: "2018 - 2021",
          description: "Desarrollo del core del producto SaaS.",
          tags: ["Vue.js", "Jest"]
        }
      ]
    },
    {
      id: "skills-1",
      title: "Habilidades",
      type: "skills",
      layout: "sidebar",
      items: [
        { id: "sk-1", title: "Frontend", description: "React, Vue, Tailwind" },
        { id: "sk-2", title: "Backend", description: "Node.js, Python" }
      ]
    },
    {
      id: "edu-1",
      title: "Educación",
      type: "education",
      layout: "sidebar",
      items: [
        {
          id: "edu-item-1",
          title: "Univ. Tecnológica",
          subtitle: "Ing. Informática",
          date: "2012 - 2017",
          description: "Graduado con honor."
        }
      ]
    }
  ]
};

interface ResumeState {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
  updateSettings: (settings: Partial<ResumeSettings>) => void;
  resetResume: () => void; // <--- Nueva acción
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      resumeData: INITIAL_DATA,
      setResumeData: (data) => set({ resumeData: data }),
      updateSettings: (newSettings) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          settings: { ...state.resumeData.settings, ...newSettings }
        }
      })),
      resetResume: () => set({ resumeData: INITIAL_DATA }), // <--- Implementación limpia
    }),
    {
      name: 'resumai-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);