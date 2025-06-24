// Email Template Builder - Production Ready
// Visual email template editor with drag-and-drop functionality

import React, { useEffect, useState } from 'react';
import { EmailTemplate, TemplateVariable, createEmailTemplate, generateTemplatePreview, getTemplateCategories, validateTemplate } from '../../services/emailService';

interface EmailTemplateBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  template?: EmailTemplate;
  onSave: (template: EmailTemplate) => void;
}

export const EmailTemplateBuilder: React.FC<EmailTemplateBuilderProps> = ({
  isOpen,
  onClose,
  template,
  onSave
}) => {
  const [templateData, setTemplateData] = useState<Partial<EmailTemplate>>({
    name: '',
    subject: '',
    category: 'Newsletter',
    type: 'newsletter',
    htmlContent: '',
    textContent: '',
    previewText: '',
    tags: [],
    variables: [],
    designSettings: {
      primaryColor: '#3498db',
      secondaryColor: '#2c3e50',
      fontFamily: 'Arial, sans-serif',
      footerText: '© 2024 Your Company. All rights reserved.'
    }
  });
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [previewVariables, setPreviewVariables] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (template) {
      setTemplateData(template);
      // Initialize preview variables with default values
      const defaultVars: { [key: string]: string } = {};
      template.variables.forEach(variable => {
        defaultVars[variable.name] = variable.defaultValue;
      });
      setPreviewVariables(defaultVars);
    }
  }, [template]);

  if (!isOpen) return null;

  const categories = getTemplateCategories();

  const handleSave = async () => {
    const validation = validateTemplate(templateData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setSaving(true);
    try {
      const savedTemplate = await createEmailTemplate(templateData);
      onSave(savedTemplate);
      onClose();
    } catch (error) {
      console.error('Error saving template:', error);
      setErrors(['Failed to save template. Please try again.']);
    } finally {
      setSaving(false);
    }
  };

  const addVariable = () => {
    const newVariable: TemplateVariable = {
      name: `variable_${(templateData.variables?.length ?? 0) + 1}`,
      type: 'text',
      defaultValue: '',
      description: '',
      required: false
    };
    
    setTemplateData({
      ...templateData,
      variables: [...(templateData.variables || []), newVariable]
    });
  };

  const updateVariable = (index: number, field: keyof TemplateVariable, value: any) => {
    const updatedVariables = [...(templateData.variables || [])];
    updatedVariables[index] = { ...updatedVariables[index], [field]: value };
    setTemplateData({ ...templateData, variables: updatedVariables });
  };

  const removeVariable = (index: number) => {
    const updatedVariables = templateData.variables?.filter((_, i) => i !== index) || [];
    setTemplateData({ ...templateData, variables: updatedVariables });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-4">Template Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-300 mb-2" htmlFor="template-name">Template Name *</label>
                <input
                  id="template-name"
                  name="template-name"
                  type="text"
                  value={templateData.name ?? ''}
                  onChange={(e) => setTemplateData({ ...templateData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white focus:outline-none focus:border-pink-500"
                  placeholder="Enter template name"
                  autoComplete="off"
                  required
                  aria-required="true"
                />
              </div>
              
              <div>
                <label className="block text-sm text-slate-300 mb-2" htmlFor="template-category">Category</label>
                <select
                  id="template-category"
                  name="template-category"
                  value={templateData.category ?? ''}
                  onChange={(e) => setTemplateData({ ...templateData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white focus:outline-none focus:border-pink-500"
                  aria-label="Template Category"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-slate-300 mb-2" htmlFor="template-subject">Subject Line *</label>
              <input
                id="template-subject"
                name="template-subject"
                type="text"
                value={templateData.subject ?? ''}
                onChange={(e) => setTemplateData({ ...templateData, subject: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white focus:outline-none focus:border-pink-500"
                placeholder="Enter email subject line"
                autoComplete="off"
                required
                aria-required="true"
              />
            </div>
            
            <div>
              <label className="block text-sm text-slate-300 mb-2" htmlFor="template-preview-text">Preview Text</label>
              <input
                id="template-preview-text"
                name="template-preview-text"
                type="text"
                value={templateData.previewText ?? ''}
                onChange={(e) => setTemplateData({ ...templateData, previewText: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white focus:outline-none focus:border-pink-500"
                placeholder="Text shown in email preview"
                autoComplete="off"
              />
            </div>
            
            <div>
              <label className="block text-sm text-slate-300 mb-2" htmlFor="template-tags">Tags</label>
              <input
                id="template-tags"
                name="template-tags"
                type="text"
                value={templateData.tags?.join(', ') ?? ''}
                onChange={(e) => setTemplateData({ ...templateData, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white focus:outline-none focus:border-pink-500"
                placeholder="Enter tags separated by commas"
                autoComplete="off"
              />
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-4">Design Settings</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-300 mb-2" htmlFor="primary-color">Primary Color</label>
                <div className="flex flex-row items-center space-x-3"> {/* Use space-x-3 for explicit spacing between color and text input */}
                  <input
                    id="primary-color"
                    name="primary-color"
                    type="color"
                    value={templateData.designSettings?.primaryColor ?? '#3498db'}
                    onChange={(e) => setTemplateData({
                      ...templateData,
                      designSettings: { ...templateData.designSettings!, primaryColor: e.target.value }
                    })}
                    className="w-12 h-10 rounded border border-slate-600"
                    aria-label="Primary Color"
                  />
                  <span className="inline-block w-2" aria-hidden="true"></span> {/* Extra spacing for accessibility and clarity */}
                  <input
                    id="primary-color-text"
                    name="primary-color-text"
                    type="text"
                    value={templateData.designSettings?.primaryColor ?? '#3498db'}
                    onChange={(e) => setTemplateData({
                      ...templateData,
                      designSettings: { ...templateData.designSettings!, primaryColor: e.target.value }
                    })}
                    className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white focus:outline-none focus:border-pink-500"
                    aria-label="Primary Color Text"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-slate-300 mb-2" htmlFor="secondary-color">Secondary Color</label>
                <div className="flex gap-2">
                  <input
                    id="secondary-color"
                    name="secondary-color"
                    type="color"
                    value={templateData.designSettings?.secondaryColor ?? '#2c3e50'}
                    onChange={(e) => setTemplateData({
                      ...templateData,
                      designSettings: { ...templateData.designSettings!, secondaryColor: e.target.value }
                    })}
                    className="w-12 h-10 rounded border border-slate-600"
                    aria-label="Secondary Color"
                  />
                  <input
                    id="secondary-color-text"
                    name="secondary-color-text"
                    type="text"
                    value={templateData.designSettings?.secondaryColor ?? '#2c3e50'}
                    onChange={(e) => setTemplateData({
                      ...templateData,
                      designSettings: { ...templateData.designSettings!, secondaryColor: e.target.value }
                    })}
                    className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white focus:outline-none focus:border-pink-500"
                    aria-label="Secondary Color Text"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-slate-300 mb-2" htmlFor="font-family">Font Family</label>
              <select
                id="font-family"
                name="font-family"
                value={templateData.designSettings?.fontFamily ?? 'Arial, sans-serif'}
                onChange={(e) => setTemplateData({
                  ...templateData,
                  designSettings: { ...templateData.designSettings!, fontFamily: e.target.value }
                })}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white focus:outline-none focus:border-pink-500"
                aria-label="Font Family"
              >
                <option value="Arial, sans-serif">Arial</option>
                <option value="Helvetica, sans-serif">Helvetica</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="'Times New Roman', serif">Times New Roman</option>
                <option value="'Courier New', monospace">Courier New</option>
                <option value="'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">Segoe UI</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-slate-300 mb-2" htmlFor="footer-text">Footer Text</label>
              <textarea
                id="footer-text"
                name="footer-text"
                value={templateData.designSettings?.footerText ?? ''}
                onChange={(e) => setTemplateData({
                  ...templateData,
                  designSettings: { ...templateData.designSettings!, footerText: e.target.value }
                })}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white focus:outline-none focus:border-pink-500 resize-none"
                rows={3}
                placeholder="Footer text for your emails"
                aria-label="Footer Text"
              />
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Template Variables</h3>
              <button
                onClick={addVariable}
                className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-400 transition-colors"
              >
                Add Variable
              </button>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {templateData.variables?.map((variable, index) => (
                <div key={variable.name ? `var-${variable.name}` : `var-${index}`} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1" htmlFor={`variable-name-${index}`}>Variable Name</label>
                      <input
                        id={`variable-name-${index}`}
                        name={`variable-name-${index}`}
                        type="text"
                        value={variable.name ?? ''}
                        onChange={(e) => updateVariable(index, 'name', e.target.value)}
                        className="w-full px-2 py-1 bg-slate-700/50 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-pink-500"
                        aria-label="Variable Name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-slate-400 mb-1" htmlFor={`variable-type-${index}`}>Type</label>
                      <select
                        id={`variable-type-${index}`}
                        name={`variable-type-${index}`}
                        value={variable.type ?? 'text'}
                        onChange={(e) => updateVariable(index, 'type', e.target.value)}
                        className="w-full px-2 py-1 bg-slate-700/50 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-pink-500"
                        aria-label="Variable Type"
                      >
                        <option value="text">Text</option>
                        <option value="image">Image</option>
                        <option value="url">URL</option>
                        <option value="date">Date</option>
                        <option value="number">Number</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1" htmlFor={`variable-default-${index}`}>Default Value</label>
                      <input
                        id={`variable-default-${index}`}
                        name={`variable-default-${index}`}
                        type="text"
                        value={variable.defaultValue ?? ''}
                        onChange={(e) => updateVariable(index, 'defaultValue', e.target.value)}
                        className="w-full px-2 py-1 bg-slate-700/50 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-pink-500"
                        aria-label="Default Value"
                      />
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <label className="flex items-center text-xs text-slate-400">
                        <input
                          id={`variable-required-${index}`}
                          name={`variable-required-${index}`}
                          type="checkbox"
                          checked={variable.required ?? false}
                          onChange={(e) => updateVariable(index, 'required', e.target.checked)}
                          className="mr-2"
                          aria-label="Required"
                        />
                        Required
                      </label>
                      <button
                        onClick={() => removeVariable(index)}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-slate-400 mb-1" htmlFor={`variable-description-${index}`}>Description</label>
                    <input
                      id={`variable-description-${index}`}
                      name={`variable-description-${index}`}
                      type="text"
                      value={variable.description ?? ''}
                      onChange={(e) => updateVariable(index, 'description', e.target.value)}
                      className="w-full px-2 py-1 bg-slate-700/50 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-pink-500"
                      placeholder="Variable description"
                      aria-label="Variable Description"
                    />
                  </div>
                </div>
              ))}
              
              {(!templateData.variables || templateData.variables.length === 0) && (
                <div className="text-center py-8 text-slate-400">
                  <p>No variables defined</p>
                  <p className="text-sm mt-1">Add variables to make your template dynamic</p>
                </div>
              )}
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-4">HTML Content</h3>
            
            <div>
              <label className="block text-sm text-slate-300 mb-2" htmlFor="html-content">HTML Content *</label>
              <textarea
                id="html-content"
                name="html-content"
                value={templateData.htmlContent ?? ''}
                onChange={(e) => setTemplateData({ ...templateData, htmlContent: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white focus:outline-none focus:border-pink-500 font-mono text-sm resize-none"
                rows={15}
                placeholder="Enter your HTML email template..."
                aria-label="HTML Content"
                required
                aria-required="true"
              />
            </div>
            
            <div>
              <label className="block text-sm text-slate-300 mb-2" htmlFor="text-content">Text Content</label>
              <textarea
                id="text-content"
                name="text-content"
                value={templateData.textContent ?? ''}
                onChange={(e) => setTemplateData({ ...templateData, textContent: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white focus:outline-none focus:border-pink-500 resize-none"
                rows={8}
                placeholder="Plain text version of your email..."
                aria-label="Text Content"
              />
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Preview</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`px-3 py-1 rounded text-sm ${
                    previewMode === 'desktop' 
                      ? 'bg-pink-500 text-white' 
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  Desktop
                </button>
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`px-3 py-1 rounded text-sm ${
                    previewMode === 'mobile' 
                      ? 'bg-pink-500 text-white' 
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  Mobile
                </button>
              </div>
            </div>
            
            {/* Variable inputs for preview */}
            {templateData.variables && templateData.variables.length > 0 && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-700/30 rounded-lg">
                <h4 className="col-span-2 text-sm font-medium text-slate-300 mb-2">Preview Variables</h4>
                {templateData.variables.map((variable) => (
                  <div key={variable.name}>
                    <label className="block text-xs text-slate-400 mb-1" htmlFor={`preview-variable-${variable.name}`}>{variable.name}</label>
                    <input
                      id={`preview-variable-${variable.name}`}
                      name={`preview-variable-${variable.name}`}
                      type="text"
                      value={previewVariables[variable.name] ?? variable.defaultValue}
                      onChange={(e) => setPreviewVariables({
                        ...previewVariables,
                        [variable.name]: e.target.value
                      })}
                      className="w-full px-2 py-1 bg-slate-700/50 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-pink-500"
                      aria-label={variable.name}
                    />
                  </div>
                ))}
              </div>
            )}
            
            {/* Email preview */}
            <div className={`border border-slate-600 rounded-lg overflow-hidden ${
              previewMode === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'
            }`}>
              <div className="bg-slate-700/50 px-4 py-2 border-b border-slate-600">
                <div className="text-sm text-slate-300">
                  <strong>Subject:</strong> {templateData.subject ?? 'No subject'}
                </div>
                {templateData.previewText && (
                  <div className="text-xs text-slate-400 mt-1">
                    {templateData.previewText}
                  </div>
                )}
              </div>
              <div 
                className="bg-white p-4 min-h-96 overflow-auto"
                dangerouslySetInnerHTML={{
                  __html: templateData.htmlContent 
                    ? generateTemplatePreview(templateData as EmailTemplate, previewVariables)
                    : '<div style="color: #666; text-align: center; padding: 40px;">No content to preview</div>'
                }}
              />
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800/90 backdrop-blur-md border border-slate-700/50 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-700/50">
          <h2 className="text-xl font-bold text-white">
            {template ? 'Edit Template' : 'Create Email Template'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step 
                    ? 'bg-pink-500 text-white' 
                    : 'bg-slate-700 text-slate-400'
                }`}>
                  {step}
                </div>
                {step < 5 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    currentStep > step ? 'bg-pink-500' : 'bg-slate-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-400">
            <span>Info</span>
            <span>Design</span>
            <span>Variables</span>
            <span>Content</span>
            <span>Preview</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {errors.length > 0 && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <h4 className="text-red-400 font-medium mb-2">Please fix the following errors:</h4>
              <ul className="text-red-300 text-sm space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
          
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-slate-700/50">
          <button
            onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : onClose()}
            className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
          >
            {currentStep > 1 ? 'Back' : 'Cancel'}
          </button>
          
          <div className="flex gap-3">
            {currentStep < 5 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-400 font-medium transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-400 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Template'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
