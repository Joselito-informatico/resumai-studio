import type { ResumeData } from '../types/resume';

export const TEMPLATES: Record<string, ResumeData> = {
  senior_dev: {
    settings: { theme: 'modern', paperSize: 'A4', density: 'compact', font: 'sans', atsMode: false, accentColor: '#2563eb' },
    basics: {
      name: "Alex Dev",
      label: "Senior Frontend Architect",
      email: "alex@tech.com",
      image: "", // Puedes poner un base64 real aquí si quieres
      phone: "+1 234 567 890",
      website: "alex.dev",
      summary: "Arquitecto de software con 10 años de experiencia escalando aplicaciones SaaS. Especialista en React, Performance y Liderazgo de equipos.",
      location: { city: "San Francisco", country: "CA" },
      profiles: [{ network: "GitHub", username: "alexcode", url: "#" }, { network: "LinkedIn", username: "alex-dev", url: "#" }]
    },
    sections: [
      {
        id: "exp", title: "Experiencia", type: "experience", layout: "main",
        items: [
          { id: "1", title: "Tech Lead", subtitle: "Unicorn Startup", date: "2020 - Pres", description: "Lideré la migración a Next.js reduciendo la latencia un 40%. Gestioné un equipo de 8 ingenieros." },
          { id: "2", title: "Senior Dev", subtitle: "Big Corp", date: "2017 - 2020", description: "Desarrollo de Design System utilizado por 40 equipos." }
        ]
      },
      {
        id: "skills", title: "Stack Técnico", type: "skills", layout: "sidebar",
        items: [
          { id: "s1", title: "Frontend", tags: ["React", "TypeScript", "Tailwind", "Zustand"] },
          { id: "s2", title: "Backend", tags: ["Node.js", "PostgreSQL", "AWS"] }
        ]
      }
    ]
  },
  marketing: {
    settings: { theme: 'classic', paperSize: 'Letter', density: 'normal', font: 'serif', atsMode: false, accentColor: '#be185d' },
    basics: {
      name: "Sarah Brand",
      label: "Head of Marketing",
      email: "sarah@brand.co",
      image: "",
      phone: "+44 7700 900077",
      summary: "Estratega de marca galardonada con historial probado en crecimiento B2B. Experta en narración de historias y marketing digital.",
      location: { city: "London", country: "UK" },
      profiles: [{ network: "LinkedIn", username: "sarah-marketing", url: "#" }, { network: "Twitter", username: "@sarahb", url: "#" }]
    },
    sections: [
      {
        id: "exp", title: "Experiencia Laboral", type: "experience", layout: "main",
        items: [
          { id: "1", title: "Marketing Director", subtitle: "Global Agency", date: "2019 - Present", description: "Incrementé el ROI de campañas en un 150% anual. Supervisión de presupuesto de $2M." },
          { id: "2", title: "Brand Manager", subtitle: "Fashion Co", date: "2015 - 2019", description: "Lanzamiento de 3 líneas de productos nuevas en mercado europeo." }
        ]
      },
      {
        id: "lang", title: "Idiomas", type: "languages", layout: "sidebar",
        items: [
          { id: "l1", title: "Inglés", subtitle: "Nativo" },
          { id: "l2", title: "Francés", subtitle: "Avanzado" },
          { id: "l3", title: "Español", subtitle: "Intermedio" }
        ]
      },
      {
        id: "edu", title: "Educación", type: "education", layout: "sidebar",
        items: [{ id: "e1", title: "MBA Marketing", subtitle: "London Business School", date: "2014" }]
      }
    ]
  }
};