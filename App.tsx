import React, { useState } from 'react';
import { PlatformType, PlatformSession, TestStatus, TestCase } from './types';
import Dashboard from './components/Dashboard';
import TestSession from './components/TestSession';
import { Sparkles } from 'lucide-react';

// Initial Mock Data Structure
const INITIAL_SESSIONS: PlatformSession[] = [
  {
    id: PlatformType.CHROME,
    name: 'Chrome Extension',
    icon: 'chrome',
    progress: 33,
    totalTests: 3,
    passedTests: 1,
    failedTests: 0,
    lastUpdated: new Date().toISOString(),
    testCases: [
      { id: 'c1', category: 'UI/UX', description: 'Extension icon appears in toolbar', expectedResult: 'Icon visible', status: TestStatus.PASSED },
      { id: 'c2', category: 'Spelling', description: 'Highlight "გამარჯობა" (correct)', expectedResult: 'No red underline', status: TestStatus.PENDING },
      { id: 'c3', category: 'Spelling', description: 'Highlight "გამრჯობა" (incorrect)', expectedResult: 'Red underline shown', status: TestStatus.PENDING },
    ]
  },
  {
    id: PlatformType.EDGE,
    name: 'Edge Extension',
    icon: 'edge',
    progress: 0,
    totalTests: 2,
    passedTests: 0,
    failedTests: 0,
    lastUpdated: new Date().toISOString(),
    testCases: [
       { id: 'e1', category: 'Performance', description: 'Check memory usage on large page', expectedResult: '< 100MB', status: TestStatus.PENDING },
       { id: 'e2', category: 'Spelling', description: 'Real-time checking delay', expectedResult: '< 500ms', status: TestStatus.PENDING },
    ]
  },
  {
    id: PlatformType.WORD,
    name: 'Microsoft Word Add-in',
    icon: 'file-text',
    progress: 50,
    totalTests: 2,
    passedTests: 0,
    failedTests: 1,
    lastUpdated: new Date().toISOString(),
    testCases: [
      { id: 'w1', category: 'UI/UX', description: 'Sidebar loads correctly', expectedResult: 'Sidebar visible', status: TestStatus.FAILED, notes: 'Sidebar stuck loading' },
      { id: 'w2', category: 'Grammar', description: 'Check context menu suggestions', expectedResult: 'Suggestions appear', status: TestStatus.PENDING },
    ]
  },
  {
    id: PlatformType.DOCS,
    name: 'Google Docs Add-on',
    icon: 'file',
    progress: 0,
    totalTests: 1,
    passedTests: 0,
    failedTests: 0,
    lastUpdated: new Date().toISOString(),
    testCases: [
      { id: 'g1', category: 'Performance', description: 'Batch check 50 pages', expectedResult: 'Completed < 5s', status: TestStatus.PENDING },
    ]
  },
  {
    id: PlatformType.WEB,
    name: 'Enagram.ai Website',
    icon: 'globe',
    progress: 100,
    totalTests: 2,
    passedTests: 2,
    failedTests: 0,
    lastUpdated: new Date().toISOString(),
    testCases: [
      { id: 'wb1', category: 'Spelling', description: 'Input text area accepts Georgian', expectedResult: 'Text input works', status: TestStatus.PASSED },
      { id: 'wb2', category: 'UI/UX', description: 'Mobile responsiveness', expectedResult: 'Layout adapts', status: TestStatus.PASSED },
    ]
  }
];

const App: React.FC = () => {
  const [sessions, setSessions] = useState<PlatformSession[]>(INITIAL_SESSIONS);
  const [activePlatformId, setActivePlatformId] = useState<PlatformType | null>(null);

  const activeSession = sessions.find(s => s.id === activePlatformId);

  const handleUpdateStatus = (testId: string, status: TestStatus) => {
    if (!activePlatformId) return;

    setSessions(prev => prev.map(session => {
      if (session.id !== activePlatformId) return session;

      const updatedTestCases = session.testCases.map(tc => 
        tc.id === testId ? { ...tc, status } : tc
      );

      const passed = updatedTestCases.filter(t => t.status === TestStatus.PASSED).length;
      const failed = updatedTestCases.filter(t => t.status === TestStatus.FAILED).length;
      const total = updatedTestCases.length;
      const progress = total === 0 ? 0 : ((passed + failed) / total) * 100; // Count failed as "processed" for progress

      return {
        ...session,
        testCases: updatedTestCases,
        passedTests: passed,
        failedTests: failed,
        totalTests: total,
        progress,
        lastUpdated: new Date().toISOString()
      };
    }));
  };

  const handleAddTestCase = (text: string) => {
    if (!activePlatformId) return;

    const newCase: TestCase = {
      id: Date.now().toString() + Math.random().toString(),
      category: 'Spelling',
      description: 'AI Generated Case',
      generatedText: text,
      expectedResult: 'Spellchecker should flag error',
      status: TestStatus.PENDING
    };

    setSessions(prev => prev.map(session => {
      if (session.id !== activePlatformId) return session;
      const updatedTests = [newCase, ...session.testCases];
      return {
        ...session,
        testCases: updatedTests,
        totalTests: updatedTests.length,
        progress: (session.passedTests + session.failedTests) / updatedTests.length * 100
      };
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center text-indigo-600">
                <Sparkles className="h-8 w-8 mr-2" />
                <span className="font-bold text-xl tracking-tight">Enagram QA Hub</span>
              </div>
            </div>
            <div className="flex items-center text-sm text-slate-500">
              Testing Environment: Production
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!activeSession ? (
          <Dashboard 
            sessions={sessions} 
            onSelectPlatform={setActivePlatformId} 
          />
        ) : (
          <TestSession 
            session={activeSession}
            onBack={() => setActivePlatformId(null)}
            onUpdateStatus={handleUpdateStatus}
            onAddTestCase={handleAddTestCase}
          />
        )}
      </main>
    </div>
  );
};

export default App;
