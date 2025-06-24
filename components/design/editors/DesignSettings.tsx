// Enhanced Design Settings - Advanced Configuration and Preferences
// Comprehensive settings panel with themes, plugins, integrations, and advanced features

import React, { useState, useEffect } from 'react';

interface DesignSettingsProps {
  onExport: (format: string, options?: any) => void;
  onImport: (file: File) => void;
  onReset: () => void;
}

interface PluginConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  version: string;
  settings?: any;
}

interface IntegrationConfig {
  id: string;
  name: string;
  type: 'cloud' | 'api' | 'webhook';
  connected: boolean;
  settings: any;
}

export const DesignSettings: React.FC<DesignSettingsProps> = ({
  onExport,
  onImport,
  onReset
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'export' | 'import' | 'preferences' | 'plugins' | 'integrations' | 'advanced'>('general');
  const [exportFormat, setExportFormat] = useState('png');
  const [exportQuality, setExportQuality] = useState(90);
  const [gridSettings, setGridSettings] = useState({
    enabled: true,
    size: 20,
    color: '#374151'
  });
  const [autoSave, setAutoSave] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [plugins, setPlugins] = useState<PluginConfig[]>([
    {
      id: 'ai-assistant',
      name: 'AI Design Assistant',
      description: 'Advanced AI-powered design suggestions and automation',
      enabled: true,
      version: '2.1.0',
      settings: { apiKey: '', model: 'gpt-4' }
    },
    {
      id: 'stock-photos',
      name: 'Stock Photo Integration',
      description: 'Access to millions of stock photos from Unsplash and Pexels',
      enabled: true,
      version: '1.5.2'
    },
    {
      id: 'brand-kit',
      name: 'Brand Kit Manager',
      description: 'Manage brand colors, fonts, and assets across projects',
      enabled: false,
      version: '1.0.0'
    }
  ]);
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>([
    {
      id: 'figma',
      name: 'Figma',
      type: 'api',
      connected: false,
      settings: { apiToken: '', teamId: '' }
    },
    {
      id: 'dropbox',
      name: 'Dropbox',
      type: 'cloud',
      connected: true,
      settings: { accessToken: 'xxx...xxx' }
    },
    {
      id: 'slack',
      name: 'Slack',
      type: 'webhook',
      connected: false,
      settings: { webhookUrl: '', channel: '#design' }
    }
  ]);
  const [performance, setPerformance] = useState({
    enableGPUAcceleration: true,
    maxUndoSteps: 50,
    autoOptimizeImages: true,
    enablePreviewCache: true
  });

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImport(file);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium text-white mb-4">General Settings</h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-slate-300">Auto Save</label>
                    <p className="text-xs text-slate-400">Automatically save changes every 30 seconds</p>
                  </div>
                  <button
                    onClick={() => setAutoSave(!autoSave)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      autoSave ? 'bg-indigo-600' : 'bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        autoSave ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-slate-300">Snap to Grid</label>
                    <p className="text-xs text-slate-400">Snap elements to grid when moving</p>
                  </div>
                  <button
                    onClick={() => setSnapToGrid(!snapToGrid)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      snapToGrid ? 'bg-indigo-600' : 'bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        snapToGrid ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-slate-300">Show Grid</label>
                    <p className="text-xs text-slate-400">Display grid lines on canvas</p>
                  </div>
                  <button
                    onClick={() => setGridSettings({ ...gridSettings, enabled: !gridSettings.enabled })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      gridSettings.enabled ? 'bg-indigo-600' : 'bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        gridSettings.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Grid Size</label>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={gridSettings.size}
                    onChange={(e) => setGridSettings({ ...gridSettings, size: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>10px</span>
                    <span>{gridSettings.size}px</span>
                    <span>50px</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Grid Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={gridSettings.color}
                      onChange={(e) => setGridSettings({ ...gridSettings, color: e.target.value })}
                      className="w-12 h-8 rounded border border-slate-600"
                    />
                    <input
                      type="text"
                      value={gridSettings.color}
                      onChange={(e) => setGridSettings({ ...gridSettings, color: e.target.value })}
                      className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-700">
              <h4 className="text-lg font-medium text-white mb-4">Keyboard Shortcuts</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-300">Copy</span>
                  <span className="text-slate-400 font-mono">Ctrl + C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Paste</span>
                  <span className="text-slate-400 font-mono">Ctrl + V</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Undo</span>
                  <span className="text-slate-400 font-mono">Ctrl + Z</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Redo</span>
                  <span className="text-slate-400 font-mono">Ctrl + Y</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Delete</span>
                  <span className="text-slate-400 font-mono">Delete</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Select All</span>
                  <span className="text-slate-400 font-mono">Ctrl + A</span>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'export':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium text-white mb-4">Export Settings</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Export Format</label>
                  <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                  >
                    <option value="png">PNG (Recommended)</option>
                    <option value="jpg">JPEG</option>
                    <option value="svg">SVG (Vector)</option>
                    <option value="pdf">PDF</option>
                    <option value="json">JSON (Project File)</option>
                  </select>
                </div>
                
                {(exportFormat === 'png' || exportFormat === 'jpg') && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Quality ({exportQuality}%)
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={exportQuality}
                      onChange={(e) => setExportQuality(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>Low (10%)</span>
                      <span>High (100%)</span>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Width (px)</label>
                    <input
                      type="number"
                      defaultValue="1920"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Height (px)</label>
                    <input
                      type="number"
                      defaultValue="1080"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                    />
                  </div>
                </div>
                
                <button
                  onClick={() => onExport(exportFormat)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-medium transition-colors"
                >
                  <span>📤</span>
                  Export as {exportFormat.toUpperCase()}
                </button>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-700">
              <h4 className="text-sm font-medium text-slate-300 mb-2">Export Presets</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'Instagram Post', size: '1080x1080' },
                  { name: 'Facebook Cover', size: '1200x630' },
                  { name: 'Twitter Header', size: '1500x500' },
                  { name: 'YouTube Thumbnail', size: '1280x720' },
                  { name: 'Business Card', size: '1050x600' },
                  { name: 'A4 Document', size: '2480x3508' }
                ].map((preset, index) => (
                  <button
                    key={index}
                    className="p-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-left transition-colors"
                  >
                    <div className="text-sm font-medium text-slate-300">{preset.name}</div>
                    <div className="text-xs text-slate-400">{preset.size}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'import':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium text-white mb-4">Import Files</h4>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                  <div className="text-4xl mb-4">📁</div>
                  <h5 className="text-lg font-medium text-slate-300 mb-2">Import Project or Assets</h5>
                  <p className="text-sm text-slate-400 mb-4">
                    Drag and drop files here or click to browse
                  </p>
                  <input
                    type="file"
                    onChange={handleFileImport}
                    accept=".json,.png,.jpg,.jpeg,.svg,.pdf"
                    className="hidden"
                    id="file-import"
                  />
                  <label
                    htmlFor="file-import"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white cursor-pointer transition-colors"
                  >
                    <span>📂</span>
                    Choose Files
                  </label>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-slate-300 mb-2">Supported Formats</h5>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-400">
                      <span>📄</span>
                      JSON (Project files)
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span>🖼️</span>
                      PNG, JPEG images
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span>🎨</span>
                      SVG vector files
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span>📋</span>
                      PDF documents
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-700">
              <h4 className="text-sm font-medium text-slate-300 mb-2">Recent Imports</h4>
              <div className="space-y-2">
                {[
                  { name: 'logo-design.json', date: '2 hours ago', type: 'project' },
                  { name: 'background.png', date: '1 day ago', type: 'image' },
                  { name: 'icons.svg', date: '3 days ago', type: 'vector' }
                ].map((file, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-slate-700/30 rounded">
                    <span className="text-lg">
                      {file.type === 'project' && '📄'}
                      {file.type === 'image' && '🖼️'}
                      {file.type === 'vector' && '🎨'}
                    </span>
                    <div className="flex-1">
                      <div className="text-sm text-slate-300">{file.name}</div>
                      <div className="text-xs text-slate-400">{file.date}</div>
                    </div>
                    <button className="text-xs text-indigo-400 hover:text-indigo-300">
                      Import Again
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'preferences':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium text-white mb-4">User Preferences</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Default Canvas Size</label>
                  <select className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white">
                    <option>1920x1080 (HD)</option>
                    <option>1080x1080 (Square)</option>
                    <option>1200x630 (Social)</option>
                    <option>Custom</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Default Font</label>
                  <select className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white">
                    <option>Arial</option>
                    <option>Helvetica</option>
                    <option>Times New Roman</option>
                    <option>Georgia</option>
                    <option>Verdana</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Theme</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Dark', 'Light', 'Auto'].map((theme) => (
                      <button
                        key={theme}
                        className="p-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-sm text-slate-300 transition-colors"
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-700">
              <h4 className="text-sm font-medium text-slate-300 mb-4">Danger Zone</h4>
              <div className="space-y-2">
                <button
                  onClick={onReset}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white transition-colors"
                >
                  <span>🗑️</span>
                  Reset All Settings
                </button>
                <p className="text-xs text-slate-400 text-center">
                  This will reset all settings to default values
                </p>
              </div>
            </div>
          </div>
        );

      case 'plugins':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium text-white mb-4">Plugin Management</h4>
              <p className="text-slate-400 mb-6">Extend functionality with powerful plugins and integrations.</p>

              <div className="space-y-4">
                {plugins.map(plugin => (
                  <div key={plugin.id} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h5 className="font-medium text-white">{plugin.name}</h5>
                        <p className="text-sm text-slate-400 mt-1">{plugin.description}</p>
                        <div className="text-xs text-slate-500 mt-2">Version {plugin.version}</div>
                      </div>
                      <button
                        onClick={() => {
                          setPlugins(prev => prev.map(p =>
                            p.id === plugin.id ? { ...p, enabled: !p.enabled } : p
                          ));
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          plugin.enabled ? 'bg-indigo-600' : 'bg-slate-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            plugin.enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {plugin.enabled && plugin.settings && (
                      <div className="pt-3 border-t border-slate-600">
                        <h6 className="text-sm font-medium text-slate-300 mb-2">Plugin Settings</h6>
                        {plugin.id === 'ai-assistant' && (
                          <div className="space-y-2">
                            <div>
                              <label className="block text-xs text-slate-400 mb-1">API Key</label>
                              <input
                                type="password"
                                placeholder="Enter your API key"
                                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-slate-400 mb-1">Model</label>
                              <select className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm">
                                <option value="gpt-4">GPT-4</option>
                                <option value="gpt-3.5">GPT-3.5</option>
                                <option value="claude">Claude</option>
                              </select>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-700">
                <button className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-medium">
                  🔍 Browse Plugin Store
                </button>
              </div>
            </div>
          </div>
        );

      case 'integrations':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium text-white mb-4">External Integrations</h4>
              <p className="text-slate-400 mb-6">Connect with your favorite tools and services.</p>

              <div className="space-y-4">
                {integrations.map(integration => (
                  <div key={integration.id} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                          {integration.name[0]}
                        </div>
                        <div>
                          <h5 className="font-medium text-white">{integration.name}</h5>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`w-2 h-2 rounded-full ${
                              integration.connected ? 'bg-green-400' : 'bg-red-400'
                            }`} />
                            <span className="text-xs text-slate-400">
                              {integration.connected ? 'Connected' : 'Not connected'}
                            </span>
                            <span className="text-xs bg-slate-600 px-2 py-1 rounded">
                              {integration.type.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          integration.connected
                            ? 'bg-red-600 hover:bg-red-500 text-white'
                            : 'bg-green-600 hover:bg-green-500 text-white'
                        }`}
                      >
                        {integration.connected ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>

                    {integration.connected && (
                      <div className="pt-3 border-t border-slate-600">
                        <div className="text-xs text-slate-400">
                          Last sync: 2 hours ago
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-700">
                <button className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg text-white font-medium">
                  ➕ Add New Integration
                </button>
              </div>
            </div>
          </div>
        );

      case 'advanced':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium text-white mb-4">Advanced Settings</h4>

              <div className="space-y-6">
                {/* Performance Settings */}
                <div>
                  <h5 className="text-sm font-medium text-slate-300 mb-3">Performance</h5>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-slate-300">GPU Acceleration</label>
                        <p className="text-xs text-slate-400">Use hardware acceleration for better performance</p>
                      </div>
                      <button
                        onClick={() => setPerformance(prev => ({ ...prev, enableGPUAcceleration: !prev.enableGPUAcceleration }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          performance.enableGPUAcceleration ? 'bg-indigo-600' : 'bg-slate-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            performance.enableGPUAcceleration ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Max Undo Steps ({performance.maxUndoSteps})
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={performance.maxUndoSteps}
                        onChange={(e) => setPerformance(prev => ({ ...prev, maxUndoSteps: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-slate-300">Auto-optimize Images</label>
                        <p className="text-xs text-slate-400">Automatically compress images for better performance</p>
                      </div>
                      <button
                        onClick={() => setPerformance(prev => ({ ...prev, autoOptimizeImages: !prev.autoOptimizeImages }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          performance.autoOptimizeImages ? 'bg-indigo-600' : 'bg-slate-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            performance.autoOptimizeImages ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Developer Settings */}
                <div className="pt-6 border-t border-slate-700">
                  <h5 className="text-sm font-medium text-slate-300 mb-3">Developer</h5>
                  <div className="space-y-3">
                    <button className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm text-left">
                      🔧 Open Developer Console
                    </button>
                    <button className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm text-left">
                      📊 Performance Monitor
                    </button>
                    <button className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm text-left">
                      🐛 Debug Mode
                    </button>
                  </div>
                </div>

                {/* Data Management */}
                <div className="pt-6 border-t border-slate-700">
                  <h5 className="text-sm font-medium text-slate-300 mb-3">Data Management</h5>
                  <div className="space-y-3">
                    <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm">
                      📦 Export All Data
                    </button>
                    <button className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-white text-sm">
                      🗑️ Clear Cache
                    </button>
                    <button
                      onClick={onReset}
                      className="w-full px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white text-sm"
                    >
                      ⚠️ Factory Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-full">
      {/* Enhanced Settings Navigation */}
      <div className="w-64 bg-slate-800/50 border-r border-slate-700/50 p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Settings</h3>
        <nav className="space-y-1">
          {[
            { key: 'general', label: 'General', icon: '⚙️' },
            { key: 'export', label: 'Export', icon: '📤' },
            { key: 'import', label: 'Import', icon: '📥' },
            { key: 'preferences', label: 'Preferences', icon: '🎛️' },
            { key: 'plugins', label: 'Plugins', icon: '🔌' },
            { key: 'integrations', label: 'Integrations', icon: '🔗' },
            { key: 'advanced', label: 'Advanced', icon: '🛠️' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === tab.key
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Settings Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {renderTabContent()}
      </div>
    </div>
  );
};
