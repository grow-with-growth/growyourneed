// Visual Design Editor - Canva-like Interface
// Drag-and-drop visual editor with elements, templates, and assets

import React, { useState, useEffect, useRef } from 'react';
import { DesignProject, DesignElement, createNewProject, getDesignTemplates, getAssetLibrary, addElementToProject, updateElement, deleteElement } from '../../../services/designEditorService';

interface VisualDesignEditorProps {
  project: DesignProject | null;
  onProjectChange: (project: DesignProject) => void;
  onProjectSave: (project: DesignProject) => void;
}

export const VisualDesignEditor: React.FC<VisualDesignEditorProps> = ({
  project,
  onProjectChange,
  onProjectSave
}) => {
  const [selectedElement, setSelectedElement] = useState<DesignElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAssets, setShowAssets] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project) {
      handleCreateNewProject();
    }
  }, []);

  useEffect(() => {
    const fetchTemplates = async () => {
      const templateData = await getDesignTemplates();
      setTemplates(templateData);
    };
    
    const fetchAssets = async () => {
      const assetData = await getAssetLibrary();
      setAssets(assetData);
    };
    
    fetchTemplates();
    fetchAssets();
  }, []);

  const handleCreateNewProject = async () => {
    try {
      const newProject = await createNewProject({
        name: 'New Design',
        type: 'graphic',
        width: 1920,
        height: 1080
      });
      onProjectChange(newProject);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleAddElement = (type: DesignElement['type']) => {
    if (!project) return;
    
    const elementDefaults = {
      text: { 
        properties: { 
          text: 'Double click to edit', 
          fontSize: 24, 
          fontFamily: 'Arial', 
          color: '#000000' 
        } 
      },
      image: { 
        width: 300, 
        height: 200, 
        properties: { 
          src: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=300&h=200&fit=crop',
          alt: 'Image' 
        } 
      },
      shape: { 
        width: 200, 
        height: 200, 
        properties: { 
          fill: '#3B82F6', 
          borderRadius: 8 
        } 
      },
      button: { 
        width: 150, 
        height: 50, 
        properties: { 
          text: 'Button', 
          backgroundColor: '#3B82F6', 
          color: '#FFFFFF', 
          borderRadius: 8 
        } 
      }
    };
    
    const defaults = elementDefaults[type] || {};
    const updatedProject = addElementToProject(project, { type, ...defaults });
    onProjectChange(updatedProject);
  };

  const handleElementClick = (element: DesignElement, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedElement(element);
  };

  const handleElementDoubleClick = (element: DesignElement) => {
    if (element.type === 'text') {
      const newText = prompt('Edit text:', element.properties.text || '');
      if (newText !== null && project) {
        const updatedProject = updateElement(project, element.id, {
          properties: { ...element.properties, text: newText }
        });
        onProjectChange(updatedProject);
      }
    }
  };

  const handleMouseDown = (element: DesignElement, event: React.MouseEvent) => {
    event.preventDefault();
    setIsDragging(true);
    setSelectedElement(element);
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: event.clientX - rect.left - element.x,
        y: event.clientY - rect.top - element.y
      });
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging || !selectedElement || !project) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const newX = event.clientX - rect.left - dragOffset.x;
      const newY = event.clientY - rect.top - dragOffset.y;
      
      const updatedProject = updateElement(project, selectedElement.id, {
        x: Math.max(0, Math.min(newX, project.width - selectedElement.width)),
        y: Math.max(0, Math.min(newY, project.height - selectedElement.height))
      });
      onProjectChange(updatedProject);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDeleteElement = () => {
    if (selectedElement && project) {
      const updatedProject = deleteElement(project, selectedElement.id);
      onProjectChange(updatedProject);
      setSelectedElement(null);
    }
  };

  const handleCanvasClick = () => {
    setSelectedElement(null);
  };

  const renderElement = (element: DesignElement) => {
    const isSelected = selectedElement?.id === element.id;
    
    const elementStyle: React.CSSProperties = {
      position: 'absolute',
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      transform: `rotate(${element.rotation}deg)`,
      opacity: element.opacity,
      zIndex: element.zIndex,
      cursor: 'move',
      border: isSelected ? '2px solid #3B82F6' : 'none',
      outline: isSelected ? '1px solid rgba(59, 130, 246, 0.3)' : 'none'
    };

    let content;
    switch (element.type) {
      case 'text':
        content = (
          <div
            style={{
              ...elementStyle,
              fontSize: element.properties.fontSize,
              fontFamily: element.properties.fontFamily,
              color: element.properties.color,
              textAlign: element.properties.textAlign as any,
              display: 'flex',
              alignItems: 'center',
              justifyContent: element.properties.textAlign === 'center' ? 'center' : 'flex-start',
              padding: '8px',
              wordWrap: 'break-word'
            }}
            onClick={(e) => handleElementClick(element, e)}
            onDoubleClick={() => handleElementDoubleClick(element)}
            onMouseDown={(e) => handleMouseDown(element, e)}
          >
            {element.properties.text || 'Text'}
          </div>
        );
        break;
        
      case 'image':
        content = (
          <img
            src={element.properties.src}
            alt={element.properties.alt || 'Image'}
            style={{
              ...elementStyle,
              objectFit: element.properties.objectFit as any || 'cover',
              borderRadius: element.properties.borderRadius || 0
            }}
            onClick={(e) => handleElementClick(element, e)}
            onMouseDown={(e) => handleMouseDown(element, e)}
            draggable={false}
          />
        );
        break;
        
      case 'shape':
        content = (
          <div
            style={{
              ...elementStyle,
              backgroundColor: element.properties.fill,
              border: element.properties.stroke ? `${element.properties.strokeWidth || 1}px solid ${element.properties.stroke}` : 'none',
              borderRadius: element.properties.borderRadius || 0
            }}
            onClick={(e) => handleElementClick(element, e)}
            onMouseDown={(e) => handleMouseDown(element, e)}
          />
        );
        break;
        
      case 'button':
        content = (
          <button
            style={{
              ...elementStyle,
              backgroundColor: element.properties.backgroundColor,
              color: element.properties.color,
              border: 'none',
              borderRadius: element.properties.borderRadius || 0,
              fontSize: element.properties.fontSize || 16,
              fontFamily: element.properties.fontFamily || 'Arial',
              cursor: 'pointer'
            }}
            onClick={(e) => handleElementClick(element, e)}
            onMouseDown={(e) => handleMouseDown(element, e)}
          >
            {element.properties.text || 'Button'}
          </button>
        );
        break;
        
      default:
        content = (
          <div
            style={elementStyle}
            onClick={(e) => handleElementClick(element, e)}
            onMouseDown={(e) => handleMouseDown(element, e)}
          >
            {element.type}
          </div>
        );
    }

    return (
      <div key={element.id}>
        {content}
        {isSelected && (
          <div
            style={{
              position: 'absolute',
              left: element.x + element.width - 20,
              top: element.y - 20,
              zIndex: 1000
            }}
          >
            <button
              onClick={handleDeleteElement}
              className="w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
            >
              ×
            </button>
          </div>
        )}
      </div>
    );
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
      {/* Left Sidebar - Tools */}
      <div className="w-64 bg-slate-800/50 border-r border-slate-700/50 p-4 overflow-y-auto">
        <h3 className="text-lg font-semibold text-white mb-4">Design Tools</h3>
        
        {/* Elements */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-slate-300 mb-2">Elements</h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              { type: 'text', icon: '📝', label: 'Text' },
              { type: 'image', icon: '🖼️', label: 'Image' },
              { type: 'shape', icon: '🔷', label: 'Shape' },
              { type: 'button', icon: '🔘', label: 'Button' }
            ].map(element => (
              <button
                key={element.type}
                onClick={() => handleAddElement(element.type as any)}
                className="flex flex-col items-center gap-1 p-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors"
              >
                <span className="text-xl">{element.icon}</span>
                <span className="text-xs text-slate-300">{element.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-slate-300 mb-2">Quick Actions</h4>
          <div className="space-y-2">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="w-full flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors text-sm text-slate-300"
            >
              <span>📋</span>
              Templates
            </button>
            <button
              onClick={() => setShowAssets(!showAssets)}
              className="w-full flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors text-sm text-slate-300"
            >
              <span>🎨</span>
              Assets
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
        
        {/* Element Properties */}
        {selectedElement && (
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-2">Properties</h4>
            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">X Position</label>
                <input
                  type="number"
                  value={selectedElement.x}
                  onChange={(e) => {
                    const updatedProject = updateElement(project, selectedElement.id, {
                      x: parseInt(e.target.value) || 0
                    });
                    onProjectChange(updatedProject);
                  }}
                  className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Y Position</label>
                <input
                  type="number"
                  value={selectedElement.y}
                  onChange={(e) => {
                    const updatedProject = updateElement(project, selectedElement.id, {
                      y: parseInt(e.target.value) || 0
                    });
                    onProjectChange(updatedProject);
                  }}
                  className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Width</label>
                <input
                  type="number"
                  value={selectedElement.width}
                  onChange={(e) => {
                    const updatedProject = updateElement(project, selectedElement.id, {
                      width: parseInt(e.target.value) || 1
                    });
                    onProjectChange(updatedProject);
                  }}
                  className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Height</label>
                <input
                  type="number"
                  value={selectedElement.height}
                  onChange={(e) => {
                    const updatedProject = updateElement(project, selectedElement.id, {
                      height: parseInt(e.target.value) || 1
                    });
                    onProjectChange(updatedProject);
                  }}
                  className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Canvas */}
      <div className="flex-1 bg-slate-900 overflow-auto">
        <div className="p-8">
          <div
            ref={canvasRef}
            className="relative bg-white mx-auto shadow-2xl"
            style={{
              width: project.width,
              height: project.height,
              backgroundColor: project.backgroundColor
            }}
            onClick={handleCanvasClick}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            {project.elements.map(renderElement)}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Layers */}
      <div className="w-64 bg-slate-800/50 border-l border-slate-700/50 p-4 overflow-y-auto">
        <h3 className="text-lg font-semibold text-white mb-4">Layers</h3>
        <div className="space-y-1">
          {project.elements
            .sort((a, b) => b.zIndex - a.zIndex)
            .map(element => (
              <div
                key={element.id}
                onClick={() => setSelectedElement(element)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  selectedElement?.id === element.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-300'
                }`}
              >
                <span className="text-sm">
                  {element.type === 'text' && '📝'}
                  {element.type === 'image' && '🖼️'}
                  {element.type === 'shape' && '🔷'}
                  {element.type === 'button' && '🔘'}
                </span>
                <span className="text-sm flex-1 truncate">
                  {element.type === 'text' 
                    ? element.properties.text || 'Text'
                    : `${element.type.charAt(0).toUpperCase() + element.type.slice(1)}`
                  }
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const updatedProject = updateElement(project, element.id, {
                      visible: !element.visible
                    });
                    onProjectChange(updatedProject);
                  }}
                  className="text-xs opacity-60 hover:opacity-100"
                >
                  {element.visible ? '👁️' : '🙈'}
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
