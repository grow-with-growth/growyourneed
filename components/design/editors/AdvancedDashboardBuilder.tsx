// Advanced Dashboard Builder - Professional Dashboard Creation
// Features: Advanced widgets, real-time data, themes, responsive design, analytics

import React, { useState, useEffect, useCallback } from 'react';
import { DashboardProject, DashboardWidget, createDashboard, addWidgetToDashboard } from '../../../services/designEditorService';

interface AdvancedDashboardBuilderProps {
  dashboard: DashboardProject | null;
  onDashboardChange: (dashboard: DashboardProject) => void;
  onDashboardSave: (dashboard: DashboardProject) => void;
}

export const AdvancedDashboardBuilder: React.FC<AdvancedDashboardBuilderProps> = ({
  dashboard,
  onDashboardChange,
  onDashboardSave
}) => {
  const [selectedWidget, setSelectedWidget] = useState<DashboardWidget | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [gridSize] = useState(20);
  const [showDataSources, setShowDataSources] = useState(false);
  const [showThemeEditor, setShowThemeEditor] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [realTimeData, setRealTimeData] = useState<{ [key: string]: any }>({});

  // Advanced widget templates
  const advancedWidgetTemplates = [
    {
      type: 'metric',
      name: 'KPI Card',
      icon: '📊',
      category: 'Analytics',
      defaultConfig: {
        title: 'Revenue',
        value: '$125,430',
        change: '+12.5%',
        changeType: 'positive',
        trend: [100, 120, 115, 134, 145, 167, 178],
        target: 150000,
        unit: '$'
      },
      defaultSize: { width: 6, height: 4 }
    },
    {
      type: 'chart',
      name: 'Advanced Chart',
      icon: '📈',
      category: 'Visualization',
      defaultConfig: {
        chartType: 'area',
        title: 'Sales Performance',
        data: [
          { name: 'Jan', sales: 4000, profit: 2400, expenses: 1600 },
          { name: 'Feb', sales: 3000, profit: 1398, expenses: 1602 },
          { name: 'Mar', sales: 2000, profit: 9800, expenses: 800 },
          { name: 'Apr', sales: 2780, profit: 3908, expenses: 872 },
          { name: 'May', sales: 1890, profit: 4800, expenses: 1090 },
          { name: 'Jun', sales: 2390, profit: 3800, expenses: 590 }
        ],
        colors: ['#3B82F6', '#10B981', '#F59E0B'],
        showGrid: true,
        showLegend: true,
        animations: true
      },
      defaultSize: { width: 12, height: 8 }
    },
    {
      type: 'table',
      name: 'Data Grid',
      icon: '📋',
      category: 'Data',
      defaultConfig: {
        title: 'Recent Orders',
        columns: [
          { key: 'id', label: 'Order ID', sortable: true },
          { key: 'customer', label: 'Customer', sortable: true },
          { key: 'amount', label: 'Amount', sortable: true, format: 'currency' },
          { key: 'status', label: 'Status', sortable: false, format: 'badge' },
          { key: 'date', label: 'Date', sortable: true, format: 'date' }
        ],
        data: [
          { id: '#1001', customer: 'John Doe', amount: 1250, status: 'completed', date: '2024-01-15' },
          { id: '#1002', customer: 'Jane Smith', amount: 890, status: 'pending', date: '2024-01-14' },
          { id: '#1003', customer: 'Bob Johnson', amount: 2100, status: 'processing', date: '2024-01-13' }
        ],
        pagination: true,
        search: true,
        filters: true
      },
      defaultSize: { width: 16, height: 10 }
    },
    {
      type: 'gauge',
      name: 'Progress Gauge',
      icon: '⏱️',
      category: 'Metrics',
      defaultConfig: {
        title: 'Server Performance',
        value: 75,
        min: 0,
        max: 100,
        unit: '%',
        thresholds: [
          { value: 50, color: '#EF4444', label: 'Critical' },
          { value: 75, color: '#F59E0B', label: 'Warning' },
          { value: 90, color: '#10B981', label: 'Good' }
        ],
        showValue: true,
        animated: true
      },
      defaultSize: { width: 6, height: 6 }
    },
    {
      type: 'map',
      name: 'Geographic Map',
      icon: '🗺️',
      category: 'Location',
      defaultConfig: {
        title: 'Sales by Region',
        mapType: 'world',
        data: [
          { region: 'US', value: 45000, color: '#3B82F6' },
          { region: 'EU', value: 32000, color: '#10B981' },
          { region: 'ASIA', value: 28000, color: '#F59E0B' }
        ],
        showTooltips: true,
        interactive: true
      },
      defaultSize: { width: 12, height: 8 }
    },
    {
      type: 'calendar',
      name: 'Event Calendar',
      icon: '📅',
      category: 'Planning',
      defaultConfig: {
        title: 'Upcoming Events',
        view: 'month',
        events: [
          { date: '2024-01-20', title: 'Team Meeting', type: 'meeting' },
          { date: '2024-01-22', title: 'Product Launch', type: 'milestone' },
          { date: '2024-01-25', title: 'Client Review', type: 'review' }
        ],
        showWeekends: true,
        allowEdit: true
      },
      defaultSize: { width: 10, height: 8 }
    }
  ];

  // Real-time data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        timestamp: Date.now(),
        revenue: Math.floor(Math.random() * 50000) + 100000,
        users: Math.floor(Math.random() * 1000) + 5000,
        conversion: (Math.random() * 5 + 2).toFixed(2),
        serverLoad: Math.floor(Math.random() * 40) + 60
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Mouse event handlers for drag functionality
  const handleMouseMove = useCallback((event: MouseEvent) => {
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
  }, [isDragging, selectedWidget, dashboard, dragOffset, gridSize, onDashboardChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Advanced widget rendering with real-time data
  const renderAdvancedWidget = (widget: DashboardWidget) => {
    const isSelected = selectedWidget?.id === widget.id;
    
    const widgetStyle: React.CSSProperties = {
      position: 'absolute',
      left: widget.x * gridSize,
      top: widget.y * gridSize,
      width: widget.width * gridSize,
      height: widget.height * gridSize,
      border: isSelected ? '2px solid #3B82F6' : '1px solid #374151',
      borderRadius: '12px',
      backgroundColor: dashboard?.theme === 'dark' ? '#1F2937' : '#FFFFFF',
      cursor: 'move',
      overflow: 'hidden',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    };

    let content;
    switch (widget.type) {
      case 'metric':
        const metricValue = realTimeData.revenue || widget.config.value;
        content = (
          <div className="p-6 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-1">{widget.config.title}</h3>
                <div className="text-3xl font-bold text-white">{metricValue}</div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${
                  widget.config.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {widget.config.change}
                </div>
                <div className="text-xs text-slate-400">vs last month</div>
              </div>
            </div>
            
            {/* Mini trend chart */}
            <div className="flex items-end justify-between h-8 mt-4">
              {widget.config.trend?.map((value: number, index: number) => (
                <div
                  key={index}
                  className="bg-blue-500 rounded-t"
                  style={{
                    height: `${(value / Math.max(...widget.config.trend)) * 100}%`,
                    width: '8px'
                  }}
                />
              ))}
            </div>
            
            {/* Progress bar for target */}
            {widget.config.target && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Progress to target</span>
                  <span>{Math.round((parseInt(metricValue.replace(/[^0-9]/g, '')) / widget.config.target) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.min(100, (parseInt(metricValue.replace(/[^0-9]/g, '')) / widget.config.target) * 100)}%` 
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        );
        break;
        
      case 'chart':
        content = (
          <div className="p-4 h-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">{widget.config.title}</h3>
              <div className="flex gap-2">
                <button className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs text-slate-300">
                  📊 Line
                </button>
                <button className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs text-slate-300">
                  📈 Area
                </button>
                <button className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs text-slate-300">
                  📊 Bar
                </button>
              </div>
            </div>
            
            {/* Advanced chart visualization */}
            <div className="h-full bg-slate-800/50 rounded-lg p-4 relative">
              <svg className="w-full h-full">
                {/* Chart grid */}
                <defs>
                  <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#374151" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* Chart data visualization */}
                {widget.config.data?.map((item: any, index: number) => {
                  const x = (index / (widget.config.data.length - 1)) * 100;
                  const y = 100 - (item.sales / 5000) * 80;
                  return (
                    <circle
                      key={index}
                      cx={`${x}%`}
                      cy={`${y}%`}
                      r="4"
                      fill="#3B82F6"
                      className="animate-pulse"
                    />
                  );
                })}
              </svg>
              
              {/* Legend */}
              {widget.config.showLegend && (
                <div className="absolute bottom-2 right-2 flex gap-4">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-xs text-slate-300">Sales</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-xs text-slate-300">Profit</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
        break;
        
      case 'gauge':
        const gaugeValue = realTimeData.serverLoad || widget.config.value;
        const gaugeAngle = (gaugeValue / widget.config.max) * 180;
        content = (
          <div className="p-6 h-full flex flex-col items-center justify-center">
            <h3 className="text-sm font-medium text-slate-300 mb-4">{widget.config.title}</h3>
            
            {/* Gauge visualization */}
            <div className="relative w-32 h-16 mb-4">
              <svg className="w-full h-full" viewBox="0 0 200 100">
                {/* Background arc */}
                <path
                  d="M 20 80 A 80 80 0 0 1 180 80"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="8"
                />
                
                {/* Progress arc */}
                <path
                  d="M 20 80 A 80 80 0 0 1 180 80"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="8"
                  strokeDasharray={`${(gaugeAngle / 180) * 251.2} 251.2`}
                  className="transition-all duration-1000"
                />
                
                {/* Needle */}
                <line
                  x1="100"
                  y1="80"
                  x2={100 + 60 * Math.cos((gaugeAngle - 90) * Math.PI / 180)}
                  y2={80 + 60 * Math.sin((gaugeAngle - 90) * Math.PI / 180)}
                  stroke="#EF4444"
                  strokeWidth="3"
                  className="transition-all duration-1000"
                />
                
                {/* Center dot */}
                <circle cx="100" cy="80" r="4" fill="#EF4444" />
              </svg>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{gaugeValue}{widget.config.unit}</div>
              <div className="text-xs text-slate-400">
                {widget.config.min} - {widget.config.max} {widget.config.unit}
              </div>
            </div>
            
            {/* Threshold indicators */}
            <div className="flex gap-2 mt-4">
              {widget.config.thresholds?.map((threshold: any, index: number) => (
                <div key={index} className="flex items-center gap-1">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: threshold.color }}
                  />
                  <span className="text-xs text-slate-400">{threshold.label}</span>
                </div>
              ))}
            </div>
          </div>
        );
        break;
        
      case 'table':
        content = (
          <div className="p-4 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">{widget.config.title}</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search..."
                  className="px-3 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                />
                <button className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-white text-sm">
                  Export
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-600">
                    {widget.config.columns?.map((col: any, index: number) => (
                      <th key={index} className="text-left py-2 text-slate-300 font-medium">
                        {col.label}
                        {col.sortable && <span className="ml-1 text-slate-500">↕️</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {widget.config.data?.map((row: any, index: number) => (
                    <tr key={index} className="border-b border-slate-700 hover:bg-slate-700/30">
                      {widget.config.columns?.map((col: any, colIndex: number) => (
                        <td key={colIndex} className="py-2 text-slate-300">
                          {col.format === 'currency' ? `$${row[col.key]}` :
                           col.format === 'badge' ? (
                             <span className={`px-2 py-1 rounded-full text-xs ${
                               row[col.key] === 'completed' ? 'bg-green-600' :
                               row[col.key] === 'pending' ? 'bg-yellow-600' :
                               'bg-blue-600'
                             }`}>
                               {row[col.key]}
                             </span>
                           ) : row[col.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
        break;
        
      default:
        content = (
          <div className="p-4 h-full flex items-center justify-center">
            <div className="text-slate-400 text-center">
              <div className="text-3xl mb-2">📊</div>
              <div className="text-sm">{widget.type}</div>
            </div>
          </div>
        );
    }

    return (
      <div
        key={widget.id}
        style={widgetStyle}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedWidget(widget);
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          setIsDragging(true);
          setSelectedWidget(widget);
          setDragOffset({
            x: e.clientX - widget.x * gridSize,
            y: e.clientY - widget.y * gridSize
          });
        }}
      >
        {content}
        
        {/* Widget controls */}
        {isSelected && (
          <>
            {/* Delete button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (dashboard) {
                  const updatedDashboard = {
                    ...dashboard,
                    widgets: dashboard.widgets.filter(w => w.id !== widget.id)
                  };
                  onDashboardChange(updatedDashboard);
                  setSelectedWidget(null);
                }
              }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 z-10"
            >
              ×
            </button>
            
            {/* Resize handles */}
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize z-10" />
            <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-blue-500 cursor-s-resize z-10 transform -translate-x-1/2" />
            <div className="absolute right-0 top-1/2 w-4 h-4 bg-blue-500 cursor-e-resize z-10 transform -translate-y-1/2" />
          </>
        )}
      </div>
    );
  };

  if (!dashboard) return <div>Loading...</div>;

  return (
    <div className="flex h-full bg-slate-900">
      {/* Enhanced Widget Library */}
      <div className="w-80 bg-slate-800/50 border-r border-slate-700/50 p-4 overflow-y-auto">
        <h3 className="text-lg font-semibold text-white mb-4">Advanced Dashboard Builder</h3>
        
        {/* Widget Categories */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-slate-300 mb-3">Widget Library</h4>
          <div className="space-y-3">
            {['Analytics', 'Visualization', 'Data', 'Metrics', 'Location', 'Planning'].map(category => (
              <div key={category}>
                <h5 className="text-xs font-medium text-slate-400 mb-2">{category}</h5>
                <div className="grid grid-cols-2 gap-2">
                  {advancedWidgetTemplates
                    .filter(template => template.category === category)
                    .map((template, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (dashboard) {
                            const newWidget: Partial<DashboardWidget> = {
                              type: template.type as any,
                              title: template.name,
                              x: 0,
                              y: 0,
                              width: template.defaultSize.width,
                              height: template.defaultSize.height,
                              config: template.defaultConfig
                            };
                            const updatedDashboard = addWidgetToDashboard(dashboard, newWidget);
                            onDashboardChange(updatedDashboard);
                          }
                        }}
                        className="flex flex-col items-center gap-1 p-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors"
                      >
                        <span className="text-lg">{template.icon}</span>
                        <span className="text-xs text-slate-300 text-center">{template.name}</span>
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Advanced Settings */}
        <div className="space-y-4">
          <button
            onClick={() => setShowDataSources(!showDataSources)}
            className="w-full flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors text-sm text-white"
          >
            <span>🔗</span>
            Data Sources
          </button>
          
          <button
            onClick={() => setShowThemeEditor(!showThemeEditor)}
            className="w-full flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors text-sm text-white"
          >
            <span>🎨</span>
            Theme Editor
          </button>
          
          <button
            onClick={() => onDashboardSave(dashboard)}
            className="w-full flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-500 rounded-lg transition-colors text-sm text-white"
          >
            <span>💾</span>
            Save Dashboard
          </button>
        </div>
      </div>

      {/* Main Dashboard Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Toolbar */}
        <div className="h-14 bg-slate-800/30 border-b border-slate-700/50 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-white">{dashboard.name}</h2>
            <div className="flex gap-2">
              {['desktop', 'tablet', 'mobile'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setPreviewMode(mode as any)}
                  className={`px-3 py-1 rounded text-sm ${
                    previewMode === mode
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {mode === 'desktop' && '💻'}
                  {mode === 'tablet' && '📱'}
                  {mode === 'mobile' && '📱'}
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Live Data
            </div>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm">
              📤 Export
            </button>
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white text-sm">
              👥 Share
            </button>
          </div>
        </div>

        {/* Responsive Canvas */}
        <div className="flex-1 bg-slate-900 overflow-auto p-8">
          <div
            className={`mx-auto bg-slate-800/30 rounded-lg min-h-96 relative ${
              previewMode === 'desktop' ? 'max-w-none' :
              previewMode === 'tablet' ? 'max-w-4xl' :
              'max-w-sm'
            }`}
            style={{
              backgroundImage: dashboard.layout === 'grid' 
                ? `radial-gradient(circle, #374151 1px, transparent 1px)`
                : 'none',
              backgroundSize: dashboard.layout === 'grid' ? `${gridSize}px ${gridSize}px` : 'auto'
            }}
            onClick={() => setSelectedWidget(null)}
          >
            {dashboard.widgets.map(renderAdvancedWidget)}
          </div>
        </div>
      </div>
    </div>
  );
};
