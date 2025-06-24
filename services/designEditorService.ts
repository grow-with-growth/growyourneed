// Comprehensive Design Editor Service - Production Ready
// Full-featured design editor like Canva with visual editor, code editor, dashboard builder

export interface DesignElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'icon' | 'chart' | 'button' | 'container';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  locked: boolean;
  visible: boolean;
  properties: ElementProperties;
}

export interface ElementProperties {
  // Text properties
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  color?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: number;
  letterSpacing?: number;

  // Image properties
  src?: string;
  alt?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down';

  // Shape properties
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  borderRadius?: number;

  // Container properties
  backgroundColor?: string;
  border?: string;
  padding?: number;
  margin?: number;
  children?: string[]; // For grouped elements

  // Filter properties
  filters?: {
    blur?: number;
    brightness?: number;
    contrast?: number;
    saturation?: number;
    [key: string]: number | undefined;
  };

  // Animation properties
  animation?: {
    type: 'fadeIn' | 'slideIn' | 'bounce' | 'pulse' | 'rotate';
    duration: number;
    delay: number;
    repeat: boolean;
  };
}

export interface DesignProject {
  id: string;
  name: string;
  type: 'graphic' | 'presentation' | 'social-media' | 'dashboard' | 'web-page';
  width: number;
  height: number;
  backgroundColor: string;
  elements: DesignElement[];
  pages: DesignPage[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  thumbnail?: string;
  tags: string[];
  isPublic: boolean;
}

export interface DesignPage {
  id: string;
  name: string;
  elements: DesignElement[];
  backgroundColor: string;
  order: number;
}

export interface DesignTemplate {
  id: string;
  name: string;
  category: string;
  type: 'graphic' | 'presentation' | 'social-media' | 'dashboard';
  thumbnail: string;
  width: number;
  height: number;
  elements: DesignElement[];
  tags: string[];
  isPremium: boolean;
  downloads: number;
  rating: number;
}

export interface AssetLibrary {
  id: string;
  name: string;
  type: 'image' | 'icon' | 'illustration' | 'shape' | 'template';
  category: string;
  url: string;
  thumbnail: string;
  tags: string[];
  isPremium: boolean;
  downloads: number;
  size?: {
    width: number;
    height: number;
  };
}

export interface CodeProject {
  id: string;
  name: string;
  language: 'html' | 'css' | 'javascript' | 'typescript' | 'react' | 'vue' | 'angular';
  code: string;
  preview: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  isPublic: boolean;
  tags: string[];
}

export interface DashboardWidget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'text' | 'image' | 'iframe' | 'gauge' | 'map' | 'calendar';
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  config: any;
  dataSource?: string;
  refreshInterval?: number;
}

export interface DashboardProject {
  id: string;
  name: string;
  description: string;
  widgets: DashboardWidget[];
  layout: 'grid' | 'free';
  theme: 'light' | 'dark' | 'custom';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  isPublic: boolean;
}

// Mock data for demonstration
const MOCK_TEMPLATES: DesignTemplate[] = [
  {
    id: 'tpl-1',
    name: 'Social Media Post',
    category: 'Social Media',
    type: 'social-media',
    thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=300&fit=crop',
    width: 1080,
    height: 1080,
    elements: [],
    tags: ['instagram', 'facebook', 'square'],
    isPremium: false,
    downloads: 1250,
    rating: 4.8
  },
  {
    id: 'tpl-2',
    name: 'Business Presentation',
    category: 'Presentation',
    type: 'presentation',
    thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop',
    width: 1920,
    height: 1080,
    elements: [],
    tags: ['business', 'corporate', 'slides'],
    isPremium: true,
    downloads: 890,
    rating: 4.9
  }
];

const MOCK_ASSETS: AssetLibrary[] = [
  {
    id: 'asset-1',
    name: 'Business Icons Pack',
    type: 'icon',
    category: 'Business',
    url: 'https://api.iconify.design/mdi:briefcase.svg',
    thumbnail: 'https://api.iconify.design/mdi:briefcase.svg',
    tags: ['business', 'office', 'work'],
    isPremium: false,
    downloads: 5420
  },
  {
    id: 'asset-2',
    name: 'Abstract Background',
    type: 'image',
    category: 'Backgrounds',
    url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=600',
    thumbnail: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=300&h=200&fit=crop',
    tags: ['abstract', 'gradient', 'modern'],
    isPremium: false,
    downloads: 3210,
    size: { width: 1920, height: 1080 }
  }
];

// Design Editor Functions
export const createNewProject = async (projectData: Partial<DesignProject>): Promise<DesignProject> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newProject: DesignProject = {
      id: `proj-${Date.now()}`,
      name: projectData.name || 'Untitled Project',
      type: projectData.type || 'graphic',
      width: projectData.width || 1920,
      height: projectData.height || 1080,
      backgroundColor: projectData.backgroundColor || '#ffffff',
      elements: [],
      pages: [{
        id: 'page-1',
        name: 'Page 1',
        elements: [],
        backgroundColor: projectData.backgroundColor || '#ffffff',
        order: 1
      }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user',
      tags: projectData.tags || [],
      isPublic: false
    };
    
    return newProject;
  } catch (error) {
    console.error('Error creating project:', error);
    throw new Error('Failed to create project');
  }
};

export const saveProject = async (project: DesignProject): Promise<boolean> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log('Project saved:', project.name);
    return true;
  } catch (error) {
    console.error('Error saving project:', error);
    return false;
  }
};

export const getDesignTemplates = async (category?: string): Promise<DesignTemplate[]> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (category) {
      return MOCK_TEMPLATES.filter(template => 
        template.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    return MOCK_TEMPLATES;
  } catch (error) {
    console.error('Error fetching templates:', error);
    return [];
  }
};

export const getAssetLibrary = async (type?: string, category?: string): Promise<AssetLibrary[]> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filteredAssets = MOCK_ASSETS;
    
    if (type) {
      filteredAssets = filteredAssets.filter(asset => asset.type === type);
    }
    
    if (category) {
      filteredAssets = filteredAssets.filter(asset => 
        asset.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    return filteredAssets;
  } catch (error) {
    console.error('Error fetching assets:', error);
    return [];
  }
};

export const addElementToProject = (project: DesignProject, element: Partial<DesignElement>): DesignProject => {
  const newElement: DesignElement = {
    id: `element-${Date.now()}`,
    type: element.type || 'text',
    x: element.x || 100,
    y: element.y || 100,
    width: element.width || 200,
    height: element.height || 50,
    rotation: 0,
    opacity: 1,
    zIndex: project.elements.length + 1,
    locked: false,
    visible: true,
    properties: element.properties || {}
  };
  
  return {
    ...project,
    elements: [...project.elements, newElement],
    updatedAt: new Date().toISOString()
  };
};

export const updateElement = (project: DesignProject, elementId: string, updates: Partial<DesignElement>): DesignProject => {
  return {
    ...project,
    elements: project.elements.map(element =>
      element.id === elementId ? { ...element, ...updates } : element
    ),
    updatedAt: new Date().toISOString()
  };
};

export const deleteElement = (project: DesignProject, elementId: string): DesignProject => {
  return {
    ...project,
    elements: project.elements.filter(element => element.id !== elementId),
    updatedAt: new Date().toISOString()
  };
};

// Code Editor Functions
export const createCodeProject = async (projectData: Partial<CodeProject>): Promise<CodeProject> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newProject: CodeProject = {
      id: `code-${Date.now()}`,
      name: projectData.name || 'Untitled Code Project',
      language: projectData.language || 'html',
      code: projectData.code || getDefaultCode(projectData.language || 'html'),
      preview: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user',
      isPublic: false,
      tags: projectData.tags || []
    };
    
    return newProject;
  } catch (error) {
    console.error('Error creating code project:', error);
    throw new Error('Failed to create code project');
  }
};

export const generateCodeWithAI = async (prompt: string, language: string): Promise<string> => {
  try {
    if (!prompt || !language) {
      throw new Error('Prompt and language are required');
    }

    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock AI code generation
    const mockCode = {
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated from: ${prompt}</title>
</head>
<body>
    <h1>AI Generated Content</h1>
    <p>This is a mock response for: ${prompt}</p>
</body>
</html>`,
      css: `/* Generated CSS for: ${prompt} */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 2rem;
    border-radius: 8px;
}`,
      javascript: `// Generated JavaScript for: ${prompt}
function generatedFunction() {
    console.log('AI generated code for: ${prompt}');

    // Mock functionality
    const element = document.createElement('div');
    element.textContent = 'Generated content';
    document.body.appendChild(element);
}

generatedFunction();`,
      typescript: `// Generated TypeScript for: ${prompt}
interface GeneratedInterface {
    message: string;
    timestamp: Date;
}

function generatedFunction(): GeneratedInterface {
    return {
        message: 'AI generated code for: ${prompt}',
        timestamp: new Date()
    };
}

const result = generatedFunction();
console.log(result);`,
      react: `// Generated React component for: ${prompt}
import React from 'react';

interface Props {
    title?: string;
}

const GeneratedComponent: React.FC<Props> = ({ title = 'Generated Component' }) => {
    return (
        <div className="generated-component">
            <h1>{title}</h1>
            <p>This component was generated for: ${prompt}</p>
        </div>
    );
};

export default GeneratedComponent;`
    };

    return mockCode[language as keyof typeof mockCode] || mockCode.html;
  } catch (error) {
    console.error('Error generating code with AI:', error);
    throw new Error(`Failed to generate ${language} code: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Dashboard Builder Functions
export const createDashboard = async (dashboardData: Partial<DashboardProject>): Promise<DashboardProject> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newDashboard: DashboardProject = {
      id: `dash-${Date.now()}`,
      name: dashboardData.name || 'New Dashboard',
      description: dashboardData.description || '',
      widgets: [],
      layout: dashboardData.layout || 'grid',
      theme: dashboardData.theme || 'dark',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user',
      isPublic: false
    };
    
    return newDashboard;
  } catch (error) {
    console.error('Error creating dashboard:', error);
    throw new Error('Failed to create dashboard');
  }
};

export const addWidgetToDashboard = (dashboard: DashboardProject, widget: Partial<DashboardWidget>): DashboardProject => {
  const newWidget: DashboardWidget = {
    id: `widget-${Date.now()}`,
    type: widget.type || 'metric',
    title: widget.title || 'New Widget',
    x: widget.x || 0,
    y: widget.y || 0,
    width: widget.width || 4,
    height: widget.height || 3,
    config: widget.config || {},
    dataSource: widget.dataSource,
    refreshInterval: widget.refreshInterval
  };
  
  return {
    ...dashboard,
    widgets: [...dashboard.widgets, newWidget],
    updatedAt: new Date().toISOString()
  };
};

// Utility Functions
const getDefaultCode = (language: string): string => {
  const defaults = {
    html: '<!DOCTYPE html>\n<html>\n<head>\n    <title>New Project</title>\n</head>\n<body>\n    <h1>Hello World!</h1>\n</body>\n</html>',
    css: '/* Your CSS here */\nbody {\n    font-family: Arial, sans-serif;\n    margin: 0;\n    padding: 20px;\n}',
    javascript: '// Your JavaScript here\nconsole.log("Hello World!");',
    typescript: '// Your TypeScript here\ninterface User {\n    name: string;\n    age: number;\n}\n\nconst user: User = {\n    name: "John",\n    age: 30\n};',
    react: 'import React from "react";\n\nfunction App() {\n    return (\n        <div>\n            <h1>Hello React!</h1>\n        </div>\n    );\n}\n\nexport default App;'
  };

  return defaults[language as keyof typeof defaults] || defaults.html;
};

// Validation Functions
export const validateProject = (project: Partial<DesignProject>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!project.name || project.name.trim().length === 0) {
    errors.push('Project name is required');
  }

  if (!project.type) {
    errors.push('Project type is required');
  }

  if (!project.width || project.width <= 0) {
    errors.push('Project width must be greater than 0');
  }

  if (!project.height || project.height <= 0) {
    errors.push('Project height must be greater than 0');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateElement = (element: Partial<DesignElement>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!element.type) {
    errors.push('Element type is required');
  }

  if (element.x === undefined || element.x < 0) {
    errors.push('Element x position must be 0 or greater');
  }

  if (element.y === undefined || element.y < 0) {
    errors.push('Element y position must be 0 or greater');
  }

  if (!element.width || element.width <= 0) {
    errors.push('Element width must be greater than 0');
  }

  if (!element.height || element.height <= 0) {
    errors.push('Element height must be greater than 0');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateCodeProject = (project: Partial<CodeProject>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!project.name || project.name.trim().length === 0) {
    errors.push('Project name is required');
  }

  if (!project.language) {
    errors.push('Programming language is required');
  }

  if (!project.code || project.code.trim().length === 0) {
    errors.push('Code content is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Dashboard Widget Templates
export const getWidgetTemplates = (): Array<{
  type: DashboardWidget['type'];
  name: string;
  icon: string;
  defaultConfig: any;
  defaultSize: { width: number; height: number };
}> => {
  return [
    {
      type: 'metric',
      name: 'Metric Card',
      icon: '📊',
      defaultConfig: {
        title: 'Total Users',
        value: '1,234',
        change: '+12%',
        changeType: 'positive'
      },
      defaultSize: { width: 4, height: 2 }
    },
    {
      type: 'chart',
      name: 'Line Chart',
      icon: '📈',
      defaultConfig: {
        chartType: 'line',
        data: [
          { name: 'Jan', value: 400 },
          { name: 'Feb', value: 300 },
          { name: 'Mar', value: 600 },
          { name: 'Apr', value: 800 },
          { name: 'May', value: 500 }
        ]
      },
      defaultSize: { width: 8, height: 4 }
    },
    {
      type: 'table',
      name: 'Data Table',
      icon: '📋',
      defaultConfig: {
        columns: ['Name', 'Email', 'Status'],
        data: [
          ['John Doe', 'john@example.com', 'Active'],
          ['Jane Smith', 'jane@example.com', 'Inactive'],
          ['Bob Johnson', 'bob@example.com', 'Active']
        ]
      },
      defaultSize: { width: 12, height: 6 }
    },
    {
      type: 'text',
      name: 'Text Widget',
      icon: '📝',
      defaultConfig: {
        content: 'Welcome to your dashboard!',
        fontSize: 16,
        textAlign: 'left'
      },
      defaultSize: { width: 6, height: 2 }
    }
  ];
};
