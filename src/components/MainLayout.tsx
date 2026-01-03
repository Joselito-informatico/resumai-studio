import { EditorPanel } from './Editor/EditorPanel';
import { PreviewPanel } from './Preview/PreviewPanel';

export const MainLayout = () => {
  return (
    // CAMBIO 1: En modo print, quitamos el flex, el height fijo y el overflow hidden.
    // También forzamos fondo blanco.
    <main className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-gray-950 print:block print:h-auto print:w-auto print:overflow-visible print:bg-white">
      
      {/* Panel Izquierdo: Se oculta completamente al imprimir (display: none) */}
      <section className="w-full md:w-1/2 h-1/2 md:h-full border-r border-gray-800 print:hidden">
        <EditorPanel />
      </section>

      {/* Panel Derecho: Ocupa todo el ancho al imprimir */}
      <section className="w-full md:w-1/2 h-1/2 md:h-full print:w-full print:h-auto print:block">
        <PreviewPanel />
      </section>
      
    </main>
  );
};