// Monaco Code Editor with AI Integration
// Professional code editor with live preview and AI assistance

import React, { useState, useEffect, useRef } from 'react';
import { CodeProject, createCodeProject, generateCodeWithAI } from '../../../services/designEditorService';

interface CodeEditorProps {
  project: CodeProject | null;
  onProjectChange: (project: CodeProject) => void;
  onProjectSave: (project: CodeProject) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  project,
  onProjectChange,
  onProjectSave
}) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<string>('html');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [previewContent, setPreviewContent] = useState('');
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (project) {
      setCode(project.code);
      setLanguage(project.language);
      updatePreview(project.code, project.language);
    } else {
      handleCreateNewProject();
    }
  }, [project]);

  useEffect(() => {
    updatePreview(code, language);
  }, [code, language]);

  const handleCreateNewProject = async () => {
    try {
      const newProject = await createCodeProject({
        name: 'New Code Project',
        language: 'html'
      });
      onProjectChange(newProject);
    } catch (error) {
      console.error('Error creating code project:', error);
    }
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    if (project) {
      const updatedProject = {
        ...project,
        code: newCode,
        updatedAt: new Date().toISOString()
      };
      onProjectChange(updatedProject);
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    if (project) {
      const updatedProject = {
        ...project,
        language: newLanguage as any,
        updatedAt: new Date().toISOString()
      };
      onProjectChange(updatedProject);
    }
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const generatedCode = await generateCodeWithAI(aiPrompt, language);
      handleCodeChange(generatedCode);
      setAiPrompt('');
    } catch (error) {
      console.error('Error generating code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const updatePreview = (codeContent: string, lang: string) => {
    let preview = '';
    
    switch (lang) {
      case 'html':
        preview = codeContent;
        break;
      case 'css':
        preview = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>${codeContent}</style>
          </head>
          <body>
            <div class="container">
              <h1 class="header">CSS Preview</h1>
              <p>Your CSS styles are applied to this preview.</p>
              <button class="button">Sample Button</button>
            </div>
          </body>
          </html>
        `;
        break;
      case 'javascript':
        preview = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
              .console { background: #000; color: #0f0; padding: 10px; border-radius: 4px; font-family: monospace; }
            </style>
          </head>
          <body>
            <h1>JavaScript Preview</h1>
            <div id="output"></div>
            <div class="console" id="console">Console output will appear here...</div>
            <script>
              // Override console.log to display in preview
              const originalLog = console.log;
              console.log = function(...args) {
                document.getElementById('console').innerHTML += args.join(' ') + '\\n';
                originalLog.apply(console, args);
              };
              
              try {
                ${codeContent}
              } catch (error) {
                document.getElementById('console').innerHTML += 'Error: ' + error.message;
              }
            </script>
          </body>
          </html>
        `;
        break;
      case 'react':
        preview = `
          <!DOCTYPE html>
          <html>
          <head>
            <script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script>
            <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
            <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          </head>
          <body>
            <div id="root"></div>
            <script type="text/babel">
              ${codeContent}
              ReactDOM.render(<App />, document.getElementById('root'));
            </script>
          </body>
          </html>
        `;
        break;
      default:
        preview = `<pre><code>${codeContent}</code></pre>`;
    }
    
    setPreviewContent(preview);
  };

  const insertCodeSnippet = (snippet: string) => {
    const textarea = editorRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newCode = code.substring(0, start) + snippet + code.substring(end);
      handleCodeChange(newCode);
      
      // Set cursor position after inserted snippet
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + snippet.length, start + snippet.length);
      }, 0);
    }
  };

  const codeSnippets = {
    html: [
      { name: 'HTML5 Boilerplate', code: '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Document</title>\n</head>\n<body>\n    \n</body>\n</html>' },
      { name: 'Div Container', code: '<div class="container">\n    \n</div>' },
      { name: 'Button', code: '<button class="btn">Click me</button>' },
      { name: 'Form', code: '<form>\n    <input type="text" placeholder="Enter text">\n    <button type="submit">Submit</button>\n</form>' }
    ],
    css: [
      { name: 'Flexbox Center', code: '.container {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    height: 100vh;\n}' },
      { name: 'Grid Layout', code: '.grid {\n    display: grid;\n    grid-template-columns: repeat(3, 1fr);\n    gap: 1rem;\n}' },
      { name: 'Button Style', code: '.btn {\n    background: #3B82F6;\n    color: white;\n    padding: 0.5rem 1rem;\n    border: none;\n    border-radius: 0.25rem;\n    cursor: pointer;\n}' }
    ],
    javascript: [
      { name: 'Function', code: 'function myFunction() {\n    console.log("Hello World!");\n}' },
      { name: 'Event Listener', code: 'document.addEventListener("DOMContentLoaded", function() {\n    console.log("Page loaded");\n});' },
      { name: 'Fetch API', code: 'fetch("/api/data")\n    .then(response => response.json())\n    .then(data => console.log(data))\n    .catch(error => console.error(error));' }
    ]
  };

  if (!project) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Left Sidebar - Tools & AI */}
      <div className="w-80 bg-slate-800/50 border-r border-slate-700/50 p-4 overflow-y-auto">
        <h3 className="text-lg font-semibold text-white mb-4">Code Tools</h3>
        
        {/* Language Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">Language</label>
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="react">React</option>
            <option value="vue">Vue</option>
            <option value="angular">Angular</option>
          </select>
        </div>

        {/* AI Code Generation */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-slate-300 mb-2">AI Assistant</h4>
          <div className="space-y-2">
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Describe what you want to create..."
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 resize-none"
              rows={3}
            />
            <button
              onClick={handleAIGenerate}
              disabled={isGenerating || !aiPrompt.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-md text-white transition-colors"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Generating...
                </>
              ) : (
                <>
                  <span>🤖</span>
                  Generate Code
                </>
              )}
            </button>
          </div>
        </div>

        {/* Code Snippets */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-slate-300 mb-2">Code Snippets</h4>
          <div className="space-y-1">
            {(codeSnippets[language as keyof typeof codeSnippets] || []).map((snippet, index) => (
              <button
                key={index}
                onClick={() => insertCodeSnippet(snippet.code)}
                className="w-full text-left px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-md text-sm text-slate-300 transition-colors"
              >
                {snippet.name}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="w-full flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors text-sm text-slate-300"
          >
            <span>{showPreview ? '🙈' : '👁️'}</span>
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
          <button
            onClick={() => onProjectSave(project)}
            className="w-full flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors text-sm text-white"
          >
            <span>💾</span>
            Save Project
          </button>
        </div>
      </div>

      {/* Code Editor */}
      <div className={`${showPreview ? 'w-1/2' : 'flex-1'} flex flex-col`}>
        <div className="flex items-center justify-between p-4 bg-slate-800/30 border-b border-slate-700/50">
          <h4 className="text-sm font-medium text-slate-300">
            {project.name} - {language.toUpperCase()}
          </h4>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Lines: {code.split('\n').length}</span>
            <span>•</span>
            <span>Characters: {code.length}</span>
          </div>
        </div>
        <div className="flex-1 relative">
          <textarea
            ref={editorRef}
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            className="w-full h-full p-4 bg-slate-900 text-white font-mono text-sm resize-none focus:outline-none"
            style={{
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
              lineHeight: '1.5',
              tabSize: 2
            }}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>
      </div>

      {/* Live Preview */}
      {showPreview && (
        <div className="w-1/2 flex flex-col border-l border-slate-700/50">
          <div className="flex items-center justify-between p-4 bg-slate-800/30 border-b border-slate-700/50">
            <h4 className="text-sm font-medium text-slate-300">Live Preview</h4>
            <button
              onClick={() => updatePreview(code, language)}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs text-slate-300 transition-colors"
            >
              🔄 Refresh
            </button>
          </div>
          <div className="flex-1 bg-white">
            <iframe
              ref={previewRef}
              srcDoc={previewContent}
              className="w-full h-full border-none"
              sandbox="allow-scripts allow-same-origin"
              title="Code Preview"
            />
          </div>
        </div>
      )}
    </div>
  );
};
