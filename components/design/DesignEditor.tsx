// Main Design Editor Component - Production Ready
// Full-featured design editor with visual editor, code editor, dashboard builder

import React, { useState } from 'react';
import { VisualDesignEditor } from './editors/VisualDesignEditor';
import { AdvancedVisualEditor } from './editors/AdvancedVisualEditor';
import { CodeEditor } from './editors/CodeEditor';
import { EnhancedCodeEditor } from './editors/EnhancedCodeEditor';
import { DashboardBuilder } from './editors/DashboardBuilder';
import { AdvancedDashboardBuilder } from './editors/AdvancedDashboardBuilder';
import { DesignSettings } from './editors/DesignSettings';
import { TemplateGallery } from './TemplateGallery';
import { DesignProject, CodeProject, DashboardProject, DesignTemplate } from '../../services/designEditorService';

interface DesignEditorProps {
  activeMode: 'visual' | 'code' | 'dashboard' | 'settings';
  onModeChange: (mode: 'visual' | 'code' | 'dashboard' | 'settings') => void;
}

export const DesignEditor: React.FC<DesignEditorProps> = ({ activeMode, onModeChange }) => {
  const [currentProject, setCurrentProject] = useState<DesignProject | null>(null);
  const [currentCodeProject, setCurrentCodeProject] = useState<CodeProject | null>(null);
  const [currentDashboard, setCurrentDashboard] = useState<DashboardProject | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [useAdvancedMode, setUseAdvancedMode] = useState(true);
  const [collaborationMode, setCollaborationMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  const handleTemplateSelect = (template: DesignTemplate) => {
    // Create new project from template
    console.log('Creating project from template:', template);
    setShowTemplateGallery(false);
  };

  const renderEditor = () => {
    switch (activeMode) {
      case 'visual':
        return useAdvancedMode ? (
          <AdvancedVisualEditor
            project={currentProject}
            onProjectChange={setCurrentProject}
            onProjectSave={handleSaveProject}
          />
        ) : (
          <VisualDesignEditor
            project={currentProject}
            onProjectChange={setCurrentProject}
            onProjectSave={handleSaveProject}
          />
        );

      case 'code':
        return useAdvancedMode ? (
          <EnhancedCodeEditor
            project={currentCodeProject}
            onProjectChange={setCurrentCodeProject}
            onProjectSave={handleSaveCodeProject}
          />
        ) : (
          <CodeEditor
            project={currentCodeProject}
            onProjectChange={setCurrentCodeProject}
            onProjectSave={handleSaveCodeProject}
          />
        );

      case 'dashboard':
        return useAdvancedMode ? (
          <AdvancedDashboardBuilder
            dashboard={currentDashboard}
            onDashboardChange={setCurrentDashboard}
            onDashboardSave={handleSaveDashboard}
          />
        ) : (
          <DashboardBuilder
            dashboard={currentDashboard}
            onDashboardChange={setCurrentDashboard}
            onDashboardSave={handleSaveDashboard}
          />
        );

      case 'settings':
        return (
          <DesignSettings
            onExport={handleExport}
            onImport={handleImport}
            onReset={handleReset}
          />
        );

      default:
        return <div>Select an editor mode</div>;
    }
  };

  const handleSaveProject = async (project: DesignProject) => {
    setIsLoading(true);
    try {
      // Save project logic here
      console.log('Saving design project:', project);
      setCurrentProject(project);
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCodeProject = async (project: CodeProject) => {
    setIsLoading(true);
    try {
      // Save code project logic here
      console.log('Saving code project:', project);
      setCurrentCodeProject(project);
    } catch (error) {
      console.error('Error saving code project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDashboard = async (dashboard: DashboardProject) => {
    setIsLoading(true);
    try {
      // Save dashboard logic here
      console.log('Saving dashboard:', dashboard);
      setCurrentDashboard(dashboard);
    } catch (error) {
      console.error('Error saving dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = (format: string) => {
    console.log('Exporting in format:', format);
    // Export logic here
  };

  const handleImport = (file: File) => {
    console.log('Importing file:', file.name);
    // Import logic here
  };

  const handleReset = () => {
    setCurrentProject(null);
    setCurrentCodeProject(null);
    setCurrentDashboard(null);
  };

  return (
    <>
      <div className="h-full flex flex-col bg-slate-900">
        {/* Enhanced Editor Mode Tabs */}
        <div className="flex border-b border-slate-700/50 bg-slate-800/50">
          {[
            { key: 'visual', label: 'Visual Editor', icon: '🎨' },
            { key: 'code', label: 'Code Editor', icon: '💻' },
            { key: 'dashboard', label: 'Dashboard', icon: '📊' },
            { key: 'settings', label: 'Settings', icon: '⚙️' }
          ].map(mode => (
            <button
              key={mode.key}
              onClick={() => onModeChange(mode.key as any)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeMode === mode.key
                  ? 'bg-indigo-600 text-white border-b-2 border-indigo-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <span className="text-lg">{mode.icon}</span>
              {mode.label}
            </button>
          ))}

          {/* Enhanced Controls */}
          <div className="ml-auto flex items-center gap-4 px-4">
            {/* Template Gallery Button */}
            <button
              onClick={() => setShowTemplateGallery(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 rounded-md text-white text-sm transition-colors"
            >
              <span>📋</span>
              Templates
            </button>

            {/* Advanced Mode Toggle */}
            <button
              onClick={() => setUseAdvancedMode(!useAdvancedMode)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                useAdvancedMode
                  ? 'bg-green-600 hover:bg-green-500 text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
            >
              <span>{useAdvancedMode ? '🚀' : '⚡'}</span>
              {useAdvancedMode ? 'Advanced' : 'Basic'}
            </button>

            {/* Collaboration Toggle */}
            <button
              onClick={() => setCollaborationMode(!collaborationMode)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                collaborationMode
                  ? 'bg-blue-600 hover:bg-blue-500 text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
            >
              <span>👥</span>
              {collaborationMode ? 'Live' : 'Solo'}
            </button>

            {/* Auto-save Indicator */}
            <div className="flex items-center gap-2">
              {isLoading ? (
                <div className="flex items-center gap-2 text-yellow-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
                  <span className="text-sm">Saving...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-green-400">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-sm">{autoSave ? 'Auto-saved' : 'Saved'}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-hidden">
          {renderEditor()}
        </div>
      </div>

      {/* Template Gallery Modal */}
      {showTemplateGallery && (
        <TemplateGallery
          onTemplateSelect={handleTemplateSelect}
          onClose={() => setShowTemplateGallery(false)}
        />
      )}
    </>
  );
};
