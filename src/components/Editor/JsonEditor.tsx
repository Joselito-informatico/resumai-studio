import Editor from '@monaco-editor/react';
import { useResumeStore } from '../../store/useResumeStore';
import { useState, useEffect } from 'react';

export const JsonEditor = () => {
  const { resumeData, setResumeData } = useResumeStore();
  const [editorValue, setEditorValue] = useState(JSON.stringify(resumeData, null, 2));

  useEffect(() => {
    setEditorValue(JSON.stringify(resumeData, null, 2));
  }, [resumeData]);

  const handleEditorChange = (value: string | undefined) => {
    if (value === undefined) return;
    setEditorValue(value);
    try {
      const parsed = JSON.parse(value);
      setResumeData(parsed);
    } catch (error) {
      // Ignorar errores de sintaxis mientras se escribe
    }
  };

  return (
    <div className="h-full w-full bg-[#1e1e1e]">
      <Editor
        height="100%"
        defaultLanguage="json"
        theme="vs-dark"
        value={editorValue}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          wordWrap: 'on',
          automaticLayout: true,
          formatOnPaste: true,
          formatOnType: true,
        }}
      />
    </div>
  );
};