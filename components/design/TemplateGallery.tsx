// Template Gallery - Professional Design Template Browser
// Advanced template discovery with categories, search, filters, and preview

import React, { useState, useEffect } from 'react';
import { DesignTemplate, getDesignTemplates } from '../../services/designEditorService';

interface TemplateGalleryProps {
  onTemplateSelect: (template: DesignTemplate) => void;
  onClose: () => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  onTemplateSelect,
  onClose
}) => {
  const [templates, setTemplates] = useState<DesignTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<DesignTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'rating'>('popular');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<DesignTemplate | null>(null);

  const categories = [
    'all', 'business', 'social-media', 'marketing', 'presentation', 
    'web-design', 'print', 'education', 'event', 'personal'
  ];

  const types = [
    'all', 'graphic', 'presentation', 'social-media', 'dashboard', 'web-page'
  ];

  // Mock template data - in real app, this would come from API
  const mockTemplates: DesignTemplate[] = [
    {
      id: 'tpl-001',
      name: 'Modern Business Card',
      category: 'business',
      type: 'graphic',
      thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
      width: 1050,
      height: 600,
      elements: [],
      tags: ['business', 'professional', 'minimal'],
      isPremium: false,
      downloads: 15420,
      rating: 4.8
    },
    {
      id: 'tpl-002',
      name: 'Instagram Story Template',
      category: 'social-media',
      type: 'social-media',
      thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
      width: 1080,
      height: 1920,
      elements: [],
      tags: ['instagram', 'story', 'social'],
      isPremium: true,
      downloads: 8930,
      rating: 4.9
    },
    {
      id: 'tpl-003',
      name: 'Sales Dashboard',
      category: 'business',
      type: 'dashboard',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
      width: 1920,
      height: 1080,
      elements: [],
      tags: ['dashboard', 'analytics', 'business'],
      isPremium: true,
      downloads: 5670,
      rating: 4.7
    },
    {
      id: 'tpl-004',
      name: 'Event Flyer',
      category: 'event',
      type: 'graphic',
      thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop',
      width: 1200,
      height: 1600,
      elements: [],
      tags: ['event', 'flyer', 'promotion'],
      isPremium: false,
      downloads: 12340,
      rating: 4.6
    },
    {
      id: 'tpl-005',
      name: 'Presentation Slide Deck',
      category: 'presentation',
      type: 'presentation',
      thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop',
      width: 1920,
      height: 1080,
      elements: [],
      tags: ['presentation', 'slides', 'corporate'],
      isPremium: true,
      downloads: 7890,
      rating: 4.8
    },
    {
      id: 'tpl-006',
      name: 'Website Landing Page',
      category: 'web-design',
      type: 'web-page',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      width: 1440,
      height: 3000,
      elements: [],
      tags: ['website', 'landing', 'conversion'],
      isPremium: false,
      downloads: 9870,
      rating: 4.5
    }
  ];

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTemplates(mockTemplates);
        setFilteredTemplates(mockTemplates);
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  useEffect(() => {
    let filtered = templates;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(template => template.type === selectedType);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by premium
    if (showPremiumOnly) {
      filtered = filtered.filter(template => template.isPremium);
    }

    // Sort templates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.downloads - a.downloads;
        case 'rating':
          return b.rating - a.rating;
        case 'recent':
          return b.id.localeCompare(a.id); // Mock recent sorting
        default:
          return 0;
      }
    });

    setFilteredTemplates(filtered);
  }, [templates, selectedCategory, selectedType, searchQuery, showPremiumOnly, sortBy]);

  const handleTemplatePreview = (template: DesignTemplate) => {
    setPreviewTemplate(template);
  };

  const handleUseTemplate = (template: DesignTemplate) => {
    onTemplateSelect(template);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800/90 backdrop-blur-md border border-slate-700/50 rounded-xl w-full max-w-7xl h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-700/50">
          <div>
            <h2 className="text-2xl font-bold text-white">Template Gallery</h2>
            <p className="text-slate-400 text-sm">Choose from thousands of professional templates</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Filters Sidebar */}
          <div className="w-80 bg-slate-800/30 border-r border-slate-700/50 p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>
            
            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:border-indigo-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:border-indigo-500"
              >
                {types.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="popular">Most Popular</option>
                <option value="recent">Most Recent</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Premium Filter */}
            <div className="mb-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showPremiumOnly}
                  onChange={(e) => setShowPremiumOnly(e.target.checked)}
                  className="rounded border-slate-600 bg-slate-700 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-300">Premium Only</span>
              </label>
            </div>

            {/* Stats */}
            <div className="pt-6 border-t border-slate-700">
              <div className="text-sm text-slate-400">
                <div className="flex justify-between mb-2">
                  <span>Total Templates:</span>
                  <span className="text-white">{templates.length}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Filtered Results:</span>
                  <span className="text-white">{filteredTemplates.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Premium:</span>
                  <span className="text-yellow-400">{templates.filter(t => t.isPremium).length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="flex-1 p-6 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                  <p className="text-slate-400">Loading templates...</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTemplates.map(template => (
                  <div
                    key={template.id}
                    className="bg-slate-700/30 rounded-xl overflow-hidden border border-slate-600/50 hover:border-indigo-500/50 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={template.thumbnail}
                        alt={template.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Premium Badge */}
                      {template.isPremium && (
                        <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                          PRO
                        </div>
                      )}
                      
                      {/* Overlay Actions */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleTemplatePreview(template)}
                          className="px-3 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors text-sm"
                        >
                          👁️ Preview
                        </button>
                        <button
                          onClick={() => handleUseTemplate(template)}
                          className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors text-sm font-medium"
                        >
                          Use Template
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-white mb-1 truncate">{template.name}</h3>
                      <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
                        <span className="capitalize">{template.category.replace('-', ' ')}</span>
                        <div className="flex items-center gap-1">
                          <span>⭐</span>
                          <span>{template.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{template.downloads.toLocaleString()} downloads</span>
                        <span>{template.width} × {template.height}</span>
                      </div>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {template.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="px-2 py-1 bg-slate-600/50 rounded text-xs text-slate-300">
                            {tag}
                          </span>
                        ))}
                        {template.tags.length > 2 && (
                          <span className="px-2 py-1 bg-slate-600/50 rounded text-xs text-slate-300">
                            +{template.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {!loading && filteredTemplates.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-white mb-2">No templates found</h3>
                  <p className="text-slate-400">Try adjusting your filters or search terms</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Template Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-60 flex items-center justify-center p-4">
          <div className="bg-slate-800/90 backdrop-blur-md border border-slate-700/50 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-slate-700/50">
              <div>
                <h3 className="text-xl font-bold text-white">{previewTemplate.name}</h3>
                <p className="text-slate-400">{previewTemplate.category} • {previewTemplate.width} × {previewTemplate.height}</p>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 p-6 flex items-center justify-center">
              <img
                src={previewTemplate.thumbnail}
                alt={previewTemplate.name}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
            
            <div className="flex justify-between items-center p-6 border-t border-slate-700/50">
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <span>⭐ {previewTemplate.rating}</span>
                <span>📥 {previewTemplate.downloads.toLocaleString()}</span>
                {previewTemplate.isPremium && <span className="text-yellow-400">👑 Premium</span>}
              </div>
              <button
                onClick={() => handleUseTemplate(previewTemplate)}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
              >
                Use This Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
