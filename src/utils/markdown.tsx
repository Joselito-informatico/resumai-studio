import React from 'react';

// Convertidor simple de Markdown a React Elements
// Soporta: **bold**, *italic*, - bullet points
export const MarkdownRenderer = ({ children, className = "" }: { children: string | undefined, className?: string }) => {
  if (!children) return null;

  // 1. Manejo de Saltos de línea
  const lines = children.split('\n');

  return (
    <div className={className}>
      {lines.map((line, i) => (
        <React.Fragment key={i}>
          <LineParser text={line} />
          {i < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </div>
  );
};

const LineParser = ({ text }: { text: string }) => {
  // Regex para capturar **bold** y *italic*
  // Nota: Esto es un parser básico. Para producción masiva usaríamos 'react-markdown'
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={index} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return <em key={index} className="italic text-gray-800">{part.slice(1, -1)}</em>;
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
};