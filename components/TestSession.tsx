import React, { useState } from 'react';
import { PlatformSession, TestStatus, TestCase } from '../types';
import { CheckCircle, XCircle, AlertCircle, ArrowLeft, Wand2, Copy, Loader2 } from 'lucide-react';
import { generateGeorgianTestCases } from '../services/geminiService';

interface TestSessionProps {
  session: PlatformSession;
  onBack: () => void;
  onUpdateStatus: (testId: string, status: TestStatus) => void;
  onAddTestCase: (text: string) => void;
}

const TestSession: React.FC<TestSessionProps> = ({ session, onBack, onUpdateStatus, onAddTestCase }) => {
  const [generating, setGenerating] = useState(false);

  const handleGenerateTests = async () => {
    setGenerating(true);
    const newCases = await generateGeorgianTestCases('complex');
    newCases.forEach(text => {
      onAddTestCase(text);
    });
    setGenerating(false);
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
          <h2 className="text-2xl font-bold text-slate-800">{session.name} Testing</h2>
        </div>
      </div>

      {/* AI Generator Section */}
      <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <h3 className="text-lg font-semibold text-indigo-900 flex items-center">
            <Wand2 className="w-5 h-5 mr-2" />
            AI Test Case Generator
          </h3>
          <p className="text-sm text-indigo-700 mt-1">
            Generate tricky Georgian sentences with intentional errors to verify spellcheck detection.
          </p>
        </div>
        <button
          onClick={handleGenerateTests}
          disabled={generating}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-colors flex items-center disabled:opacity-50"
        >
          {generating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
          {generating ? 'Generating...' : 'Generate Cases'}
        </button>
      </div>

      {/* Test Cases List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800">Test Cases ({session.testCases.length})</h3>
        
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
                {test.generatedText || test.description}
              </p>
              <p className="text-sm text-slate-500 mt-1">Expected: {test.expectedResult}</p>
              
              {/* Copy functionality for testing ease */}
              {(test.generatedText) && (
                <button 
                  onClick={() => navigator.clipboard.writeText(test.generatedText!)}
                  className="mt-2 text-xs text-indigo-600 hover:text-indigo-800 flex items-center"
                >
                  <Copy className="w-3 h-3 mr-1" /> Copy text to clipboard
                </button>
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
          <div className="text-center py-12 text-slate-400">
            No test cases yet. Use the AI Generator to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default TestSession;
