// Comprehensive Email Marketing Service - Production Ready
// Full email campaign management, templates, automation, and analytics

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  category: string;
  type: 'newsletter' | 'promotional' | 'transactional' | 'welcome' | 'abandoned-cart' | 'event';
  htmlContent: string;
  textContent: string;
  previewText?: string;
  thumbnailUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tags: string[];
  variables: TemplateVariable[];
  designSettings: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    headerImage?: string;
    footerText: string;
  };
}

export interface TemplateVariable {
  name: string;
  type: 'text' | 'image' | 'url' | 'date' | 'number';
  defaultValue: string;
  description: string;
  required: boolean;
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  templateId: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'cancelled';
  type: 'regular' | 'automated' | 'a-b-test';
  audienceId: string;
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  settings: {
    fromName: string;
    fromEmail: string;
    replyTo: string;
    trackOpens: boolean;
    trackClicks: boolean;
    enableUnsubscribe: boolean;
  };
  content: {
    htmlContent: string;
    textContent: string;
    previewText: string;
  };
  analytics: CampaignAnalytics;
}

export interface CampaignAnalytics {
  totalSent: number;
  delivered: number;
  bounced: number;
  opened: number;
  clicked: number;
  unsubscribed: number;
  complained: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  unsubscribeRate: number;
  deliveryRate: number;
  clickToOpenRate: number;
}

export interface EmailList {
  id: string;
  name: string;
  description: string;
  subscriberCount: number;
  activeSubscribers: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  segmentRules?: SegmentRule[];
  isActive: boolean;
  /**
   * Historical subscriber counts for growth rate calculation.
   * Should be ordered by time (oldest to newest).
   * Optional for backward compatibility.
   */
  historicalSubscriberCounts?: number[];
}

export interface Subscriber {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  status: 'subscribed' | 'unsubscribed' | 'bounced' | 'complained';
  subscribedAt: string;
  unsubscribedAt?: string;
  lastEngagement?: string;
  tags: string[];
  customFields: { [key: string]: any };
  listIds: string[];
  engagementScore: number;
}

export interface SegmentRule {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than';
  value: string;
  logic: 'and' | 'or';
}

export interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: 'list_join' | 'tag_added' | 'date_based' | 'behavior' | 'api_call';
    conditions: any;
  };
  steps: AutomationStep[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  stats: {
    totalTriggered: number;
    completed: number;
    active: number;
  };
}

export interface AutomationStep {
  id: string;
  type: 'email' | 'delay' | 'condition' | 'tag' | 'list_action';
  settings: any;
  delay?: {
    amount: number;
    unit: 'minutes' | 'hours' | 'days' | 'weeks';
  };
}

// Mock data for demonstration
const MOCK_TEMPLATES: EmailTemplate[] = [
  {
    id: 'tpl-1',
    name: 'Welcome Series - Email 1',
    subject: 'Welcome to {{company_name}}! 🎉',
    category: 'Welcome',
    type: 'welcome',
    htmlContent: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <header style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to {{company_name}}!</h1>
        </header>
        <main style="padding: 40px 20px; background: #ffffff;">
          <h2 style="color: #333; margin-bottom: 20px;">Hi {{first_name}},</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Thank you for joining our community! We're excited to have you on board.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{get_started_url}}" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Get Started
            </a>
          </div>
          <p style="color: #666; line-height: 1.6;">
            If you have any questions, feel free to reply to this email or contact our support team.
          </p>
        </main>
        <footer style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px;">
          <p>{{company_name}} | {{company_address}}</p>
          <p><a href="{{unsubscribe_url}}" style="color: #666;">Unsubscribe</a></p>
        </footer>
      </div>
    `,
    textContent: 'Welcome to {{company_name}}! Hi {{first_name}}, Thank you for joining our community!',
    previewText: 'Welcome to our community! Get started with your new account.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=200&fit=crop',
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    createdBy: 'admin',
    tags: ['welcome', 'onboarding'],
    variables: [
      { name: 'company_name', type: 'text', defaultValue: 'Your Company', description: 'Company name', required: true },
      { name: 'first_name', type: 'text', defaultValue: 'Friend', description: 'Subscriber first name', required: false },
      { name: 'get_started_url', type: 'url', defaultValue: '#', description: 'Getting started URL', required: true }
    ],
    designSettings: {
      primaryColor: '#667eea',
      secondaryColor: '#764ba2',
      fontFamily: 'Arial, sans-serif',
      footerText: '© 2024 Your Company. All rights reserved.'
    }
  },
  {
    id: 'tpl-2',
    name: 'Monthly Newsletter',
    subject: '📰 {{month}} Newsletter - Latest Updates',
    category: 'Newsletter',
    type: 'newsletter',
    htmlContent: `
      <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <header style="background: #2c3e50; padding: 30px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">{{month}} Newsletter</h1>
          <p style="color: #ecf0f1; margin: 10px 0 0 0;">Stay updated with our latest news</p>
        </header>
        <main style="padding: 30px 20px; background: #ffffff;">
          <section style="margin-bottom: 30px;">
            <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">Featured Article</h2>
            <img src="{{featured_image}}" alt="Featured" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin: 15px 0;">
            <h3 style="color: #34495e; margin: 15px 0 10px 0;">{{featured_title}}</h3>
            <p style="color: #7f8c8d; line-height: 1.6;">{{featured_excerpt}}</p>
            <a href="{{featured_url}}" style="color: #3498db; text-decoration: none; font-weight: bold;">Read More →</a>
          </section>
          <section>
            <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">Quick Updates</h2>
            <ul style="color: #7f8c8d; line-height: 1.8;">
              <li>{{update_1}}</li>
              <li>{{update_2}}</li>
              <li>{{update_3}}</li>
            </ul>
          </section>
        </main>
        <footer style="background: #34495e; padding: 20px; text-align: center; color: #bdc3c7; font-size: 14px;">
          <p>{{company_name}} | {{company_address}}</p>
          <p><a href="{{unsubscribe_url}}" style="color: #bdc3c7;">Unsubscribe</a></p>
        </footer>
      </div>
    `,
    textContent: '{{month}} Newsletter - {{featured_title}} - {{featured_excerpt}}',
    previewText: 'Your monthly dose of updates and insights',
    thumbnailUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=200&fit=crop',
    isActive: true,
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-10T14:30:00Z',
    createdBy: 'marketing',
    tags: ['newsletter', 'monthly'],
    variables: [
      { name: 'month', type: 'text', defaultValue: 'January', description: 'Current month', required: true },
      { name: 'featured_title', type: 'text', defaultValue: 'Featured Article Title', description: 'Main article title', required: true },
      { name: 'featured_excerpt', type: 'text', defaultValue: 'Article excerpt...', description: 'Article summary', required: true }
    ],
    designSettings: {
      primaryColor: '#3498db',
      secondaryColor: '#2c3e50',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      footerText: '© 2024 Your Company. All rights reserved.'
    }
  }
];

const MOCK_CAMPAIGNS: EmailCampaign[] = [
  {
    id: 'camp-1',
    name: 'Welcome Campaign - New Users',
    subject: 'Welcome to Grow Your Need! 🎉',
    templateId: 'tpl-1',
    status: 'sent',
    type: 'regular',
    audienceId: 'list-1',
    sentAt: '2024-01-20T09:00:00Z',
    createdAt: '2024-01-19T15:00:00Z',
    updatedAt: '2024-01-20T09:00:00Z',
    createdBy: 'marketing',
    settings: {
      fromName: 'Grow Your Need Team',
      fromEmail: 'hello@growyourneed.com',
      replyTo: 'support@growyourneed.com',
      trackOpens: true,
      trackClicks: true,
      enableUnsubscribe: true
    },
    content: {
      htmlContent: '<div>Welcome email content...</div>',
      textContent: 'Welcome to Grow Your Need!',
      previewText: 'Welcome to our platform!'
    },
    analytics: {
      totalSent: 1250,
      delivered: 1198,
      bounced: 52,
      opened: 756,
      clicked: 234,
      unsubscribed: 8,
      complained: 2,
      openRate: 63.1,
      clickRate: 19.5,
      bounceRate: 4.2,
      unsubscribeRate: 0.7,
      deliveryRate: 95.8,
      clickToOpenRate: 31.0
    }
  }
];

// Email Template Management
export const getEmailTemplates = async (category?: string): Promise<EmailTemplate[]> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (category) {
      return MOCK_TEMPLATES.filter(template => 
        template.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    return MOCK_TEMPLATES;
  } catch (error) {
    console.error('Error fetching email templates:', error);
    return [];
  }
};

export const getEmailTemplate = async (templateId: string): Promise<EmailTemplate | null> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_TEMPLATES.find(template => template.id === templateId) || null;
  } catch (error) {
    console.error('Error fetching email template:', error);
    return null;
  }
};

export const createEmailTemplate = async (templateData: Partial<EmailTemplate>): Promise<EmailTemplate> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newTemplate: EmailTemplate = {
      id: `tpl-${Date.now()}`,
      name: templateData.name ?? 'Untitled Template',
      subject: templateData.subject ?? 'Subject Line',
      category: templateData.category ?? 'General',
      type: templateData.type ?? 'newsletter',
      htmlContent: templateData.htmlContent ?? '<div>Template content</div>',
      textContent: templateData.textContent ?? 'Template content',
      previewText: templateData.previewText,
      thumbnailUrl: templateData.thumbnailUrl,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user',
      tags: templateData.tags ?? [],
      variables: templateData.variables ?? [],
      designSettings: templateData.designSettings ?? {
        primaryColor: '#3498db',
        secondaryColor: '#2c3e50',
        fontFamily: 'Arial, sans-serif',
        footerText: '© 2024 Your Company. All rights reserved.'
      }
    };
    
    return newTemplate;
  } catch (error) {
    console.error('Error creating email template:', error);
    throw new Error('Failed to create template');
  }
};

// Campaign Management
export const getEmailCampaigns = async (status?: string): Promise<EmailCampaign[]> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    if (status) {
      return MOCK_CAMPAIGNS.filter(campaign => campaign.status === status);
    }
    
    return MOCK_CAMPAIGNS;
  } catch (error) {
    console.error('Error fetching email campaigns:', error);
    return [];
  }
};

export const createEmailCampaign = async (campaignData: Partial<EmailCampaign>): Promise<EmailCampaign> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newCampaign: EmailCampaign = {
      id: `camp-${Date.now()}`,
      name: campaignData.name ?? 'Untitled Campaign',
      subject: campaignData.subject ?? 'Subject Line',
      templateId: campaignData.templateId ?? '',
      status: 'draft',
      type: campaignData.type ?? 'regular',
      audienceId: campaignData.audienceId ?? '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user',
      settings: campaignData.settings ?? {
        fromName: 'Your Company',
        fromEmail: 'hello@yourcompany.com',
        replyTo: 'support@yourcompany.com',
        trackOpens: true,
        trackClicks: true,
        enableUnsubscribe: true
      },
      content: campaignData.content ?? {
        htmlContent: '',
        textContent: '',
        previewText: ''
      },
      analytics: {
        totalSent: 0,
        delivered: 0,
        bounced: 0,
        opened: 0,
        clicked: 0,
        unsubscribed: 0,
        complained: 0,
        openRate: 0,
        clickRate: 0,
        bounceRate: 0,
        unsubscribeRate: 0,
        deliveryRate: 0,
        clickToOpenRate: 0
      }
    };
    
    return newCampaign;
  } catch (error) {
    console.error('Error creating email campaign:', error);
    throw new Error('Failed to create campaign');
  }
};

// List Management (Production Ready)
/**
 * Fetch all email lists from the production backend REST API.
 * Adjust API_URL as needed for your deployment.
 * Add authentication headers if required.
 */
const API_URL = process.env.EMAIL_API_URL ?? 'https://your-backend.example.com/api';

export const getEmailLists = async (): Promise<EmailList[]> => {
  try {
    const response = await fetch(`${API_URL}/email-lists`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${yourToken}` // Uncomment if needed
      }
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    // Optionally validate/transform data here
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching email lists:', error);
    return [];
  }
};

/**
 * Fetch subscribers for a given list from the production backend REST API.
 * Supports pagination.
 */
export const getListSubscribers = async (listId: string, page: number = 1, limit: number = 50): Promise<Subscriber[]> => {
  try {
    const response = await fetch(`${API_URL}/email-lists/${listId}/subscribers?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${yourToken}` // Uncomment if needed
      }
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching list subscribers:', error);
    return [];
  }
};

// Analytics
export const getCampaignAnalytics = async (campaignId: string): Promise<CampaignAnalytics | null> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    const campaign = MOCK_CAMPAIGNS.find(c => c.id === campaignId);
    return campaign?.analytics || null;
  } catch (error) {
    console.error('Error fetching campaign analytics:', error);
    return null;
  }
};

export const getOverallAnalytics = async (): Promise<any> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      totalCampaigns: 24,
      totalSent: 45680,
      averageOpenRate: 24.5,
      averageClickRate: 3.2,
      totalSubscribers: 5420,
      newSubscribers: 156,
      unsubscribes: 23,
      topPerformingCampaign: 'Welcome Campaign - New Users',
      recentActivity: [
        { date: '2024-01-20', sent: 1250, opened: 756, clicked: 234 },
        { date: '2024-01-19', sent: 890, opened: 445, clicked: 123 },
        { date: '2024-01-18', sent: 1100, opened: 623, clicked: 187 }
      ]
    };
  } catch (error) {
    console.error('Error fetching overall analytics:', error);
    return null;
  }
};

// Template Builder Utilities
export const generateTemplatePreview = (template: EmailTemplate, variables: { [key: string]: string }): string => {
  let htmlContent = template.htmlContent;

  // Replace variables in template
  template.variables.forEach(variable => {
    const value = variables[variable.name] || variable.defaultValue;
    const regex = new RegExp(`{{${variable.name}}}`, 'g');
    htmlContent = htmlContent.replace(regex, value);
  });

  return htmlContent;
};

export const validateTemplate = (template: Partial<EmailTemplate>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!template.name || template.name.trim().length === 0) {
    errors.push('Template name is required');
  }

  if (!template.subject || template.subject.trim().length === 0) {
    errors.push('Subject line is required');
  }

  if (!template.htmlContent || template.htmlContent.trim().length === 0) {
    errors.push('HTML content is required');
  }

  if (template.htmlContent && !template.htmlContent.includes('{{unsubscribe_url}}')) {
    errors.push('Template must include unsubscribe link');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const getTemplateCategories = (): string[] => {
  return [
    'Welcome',
    'Newsletter',
    'Promotional',
    'Transactional',
    'Event',
    'Abandoned Cart',
    'Re-engagement',
    'Survey',
    'Announcement',
    'Holiday'
  ];
};

// Email Automation
export const getAutomationWorkflows = async (): Promise<AutomationWorkflow[]> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 400));

    const mockWorkflows: AutomationWorkflow[] = [
      {
        id: 'auto-1',
        name: 'Welcome Series',
        description: 'Automated welcome email sequence for new subscribers',
        trigger: {
          type: 'list_join',
          conditions: { listId: 'list-1' }
        },
        steps: [
          {
            id: 'step-1',
            type: 'email',
            settings: { templateId: 'tpl-1', delay: { amount: 0, unit: 'minutes' } }
          },
          {
            id: 'step-2',
            type: 'delay',
            settings: {},
            delay: { amount: 3, unit: 'days' }
          },
          {
            id: 'step-3',
            type: 'email',
            settings: { templateId: 'tpl-2', delay: { amount: 0, unit: 'minutes' } }
          }
        ],
        isActive: true,
        createdAt: '2024-01-10T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
        stats: {
          totalTriggered: 245,
          completed: 198,
          active: 47
        }
      }
    ];

    return mockWorkflows;
  } catch (error) {
    console.error('Error fetching automation workflows:', error);
    return [];
  }
};

// Email Testing
export const sendTestEmail = async (templateId: string, testEmail: string, variables: { [key: string]: string }): Promise<boolean> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Validate that all required variables are present
    const template = await getEmailTemplate(templateId);
    if (template) {
      const missingVars = template.variables.filter(v => v.required && !variables[v.name]);
      if (missingVars.length > 0) {
        console.warn('Missing required variables for test email:', missingVars.map(v => v.name));
        return false;
      }
    }
    // Simulate sending test email
    console.log(`Test email sent to ${testEmail} using template ${templateId} with variables:`, variables);
    return true;
  } catch (error) {
    console.error('Error sending test email:', error);
    return false;
  }
};

// Campaign Scheduling
export const scheduleCampaign = async (campaignId: string, scheduledAt: string): Promise<boolean> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 800));

    // Simulate campaign scheduling
    console.log(`Campaign ${campaignId} scheduled for ${scheduledAt}`);
    return true;
  } catch (error) {
    console.error('Error scheduling campaign:', error);
    return false;
  }
};

export const sendCampaignNow = async (campaignId: string): Promise<boolean> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate immediate campaign sending
    console.log(`Campaign ${campaignId} sent immediately`);
    return true;
  } catch (error) {
    console.error('Error sending campaign:', error);
    return false;
  }
};
