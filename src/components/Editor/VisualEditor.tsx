import { useForm, useFieldArray, Controller } from 'react-hook-form';
import type { Control, UseFormRegister } from 'react-hook-form';

import { useResumeStore } from '../../store/useResumeStore';
import { useEffect, useRef, useState } from 'react';
import { 
  Plus, Trash2, MapPin, Globe, Mail, Phone, User, 
  LayoutTemplate, Columns, Palette, Type, Upload, 
  ArrowUp, ArrowDown, Download, FileJson, RefreshCw,
  ChevronDown, ChevronUp, Tag, Globe2, Award, Bold, Italic, Sparkles, BookTemplate, Link as LinkIcon
} from 'lucide-react';
import type { ResumeData } from '../../types/resume';
import { TEMPLATES } from '../../data/templates';

const ACCENT_COLORS = ['#2563eb', '#059669', '#dc2626', '#7c3aed', '#db2777', '#d97706', '#111827'];

interface RichTextareaProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
}

const RichTextarea = ({ value, onChange, placeholder, rows = 3 }: RichTextareaProps) => {
    const insertFormat = (format: string) => {
        const text = value || '';
        if (format === 'AI') onChange(text + " Lideré iniciativas estratégicas resultando en un incremento del 20% en eficiencia operativa.");
        else if (format === 'bold') onChange(text + " **texto destacado** ");
        else if (format === 'italic') onChange(text + " *texto itálico* ");
    };
    return (
        <div className="relative group">
            <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 p-1 rounded border border-gray-700 shadow-lg z-10">
                <button type="button" onClick={() => insertFormat('bold')} className="p-1 hover:bg-gray-700 text-gray-300 rounded"><Bold size={12} /></button>
                <button type="button" onClick={() => insertFormat('italic')} className="p-1 hover:bg-gray-700 text-gray-300 rounded"><Italic size={12} /></button>
                <div className="w-px bg-gray-600 mx-1"></div>
                <button type="button" onClick={() => insertFormat('AI')} className="p-1 hover:bg-purple-900 text-purple-400 rounded flex items-center gap-1"><Sparkles size={12} /> <span className="text-[10px] font-bold">AI</span></button>
            </div>
            <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} placeholder={placeholder} className="w-full bg-gray-800/50 rounded p-2 text-xs text-gray-300 focus:ring-1 focus:ring-blue-500 outline-none resize-none leading-relaxed" />
        </div>
    );
};

export const VisualEditor = () => {
  const { resumeData, setResumeData, resetResume } = useResumeStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);
  const [showSectionMenu, setShowSectionMenu] = useState(false);
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);

  const { register, control, watch, setValue, reset } = useForm<ResumeData>({ defaultValues: resumeData, mode: 'onChange' });
  const { fields: sectionFields, append: appendSection, remove: removeSection, move: moveSection } = useFieldArray({ control, name: "sections" });

  useEffect(() => {
    const subscription = watch((value) => { 
        const timeout = setTimeout(() => {
            if (value) setResumeData(value as ResumeData); 
        }, 300);
        return () => clearTimeout(timeout);
    });
    return () => subscription.unsubscribe();
  }, [watch, setResumeData]);

  const loadTemplate = (key: string) => {
    if(confirm("Esto reemplazará tu contenido actual. ¿Continuar?")) {
        const template = TEMPLATES[key];
        setResumeData(template);
        reset(template);
        setShowTemplateMenu(false);
    }
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        setResumeData(parsed); reset(parsed); alert("¡CV Importado!");
      } catch (err) { alert("Error: JSON inválido."); }
    };
    reader.readAsText(file);
    if (jsonInputRef.current) jsonInputRef.current.value = "";
  };

  const handleExportJson = () => {
    const dataStr = JSON.stringify(watch(), null, 2);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([dataStr], { type: "application/json" }));
    link.download = `resumai-cv.json`;
    link.click();
  };

  const handleReset = () => { 
      if (confirm("¿Borrar todo?")) { 
          resetResume();
          setTimeout(() => reset(useResumeStore.getState().resumeData), 50);
      } 
  };
  
  const handleColorChange = (c: string) => setValue('settings.accentColor', c);
  const handleFontChange = (f: 'sans' | 'serif' | 'mono') => setValue('settings.font', f);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setValue('basics.image', reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addSpecialSection = (type: 'custom' | 'languages' | 'courses', title: string) => {
    appendSection({ id: crypto.randomUUID(), title, type, layout: type === 'languages' ? 'sidebar' : 'main', items: [] });
    setShowSectionMenu(false);
  };

  const currentTheme = watch('settings');
  const currentImage = watch('basics.image');

  return (
    <div className="h-full overflow-y-auto p-6 bg-gray-900 text-gray-300 space-y-6 pb-32 scroll-smooth">
      <section className="bg-gray-800/40 p-4 rounded-xl border border-gray-700 space-y-4">
        <h2 className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-wider border-b border-gray-700 pb-2"><Palette size={16} className="text-pink-500" /> Diseño Global</h2>
        <div className="grid grid-cols-2 gap-4">
            <button type="button" onClick={() => setValue('settings.theme', 'modern')} className={`p-3 rounded-lg border-2 text-left transition-all ${currentTheme.theme === 'modern' ? 'border-blue-500 bg-blue-900/20' : 'border-gray-700 hover:border-gray-600'}`}>
                <div className="font-bold text-sm text-white mb-1">Moderno</div><div className="text-[10px] text-gray-400">Tech / Creativo</div>
            </button>
            <button type="button" onClick={() => setValue('settings.theme', 'classic')} className={`p-3 rounded-lg border-2 text-left transition-all ${currentTheme.theme === 'classic' ? 'border-blue-500 bg-blue-900/20' : 'border-gray-700 hover:border-gray-600'}`}>
                <div className="font-bold text-sm text-white mb-1 font-serif">Clásico</div><div className="text-[10px] text-gray-400">Formal / Ejecutivo</div>
            </button>
        </div>
        <div className="flex flex-wrap gap-6 pt-2 border-t border-gray-700/50">
          <div className="space-y-2">
            <span className="text-xs text-gray-500 font-medium">COLOR</span>
            <div className="flex gap-2">{ACCENT_COLORS.map(color => <button key={color} type="button" onClick={() => handleColorChange(color)} className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${currentTheme.accentColor === color ? 'border-white ring-2 ring-blue-500' : 'border-transparent'}`} style={{ backgroundColor: color }} />)}</div>
          </div>
          <div className="space-y-2 flex-1">
             <span className="text-xs text-gray-500 font-medium flex items-center gap-1"><Type size={12} /> TIPOGRAFÍA</span>
             <div className="flex bg-gray-900 rounded p-1 border border-gray-700 w-full max-w-[200px]">{(['sans', 'serif', 'mono'] as const).map(font => <button key={font} type="button" onClick={() => handleFontChange(font)} className={`flex-1 px-2 py-1 text-xs rounded transition-all capitalize ${currentTheme.font === font ? 'bg-gray-700 text-white shadow font-bold' : 'text-gray-500 hover:text-gray-300'}`}>{font}</button>)}</div>
          </div>
        </div>
      </section>

      <CollapsibleSection title="Datos Personales" icon={<User size={18} className="text-blue-500" />} defaultOpen={true}>
        <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center gap-2 pt-2">
                <div onClick={() => fileInputRef.current?.click()} className="w-20 h-20 rounded-full border-2 border-dashed border-gray-600 hover:border-blue-500 cursor-pointer flex items-center justify-center overflow-hidden relative group bg-gray-900">
                    {currentImage ? <img src={currentImage} alt="Preview" className="w-full h-full object-cover" /> : <Upload size={18} className="text-gray-500" />}
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            </div>
            <div className="flex-1 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><label className="label">Nombre</label><input {...register('basics.name')} className="input-field" /></div>
                    <div className="space-y-1"><label className="label">Título</label><input {...register('basics.label')} className="input-field" /></div>
                </div>
                <div className="space-y-1"><label className="label">Resumen</label>
                    <Controller name="basics.summary" control={control} render={({ field }) => <RichTextarea {...field} value={field.value || ''} placeholder="Perfil profesional..." />} />
                </div>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
           <div className="icon-input"><Mail size={14} /><input {...register('basics.email')} className="pl-8 input-field" placeholder="Email" /></div>
           <div className="icon-input"><Phone size={14} /><input {...register('basics.phone')} className="pl-8 input-field" placeholder="Teléfono" /></div>
           <div className="icon-input"><MapPin size={14} /><input {...register('basics.location.city')} className="pl-8 input-field" placeholder="Ciudad" /></div>
           <div className="icon-input"><Globe size={14} /><input {...register('basics.website')} className="pl-8 input-field" placeholder="Web" /></div>
        </div>
      </CollapsibleSection>

      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-800 relative">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Bloques</h3>
            <div className="relative">
                <button type="button" onClick={() => setShowSectionMenu(!showSectionMenu)} className="btn-primary"><Plus size={14} /> Añadir Sección</button>
                {showSectionMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                        <div className="p-2 text-xs text-gray-500 font-bold uppercase tracking-wider bg-gray-900/50 border-b border-gray-700">Catálogo</div>
                        <button onClick={() => addSpecialSection('custom', 'Estándar')} className="w-full text-left px-4 py-3 hover:bg-gray-700 text-sm flex items-center gap-2"><LayoutTemplate size={16} className="text-blue-400" /> Estándar</button>
                        <button onClick={() => addSpecialSection('languages', 'Idiomas')} className="w-full text-left px-4 py-3 hover:bg-gray-700 text-sm flex items-center gap-2"><Globe2 size={16} className="text-green-400" /> Idiomas</button>
                        <button onClick={() => addSpecialSection('courses', 'Certificaciones')} className="w-full text-left px-4 py-3 hover:bg-gray-700 text-sm flex items-center gap-2"><Award size={16} className="text-yellow-400" /> Cursos / Premios</button>
                    </div>
                )}
                {showSectionMenu && <div className="fixed inset-0 z-40" onClick={() => setShowSectionMenu(false)} />}
            </div>
        </div>
        {sectionFields.map((section, index) => <SectionEditor key={section.id} control={control} register={register} sectionIndex={index} removeSection={() => removeSection(index)} moveSection={moveSection} isFirst={index === 0} isLast={index === sectionFields.length - 1} type={section.type} />)}
      </div>

      <div className="fixed bottom-0 left-0 w-full md:w-1/2 bg-gray-900/95 backdrop-blur border-t border-gray-800 p-3 flex items-center justify-between z-50">
         <div className="flex items-center gap-2">
             <div className="relative">
                 <button onClick={() => setShowTemplateMenu(!showTemplateMenu)} className="btn-secondary text-purple-300 border-purple-900/50 hover:bg-purple-900/20" title="Cargar ejemplo">
                    <BookTemplate size={14} /> <span className="hidden sm:inline">Plantillas</span>
                 </button>
                 {showTemplateMenu && (
                     <div className="absolute left-0 bottom-full mb-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                        <div className="p-2 text-xs text-gray-500 font-bold uppercase tracking-wider bg-gray-900/50 border-b border-gray-700">Ejemplos</div>
                        <button onClick={() => loadTemplate('senior_dev')} className="w-full text-left px-4 py-3 hover:bg-gray-700 text-xs text-gray-300">👨‍💻 Senior Developer</button>
                        <button onClick={() => loadTemplate('marketing')} className="w-full text-left px-4 py-3 hover:bg-gray-700 text-xs text-gray-300">📈 Marketing Manager</button>
                     </div>
                 )}
                 {showTemplateMenu && <div className="fixed inset-0 z-40" onClick={() => setShowTemplateMenu(false)} />}
             </div>
             <div className="h-4 w-px bg-gray-700 mx-1"></div>
             <button onClick={handleExportJson} className="btn-secondary" title="Guardar"><Download size={14} /></button>
             <div className="relative"><button onClick={() => jsonInputRef.current?.click()} className="btn-secondary" title="Cargar"><FileJson size={14} /></button><input type="file" ref={jsonInputRef} onChange={handleImportJson} accept=".json" className="hidden" /></div>
         </div>
         <button onClick={handleReset} className="btn-danger"><RefreshCw size={14} /> Reset</button>
      </div>
      <style>{`
        .input-field { width: 100%; background-color: rgb(31 41 55); border: 1px solid rgb(55 65 81); border-radius: 0.375rem; padding: 0.4rem 0.6rem; font-size: 0.85rem; color: white; transition: all 0.2s; }
        .input-field:focus { outline: none; border-color: rgb(59 130 246); }
        .label { font-size: 0.7rem; font-weight: 500; color: rgb(156 163 175); text-transform: uppercase; }
        .icon-input { position: relative; }
        .icon-input svg { position: absolute; left: 0.6rem; top: 0.6rem; color: rgb(156 163 175); }
        .btn-primary { font-size: 0.75rem; background-color: rgb(37 99 235); color: white; padding: 0.4rem 0.8rem; border-radius: 0.375rem; display: flex; align-items: center; gap: 0.25rem; }
        .btn-secondary { font-size: 0.75rem; background-color: rgb(31 41 55); color: rgb(147 197 253); padding: 0.4rem 0.8rem; border-radius: 0.375rem; border: 1px solid rgb(55 65 81); display: flex; align-items: center; gap: 0.25rem; }
        .btn-danger { font-size: 0.75rem; background-color: rgba(127, 29, 29, 0.2); color: rgb(248 113 113); padding: 0.4rem 0.8rem; border-radius: 0.375rem; display: flex; align-items: center; gap: 0.25rem; }
      `}</style>
    </div>
  );
};

interface CollapsibleProps { title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean; }
const CollapsibleSection = ({ title, icon, children, defaultOpen = false }: CollapsibleProps) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <section className="bg-gray-800/20 border border-gray-800 rounded-lg overflow-hidden transition-all hover:border-gray-700">
            <div onClick={() => setIsOpen(!isOpen)} className="bg-gray-800/40 p-3 flex items-center justify-between cursor-pointer select-none hover:bg-gray-800/60">
                <h3 className="flex items-center gap-2 text-sm font-bold text-gray-200">{icon} {title}</h3>
                {isOpen ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
            </div>
            {isOpen && <div className="p-4 border-t border-gray-800">{children}</div>}
        </section>
    );
};

interface SectionEditorProps {
    control: Control<ResumeData>;
    register: UseFormRegister<ResumeData>;
    sectionIndex: number;
    removeSection: () => void;
    moveSection: (from: number, to: number) => void;
    isFirst: boolean;
    isLast: boolean;
    type: string;
}

const SectionEditor = ({ control, register, sectionIndex, removeSection, moveSection, isFirst, isLast, type }: SectionEditorProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const { fields, append, remove, move } = useFieldArray({ control, name: `sections.${sectionIndex}.items` });
  const getIcon = () => { if (type === 'languages') return <Globe2 size={16} className="text-green-400" />; if (type === 'courses') return <Award size={16} className="text-yellow-400" />; return <LayoutTemplate size={16} className="text-purple-400" />; };

  return (
    <section className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden shadow-sm hover:border-blue-900/30 transition-all">
      <div className="bg-gray-800 p-2 pl-3 flex items-center justify-between border-b border-gray-700 select-none">
        <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
            <div className="flex flex-col gap-0.5"><button type="button" onClick={(e) => {e.stopPropagation(); moveSection(sectionIndex, sectionIndex - 1)}} disabled={isFirst} className="text-gray-500 hover:text-white disabled:opacity-20"><ArrowUp size={10} /></button><button type="button" onClick={(e) => {e.stopPropagation(); moveSection(sectionIndex, sectionIndex + 1)}} disabled={isLast} className="text-gray-500 hover:text-white disabled:opacity-20"><ArrowDown size={10} /></button></div>
            {getIcon()}
            <input {...register(`sections.${sectionIndex}.title`)} onClick={(e) => e.stopPropagation()} className="bg-transparent font-bold text-white text-sm focus:outline-none focus:border-b border-blue-500 w-full max-w-[200px]" placeholder="Título" />
            <span className="text-xs text-gray-600 bg-gray-900 px-1.5 rounded">{type === 'custom' ? '' : type}</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-gray-900 rounded px-1 border border-gray-700"><Columns size={12} className="text-gray-500" /><select {...register(`sections.${sectionIndex}.layout`)} className="bg-transparent text-[10px] text-gray-300 uppercase font-bold focus:outline-none cursor-pointer py-1"><option value="main">Principal</option><option value="sidebar">Lateral</option></select></div>
            <button type="button" onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-white"><ChevronDown size={16} className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} /></button>
            <button type="button" onClick={removeSection} className="text-gray-600 hover:text-red-400 p-1 hover:bg-gray-800 rounded"><Trash2 size={14} /></button>
        </div>
      </div>
      {isOpen && (
      <div className="p-3 space-y-3 bg-gray-900/50">
        {fields.map((item, index) => (
          <div key={item.id} className="group relative pl-3 border-l-2 border-gray-700 hover:border-blue-500 flex gap-3 items-start">
            <div className="flex flex-col justify-start gap-1 pt-1 opacity-20 group-hover:opacity-100 transition-opacity"><button type="button" onClick={() => move(index, index - 1)} disabled={index === 0} className="hover:text-white"><ArrowUp size={12} /></button><button type="button" onClick={() => move(index, index + 1)} disabled={index === fields.length - 1} className="hover:text-white"><ArrowDown size={12} /></button><button type="button" onClick={() => remove(index)} className="text-red-500 hover:text-red-400 mt-1"><Trash2 size={12} /></button></div>
            <div className="flex-1 space-y-2">
                {type === 'languages' ? (
                   <div className="space-y-1">
                      <div className="flex gap-2 items-center"><input {...register(`sections.${sectionIndex}.items.${index}.title`)} placeholder="Idioma" className="flex-1 bg-transparent border-b border-gray-800 focus:border-blue-500 text-sm font-medium text-white px-1 py-0.5 outline-none" /><select {...register(`sections.${sectionIndex}.items.${index}.subtitle`)} className="bg-gray-800 text-xs text-gray-300 border border-gray-700 rounded px-2 py-1 outline-none"><option value="Nativo">Nativo</option><option value="Avanzado">Avanzado (C1/C2)</option><option value="Intermedio">Intermedio (B1/B2)</option><option value="Básico">Básico (A1/A2)</option></select></div>
                      {/* NUEVO: Descripción para idioma */}
                      <input {...register(`sections.${sectionIndex}.items.${index}.description`)} placeholder="Detalle (ej: Lectura técnica)" className="w-full bg-transparent text-xs text-gray-500 px-1 outline-none placeholder-gray-700" />
                   </div>
                ) : type === 'courses' ? (
                   <div className="space-y-1">
                       <div className="flex gap-2"><input {...register(`sections.${sectionIndex}.items.${index}.title`)} placeholder="Curso / Certificación" className="flex-1 bg-transparent border-b border-gray-800 focus:border-blue-500 text-sm font-medium text-white px-1 py-0.5 outline-none" /><input {...register(`sections.${sectionIndex}.items.${index}.date`)} placeholder="Año" className="w-16 bg-transparent border-b border-gray-800 focus:border-blue-500 text-xs text-right text-gray-400 px-1 py-0.5 outline-none font-mono" /></div>
                       {/* NUEVO: Campo URL para el certificado */}
                       <div className="flex gap-2 items-center"><input {...register(`sections.${sectionIndex}.items.${index}.subtitle`)} placeholder="Entidad Emisora" className="flex-1 bg-transparent text-xs text-blue-400 px-1 outline-none" /><LinkIcon size={10} className="text-gray-600"/><input {...register(`sections.${sectionIndex}.items.${index}.url`)} placeholder="https://..." className="w-1/3 bg-transparent text-xs text-gray-500 outline-none" /></div>
                       {/* NUEVO: Descripción para el curso */}
                       <Controller name={`sections.${sectionIndex}.items.${index}.description`} control={control} render={({ field }) => <RichTextarea {...field} value={field.value || ''} placeholder="Detalles del curso..." rows={2} />} />
                   </div>
                ) : (
                   <>
                       <div className="flex gap-2"><input {...register(`sections.${sectionIndex}.items.${index}.title`)} placeholder="Título Principal" className="w-full bg-transparent border-b border-gray-800 focus:border-blue-500 text-sm font-medium text-white px-1 py-0.5 outline-none" /><input {...register(`sections.${sectionIndex}.items.${index}.date`)} placeholder="Fecha" className="w-1/3 bg-transparent border-b border-gray-800 focus:border-blue-500 text-xs text-right text-gray-400 px-1 py-0.5 outline-none font-mono" /></div>
                       <div className="flex gap-2 items-center">
                           <input {...register(`sections.${sectionIndex}.items.${index}.subtitle`)} placeholder="Subtítulo / Empresa" className="flex-1 bg-transparent text-xs text-blue-400 px-1 outline-none placeholder-gray-600" />
                           {/* NUEVO: Campo URL para el proyecto */}
                           <LinkIcon size={10} className="text-gray-600"/><input {...register(`sections.${sectionIndex}.items.${index}.url`)} placeholder="Link Proyecto..." className="w-1/3 bg-transparent text-xs text-gray-500 outline-none" />
                       </div>
                       <Controller control={control} name={`sections.${sectionIndex}.items.${index}.tags`} render={({ field }) => ( <div className="flex items-center gap-2 bg-gray-800/50 rounded px-2 py-1 border border-transparent focus-within:border-gray-600"><Tag size={12} className="text-gray-500" /><input className="w-full bg-transparent text-xs text-gray-300 outline-none placeholder-gray-600" placeholder="Tags..." defaultValue={field.value?.join(", ")} onBlur={(e) => field.onChange(e.target.value ? e.target.value.split(',').map(s => s.trim()).filter(Boolean) : [])} /></div> )} />
                       <Controller name={`sections.${sectionIndex}.items.${index}.description`} control={control} render={({ field }) => <RichTextarea {...field} value={field.value || ''} placeholder="Descripción..." />} />
                   </>
                )}
            </div>
          </div>
        ))}
        <button type="button" onClick={() => append({ id: crypto.randomUUID(), title: "", description: "" })} className="w-full py-2 border border-dashed border-gray-700 text-gray-500 text-xs rounded hover:border-blue-500 hover:text-blue-400 flex items-center justify-center gap-1 transition-colors"><Plus size={14} /> Añadir Ítem</button>
      </div>
      )}
    </section>
  );
};