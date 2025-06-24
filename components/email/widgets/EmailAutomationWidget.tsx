// Email Automation Widget - Production Ready
// Automated email workflow management and monitoring

import React, { useState, useEffect } from 'react';
import { EmailDataCard } from '../EmailDataCard';
import { getAutomationWorkflows, AutomationWorkflow } from '../../../services/emailService';

export const EmailAutomationWidget: React.FC = () => {
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkflow, setSelectedWorkflow] = useState<AutomationWorkflow | null>(null);

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        setLoading(true);
        const workflowData = await getAutomationWorkflows();
        setWorkflows(workflowData);
      } catch (error) {
        console.error('Error fetching automation workflows:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflows();
  }, []);

  const getTriggerIcon = (triggerType: string) => {
    switch (triggerType) {
      case 'list_join': return '📝';
      case 'tag_added': return '🏷️';
      case 'date_based': return '📅';
      case 'behavior': return '👆';
      case 'api_call': return '🔗';
      default: return '⚡';
    }
  };

  const getTriggerLabel = (triggerType: string) => {
    switch (triggerType) {
      case 'list_join': return 'List Join';
      case 'tag_added': return 'Tag Added';
      case 'date_based': return 'Date Based';
      case 'behavior': return 'Behavior';
      case 'api_call': return 'API Call';
      default: return 'Unknown';
    }
  };

  const getStepIcon = (stepType: string) => {
    switch (stepType) {
      case 'email': return '📧';
      case 'delay': return '⏰';
      case 'condition': return '🔀';
      case 'tag': return '🏷️';
      case 'list_action': return '📋';
      default: return '⚙️';
    }
  };

  const getStepLabel = (stepType: string) => {
    switch (stepType) {
      case 'email': return 'Send Email';
      case 'delay': return 'Wait';
      case 'condition': return 'Condition';
      case 'tag': return 'Add/Remove Tag';
      case 'list_action': return 'List Action';
      default: return 'Action';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateCompletionRate = (workflow: AutomationWorkflow) => {
    if (workflow.stats.totalTriggered === 0) return 0;
    return (workflow.stats.completed / workflow.stats.totalTriggered) * 100;
  };

  return (
    <>
      <EmailDataCard 
        title="Email Automation" 
        footer={
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-pink-500 text-white rounded-md hover:bg-pink-400 text-xs font-semibold">
              Create Workflow
            </button>
            <button className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-400 text-xs font-semibold">
              Templates
            </button>
          </div>
        }
      >
        <div className="text-sm">
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {workflows.length > 0 ? (
                workflows.map(workflow => {
                  const completionRate = calculateCompletionRate(workflow);
                  
                  return (
                    <div 
                      key={workflow.id} 
                      className="p-3 bg-slate-700/50 rounded-md hover:bg-slate-700/70 transition-colors cursor-pointer"
                      onClick={() => setSelectedWorkflow(selectedWorkflow?.id === workflow.id ? null : workflow)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getTriggerIcon(workflow.trigger.type)}</span>
                          <div>
                            <h4 className="font-semibold text-pink-200">{workflow.name}</h4>
                            <p className="text-xs text-slate-400">{workflow.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {workflow.isActive ? (
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
                      
                      {/* Trigger Info */}
                      <div className="text-xs text-slate-400 mb-2">
                        <strong>Trigger:</strong> {getTriggerLabel(workflow.trigger.type)}
                      </div>
                      
                      {/* Workflow Stats */}
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-400">{workflow.stats.totalTriggered}</div>
                          <div className="text-xs text-slate-400">Triggered</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-400">{workflow.stats.completed}</div>
                          <div className="text-xs text-slate-400">Completed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-yellow-400">{workflow.stats.active}</div>
                          <div className="text-xs text-slate-400">Active</div>
                        </div>
                      </div>
                      
                      {/* Completion Rate */}
                      <div className="mb-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400">Completion Rate</span>
                          <span className="text-green-400">{completionRate.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-slate-600/50 rounded-full h-1.5">
                          <div 
                            className="bg-green-500 h-1.5 rounded-full transition-all"
                            style={{ width: `${completionRate}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
                        <span>Steps: {workflow.steps.length}</span>
                        <span>Updated: {formatDate(workflow.updatedAt)}</span>
                      </div>
                      
                      {/* Expanded Workflow Details */}
                      {selectedWorkflow?.id === workflow.id && (
                        <div className="mt-3 pt-3 border-t border-slate-600/50">
                          <h5 className="text-sm font-medium text-slate-300 mb-2">Workflow Steps</h5>
                          <div className="space-y-2">
                            {workflow.steps.map((step, index) => (
                              <div key={step.id} className="flex items-center gap-3 p-2 bg-slate-600/30 rounded">
                                <div className="flex items-center justify-center w-6 h-6 bg-slate-700 rounded-full text-xs font-medium">
                                  {index + 1}
                                </div>
                                <span className="text-lg">{getStepIcon(step.type)}</span>
                                <div className="flex-1">
                                  <div className="text-sm text-slate-300">{getStepLabel(step.type)}</div>
                                  {step.delay && (
                                    <div className="text-xs text-slate-400">
                                      Wait {step.delay.amount} {step.delay.unit}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex gap-2 mt-3">
                            <button className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-400">
                              Edit Workflow
                            </button>
                            <button className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-400">
                              View Analytics
                            </button>
                            <button className="px-2 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-400">
                              Duplicate
                            </button>
                            <button 
                              className={`px-2 py-1 rounded text-xs ${
                                workflow.isActive 
                                  ? 'bg-red-500 hover:bg-red-400 text-white' 
                                  : 'bg-green-500 hover:bg-green-400 text-white'
                              }`}
                            >
                              {workflow.isActive ? 'Pause' : 'Activate'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-slate-400">
                  <div className="text-4xl mb-2">⚡</div>
                  <p>No automation workflows found</p>
                  <p className="text-xs mt-1">Create your first automated email sequence</p>
                </div>
              )}
            </div>
          )}
        </div>
      </EmailDataCard>

      {/* Quick Automation Templates */}
      <div className="mt-4">
        <EmailDataCard title="Quick Start Templates">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button className="p-2 bg-slate-700/30 rounded-md hover:bg-slate-700/50 transition-colors text-left">
              <div className="flex items-center gap-2 mb-1">
                <span>👋</span>
                <span className="font-medium text-slate-300">Welcome Series</span>
              </div>
              <p className="text-slate-400">3-email welcome sequence</p>
            </button>
            
            <button className="p-2 bg-slate-700/30 rounded-md hover:bg-slate-700/50 transition-colors text-left">
              <div className="flex items-center gap-2 mb-1">
                <span>🛒</span>
                <span className="font-medium text-slate-300">Abandoned Cart</span>
              </div>
              <p className="text-slate-400">Recover lost sales</p>
            </button>
            
            <button className="p-2 bg-slate-700/30 rounded-md hover:bg-slate-700/50 transition-colors text-left">
              <div className="flex items-center gap-2 mb-1">
                <span>🎂</span>
                <span className="font-medium text-slate-300">Birthday Campaign</span>
              </div>
              <p className="text-slate-400">Automated birthday emails</p>
            </button>
            
            <button className="p-2 bg-slate-700/30 rounded-md hover:bg-slate-700/50 transition-colors text-left">
              <div className="flex items-center gap-2 mb-1">
                <span>🔄</span>
                <span className="font-medium text-slate-300">Re-engagement</span>
              </div>
              <p className="text-slate-400">Win back inactive users</p>
            </button>
          </div>
        </EmailDataCard>
      </div>
    </>
  );
};
