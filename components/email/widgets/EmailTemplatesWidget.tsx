// Email Templates Widget - Production Ready
// Template management with preview and editing capabilities

import React, { useState, useEffect } from 'react';
import { EmailDataCard } from '../EmailDataCard';
import { getEmailTemplates, EmailTemplate, getTemplateCategories } from '../../../services/emailService';
import { EmailTemplateBuilder } from '../EmailTemplateBuilder';

export const EmailTemplatesWidget: React.FC = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showTemplateBuilder, setShowTemplateBuilder] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | undefined>();
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const templateData = selectedCategory === 'all' 
          ? await getEmailTemplates() 
          : await getEmailTemplates(selectedCategory);
        setTemplates(templateData);
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [selectedCategory]);

  const categories = ['all', ...getTemplateCategories()];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'welcome': return '👋';
      case 'newsletter': return '📰';
      case 'promotional': return '🎯';
      case 'transactional': return '📄';
      case 'event': return '🎉';
      case 'abandoned-cart': return '🛒';
      default: return '📧';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleTemplateCreated = (template: EmailTemplate) => {
    setTemplates([template, ...templates]);
    setShowTemplateBuilder(false);
    setEditingTemplate(undefined);
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setShowTemplateBuilder(true);
  };

  const handlePreviewTemplate = (template: EmailTemplate) => {
    setPreviewTemplate(template);
  };

  return (
    <>
      <EmailDataCard 
        title="Email Templates" 
        footer={
          <div className="flex gap-2">
            <button 
              onClick={() => setShowTemplateBuilder(true)}
              className="px-3 py-1.5 bg-pink-500 text-white rounded-md hover:bg-pink-400 text-xs font-semibold"
            >
              Create Template
            </button>
            <button className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-400 text-xs font-semibold">
              Browse Gallery
            </button>
          </div>
        }
      >
        <div className="text-sm">
          {/* Category Filter */}
          <div className="mb-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2 py-1 bg-slate-700/50 border border-slate-600 rounded text-xs text-slate-200 focus:outline-none focus:border-pink-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
            </div>
          ) : (
            <div className="space-y-2">
              {templates.length > 0 ? (
                templates.map(template => (
                  <div 
                    key={template.id} 
                    className="p-3 bg-slate-700/50 rounded-md hover:bg-slate-700/70 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getTypeIcon(template.type)}</span>
                        <div>
                          <h4 className="font-semibold text-pink-200">{template.name}</h4>
                          <div className="text-xs text-slate-400">{template.category}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {template.isActive ? (
                          <span className="text-xs bg-green-600/50 text-green-300 px-1.5 py-0.5 rounded">
                            Active
                          </span>
                        ) : (
                          <span className="text-xs bg-gray-600/50 text-gray-300 px-1.5 py-0.5 rounded">
                            Inactive
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-xs text-slate-300 mb-2">
                      <strong>Subject:</strong> {template.subject}
                    </div>
                    
                    {template.previewText && (
                      <div className="text-xs text-slate-400 mb-2">
                        {template.previewText}
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="text-slate-400">
                        Created: {formatDate(template.createdAt)}
                      </span>
                      <span className="text-slate-400">
                        By: {template.createdBy}
                      </span>
                    </div>
                    
                    {/* Template Tags */}
                    {template.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {template.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-1.5 py-0.5 bg-slate-600/50 rounded text-xs text-slate-300">
                            {tag}
                          </span>
                        ))}
                        {template.tags.length > 3 && (
                          <span className="px-1.5 py-0.5 bg-slate-600/50 rounded text-xs text-slate-300">
                            +{template.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Template Variables */}
                    {template.variables.length > 0 && (
                      <div className="text-xs text-slate-400 mb-2">
                        Variables: {template.variables.map(v => v.name).join(', ')}
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-3">
                      <button 
                        onClick={() => handlePreviewTemplate(template)}
                        className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-400"
                      >
                        Preview
                      </button>
                      <button 
                        onClick={() => handleEditTemplate(template)}
                        className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-400"
                      >
                        Edit
                      </button>
                      <button className="px-2 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-400">
                        Use Template
                      </button>
                      <button className="px-2 py-1 bg-slate-600 text-white rounded text-xs hover:bg-slate-500">
                        Duplicate
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400">
                  <div className="text-4xl mb-2">📝</div>
                  <p>No templates found</p>
                  <p className="text-xs mt-1">
                    {selectedCategory === 'all' 
                      ? 'Create your first email template' 
                      : `No templates in ${selectedCategory} category`}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </EmailDataCard>

      {/* Template Builder Modal */}
      <EmailTemplateBuilder
        isOpen={showTemplateBuilder}
        onClose={() => {
          setShowTemplateBuilder(false);
          setEditingTemplate(undefined);
        }}
        template={editingTemplate}
        onSave={handleTemplateCreated}
      />

      {/* Template Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800/90 backdrop-blur-md border border-slate-700/50 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-700/50">
              <div>
                <h2 className="text-xl font-bold text-white">{previewTemplate.name}</h2>
                <p className="text-slate-400 text-sm">{previewTemplate.subject}</p>
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

            {/* Preview Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-2xl mx-auto">
                {/* Email Header */}
                <div className="bg-slate-700/50 px-4 py-3 rounded-t-lg border-b border-slate-600">
                  <div className="text-sm text-slate-300">
                    <div><strong>From:</strong> {previewTemplate.createdBy}</div>
                    <div><strong>Subject:</strong> {previewTemplate.subject}</div>
                    {previewTemplate.previewText && (
                      <div className="text-xs text-slate-400 mt-1">{previewTemplate.previewText}</div>
                    )}
                  </div>
                </div>
                
                {/* Email Body */}
                <div 
                  className="bg-white p-6 rounded-b-lg min-h-96"
                  dangerouslySetInnerHTML={{ __html: previewTemplate.htmlContent }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center p-6 border-t border-slate-700/50">
              <div className="text-sm text-slate-400">
                Template ID: {previewTemplate.id}
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleEditTemplate(previewTemplate)}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-400 transition-colors"
                >
                  Edit Template
                </button>
                <button className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-400 transition-colors">
                  Use Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
