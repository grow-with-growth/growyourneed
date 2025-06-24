// Dashboard Builder - Interactive Dashboard Creator
// Drag-and-drop dashboard builder with widgets and real-time data

import React, { useState, useEffect } from 'react';
import { DashboardProject, DashboardWidget, createDashboard, addWidgetToDashboard, getWidgetTemplates } from '../../../services/designEditorService';

interface DashboardBuilderProps {
  dashboard: DashboardProject | null;
  onDashboardChange: (dashboard: DashboardProject) => void;
  onDashboardSave: (dashboard: DashboardProject) => void;
}

export const DashboardBuilder: React.FC<DashboardBuilderProps> = ({
  dashboard,
  onDashboardChange,
  onDashboardSave
}) => {
  const [selectedWidget, setSelectedWidget] = useState<DashboardWidget | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [gridSize] = useState(20);
  const [showWidgetLibrary, setShowWidgetLibrary] = useState(false);
  const [widgetTemplates, setWidgetTemplates] = useState<any[]>([]);

  useEffect(() => {
    if (!dashboard) {
      handleCreateNewDashboard();
    }
  }, []);

  useEffect(() => {
    const templates = getWidgetTemplates();
    setWidgetTemplates(templates);
  }, []);

  const handleCreateNewDashboard = async () => {
    try {
      const newDashboard = await createDashboard({
        name: 'New Dashboard',
        description: 'A new dashboard',
        layout: 'grid',
        theme: 'dark'
      });
      onDashboardChange(newDashboard);
    } catch (error) {
      console.error('Error creating dashboard:', error);
    }
  };

  const handleAddWidget = (template: any) => {
    if (!dashboard) return;
    
    const newWidget: Partial<DashboardWidget> = {
      type: template.type,
      title: template.name,
      x: 0,
      y: 0,
      width: template.defaultSize.width,
      height: template.defaultSize.height,
      config: template.defaultConfig
    };
    
    const updatedDashboard = addWidgetToDashboard(dashboard, newWidget);
    onDashboardChange(updatedDashboard);
    setShowWidgetLibrary(false);
  };

  const handleWidgetClick = (widget: DashboardWidget, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedWidget(widget);
  };

  const handleMouseDown = (widget: DashboardWidget, event: React.MouseEvent) => {
    event.preventDefault();
    setIsDragging(true);
    setSelectedWidget(widget);
    setDragOffset({
      x: event.clientX - widget.x * gridSize,
      y: event.clientY - widget.y * gridSize
    });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging || !selectedWidget || !dashboard) return;
    
    const newX = Math.round((event.clientX - dragOffset.x) / gridSize);
    const newY = Math.round((event.clientY - dragOffset.y) / gridSize);
    
    const updatedDashboard = {
      ...dashboard,
      widgets: dashboard.widgets.map(widget =>
        widget.id === selectedWidget.id
          ? { ...widget, x: Math.max(0, newX), y: Math.max(0, newY) }
          : widget
      ),
      updatedAt: new Date().toISOString()
    };
    
    onDashboardChange(updatedDashboard);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWidgetResize = (widget: DashboardWidget, newWidth: number, newHeight: number) => {
    if (!dashboard) return;
    
    const updatedDashboard = {
      ...dashboard,
      widgets: dashboard.widgets.map(w =>
        w.id === widget.id
          ? { ...w, width: Math.max(1, newWidth), height: Math.max(1, newHeight) }
          : w
      ),
      updatedAt: new Date().toISOString()
    };
    
    onDashboardChange(updatedDashboard);
  };

  const handleDeleteWidget = (widgetId: string) => {
    if (!dashboard) return;
    
    const updatedDashboard = {
      ...dashboard,
      widgets: dashboard.widgets.filter(widget => widget.id !== widgetId),
      updatedAt: new Date().toISOString()
    };
    
    onDashboardChange(updatedDashboard);
    setSelectedWidget(null);
  };

  const renderWidget = (widget: DashboardWidget) => {
    const isSelected = selectedWidget?.id === widget.id;
    
    const widgetStyle: React.CSSProperties = {
      position: 'absolute',
      left: widget.x * gridSize,
      top: widget.y * gridSize,
      width: widget.width * gridSize,
      height: widget.height * gridSize,
      border: isSelected ? '2px solid #3B82F6' : '1px solid #374151',
      borderRadius: '8px',
      backgroundColor: dashboard?.theme === 'dark' ? '#1F2937' : '#FFFFFF',
      cursor: 'move',
      overflow: 'hidden'
    };

    let content;
    switch (widget.type) {
      case 'metric':
        content = (
          <div className="p-4 h-full flex flex-col justify-center">
            <div className="text-2xl font-bold text-white">{widget.config.value}</div>
            <div className="text-sm text-slate-400">{widget.title}</div>
            <div className={`text-xs ${widget.config.changeType === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
              {widget.config.change}
            </div>
          </div>
        );
        break;
        
      case 'chart':
        content = (
          <div className="p-4 h-full">
            <div className="text-sm font-medium text-white mb-2">{widget.title}</div>
            <div className="h-full bg-slate-800 rounded flex items-end justify-around p-2">
              {widget.config.data?.map((item: any, index: number) => (
                <div
                  key={index}
                  className="bg-blue-500 rounded-t"
                  style={{
                    height: `${(item.value / 1000) * 80}%`,
                    width: '20px'
                  }}
                  title={`${item.name}: ${item.value}`}
                />
              ))}
            </div>
          </div>
        );
        break;
        
      case 'table':
        content = (
          <div className="p-4 h-full overflow-auto">
            <div className="text-sm font-medium text-white mb-2">{widget.title}</div>
            <table className="w-full text-xs text-slate-300">
              <thead>
                <tr className="border-b border-slate-600">
                  {widget.config.columns?.map((col: string, index: number) => (
                    <th key={index} className="text-left py-1">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {widget.config.data?.slice(0, 5).map((row: string[], index: number) => (
                  <tr key={index} className="border-b border-slate-700">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="py-1">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        break;
        
      case 'text':
        content = (
          <div className="p-4 h-full">
            <div className="text-sm font-medium text-white mb-2">{widget.title}</div>
            <div 
              className="text-slate-300"
              style={{
                fontSize: widget.config.fontSize || 14,
                textAlign: widget.config.textAlign || 'left'
              }}
            >
              {widget.config.content}
            </div>
          </div>
        );
        break;
        
      default:
        content = (
          <div className="p-4 h-full flex items-center justify-center">
            <div className="text-slate-400 text-center">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm">{widget.type}</div>
            </div>
          </div>
        );
    }

    return (
      <div
        key={widget.id}
        style={widgetStyle}
        onClick={(e) => handleWidgetClick(widget, e)}
        onMouseDown={(e) => handleMouseDown(widget, e)}
      >
        {content}
        
        {/* Widget Controls */}
        {isSelected && (
          <>
            {/* Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteWidget(widget.id);
              }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 z-10"
            >
              ×
            </button>
            
            {/* Resize Handle */}
            <div
              className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize"
              onMouseDown={(e) => {
                e.stopPropagation();
                const startX = e.clientX;
                const startY = e.clientY;
                const startWidth = widget.width;
                const startHeight = widget.height;
                
                const handleResize = (e: MouseEvent) => {
                  const deltaX = e.clientX - startX;
                  const deltaY = e.clientY - startY;
                  const newWidth = startWidth + Math.round(deltaX / gridSize);
                  const newHeight = startHeight + Math.round(deltaY / gridSize);
                  handleWidgetResize(widget, newWidth, newHeight);
                };
                
                const handleResizeEnd = () => {
                  document.removeEventListener('mousemove', handleResize);
                  document.removeEventListener('mouseup', handleResizeEnd);
                };
                
                document.addEventListener('mousemove', handleResize);
                document.addEventListener('mouseup', handleResizeEnd);
              }}
            />
          </>
        )}
      </div>
    );
  };

  if (!dashboard) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Left Sidebar - Widget Library */}
      <div className="w-64 bg-slate-800/50 border-r border-slate-700/50 p-4 overflow-y-auto">
        <h3 className="text-lg font-semibold text-white mb-4">Dashboard Builder</h3>
        
        {/* Dashboard Settings */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-slate-300 mb-2">Settings</h4>
          <div className="space-y-2">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Theme</label>
              <select
                value={dashboard.theme}
                onChange={(e) => {
                  const updatedDashboard = {
                    ...dashboard,
                    theme: e.target.value as any,
                    updatedAt: new Date().toISOString()
                  };
                  onDashboardChange(updatedDashboard);
                }}
                className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-xs"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Layout</label>
              <select
                value={dashboard.layout}
                onChange={(e) => {
                  const updatedDashboard = {
                    ...dashboard,
                    layout: e.target.value as any,
                    updatedAt: new Date().toISOString()
                  };
                  onDashboardChange(updatedDashboard);
                }}
                className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-xs"
              >
                <option value="grid">Grid</option>
                <option value="free">Free Form</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Widget Library */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-slate-300 mb-2">Widgets</h4>
          <div className="grid grid-cols-2 gap-2">
            {widgetTemplates.map((template, index) => (
              <button
                key={index}
                onClick={() => handleAddWidget(template)}
                className="flex flex-col items-center gap-1 p-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors"
              >
                <span className="text-xl">{template.icon}</span>
                <span className="text-xs text-slate-300 text-center">{template.name}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="space-y-2">
          <button
            onClick={() => onDashboardSave(dashboard)}
            className="w-full flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors text-sm text-white"
          >
            <span>💾</span>
            Save Dashboard
          </button>
          <button
            onClick={() => {
              const exportData = JSON.stringify(dashboard, null, 2);
              const blob = new Blob([exportData], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${dashboard.name}.json`;
              a.click();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors text-sm text-slate-300"
          >
            <span>📤</span>
            Export
          </button>
        </div>
        
        {/* Widget Properties */}
        {selectedWidget && (
          <div className="mt-6 pt-4 border-t border-slate-700">
            <h4 className="text-sm font-medium text-slate-300 mb-2">Widget Properties</h4>
            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Title</label>
                <input
                  type="text"
                  value={selectedWidget.title}
                  onChange={(e) => {
                    const updatedDashboard = {
                      ...dashboard,
                      widgets: dashboard.widgets.map(widget =>
                        widget.id === selectedWidget.id
                          ? { ...widget, title: e.target.value }
                          : widget
                      ),
                      updatedAt: new Date().toISOString()
                    };
                    onDashboardChange(updatedDashboard);
                  }}
                  className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Width</label>
                  <input
                    type="number"
                    value={selectedWidget.width}
                    onChange={(e) => handleWidgetResize(selectedWidget, parseInt(e.target.value) || 1, selectedWidget.height)}
                    className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Height</label>
                  <input
                    type="number"
                    value={selectedWidget.height}
                    onChange={(e) => handleWidgetResize(selectedWidget, selectedWidget.width, parseInt(e.target.value) || 1)}
                    className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Dashboard Canvas */}
      <div className="flex-1 bg-slate-900 overflow-auto">
        <div className="p-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white">{dashboard.name}</h2>
            <p className="text-slate-400">{dashboard.description}</p>
          </div>
          
          <div
            className="relative bg-slate-800/30 rounded-lg min-h-96"
            style={{
              backgroundImage: dashboard.layout === 'grid' 
                ? `radial-gradient(circle, #374151 1px, transparent 1px)`
                : 'none',
              backgroundSize: dashboard.layout === 'grid' ? `${gridSize}px ${gridSize}px` : 'auto'
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onClick={() => setSelectedWidget(null)}
          >
            {dashboard.widgets.map(renderWidget)}
          </div>
        </div>
      </div>
    </div>
  );
};
