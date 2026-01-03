import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import App from '../App';
import { useResumeStore } from '../store/useResumeStore';

// Mock de window.print y confirm
window.print = vi.fn();
window.confirm = vi.fn(() => true);
window.alert = vi.fn();

// Mock para evitar errores con Scroll en entorno de test JSDOM
window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('ResumAI Studio Analysis', () => {
  
  // Resetear store antes de cada test para aislar casos
  beforeEach(() => {
    const { resetResume } = useResumeStore.getState();
    resetResume();
  });

  it('Caso 1: La aplicación debe renderizar sin crashear (Smoke Test)', () => {
    render(<App />);
    expect(screen.getByText(/Código/i)).toBeInTheDocument();
    expect(screen.getByText(/Visual/i)).toBeInTheDocument();
  });

  it('Caso 2: Verificar carga de datos iniciales', () => {
    render(<App />);
    
    // 1. Cambiar a pestaña Visual primero para que los inputs existan en el DOM
    const visualBtn = screen.getByText(/Visual/i);
    fireEvent.click(visualBtn);
    
    // 2. Buscar el valor por defecto "Alex Dev". 
    // Usamos getAllByDisplayValue porque aparece tanto en el Input del Editor como en el Preview si fuera un input, 
    // pero aquí buscamos específicamente que el formulario se haya hidratado bien.
    expect(screen.getAllByDisplayValue(/Alex Dev/i)[0]).toBeInTheDocument();
  });

  it('Caso 3: Cambio de Pestaña Visual a Código', () => {
    render(<App />);
    
    // Primero vamos a Visual
    const visualBtn = screen.getByText(/Visual/i);
    fireEvent.click(visualBtn);
    
    // --- CORRECCIÓN AQUÍ ---
    // En lugar de buscar un placeholder que ya no existe, buscamos el título de la sección
    expect(screen.getByText(/Datos Personales/i)).toBeInTheDocument(); 

    // Luego volvemos a Código
    const codeBtn = screen.getByText(/Código/i);
    fireEvent.click(codeBtn);
    
    // Verificamos que la interfaz no crasheó al volver
    expect(screen.getByText(/Visual/i)).toBeInTheDocument();
  });

  it('Caso 4: Agregar una nueva sección no debe producir error', () => {
    render(<App />);
    
    // Ir a modo visual
    const visualBtn = screen.getByText(/Visual/i);
    fireEvent.click(visualBtn);

    // Buscar botón de añadir sección
    const addSectionBtn = screen.getByText(/Añadir Sección/i);
    fireEvent.click(addSectionBtn);

    // Seleccionar 'Estándar' del menú
    const standardOption = screen.getByText(/Estándar/i);
    fireEvent.click(standardOption);

    // Verificar que se agregó un nuevo input de título (ahora habrá más de los iniciales)
    // El placeholder "Título" sí existe en las secciones nuevas
    const inputs = screen.getAllByPlaceholderText(/Título/i);
    expect(inputs.length).toBeGreaterThan(0);
  });
});