import type { ResumeData } from '../types/resume';

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export const validateResumeData = (data: any): { isValid: boolean; errors: ValidationError[] } => {
  const errors: ValidationError[] = [];

  // 1. Verificar estructura base
  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: [{ field: 'root', message: 'El JSON está vacío o no es un objeto.', severity: 'error' }] };
  }

  // 2. Verificar 'basics' (Crítico)
  if (!data.basics) {
    errors.push({ field: 'basics', message: 'Falta la sección "basics".', severity: 'error' });
  } else {
    const b = data.basics;
    if (!b.name) errors.push({ field: 'basics.name', message: 'El nombre es obligatorio.', severity: 'error' });
    if (!b.email) errors.push({ field: 'basics.email', message: 'El email es obligatorio.', severity: 'warning' });
  }

  // 3. Verificar 'sections'
  if (!data.sections || !Array.isArray(data.sections)) {
    errors.push({ field: 'sections', message: 'La lista de secciones no existe o es inválida.', severity: 'error' });
  } else {
    data.sections.forEach((section: any, index: number) => {
      // Validar ID y Título de sección
      if (!section.id || !section.title) {
        errors.push({ field: `sections[${index}]`, message: `La sección en índice ${index} no tiene ID o Título.`, severity: 'error' });
      }

      // Validar items dentro de la sección
      if (Array.isArray(section.items)) {
        section.items.forEach((item: any, iIndex: number) => {
          if (!item.title) {
            errors.push({ field: `sections[${index}].items[${iIndex}]`, message: `Un ítem en "${section.title}" no tiene título.`, severity: 'warning' });
          }
        });
      }
    });
  }

  // 4. Verificar 'settings' (Para evitar crash en renderizado)
  if (!data.settings) {
    errors.push({ field: 'settings', message: 'Falta configuración (settings). Se usarán valores por defecto.', severity: 'warning' });
  }

  const hasCriticalErrors = errors.some(e => e.severity === 'error');

  return {
    isValid: !hasCriticalErrors,
    errors
  };
};

/**
 * Función helper para reparar datos incompletos (Sanitizer)
 */
export const sanitizeData = (data: any): ResumeData => {
  // Aquí podrías fusionar el data entrante con tu INITIAL_DATA para asegurar
  // que los campos faltantes tengan un valor por defecto.
  // Por brevedad, asumimos que si pasa la validación, es seguro usarlo o rellenar settings básicos.
  return {
    ...data,
    settings: {
      theme: 'modern',
      paperSize: 'A4',
      density: 'compact',
      font: 'sans',
      atsMode: false,
      accentColor: '#2563eb',
      ...data.settings // Sobrescribir con lo que traiga el JSON si existe
    },
    sections: Array.isArray(data.sections) ? data.sections : []
  } as ResumeData;
};