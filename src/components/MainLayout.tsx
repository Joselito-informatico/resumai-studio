import { EditorPanel } from './Editor/EditorPanel';
import { PreviewPanel } from './Preview/PreviewPanel';

export const MainLayout = () => {
  return (
    // CAMBIO: md:flex-row fuerza que estén lado a lado en pantallas medianas/grandes
    <main className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-gray-950">
      
      {/* Panel Izquierdo: 50% */}
      <section className="w-full md:w-1/2 h-1/2 md:h-full border-r border-gray-800">
        <EditorPanel />
      </section>

      {/* Panel Derecho: 50% */}
      <section className="w-full md:w-1/2 h-1/2 md:h-full">
        <PreviewPanel />
      </section>
      
    </main>
  );
};