import { Code, Eye } from 'lucide-react';
import { useState } from 'react';
import { JsonEditor } from './JsonEditor';
import { VisualEditor } from './VisualEditor'; // <--- IMPORTAR

export const EditorPanel = () => {
  const [activeTab, setActiveTab] = useState<'code' | 'visual'>('code');

  return (
    <div className="flex flex-col h-full bg-gray-900 text-gray-300 border-r border-gray-800">
      
      {/* --- Toolbar --- */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-900 z-10">
        <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeTab === 'code' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'hover:text-white hover:bg-gray-700'
            }`}
          >
            <Code size={16} />
            <span>Código</span>
          </button>
          <button
            onClick={() => setActiveTab('visual')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeTab === 'visual' 
                ? 'bg-purple-600 text-white shadow-sm' 
                : 'hover:text-white hover:bg-gray-700'
            }`}
          >
            <Eye size={16} />
            <span>Visual</span>
          </button>
        </div>
        
        <div className="text-xs font-mono text-gray-500 hidden sm:block">
          ResumAI Studio
        </div>
      </header>

      {/* --- Área de Contenido --- */}
      <div className="flex-1 overflow-hidden relative bg-gray-900">
        {activeTab === 'code' ? (
          <JsonEditor />
        ) : (
          <VisualEditor /> // <--- AQUÍ CARGAMOS EL COMPONENTE
        )}
      </div>
    </div>
  );
};