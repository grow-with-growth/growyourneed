// Enhanced Code Editor - Advanced Monaco Editor with AI
// Features: AI assistance, code completion, debugging, collaboration, version control

import React, { useState, useEffect, useRef } from 'react';
import { CodeProject, generateCodeWithAI } from '../../../services/designEditorService';

interface EnhancedCodeEditorProps {
  project: CodeProject | null;
  onProjectChange: (project: CodeProject) => void;
  onProjectSave: (project: CodeProject) => void;
}

export const EnhancedCodeEditor: React.FC<EnhancedCodeEditorProps> = ({
  project,
  onProjectChange,
  onProjectSave
}) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<string>('html');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [showConsole, setShowConsole] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [aiChatHistory, setAiChatHistory] = useState<Array<{role: 'user' | 'ai', message: string}>>([]);
  const [errors, setErrors] = useState<Array<{line: number, message: string}>>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isDebugging, setIsDebugging] = useState(false);
  const [breakpoints, setBreakpoints] = useState<number[]>([]);
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Advanced AI features
  const handleAIChat = async (message: string) => {
    setAiChatHistory(prev => [...prev, { role: 'user', message }]);
    setIsGenerating(true);
    
    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1500));
      const aiResponse = await generateAIResponse(message, code, language);
      setAiChatHistory(prev => [...prev, { role: 'ai', message: aiResponse }]);
    } catch (error) {
      console.error('AI chat error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAIResponse = async (prompt: string, currentCode: string, lang: string): Promise<string> => {
    // Mock AI responses based on prompt type
    if (prompt.toLowerCase().includes('explain')) {
      return `This ${lang} code creates a ${lang === 'html' ? 'web page structure' : lang === 'css' ? 'styling rules' : 'interactive functionality'}. The main components include...`;
    } else if (prompt.toLowerCase().includes('optimize')) {
      return `Here are some optimization suggestions for your ${lang} code:\n1. Use semantic HTML elements\n2. Minimize CSS selectors\n3. Implement lazy loading\n4. Use modern JavaScript features`;
    } else if (prompt.toLowerCase().includes('debug')) {
      return `I found potential issues in your code:\n1. Missing semicolon on line 15\n2. Undefined variable 'userName'\n3. Consider adding error handling`;
    } else {
      return `I can help you with that! Let me generate some ${lang} code for: ${prompt}`;
    }
  };

  // Code analysis and suggestions
  const analyzeCode = (codeContent: string, lang: string) => {
    const lines = codeContent.split('\n');
    const newErrors: Array<{line: number, message: string}> = [];
    const newSuggestions: string[] = [];

    lines.forEach((line, index) => {
      // Basic syntax checking (mock)
      if (lang === 'javascript') {
        if (line.includes('var ')) {
          newSuggestions.push(`Line ${index + 1}: Consider using 'let' or 'const' instead of 'var'`);
        }
        if (line.includes('==') && !line.includes('===')) {
          newSuggestions.push(`Line ${index + 1}: Use strict equality (===) instead of loose equality (==)`);
        }
        if (line.trim().endsWith('{') && !lines[index - 1]?.trim().endsWith(';') && index > 0) {
          newErrors.push({ line: index + 1, message: 'Missing semicolon' });
        }
      }
      
      if (lang === 'html') {
        if (line.includes('<img') && !line.includes('alt=')) {
          newSuggestions.push(`Line ${index + 1}: Add alt attribute for accessibility`);
        }
      }
    });

    setErrors(newErrors);
    setSuggestions(newSuggestions);
  };

  // Debugging features
  const toggleBreakpoint = (lineNumber: number) => {
    setBreakpoints(prev => 
      prev.includes(lineNumber)
        ? prev.filter(bp => bp !== lineNumber)
        : [...prev, lineNumber]
    );
  };

  const startDebugging = () => {
    setIsDebugging(true);
    setCurrentLine(breakpoints[0] || 1);
    setConsoleOutput(prev => [...prev, '🐛 Debug session started']);
  };

  const stepDebug = () => {
    if (currentLine !== null) {
      const nextLine = currentLine + 1;
      setCurrentLine(nextLine);
      setConsoleOutput(prev => [...prev, `Step: Line ${nextLine}`]);
    }
  };

  // Code formatting and beautification
  const formatCode = () => {
    let formattedCode = code;
    
    if (language === 'javascript') {
      // Basic JavaScript formatting
      formattedCode = formattedCode
        .replace(/;/g, ';\n')
        .replace(/{/g, ' {\n  ')
        .replace(/}/g, '\n}')
        .replace(/,/g, ',\n  ');
    } else if (language === 'html') {
      // Basic HTML formatting
      formattedCode = formattedCode
        .replace(/></g, '>\n<')
        .replace(/^\s+|\s+$/gm, '');
    }
    
    setCode(formattedCode);
    if (project) {
      onProjectChange({ ...project, code: formattedCode });
    }
  };

  // Advanced code snippets with AI generation
  const advancedSnippets = {
    html: [
      { name: 'Responsive Layout', prompt: 'Create a responsive HTML layout with header, main, and footer' },
      { name: 'Form with Validation', prompt: 'Create an HTML form with client-side validation' },
      { name: 'Accessible Navigation', prompt: 'Create an accessible navigation menu with ARIA labels' },
      { name: 'SEO Optimized Page', prompt: 'Create an SEO-optimized HTML page structure' }
    ],
    css: [
      { name: 'CSS Grid Layout', prompt: 'Create a CSS Grid layout for a modern website' },
      { name: 'Flexbox Components', prompt: 'Create flexible components using CSS Flexbox' },
      { name: 'Dark Mode Theme', prompt: 'Create CSS variables for dark and light mode themes' },
      { name: 'Animations & Transitions', prompt: 'Create smooth CSS animations and transitions' }
    ],
    javascript: [
      { name: 'API Integration', prompt: 'Create JavaScript code to fetch and display data from an API' },
      { name: 'Form Validation', prompt: 'Create comprehensive form validation in JavaScript' },
      { name: 'Local Storage Manager', prompt: 'Create a JavaScript utility for managing localStorage' },
      { name: 'Event Handling System', prompt: 'Create an advanced event handling system' }
    ],
    react: [
      { name: 'Custom Hooks', prompt: 'Create useful React custom hooks for common functionality' },
      { name: 'Context Provider', prompt: 'Create a React Context provider for state management' },
      { name: 'Component Library', prompt: 'Create reusable React components with TypeScript' },
      { name: 'Performance Optimization', prompt: 'Create optimized React components with memoization' }
    ]
  };

  const generateSnippet = async (snippet: any) => {
    setIsGenerating(true);
    try {
      const generatedCode = await generateCodeWithAI(snippet.prompt, language);
      setCode(prev => prev + '\n\n' + generatedCode);
      if (project) {
        onProjectChange({ ...project, code: code + '\n\n' + generatedCode });
      }
    } catch (error) {
      console.error('Error generating snippet:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Real-time collaboration simulation
  const [collaborators] = useState([
    { id: 1, name: 'Alice', color: '#3B82F6', cursor: { line: 5, column: 10 } },
    { id: 2, name: 'Bob', color: '#EF4444', cursor: { line: 12, column: 5 } }
  ]);

  useEffect(() => {
    if (code) {
      analyzeCode(code, language);
    }
  }, [code, language]);

  if (!project) return <div>Loading...</div>;

  return (
    <div className="flex h-full bg-slate-900">
      {/* Enhanced Left Sidebar */}
      <div className="w-80 bg-slate-800/50 border-r border-slate-700/50 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* AI Assistant */}
          <div>
            <button
              onClick={() => setShowAIChat(!showAIChat)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium"
            >
              <span className="flex items-center gap-2">
                <span>🤖</span>
                AI Assistant
              </span>
              <span className={`transform transition-transform ${showAIChat ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            
            {showAIChat && (
              <div className="mt-3 space-y-3">
                <div className="h-40 bg-slate-700/50 rounded-lg p-3 overflow-y-auto">
                  {aiChatHistory.map((chat, index) => (
                    <div key={index} className={`mb-2 ${chat.role === 'user' ? 'text-blue-300' : 'text-green-300'}`}>
                      <strong>{chat.role === 'user' ? 'You' : 'AI'}:</strong> {chat.message}
                    </div>
                  ))}
                  {isGenerating && (
                    <div className="text-yellow-300">
                      <strong>AI:</strong> <span className="animate-pulse">Thinking...</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Ask AI anything about your code..."
                    className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && aiPrompt && handleAIChat(aiPrompt)}
                  />
                  <button
                    onClick={() => aiPrompt && handleAIChat(aiPrompt)}
                    disabled={!aiPrompt || isGenerating}
                    className="px-3 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-600 rounded text-white text-sm"
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Advanced Snippets */}
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-3">AI-Powered Snippets</h4>
            <div className="space-y-2">
              {(advancedSnippets[language as keyof typeof advancedSnippets] || []).map((snippet, index) => (
                <button
                  key={index}
                  onClick={() => generateSnippet(snippet)}
                  className="w-full text-left px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded text-sm text-slate-300 transition-colors"
                >
                  {snippet.name}
                </button>
              ))}
            </div>
          </div>

          {/* Code Analysis */}
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-3">Code Analysis</h4>
            
            {errors.length > 0 && (
              <div className="mb-3">
                <h5 className="text-xs font-medium text-red-400 mb-2">Errors ({errors.length})</h5>
                <div className="space-y-1">
                  {errors.map((error, index) => (
                    <div key={index} className="text-xs text-red-300 bg-red-900/20 p-2 rounded">
                      Line {error.line}: {error.message}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {suggestions.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-yellow-400 mb-2">Suggestions ({suggestions.length})</h5>
                <div className="space-y-1">
                  {suggestions.slice(0, 3).map((suggestion, index) => (
                    <div key={index} className="text-xs text-yellow-300 bg-yellow-900/20 p-2 rounded">
                      {suggestion}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Debugging Tools */}
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-3">Debugging</h4>
            <div className="space-y-2">
              <button
                onClick={isDebugging ? () => setIsDebugging(false) : startDebugging}
                className={`w-full px-3 py-2 rounded text-sm ${
                  isDebugging 
                    ? 'bg-red-600 hover:bg-red-500 text-white' 
                    : 'bg-green-600 hover:bg-green-500 text-white'
                }`}
              >
                {isDebugging ? '⏹️ Stop Debug' : '🐛 Start Debug'}
              </button>
              
              {isDebugging && (
                <div className="space-y-2">
                  <button
                    onClick={stepDebug}
                    className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white text-sm"
                  >
                    ⏭️ Step Over
                  </button>
                  <div className="text-xs text-slate-400">
                    Current line: {currentLine}
                  </div>
                  <div className="text-xs text-slate-400">
                    Breakpoints: {breakpoints.join(', ') || 'None'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Collaboration */}
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-3">Collaborators</h4>
            <div className="space-y-2">
              {collaborators.map(collaborator => (
                <div key={collaborator.id} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: collaborator.color }}
                  />
                  <span className="text-xs text-slate-300">{collaborator.name}</span>
                  <span className="text-xs text-slate-400">
                    Line {collaborator.cursor.line}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Toolbar */}
        <div className="h-12 bg-slate-800/30 border-b border-slate-700/50 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
            >
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="react">React</option>
              <option value="vue">Vue</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
            </select>
            
            <button
              onClick={formatCode}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded text-white text-sm"
            >
              ✨ Format
            </button>
            
            <button
              onClick={() => setShowConsole(!showConsole)}
              className={`px-3 py-1 rounded text-sm ${
                showConsole ? 'bg-yellow-600 text-white' : 'bg-slate-700 text-slate-300'
              }`}
            >
              📟 Console
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-xs text-slate-400">
              Lines: {code.split('\n').length} | 
              Chars: {code.length} | 
              Errors: {errors.length}
            </div>
            <button
              onClick={() => project && onProjectSave(project)}
              className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded text-white text-sm"
            >
              💾 Save
            </button>
          </div>
        </div>

        {/* Editor and Preview Layout */}
        <div className="flex-1 flex">
          {/* Code Editor */}
          <div className={`${showPreview ? 'w-1/2' : 'w-full'} flex flex-col`}>
            <div className="flex-1 relative">
              {/* Line numbers with breakpoints */}
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-slate-800 border-r border-slate-700 z-10">
                {code.split('\n').map((_, index) => (
                  <div
                    key={index}
                    className={`h-6 flex items-center justify-center text-xs cursor-pointer ${
                      breakpoints.includes(index + 1) 
                        ? 'bg-red-600 text-white' 
                        : currentLine === index + 1
                        ? 'bg-yellow-600 text-black'
                        : 'text-slate-400 hover:bg-slate-700'
                    }`}
                    onClick={() => toggleBreakpoint(index + 1)}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
              
              <textarea
                ref={editorRef}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  if (project) {
                    onProjectChange({ ...project, code: e.target.value });
                  }
                }}
                className="w-full h-full pl-14 p-4 bg-slate-900 text-white font-mono text-sm resize-none focus:outline-none"
                style={{
                  fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                  lineHeight: '1.5',
                  tabSize: 2
                }}
                spellCheck={false}
              />
              
              {/* Collaboration cursors */}
              {collaborators.map(collaborator => (
                <div
                  key={collaborator.id}
                  className="absolute w-0.5 h-6 z-20"
                  style={{
                    backgroundColor: collaborator.color,
                    left: 60 + collaborator.cursor.column * 8,
                    top: 16 + collaborator.cursor.line * 24
                  }}
                >
                  <div 
                    className="absolute -top-6 left-0 px-2 py-1 rounded text-xs text-white whitespace-nowrap"
                    style={{ backgroundColor: collaborator.color }}
                  >
                    {collaborator.name}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Console */}
            {showConsole && (
              <div className="h-32 bg-black border-t border-slate-700 p-2 overflow-y-auto">
                <div className="text-green-400 font-mono text-sm">
                  {consoleOutput.map((output, index) => (
                    <div key={index}>{output}</div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Preview */}
          {showPreview && (
            <div className="w-1/2 flex flex-col border-l border-slate-700/50">
              <div className="h-12 bg-slate-800/30 border-b border-slate-700/50 flex items-center justify-between px-4">
                <h4 className="text-sm font-medium text-slate-300">Live Preview</h4>
                <div className="flex items-center gap-2">
                  <button className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs text-slate-300">
                    📱 Mobile
                  </button>
                  <button className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs text-slate-300">
                    💻 Desktop
                  </button>
                  <button className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs text-slate-300">
                    🔄 Refresh
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-white">
                <iframe
                  srcDoc={code}
                  className="w-full h-full border-none"
                  sandbox="allow-scripts allow-same-origin"
                  title="Code Preview"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
