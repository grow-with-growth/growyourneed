// Advanced Visual Editor - Enhanced Canva-like Interface
// Advanced features: layers, animations, filters, collaboration, version control

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DesignProject, DesignElement, DesignPage } from '../../../services/designEditorService';

interface AdvancedVisualEditorProps {
  project: DesignProject | null;
  onProjectChange: (project: DesignProject) => void;
  onProjectSave: (project: DesignProject) => void;
}

export const AdvancedVisualEditor: React.FC<AdvancedVisualEditorProps> = ({
  project,
  onProjectChange,
  onProjectSave
}) => {
  const [selectedElements, setSelectedElements] = useState<DesignElement[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [showRulers, setShowRulers] = useState(true);
  const [showGuides, setShowGuides] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [history, setHistory] = useState<DesignProject[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Add project to history when it changes
  useEffect(() => {
    if (project && history.length === 0) {
      setHistory([project]);
      setHistoryIndex(0);
    }
  }, [project, history.length]);

  // Update history when project changes (debounced)
  useEffect(() => {
    if (!project) return;

    const timeoutId = setTimeout(() => {
      setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(project);
        return newHistory.slice(-50); // Keep last 50 states
      });
      setHistoryIndex(prev => Math.min(prev + 1, 49));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [project, historyIndex]);

  // Advanced selection with multi-select
  const handleElementSelection = useCallback((element: DesignElement, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (event.ctrlKey || event.metaKey) {
      // Multi-select
      setSelectedElements(prev => 
        prev.find(el => el.id === element.id)
          ? prev.filter(el => el.id !== element.id)
          : [...prev, element]
      );
    } else {
      // Single select
      setSelectedElements([element]);
    }
  }, []);

  // Group selected elements
  const handleGroupElements = useCallback(() => {
    if (selectedElements.length < 2 || !project) return;
    
    const groupId = `group-${Date.now()}`;
    const groupBounds = calculateGroupBounds(selectedElements);
    
    const groupElement: DesignElement = {
      id: groupId,
      type: 'container',
      x: groupBounds.x,
      y: groupBounds.y,
      width: groupBounds.width,
      height: groupBounds.height,
      rotation: 0,
      opacity: 1,
      zIndex: Math.max(...selectedElements.map(el => el.zIndex)) + 1,
      locked: false,
      visible: true,
      properties: {
        children: selectedElements.map(el => el.id),
        backgroundColor: 'transparent'
      }
    };

    const updatedProject = {
      ...project,
      elements: [
        ...project.elements.filter(el => !selectedElements.find(sel => sel.id === el.id)),
        groupElement
      ]
    };

    onProjectChange(updatedProject);
    setSelectedElements([groupElement]);
  }, [selectedElements, project, onProjectChange]);

  // Animation controls
  const handleAddAnimation = useCallback((animationType: string) => {
    if (selectedElements.length === 0 || !project) return;

    const updatedElements = project.elements.map(element => {
      if (selectedElements.find(sel => sel.id === element.id)) {
        return {
          ...element,
          properties: {
            ...element.properties,
            animation: {
              type: animationType,
              duration: 1000,
              delay: 0,
              repeat: false
            }
          }
        };
      }
      return element;
    });

    onProjectChange({ ...project, elements: updatedElements });
  }, [selectedElements, project, onProjectChange]);

  // Layer operations
  const handleLayerOperation = useCallback((operation: 'front' | 'back' | 'forward' | 'backward') => {
    if (selectedElements.length === 0 || !project) return;

    const updatedElements = project.elements.map(element => {
      if (selectedElements.find(sel => sel.id === element.id)) {
        let newZIndex = element.zIndex;
        
        switch (operation) {
          case 'front':
            newZIndex = Math.max(...project.elements.map(el => el.zIndex)) + 1;
            break;
          case 'back':
            newZIndex = Math.min(...project.elements.map(el => el.zIndex)) - 1;
            break;
          case 'forward':
            newZIndex = element.zIndex + 1;
            break;
          case 'backward':
            newZIndex = element.zIndex - 1;
            break;
        }
        
        return { ...element, zIndex: newZIndex };
      }
      return element;
    });

    onProjectChange({ ...project, elements: updatedElements });
  }, [selectedElements, project, onProjectChange]);

  // Undo/Redo functionality
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const previousState = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      onProjectChange(previousState);
    }
  }, [history, historyIndex, onProjectChange]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      onProjectChange(nextState);
    }
  }, [history, historyIndex, onProjectChange]);

  // Advanced filters and effects
  const applyFilter = useCallback((filterType: string, value: number) => {
    if (selectedElements.length === 0 || !project) return;

    const updatedElements = project.elements.map(element => {
      if (selectedElements.find(sel => sel.id === element.id)) {
        return {
          ...element,
          properties: {
            ...element.properties,
            filters: {
              ...element.properties.filters,
              [filterType]: value
            }
          }
        };
      }
      return element;
    });

    onProjectChange({ ...project, elements: updatedElements });
  }, [selectedElements, project, onProjectChange]);

  // Page management
  const addPage = useCallback(() => {
    if (!project) return;

    const newPage: DesignPage = {
      id: `page-${Date.now()}`,
      name: `Page ${project.pages.length + 1}`,
      elements: [],
      backgroundColor: '#ffffff',
      order: project.pages.length
    };

    onProjectChange({
      ...project,
      pages: [...project.pages, newPage]
    });
  }, [project, onProjectChange]);

  const deletePage = useCallback((pageIndex: number) => {
    if (!project || project.pages.length <= 1) return;

    const updatedPages = project.pages.filter((_, index) => index !== pageIndex);
    const newCurrentPage = currentPage >= pageIndex && currentPage > 0 ? currentPage - 1 : currentPage;

    onProjectChange({
      ...project,
      pages: updatedPages
    });
    setCurrentPage(newCurrentPage);
  }, [project, currentPage, onProjectChange]);

  // Collaboration features (placeholder for future implementation)
  // const addComment = useCallback((x: number, y: number, text: string) => {
  //   console.log('Adding comment at', x, y, ':', text);
  // }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'z':
            event.preventDefault();
            if (event.shiftKey) {
              handleRedo();
            } else {
              handleUndo();
            }
            break;
          case 'g':
            event.preventDefault();
            handleGroupElements();
            break;
          case 's':
            event.preventDefault();
            if (project) onProjectSave(project);
            break;
          case 'a':
            event.preventDefault();
            if (project) setSelectedElements(project.elements);
            break;
        }
      }
      
      if (event.key === 'Delete' && selectedElements.length > 0) {
        event.preventDefault();
        if (project) {
          const updatedElements = project.elements.filter(
            el => !selectedElements.find(sel => sel.id === el.id)
          );
          onProjectChange({ ...project, elements: updatedElements });
          setSelectedElements([]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, handleGroupElements, selectedElements, project, onProjectSave, onProjectChange]);

  const calculateGroupBounds = (elements: DesignElement[]) => {
    const minX = Math.min(...elements.map(el => el.x));
    const minY = Math.min(...elements.map(el => el.y));
    const maxX = Math.max(...elements.map(el => el.x + el.width));
    const maxY = Math.max(...elements.map(el => el.y + el.height));
    
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div className="flex h-full bg-slate-900">
      {/* Advanced Toolbar */}
      <div className="w-16 bg-slate-800/50 border-r border-slate-700/50 flex flex-col items-center py-4 space-y-2">
        {/* Selection Tools */}
        <div className="space-y-1">
          <button className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center text-white">
            <span>🔍</span>
          </button>
          <button className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center text-white">
            <span>✋</span>
          </button>
        </div>

        {/* Shape Tools */}
        <div className="space-y-1 pt-2 border-t border-slate-600">
          <button className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center text-white">
            <span>📝</span>
          </button>
          <button className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center text-white">
            <span>🔷</span>
          </button>
          <button className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center text-white">
            <span>⭕</span>
          </button>
          <button className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center text-white">
            <span>📏</span>
          </button>
        </div>

        {/* Advanced Tools */}
        <div className="space-y-1 pt-2 border-t border-slate-600">
          <button className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center text-white">
            <span>🎨</span>
          </button>
          <button className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center text-white">
            <span>✨</span>
          </button>
          <button className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center text-white">
            <span>🔗</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Controls */}
        <div className="h-12 bg-slate-800/30 border-b border-slate-700/50 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel(Math.max(25, zoomLevel - 25))}
                className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-white text-xs"
              >
                -
              </button>
              <span className="text-white text-sm w-12 text-center">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel(Math.min(400, zoomLevel + 25))}
                className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-white text-xs"
              >
                +
              </button>
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`px-3 py-1 rounded text-xs ${showGrid ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'}`}
              >
                Grid
              </button>
              <button
                onClick={() => setShowRulers(!showRulers)}
                className={`px-3 py-1 rounded text-xs ${showRulers ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'}`}
              >
                Rulers
              </button>
              <button
                onClick={() => setShowGuides(!showGuides)}
                className={`px-3 py-1 rounded text-xs ${showGuides ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'}`}
              >
                Guides
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Animation Controls */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded text-white text-xs"
            >
              {isPlaying ? '⏸️ Pause' : '▶️ Play'}
            </button>

            {/* Collaboration */}
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {collaborators.slice(0, 3).map((collaborator, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full border-2 border-slate-800 flex items-center justify-center text-white text-xs font-bold"
                  >
                    {collaborator.name?.[0] || 'U'}
                  </div>
                ))}
              </div>
              <button className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-white text-xs">
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Canvas with Rulers */}
        <div className="flex-1 relative overflow-auto bg-slate-900">
          {showRulers && (
            <>
              {/* Horizontal Ruler */}
              <div className="absolute top-0 left-8 right-0 h-8 bg-slate-800 border-b border-slate-600 z-10">
                <div className="relative h-full">
                  {Array.from({ length: Math.ceil((project.width * zoomLevel / 100) / 50) }, (_, i) => (
                    <div
                      key={i}
                      className="absolute top-0 h-full border-l border-slate-600"
                      style={{ left: i * 50 }}
                    >
                      <span className="text-xs text-slate-400 ml-1">{i * 50}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vertical Ruler */}
              <div className="absolute top-8 left-0 bottom-0 w-8 bg-slate-800 border-r border-slate-600 z-10">
                <div className="relative w-full h-full">
                  {Array.from({ length: Math.ceil((project.height * zoomLevel / 100) / 50) }, (_, i) => (
                    <div
                      key={i}
                      className="absolute left-0 w-full border-t border-slate-600"
                      style={{ top: i * 50 }}
                    >
                      <span className="text-xs text-slate-400 writing-mode-vertical-rl transform rotate-180 ml-1">
                        {i * 50}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Main Canvas */}
          <div
            className="absolute bg-white shadow-2xl"
            style={{
              left: showRulers ? 40 : 20,
              top: showRulers ? 40 : 20,
              width: project.width * zoomLevel / 100,
              height: project.height * zoomLevel / 100,
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top left'
            }}
          >
            {/* Canvas content would go here */}
            <div className="w-full h-full relative">
              {project.pages[currentPage]?.elements.map(element => (
                <div
                  key={element.id}
                  className={`absolute border-2 ${
                    selectedElements.find(sel => sel.id === element.id)
                      ? 'border-blue-500'
                      : 'border-transparent'
                  }`}
                  style={{
                    left: element.x,
                    top: element.y,
                    width: element.width,
                    height: element.height,
                    transform: `rotate(${element.rotation}deg)`,
                    opacity: element.opacity
                  }}
                  onClick={(e) => handleElementSelection(element, e)}
                >
                  {/* Element content */}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Page Tabs */}
        <div className="h-10 bg-slate-800/30 border-t border-slate-700/50 flex items-center px-4 gap-2">
          {project.pages.map((page, index) => (
            <button
              key={page.id}
              onClick={() => setCurrentPage(index)}
              className={`px-3 py-1 rounded text-xs ${
                currentPage === index
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {page.name}
            </button>
          ))}
          <button
            onClick={addPage}
            className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded text-white text-xs"
          >
            + Add Page
          </button>
        </div>
      </div>

      {/* Advanced Properties Panel */}
      <div className="w-80 bg-slate-800/50 border-l border-slate-700/50 p-4 overflow-y-auto">
        <h3 className="text-lg font-semibold text-white mb-4">Advanced Properties</h3>
        
        {selectedElements.length > 0 && (
          <div className="space-y-6">
            {/* Layer Controls */}
            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-2">Layer Order</h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleLayerOperation('front')}
                  className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white text-xs"
                >
                  Bring to Front
                </button>
                <button
                  onClick={() => handleLayerOperation('back')}
                  className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white text-xs"
                >
                  Send to Back
                </button>
                <button
                  onClick={() => handleLayerOperation('forward')}
                  className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white text-xs"
                >
                  Bring Forward
                </button>
                <button
                  onClick={() => handleLayerOperation('backward')}
                  className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white text-xs"
                >
                  Send Backward
                </button>
              </div>
            </div>

            {/* Animation Controls */}
            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-2">Animations</h4>
              <div className="grid grid-cols-2 gap-2">
                {['fadeIn', 'slideIn', 'bounce', 'pulse', 'rotate'].map(animation => (
                  <button
                    key={animation}
                    onClick={() => handleAddAnimation(animation)}
                    className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white text-xs capitalize"
                  >
                    {animation}
                  </button>
                ))}
              </div>
            </div>

            {/* Filters and Effects */}
            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-2">Filters & Effects</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Blur</label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    onChange={(e) => applyFilter('blur', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Brightness</label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    defaultValue="100"
                    onChange={(e) => applyFilter('brightness', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Contrast</label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    defaultValue="100"
                    onChange={(e) => applyFilter('contrast', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Saturation</label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    defaultValue="100"
                    onChange={(e) => applyFilter('saturation', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Grouping */}
            {selectedElements.length > 1 && (
              <div>
                <button
                  onClick={handleGroupElements}
                  className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-white text-sm"
                >
                  Group Elements ({selectedElements.length})
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
