import React, { useState } from 'react';
import { PlatformSession, TestStatus } from '../types';
import { CheckCircle, XCircle, AlertCircle, ArrowLeft, Plus, BookOpen, Loader2, Copy } from 'lucide-react';
// Note: In a real scenario, rename geminiService.ts to mockData.ts
import { getSampleTestCases } from '../services/geminiService';

interface TestSessionProps {
  session: PlatformSession;
  onBack: () => void;
  onUpdateStatus: (testId: string, status: TestStatus) => void;
  onAddTestCase: (text: string) => void;
}

const TestSession: React.FC<TestSessionProps> = ({ session, onBack, onUpdateStatus, onAddTestCase }) => {
  const [newCaseText, setNewCaseText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmitManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCaseText.trim()) {
      onAddTestCase(newCaseText);
      setNewCaseText('');
    }
  };

  const handleLoadTemplates = async () => {
    setLoading(true);
    try {
      const templates = await getSampleTestCases('complex');
      templates.forEach(text => onAddTestCase(text));
    } catch (error) {
      console.error("Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: TestStatus) => {
    switch (status) {
      case TestStatus.PASSED: return 'bg-green-100 text-green-700 border-green-200';
      case TestStatus.FAILED: return 'bg-red-100 text-red-700 border-red-200';
      case TestStatus.BLOCKED: return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-10 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>
        <div className="flex items-center space-x-3">
          <h2 className="text-2xl font-bold text-slate-800">{session.name}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Manual Add Section */}
        <div className="md:col-span-2 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <form onSubmit={handleSubmitManual} className="flex gap-2">
            <input 
              type="text" 
              value={newCaseText}
              onChange={(e) => setNewCaseText(e.target.value)}
              placeholder="Add a new test case description..."
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button 
              type="submit"
              className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center whitespace-nowrap"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Case
            </button>
          </form>
        </div>

        {/* Quick Templates */}
        <div className="md:col-span-1">
          <button
            onClick={handleLoadTemplates}
            disabled={loading}
            className="w-full h-full px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-xl hover:bg-indigo-100 transition-colors flex items-center justify-center font-medium"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <BookOpen className="w-4 h-4 mr-2" />
            )}
            {loading ? 'Loading...' : 'Load Sample Data'}
          </button>
        </div>
      </div>

      {/* Test Cases List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800">Checklist ({session.testCases.length})</h3>
        
        {session.testCases.map((test) => (
          <div key={test.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-2 py-0.5 text-xs font-medium rounded border ${getStatusColor(test.status)}`}>
                  {test.status}
                </span>
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  {test.category}
                </span>
              </div>
              <p className="text-slate-800 font-medium text-lg leading-relaxed font-georgian">
                {test.sampleText || test.description}
              </p>
              
              {!test.sampleText && (
                 <p className="text-sm text-slate-500 mt-1">Expected: {test.expectedResult}</p>
              )}
              
              {/* Copy functionality for sample text */}
              {(test.sampleText) && (
                <div className="mt-2 flex items-center space-x-4">
                    <p className="text-sm text-slate-500">Sample input data</p>
                    <button 
                    onClick={() => navigator.clipboard.writeText(test.sampleText!)}
                    className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center font-medium"
                    >
                    <Copy className="w-3 h-3 mr-1" /> Copy
                    </button>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => onUpdateStatus(test.id, TestStatus.PASSED)}
                className={`p-2 rounded-lg transition-colors ${
                  test.status === TestStatus.PASSED 
                    ? 'bg-green-100 text-green-700' 
                    : 'hover:bg-green-50 text-slate-400 hover:text-green-600'
                }`}
                title="Mark Passed"
              >
                <CheckCircle className="w-6 h-6" />
              </button>
              <button
                onClick={() => onUpdateStatus(test.id, TestStatus.FAILED)}
                className={`p-2 rounded-lg transition-colors ${
                  test.status === TestStatus.FAILED 
                    ? 'bg-red-100 text-red-700' 
                    : 'hover:bg-red-50 text-slate-400 hover:text-red-600'
                }`}
                title="Mark Failed"
              >
                <XCircle className="w-6 h-6" />
              </button>
              <button
                onClick={() => onUpdateStatus(test.id, TestStatus.BLOCKED)}
                className={`p-2 rounded-lg transition-colors ${
                  test.status === TestStatus.BLOCKED 
                    ? 'bg-orange-100 text-orange-700' 
                    : 'hover:bg-orange-50 text-slate-400 hover:text-orange-600'
                }`}
                title="Mark Blocked"
              >
                <AlertCircle className="w-6 h-6" />
              </button>
            </div>
          </div>
        ))}

        {session.testCases.length === 0 && (
          <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
            No test cases found. Add manually or load sample data.
          </div>
        )}
      </div>
    </div>
  );
};

export default TestSession;