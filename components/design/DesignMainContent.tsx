import React, { useState } from 'react';
import { DesignEditor } from './DesignEditor';
import { SampleDesignWidget } from './widgets/SampleDesignWidget';

interface DesignMainContentProps {
  activeSubModuleKey?: string;
}

export const DesignMainContent: React.FC<DesignMainContentProps> = ({ activeSubModuleKey = 'overview' }) => {
  const [editorMode, setEditorMode] = useState<'visual' | 'code' | 'dashboard' | 'settings'>('visual');

  const renderContent = () => {
    switch (activeSubModuleKey) {
      case 'design-editor':
        return (
          <div className="h-full">
            <DesignEditor
              activeMode={editorMode}
              onModeChange={setEditorMode}
            />
          </div>
        );

      case 'design-branding':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Brand Colors</h3>
              <div className="grid grid-cols-4 gap-3">
                {['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'].map((color, index) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <div
                      className="w-12 h-12 rounded-lg border-2 border-slate-600"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs text-slate-400 font-mono">{color}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Typography</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-2xl font-bold text-white">Heading 1</div>
                  <div className="text-xs text-slate-400">32px, Bold</div>
                </div>
                <div>
                  <div className="text-xl font-semibold text-white">Heading 2</div>
                  <div className="text-xs text-slate-400">24px, Semibold</div>
                </div>
                <div>
                  <div className="text-lg text-white">Heading 3</div>
                  <div className="text-xs text-slate-400">18px, Medium</div>
                </div>
                <div>
                  <div className="text-base text-slate-300">Body Text</div>
                  <div className="text-xs text-slate-400">16px, Regular</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Logo Assets</h3>
              <div className="space-y-3">
                <div className="p-4 bg-white rounded-lg">
                  <div className="text-center text-slate-800 font-bold">LOGO</div>
                </div>
                <div className="p-4 bg-slate-900 rounded-lg">
                  <div className="text-center text-white font-bold">LOGO</div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-500">
                    Download SVG
                  </button>
                  <button className="flex-1 px-3 py-2 bg-slate-700 text-white rounded text-sm hover:bg-slate-600">
                    Download PNG
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'design-templates':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[
              { name: 'Social Media Post', category: 'Social', preview: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=300&fit=crop' },
              { name: 'Business Card', category: 'Print', preview: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop' },
              { name: 'Presentation Slide', category: 'Presentation', preview: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=200&fit=crop' },
              { name: 'Email Header', category: 'Email', preview: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=300&h=200&fit=crop' },
              { name: 'Web Banner', category: 'Web', preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop' },
              { name: 'Infographic', category: 'Infographic', preview: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop' }
            ].map((template, index) => (
              <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:border-indigo-500/50 transition-colors cursor-pointer">
                <div className="aspect-video bg-slate-700 relative overflow-hidden">
                  <img
                    src={template.preview}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500">
                      Use Template
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white">{template.name}</h3>
                  <p className="text-sm text-slate-400">{template.category}</p>
                </div>
              </div>
            ))}
          </div>
        );

      case 'design-assets':
        return (
          <div className="space-y-6">
            <div className="flex gap-4">
              {['All', 'Icons', 'Images', 'Illustrations', 'Shapes'].map((category) => (
                <button
                  key={category}
                  className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-slate-300 transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {Array.from({ length: 24 }, (_, index) => (
                <div key={index} className="aspect-square bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:border-indigo-500/50 transition-colors cursor-pointer flex items-center justify-center">
                  <div className="text-2xl">
                    {index % 4 === 0 && '🎨'}
                    {index % 4 === 1 && '📊'}
                    {index % 4 === 2 && '🖼️'}
                    {index % 4 === 3 && '⭐'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default: // overview
        return (
          <>
            {/* Quick Actions */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <button
                onClick={() => setEditorMode('visual')}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-indigo-500/50 transition-colors text-left"
              >
                <div className="text-3xl mb-3">🎨</div>
                <h3 className="font-semibold text-white mb-1">Visual Editor</h3>
                <p className="text-sm text-slate-400">Canva-like design editor</p>
              </button>

              <button
                onClick={() => setEditorMode('code')}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-indigo-500/50 transition-colors text-left"
              >
                <div className="text-3xl mb-3">💻</div>
                <h3 className="font-semibold text-white mb-1">Code Editor</h3>
                <p className="text-sm text-slate-400">Monaco editor with AI</p>
              </button>

              <button
                onClick={() => setEditorMode('dashboard')}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-indigo-500/50 transition-colors text-left"
              >
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-semibold text-white mb-1">Dashboard Builder</h3>
                <p className="text-sm text-slate-400">Create custom dashboards</p>
              </button>

              <button
                onClick={() => setEditorMode('settings')}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-indigo-500/50 transition-colors text-left"
              >
                <div className="text-3xl mb-3">⚙️</div>
                <h3 className="font-semibold text-white mb-1">Settings</h3>
                <p className="text-sm text-slate-400">Configure preferences</p>
              </button>
            </div>

            {/* Recent Projects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <SampleDesignWidget />
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Projects</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Social Media Campaign', type: 'Visual Design', updated: '2 hours ago' },
                    { name: 'Landing Page Code', type: 'Code Project', updated: '1 day ago' },
                    { name: 'Analytics Dashboard', type: 'Dashboard', updated: '3 days ago' }
                  ].map((project, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-600/30 transition-colors cursor-pointer">
                      <div className="text-2xl">
                        {project.type === 'Visual Design' && '🎨'}
                        {project.type === 'Code Project' && '💻'}
                        {project.type === 'Dashboard' && '📊'}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{project.name}</h4>
                        <p className="text-sm text-slate-400">{project.type} • {project.updated}</p>
                      </div>
                      <button className="text-indigo-400 hover:text-indigo-300 text-sm">
                        Open
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Design Resources */}
            <div className="bg-slate-800/30 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-slate-300 mb-2">Design System & Resources</h2>
              <p className="text-slate-400 mb-4">
                Access comprehensive design tools including visual editor, code editor with AI assistance, dashboard builder, and design assets.
              </p>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors">
                  Start Creating
                </button>
                <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors">
                  Browse Templates
                </button>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <main className="h-full flex flex-col p-3 md:p-4 gap-3 md:gap-4 bg-transparent overflow-y-auto">
      {renderContent()}
    </main>
  );
};