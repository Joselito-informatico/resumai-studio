import { Github, Linkedin, Twitter, Globe, Mail, Phone, MapPin } from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import type { ResumeSection, ResumeData } from '../../types/resume';
import { MarkdownRenderer } from '../../utils/markdown'; // <--- IMPORTAR

const getSocialIcon = (network: string) => {
  const n = network.toLowerCase();
  if (n.includes('github')) return <Github size={10} />;
  if (n.includes('linkedin')) return <Linkedin size={10} />;
  if (n.includes('twitter') || n.includes('x')) return <Twitter size={10} />;
  return <Globe size={10} />;
};

export const ResumeRenderer = () => {
  const { resumeData } = useResumeStore();
  if (resumeData.settings.atsMode) return <ATSLayout data={resumeData} />;
  return resumeData.settings.theme === 'classic' ? <ClassicLayout data={resumeData} /> : <ModernLayout data={resumeData} />;
};

// --- MODERN LAYOUT ---
const ModernLayout = ({ data }: { data: ResumeData }) => {
  const { basics, sections, settings } = data;
  const mainSections = sections.filter(s => s.layout === 'main');
  const sideSections = sections.filter(s => s.layout === 'sidebar');
  const density = {
    compact: { gap: 'gap-3', text: 'text-xs', header: 'text-2xl', margin: 'mb-4' },
    normal: { gap: 'gap-5', text: 'text-sm', header: 'text-3xl', margin: 'mb-6' },
    spacious: { gap: 'gap-8', text: 'text-base', header: 'text-4xl', margin: 'mb-8' },
  }[settings.density];
  const fontClass = `font-${settings.font}`;

  return (
    <div className={`flex flex-col h-full text-gray-900 ${density.text} ${fontClass}`}>
      <header className={`border-b-2 pb-5 mb-6 flex gap-6 items-start`} style={{ borderColor: settings.accentColor }}>
        {basics.image && <img src={basics.image} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-gray-100" style={{ borderColor: settings.accentColor + '20' }} />}
        <div className="flex-1">
            <h1 className={`${density.header} font-extrabold uppercase leading-none tracking-tight`} style={{ color: settings.accentColor }}>{basics.name}</h1>
            <p className="text-gray-600 font-medium mt-1 tracking-wide text-lg">{basics.label}</p>
            <ContactInfo basics={basics} color={settings.accentColor} />
            {basics.summary && <MarkdownRenderer className="mt-3 text-gray-700 leading-relaxed text-justify">{basics.summary}</MarkdownRenderer>}
        </div>
      </header>
      <div className="grid grid-cols-12 gap-8 h-full">
        <div className="col-span-8 space-y-2">{mainSections.map(s => <SectionRenderer key={s.id} section={s} settings={settings} />)}</div>
        <div className="col-span-4 border-l border-gray-200 pl-6 space-y-2 h-full">{sideSections.map(s => <SectionRenderer key={s.id} section={s} settings={settings} />)}</div>
      </div>
    </div>
  );
};

// --- CLASSIC LAYOUT ---
const ClassicLayout = ({ data }: { data: ResumeData }) => {
  const { basics, sections, settings } = data;
  const allSections = [...sections.filter(s => s.layout === 'main'), ...sections.filter(s => s.layout === 'sidebar')];
  const density = { compact: { text: 'text-xs', header: 'text-2xl', margin: 'mb-4' }, normal: { text: 'text-sm', header: 'text-3xl', margin: 'mb-6' }, spacious: { text: 'text-base', header: 'text-4xl', margin: 'mb-8' } }[settings.density];
  const fontClass = settings.font === 'sans' ? 'font-serif' : `font-${settings.font}`;

  return (
    <div className={`flex flex-col h-full text-gray-900 ${density.text} ${fontClass}`}>
      <header className="text-center border-b border-gray-300 pb-6 mb-6">
        <h1 className={`${density.header} font-serif font-bold uppercase tracking-widest text-gray-900`}>{basics.name}</h1>
        <p className="text-gray-600 italic mt-1 text-lg">{basics.label}</p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-3 text-xs text-gray-500 font-medium uppercase tracking-wider"><ContactItems basics={basics} /></div>
        {basics.summary && <MarkdownRenderer className="mt-4 text-gray-700 leading-relaxed max-w-3xl mx-auto italic">{"\"" + basics.summary + "\""}</MarkdownRenderer>}
      </header>
      <div className="space-y-6">
        {allSections.map(s => (
          <div key={s.id} className={`${density.margin}`}>
            <h3 className="text-center font-bold uppercase tracking-widest border-b border-gray-300 mb-4 pb-1 text-sm text-gray-800">{s.title}</h3>
            {s.type === 'languages' ? (
                <div className="flex flex-wrap justify-center gap-6">
                    {s.items.map((item: any) => (
                        <div key={item.id} className="text-center"><span className="font-bold">{item.title}</span> <span className="text-gray-500 italic">({item.subtitle})</span></div>
                    ))}
                </div>
            ) : (
                <div className="space-y-4">{s.items.map((item: any) => (
                    <div key={item.id} className="grid grid-cols-12 gap-4">
                        <div className="col-span-2 text-right text-gray-500 font-medium text-xs pt-0.5">{item.date}</div>
                        <div className="col-span-10">
                            <h4 className="font-bold text-gray-900 text-base">{item.title}</h4>
                            {item.subtitle && <p className="text-gray-700 italic mb-1">{item.subtitle}</p>}
                            {item.description && <MarkdownRenderer className="text-gray-600 leading-relaxed whitespace-pre-line text-justify">{item.description}</MarkdownRenderer>}
                        </div>
                    </div>
                ))}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ATSLayout = ({ data }: { data: ResumeData }) => <ModernLayout data={{...data, settings: {...data.settings, accentColor: '#000'}}} />;

const ContactInfo = ({ basics, color }: any) => <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-500 font-medium"><ContactItems basics={basics} color={color} /></div>;
const ContactItems = ({ basics, color }: any) => (
    <>
        {basics.email && <span className="flex items-center gap-1">{basics.email}</span>}
        {basics.phone && <span>| {basics.phone}</span>}
        {basics.location?.city && <span>| {basics.location.city}, {basics.location.country}</span>}
        {basics.profiles.map((profile: any, idx: number) => <a key={idx} href={profile.url} target="_blank" rel="noreferrer" style={{ color }} className="flex items-center gap-1 hover:underline">| {profile.network}</a>)}
    </>
);

const LevelDots = ({ level, color }: { level: string, color: string }) => {
    const score = { 'Nativo': 5, 'Avanzado': 4, 'Intermedio': 3, 'Básico': 2 }[level] || 3;
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`w-2 h-2 rounded-full ${i <= score ? '' : 'bg-gray-200'}`} style={{ backgroundColor: i <= score ? color : undefined }} />
            ))}
        </div>
    );
};

const SectionRenderer = ({ section, settings }: any) => (
  <div className="mb-6 last:mb-0">
    <h3 className="font-bold uppercase tracking-widest border-b-2 mb-3 text-xs flex items-center gap-2 pb-1" style={{ color: settings.accentColor, borderColor: settings.accentColor }}>{section.title}</h3>
    <div className="space-y-3">
      {section.items.map((item: any) => (
        <div key={item.id}>
          {section.type === 'languages' ? (
              <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-gray-800 text-sm">{item.title}</span>
                  <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 mr-1">{item.subtitle}</span>
                      <LevelDots level={item.subtitle || ''} color={settings.accentColor} />
                  </div>
              </div>
          ) : (
            <>
              <div className="flex justify-between items-baseline mb-1">
                <h4 className="font-bold text-gray-900">{item.title}</h4>
                {item.date && <span className="text-xs text-gray-500 font-mono ml-2">{item.date}</span>}
              </div>
              {item.subtitle && <p className="font-medium text-xs mb-1" style={{ color: settings.accentColor }}>{item.subtitle}</p>}
              {item.description && <MarkdownRenderer className="text-gray-700 leading-relaxed text-justify whitespace-pre-line">{item.description}</MarkdownRenderer>}
              {item.tags && item.tags.length > 0 && (
                <div className="flex gap-1 flex-wrap mt-1.5">{item.tags.map((tag: string) => <span key={tag} className="bg-gray-100 border border-gray-200 text-gray-600 px-1.5 py-0.5 rounded text-[10px] font-medium uppercase">{tag}</span>)}</div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  </div>
);