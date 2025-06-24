import React, { useEffect, useState } from 'react';
import { AcademicCapIcon, ChartBarIcon, ChatBubbleLeftEllipsisIcon, CogIcon } from '../icons';

interface AIAssistantWidgetProps {
  userRole?: string;
  moduleContext?: string;
  compact?: boolean;
}

interface AIMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AIInsight {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  actionable: boolean;
}

export const AIAssistantWidget: React.FC<AIAssistantWidgetProps> = ({ 
  userRole = 'admin', 
  moduleContext = 'school',
  compact = false 
}) => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'insights' | 'recommendations'>('chat');

  // Mock AI insights based on module context
  const mockInsights: Record<string, AIInsight[]> = {
    school: [
      {
        id: '1',
        title: 'Attendance Rate Improvement',
        description: 'Student attendance has increased by 5% this month. Consider implementing the new morning assembly program school-wide.',
        priority: 'high',
        category: 'Academic Performance',
        actionable: true
      },
      {
        id: '2',
        title: 'Budget Optimization',
        description: 'AI analysis suggests reallocating 15% of the technology budget to teacher training for better ROI.',
        priority: 'medium',
        category: 'Financial',
        actionable: true
      }
    ],
    student: [
      {
        id: '1',
        title: 'Learning Gap Detection',
        description: '23 students in Grade 8 Math show signs of struggling with algebra concepts. Recommend additional support.',
        priority: 'high',
        category: 'Academic Support',
        actionable: true
      }
    ],
    teacher: [
      {
        id: '1',
        title: 'Grading Efficiency',
        description: 'AI-assisted grading could save teachers 4 hours per week. 85% accuracy rate achieved in pilot program.',
        priority: 'medium',
        category: 'Productivity',
        actionable: true
      }
    ],
    parent: [
      {
        id: '1',
        title: 'Communication Optimization',
        description: 'Parents respond 40% faster to SMS notifications compared to emails. Consider adjusting communication strategy.',
        priority: 'medium',
        category: 'Communication',
        actionable: true
      }
    ],
    marketing: [
      {
        id: '1',
        title: 'Enrollment Prediction',
        description: 'AI models predict 15% increase in enrollment applications for next semester based on current campaign performance.',
        priority: 'high',
        category: 'Enrollment',
        actionable: false
      }
    ],
    finance: [
      {
        id: '1',
        title: 'Cost Reduction Opportunity',
        description: 'Switching to digital textbooks could save $25,000 annually while improving student engagement by 20%.',
        priority: 'high',
        category: 'Cost Optimization',
        actionable: true
      }
    ]
  };

  useEffect(() => {
    setInsights(mockInsights[moduleContext] || mockInsights.school);
    // Personalized welcome message using userRole
    const roleLabel = userRole.charAt(0).toUpperCase() + userRole.slice(1);
    const welcomeMessage: AIMessage = {
      id: '1',
      type: 'assistant',
      content: `Hello, ${roleLabel}! I'm your AI assistant for ${moduleContext} management. How can I help you today?`,
      timestamp: new Date(),
      suggestions: [
        'Show me performance analytics',
        'Generate a report',
        'Suggest improvements',
        'Help with planning'
      ]
    };
    setMessages([welcomeMessage]);
  }, [moduleContext, userRole]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateAIResponse(inputMessage, moduleContext, userRole),
        timestamp: new Date(),
        suggestions: [
          'Tell me more',
          'Show related data',
          'Create action plan',
          'Export report'
        ]
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  // Enhance: Use userRole in AI response generation
  const generateAIResponse = (input: string, context: string, role: string): string => {
    const responses: Record<string, string[]> = {
      school: [
        `As an AI for ${role}, I recommend focusing on improving student engagement through technology integration. You asked: "${input}"`,
        `Your school's performance metrics show strong growth in academic achievement. Consider expanding successful programs for ${role}s. (You said: "${input}")`,
        `I've analyzed your operational data and identified opportunities for cost optimization while maintaining quality for ${role}s. (Input: "${input}")`
      ],
      student: [
        `I've identified learning patterns that suggest personalized study plans could improve outcomes by 25% for ${role}s. (You asked: "${input}")`,
        `Based on assessment data, these students would benefit from additional support in specific subject areas for ${role}s. (Input: "${input}")`,
        `The AI learning analytics show promising trends in student engagement and comprehension for ${role}s. (You mentioned: "${input}")`
      ],
      teacher: [
        `AI-powered lesson planning could save you 3 hours per week while improving student outcomes for ${role}s. (You asked: "${input}")`,
        `Your teaching effectiveness metrics are excellent. Consider sharing your methods with other faculty ${role}s. (Input: "${input}")`,
        `I recommend these evidence-based strategies to enhance classroom engagement for ${role}s. (You said: "${input}")`
      ]
    };
    const contextResponses = responses[context] || responses.school;
    return contextResponses[Math.floor(Math.random() * contextResponses.length)];
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  if (compact) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-4 border border-slate-700/50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-200">AI Assistant</h3>
          <AcademicCapIcon className="w-5 h-5 text-purple-400" />
        </div>
        
        <div className="space-y-3">
          <div className="text-sm text-slate-300">
            {insights.length} AI insights available
          </div>
          
          <div className="space-y-2">
            {insights.slice(0, 2).map(insight => (
              <div key={insight.id} className="p-2 bg-slate-700/30 rounded text-xs">
                <div className="font-medium text-slate-200">{insight.title}</div>
                <div className="text-slate-400 line-clamp-2">{insight.description}</div>
              </div>
            ))}
          </div>
          
          <button className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors">
            Open AI Assistant
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-200">AI Assistant</h2>
          <p className="text-slate-400 text-sm">Intelligent insights and recommendations for {moduleContext}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-500">Context:</span>
          <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded capitalize">
            {moduleContext}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-slate-700/30 rounded-lg p-1">
        {[
          { id: 'chat', label: 'Chat', icon: ChatBubbleLeftEllipsisIcon },
          { id: 'insights', label: 'Insights', icon: ChartBarIcon },
          { id: 'recommendations', label: 'Recommendations', icon: CogIcon }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id 
                ? 'bg-purple-600 text-white' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'chat' && (
        <div className="space-y-4">
          {/* Messages */}
          <div className="h-64 overflow-y-auto space-y-3 p-3 bg-slate-700/20 rounded-lg">
            {messages.map(message => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs p-3 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-slate-600 text-slate-200'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  {message.suggestions && (
                    <div className="mt-2 space-y-1">
                      {message.suggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="block w-full text-left text-xs p-1 bg-slate-500/30 hover:bg-slate-500/50 rounded transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-600 text-slate-200 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything..."
              className="flex-1 bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="space-y-4">
          {insights.map(insight => {
            let priorityClass = '';
            if (insight.priority === 'high') priorityClass = 'bg-red-500/20 text-red-400';
            else if (insight.priority === 'medium') priorityClass = 'bg-yellow-500/20 text-yellow-400';
            else priorityClass = 'bg-green-500/20 text-green-400';
            return (
              <div key={insight.id} className="p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-slate-200">{insight.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${priorityClass}`}>
                    {insight.priority}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-3">{insight.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{insight.category}</span>
                  {insight.actionable && (
                    <button className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded transition-colors">
                      Take Action
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'recommendations' && (
        <div className="space-y-4">
          <div className="text-center py-8">
            <AcademicCapIcon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-200 mb-2">AI Recommendations</h3>
            <p className="text-slate-400 text-sm">
              Personalized recommendations based on your {moduleContext} data and best practices.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-700/30 rounded-lg">
              <h4 className="font-medium text-slate-200 mb-2">Performance Optimization</h4>
              <p className="text-slate-400 text-sm">AI suggests 3 areas for improvement based on current metrics.</p>
            </div>
            <div className="p-4 bg-slate-700/30 rounded-lg">
              <h4 className="font-medium text-slate-200 mb-2">Resource Allocation</h4>
              <p className="text-slate-400 text-sm">Optimize resource distribution for maximum impact.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
