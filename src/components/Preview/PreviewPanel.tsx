import { useState, useRef, useEffect } from 'react'; 
import { Printer, Settings2, FileText, Columns, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import { ResumeRenderer } from './ResumeRenderer';

export const PreviewPanel = () => {
  const { resumeData, updateSettings } = useResumeStore();
  const { settings } = resumeData;
  const [zoom, setZoom] = useState(0.8); 
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.max(0.3, Math.min(2, prev + delta)));
  };

  // Dimensiones físicas para visualización en pantalla
  const pageSize = settings.paperSize === 'A4' 
    ? { width: '210mm', height: '297mm' }
    : { width: '8.5in', height: '11in' };

  return (
    <div className="flex flex-col h-full bg-gray-950 text-gray-300 relative">
      
      {/* --- TOOLBAR --- */}
      <header className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-950/95 backdrop-blur z-20 print:hidden shadow-md">
        
        {/* Izquierda: Modos */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => updateSettings({ atsMode: !settings.atsMode })}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
              settings.atsMode 
                ? 'bg-red-900/30 border-red-500/50 text-red-200' 
                : 'bg-gray-900 border-gray-700 text-gray-400 hover:text-white'
            }`}
            title={settings.atsMode ? "Volver a Diseño Visual" : "Ver como Robot (ATS)"}
          >
            {settings.atsMode ? <FileText size={16} /> : <Columns size={16} />}
            <span className="text-xs font-bold hidden xl:inline">
              {settings.atsMode ? 'MODO ROBOT' : 'MODO DISEÑO'}
            </span>
          </button>

          <div className="h-6 w-px bg-gray-800 hidden lg:block"></div>

          {/* Densidad */}
          <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-800 hidden md:flex">
            {(['compact', 'normal', 'spacious'] as const).map((density) => (
              <button
                key={density}
                onClick={() => updateSettings({ density })}
                className={`px-3 py-1 text-xs rounded-md transition-all capitalize ${
                  settings.density === density 
                    ? 'bg-gray-700 text-white shadow-sm font-medium' 
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {density}
              </button>
            ))}
          </div>
        </div>

        {/* Centro: Zoom */}
        <div className="hidden lg:flex items-center gap-2 bg-gray-900 px-2 py-1 rounded-lg border border-gray-800">
            <button onClick={() => handleZoom(-0.1)} className="p-1 hover:text-white text-gray-500"><ZoomOut size={16} /></button>
            <span className="text-xs font-mono w-12 text-center">{(zoom * 100).toFixed(0)}%</span>
            <button onClick={() => handleZoom(0.1)} className="p-1 hover:text-white text-gray-500"><ZoomIn size={16} /></button>
            <div className="w-px h-4 bg-gray-700 mx-1"></div>
            <button onClick={() => setZoom(0.75)} className="p-1 hover:text-white text-gray-500" title="Ajustar"><Maximize size={14} /></button>
        </div>

        {/* Derecha: Exportar */}
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-800 hidden sm:flex">
             <Settings2 size={14} className="text-gray-500" />
             <select 
               value={settings.paperSize}
               onChange={(e) => updateSettings({ paperSize: e.target.value as 'A4' | 'Letter' })}
               className="bg-transparent text-xs text-gray-300 focus:outline-none cursor-pointer"
             >
               <option value="A4">A4 (210mm)</option>
               <option value="Letter">Carta (US)</option>
             </select>
           </div>

           <button 
             onClick={handlePrint}
             className="flex items-center gap-2 text-xs bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-lg shadow-blue-900/20 active:scale-95 group"
           >
             <Printer size={16} className="group-hover:animate-bounce" />
             <span className="hidden sm:inline">PDF</span>
           </button>
        </div>
      </header>

      {/* --- CANVAS --- */}
      <div className="flex-1 overflow-auto p-8 flex justify-center items-start bg-gray-900/50 print:p-0 print:overflow-visible print:bg-white relative">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#374151 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

        <div 
            id="print-area"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.2s ease-out' }}
            className="relative z-10"
        >
            <div 
              id="resume-paper"
              className="bg-white text-black shadow-2xl origin-top relative print:shadow-none print:m-0"
              style={{ 
                width: pageSize.width, 
                minHeight: pageSize.height,
                padding: '12mm' // Se mantiene para la vista previa
              }}
            >
              <ResumeRenderer />
              
              {/* Líneas guía de páginas */}
              <div className="absolute inset-0 pointer-events-none print:hidden overflow-hidden">
                 {[1, 2, 3].map(page => (
                     <div 
                        key={page} 
                        className="absolute w-full border-b-2 border-dashed border-red-400/50 flex items-end justify-end pr-2"
                        style={{ top: `calc(${pageSize.height} * ${page})` }}
                     >
                         <span className="text-[10px] font-mono text-red-400 bg-white/80 px-1 rounded -mb-2">
                             Fin de Página {page}
                         </span>
                     </div>
                 ))}
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};