import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PlatformSession, TestStatus, PlatformType } from '../types';
import { Monitor, FileText, Globe, Chrome, LayoutGrid } from 'lucide-react';

interface DashboardProps {
  sessions: PlatformSession[];
  onSelectPlatform: (id: PlatformType) => void;
}

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#cbd5e1']; // Green, Red, Amber, Slate

const Dashboard: React.FC<DashboardProps> = ({ sessions, onSelectPlatform }) => {
  
  // Calculate aggregate stats
  const totalPassed = sessions.reduce((acc, s) => acc + s.passedTests, 0);
  const totalFailed = sessions.reduce((acc, s) => acc + s.failedTests, 0);
  const totalPending = sessions.reduce((acc, s) => acc + (s.totalTests - s.passedTests - s.failedTests), 0);
  
  const chartData = [
    { name: 'Passed', value: totalPassed },
    { name: 'Failed', value: totalFailed },
    { name: 'Pending', value: totalPending },
  ];

  const getIcon = (type: PlatformType) => {
    switch (type) {
      case PlatformType.CHROME: return <Chrome className="w-6 h-6 text-blue-500" />;
      case PlatformType.EDGE: return <Monitor className="w-6 h-6 text-sky-600" />;
      case PlatformType.WORD: return <FileText className="w-6 h-6 text-blue-800" />;
      case PlatformType.DOCS: return <FileText className="w-6 h-6 text-yellow-500" />;
      case PlatformType.WEB: return <Globe className="w-6 h-6 text-purple-600" />;
      default: return <LayoutGrid />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Summary Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-1">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Overall Quality Status</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center mt-2 text-sm text-slate-500">
            Total Tests Executed: {totalPassed + totalFailed}
          </div>
        </div>

        {/* Platform Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => onSelectPlatform(session.id)}
              className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-200 transition-all text-left flex flex-col justify-between"
            >
              <div className="flex justify-between items-start w-full mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    {getIcon(session.id)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">{session.name}</h3>
                    <p className="text-xs text-slate-500">Updated: {new Date(session.lastUpdated).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  session.failedTests > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                }`}>
                  {session.failedTests > 0 ? `${session.failedTests} Issues` : 'Healthy'}
                </div>
              </div>

              <div className="w-full">
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Progress</span>
                  <span>{Math.round(session.progress)}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${session.progress}%` }}
                  />
                </div>
                <div className="mt-3 flex space-x-4 text-xs">
                  <span className="text-green-600 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                    {session.passedTests} Pass
                  </span>
                  <span className="text-red-600 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>
                    {session.failedTests} Fail
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
