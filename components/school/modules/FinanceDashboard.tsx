import React, { useState, useEffect } from 'react';
import { School, FinanceRecord, getFinanceRecords } from '../../../services/schoolService';
import {
  CreditCardIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  ExclamationCircleIcon,
  AcademicCapIcon,
  CogIcon
} from '../../../components/icons';
import { CommonServicesWidget } from '../CommonServicesWidget';
import { IslamicResourcesWidget } from '../IslamicResourcesWidget';
import { AIAssistantWidget } from '../AIAssistantWidget';

interface FinanceDashboardProps {
  schools: School[];
}

export const FinanceDashboard: React.FC<FinanceDashboardProps> = ({ schools }) => {
  const [financeRecords, setFinanceRecords] = useState<FinanceRecord[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(schools[0] || null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  useEffect(() => {
    const loadFinanceRecords = async () => {
      if (!selectedSchool) return;
      
      setIsLoading(true);
      try {
        const recordsData = await getFinanceRecords(selectedSchool.id);
        setFinanceRecords(recordsData);
      } catch (error) {
        console.error('Error loading finance records:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFinanceRecords();
  }, [selectedSchool]);

  const filteredRecords = financeRecords.filter(record => {
    const matchesSearch = record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.reference?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || record.type === filterType;
    return matchesSearch && matchesType;
  });

  const StatCard = ({ title, value, subtitle, icon: Icon, color }: any) => (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-4 border border-slate-700/50">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          <p className="text-slate-500 text-xs">{subtitle}</p>
        </div>
        <Icon className={`w-8 h-8 ${color}`} />
      </div>
    </div>
  );

  const FinanceRecordCard = ({ record }: { record: FinanceRecord }) => (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-4 border border-slate-700/50 hover:border-slate-600 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            record.type === 'income' 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-red-500/20 text-red-400'
          }`}>
            {record.type === 'income' ? (
              <ArrowTrendingUpIcon className="w-5 h-5" />
            ) : (
              <ArrowTrendingDownIcon className="w-5 h-5" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-200">{record.description}</h3>
              <span className={`text-lg font-bold ${
                record.type === 'income' ? 'text-green-400' : 'text-red-400'
              }`}>
                {record.type === 'income' ? '+' : '-'}${record.amount.toLocaleString()}
              </span>
            </div>
            <p className="text-slate-400 text-sm">{record.category}</p>
            <p className="text-slate-500 text-xs">{new Date(record.date).toLocaleDateString()}</p>
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-4">
                {record.paymentMethod && (
                  <span className="text-xs text-slate-400">{record.paymentMethod}</span>
                )}
                {record.reference && (
                  <span className="text-xs text-slate-500">Ref: {record.reference}</span>
                )}
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                record.status === 'completed' 
                  ? 'bg-green-500/20 text-green-400' 
                  : record.status === 'pending'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {record.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const getFinanceStats = () => {
    const totalIncome = financeRecords
      .filter(r => r.type === 'income' && r.status === 'completed')
      .reduce((sum, r) => sum + r.amount, 0);
    
    const totalExpenses = financeRecords
      .filter(r => r.type === 'expense' && r.status === 'completed')
      .reduce((sum, r) => sum + r.amount, 0);
    
    const netProfit = totalIncome - totalExpenses;
    const pendingTransactions = financeRecords.filter(r => r.status === 'pending').length;
    
    // Category breakdown
    const incomeCategories = financeRecords
      .filter(r => r.type === 'income')
      .reduce((acc, r) => {
        acc[r.category] = (acc[r.category] || 0) + r.amount;
        return acc;
      }, {} as Record<string, number>);
    
    const expenseCategories = financeRecords
      .filter(r => r.type === 'expense')
      .reduce((acc, r) => {
        acc[r.category] = (acc[r.category] || 0) + r.amount;
        return acc;
      }, {} as Record<string, number>);

    return { 
      totalIncome, 
      totalExpenses, 
      netProfit, 
      pendingTransactions,
      incomeCategories,
      expenseCategories
    };
  };

  const stats = getFinanceStats();

  return (
    <div className="space-y-6">
      {/* School Selector */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-4 border border-slate-700/50">
        <label className="block text-slate-300 text-sm font-medium mb-2">Select School</label>
        <select
          value={selectedSchool?.id || ''}
          onChange={(e) => setSelectedSchool(schools.find(s => s.id === e.target.value) || null)}
          className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {schools.map(school => (
            <option key={school.id} value={school.id}>{school.name}</option>
          ))}
        </select>
      </div>

      {/* Financial Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Income"
          value={`$${stats.totalIncome.toLocaleString()}`}
          subtitle="Completed transactions"
          icon={ArrowTrendingUpIcon}
          color="text-green-400"
        />
        <StatCard
          title="Total Expenses"
          value={`$${stats.totalExpenses.toLocaleString()}`}
          subtitle="Completed payments"
          icon={ArrowTrendingDownIcon}
          color="text-red-400"
        />
        <StatCard
          title="Net Profit"
          value={`$${stats.netProfit.toLocaleString()}`}
          subtitle={stats.netProfit >= 0 ? "Positive balance" : "Negative balance"}
          icon={ChartBarIcon}
          color={stats.netProfit >= 0 ? "text-green-400" : "text-red-400"}
        />
        <StatCard
          title="Pending"
          value={stats.pendingTransactions}
          subtitle="Awaiting processing"
          icon={ExclamationCircleIcon}
          color="text-yellow-400"
        />
      </div>

      {/* Income vs Expenses Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50">
          <h2 className="text-lg font-semibold text-slate-200 mb-4">Income Categories</h2>
          <div className="space-y-3">
            {Object.entries(stats.incomeCategories).map(([category, amount]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-slate-300">{category}</span>
                <span className="text-green-400 font-semibold">
                  ${amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50">
          <h2 className="text-lg font-semibold text-slate-200 mb-4">Expense Categories</h2>
          <div className="space-y-3">
            {Object.entries(stats.expenseCategories).map(([category, amount]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-slate-300">{category}</span>
                <span className="text-red-400 font-semibold">
                  ${amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-4 border border-slate-700/50">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search transactions by description, category, or reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
            className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Transactions</option>
            <option value="income">Income Only</option>
            <option value="expense">Expenses Only</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            Add Transaction
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-200">
            Transactions ({filteredRecords.length})
          </h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors">
              Export
            </button>
            <button className="px-3 py-1 text-sm bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors">
              Generate Report
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-12">
            <CreditCardIcon className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">No transactions found</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredRecords.map(record => (
              <FinanceRecordCard key={record.id} record={record} />
            ))}
          </div>
        )}
      </div>

      {/* AI Financial Tools */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">AI-Powered Financial Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg">
            <ChartBarIcon className="w-8 h-8 text-green-400 mb-2" />
            <h3 className="font-semibold text-slate-200">Cost Efficiency AI</h3>
            <p className="text-slate-400 text-sm">Smart cost optimization</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg">
            <ArrowTrendingUpIcon className="w-8 h-8 text-blue-400 mb-2" />
            <h3 className="font-semibold text-slate-200">Forecasting</h3>
            <p className="text-slate-400 text-sm">Advanced financial modeling</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg">
            <AcademicCapIcon className="w-8 h-8 text-purple-400 mb-2" />
            <h3 className="font-semibold text-slate-200">Grant Assistant</h3>
            <p className="text-slate-400 text-sm">AI grant writing help</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg">
            <CogIcon className="w-8 h-8 text-yellow-400 mb-2" />
            <h3 className="font-semibold text-slate-200">Audit Monitor</h3>
            <p className="text-slate-400 text-sm">Compliance tracking</p>
          </div>
        </div>
      </div>

      {/* Financial Aid & Grant Management */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Financial Aid & Grant Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-700/30 rounded-lg">
            <h3 className="font-medium text-slate-200 mb-2">Active Grants</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Education Grant 2024</span>
                <span className="text-green-400 text-sm">$50,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">STEM Initiative</span>
                <span className="text-blue-400 text-sm">$25,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Technology Fund</span>
                <span className="text-purple-400 text-sm">$15,000</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-700/30 rounded-lg">
            <h3 className="font-medium text-slate-200 mb-2">Financial Aid</h3>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">156</div>
              <div className="text-slate-400 text-sm">Students Assisted</div>
              <div className="text-slate-500 text-xs mt-1">$125,000 Total Aid</div>
            </div>
          </div>

          <div className="p-4 bg-slate-700/30 rounded-lg">
            <h3 className="font-medium text-slate-200 mb-2">Fundraising</h3>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">$85K</div>
              <div className="text-slate-400 text-sm">Raised This Year</div>
              <div className="text-slate-500 text-xs mt-1">Goal: $100K</div>
            </div>
          </div>
        </div>
      </div>

      {/* Investment & Endowment Tracker */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Investment & Endowment Tracker</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium text-slate-200">Investment Portfolio</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div>
                  <div className="text-slate-200">Education Bonds</div>
                  <div className="text-slate-500 text-sm">Low Risk</div>
                </div>
                <div className="text-right">
                  <div className="text-green-400">+2.5%</div>
                  <div className="text-slate-400 text-sm">$250K</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div>
                  <div className="text-slate-200">Growth Fund</div>
                  <div className="text-slate-500 text-sm">Medium Risk</div>
                </div>
                <div className="text-right">
                  <div className="text-blue-400">+5.2%</div>
                  <div className="text-slate-400 text-sm">$150K</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-slate-200">Endowment Fund</h3>
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <div className="text-3xl font-bold text-yellow-400">$1.2M</div>
              <div className="text-slate-400">Total Endowment</div>
              <div className="text-green-400 text-sm mt-1">+8.5% YoY Growth</div>
            </div>
          </div>
        </div>
      </div>

      {/* Common Services Integration */}
      <CommonServicesWidget userRole="finance" />

      {/* Islamic Resources */}
      <IslamicResourcesWidget compact={true} />

      {/* AI Assistant */}
      <AIAssistantWidget userRole="finance" moduleContext="finance" compact={true} />

      {/* Quick Actions */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
            <BanknotesIcon className="w-6 h-6 text-green-400" />
            <span className="text-slate-200">Record Payment</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
            <ChartBarIcon className="w-6 h-6 text-blue-400" />
            <span className="text-slate-200">Financial Reports</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
            <CreditCardIcon className="w-6 h-6 text-purple-400" />
            <span className="text-slate-200">Budget Planning</span>
          </button>
        </div>
      </div>
    </div>
  );
};
