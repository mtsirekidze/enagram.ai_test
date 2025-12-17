import React, { useState } from 'react';
import { PlatformType, PlatformSession, TestStatus, TestCase } from './types';
import Dashboard from './components/Dashboard';
import TestSession from './components/TestSession';
import { ClipboardList } from 'lucide-react';

// Customized Data based on user request
const INITIAL_SESSIONS: PlatformSession[] = [
  {
    id: PlatformType.CHROME,
    name: '1. Chrome & Edge Extensions',
    icon: 'chrome',
    progress: 0,
    totalTests: 4,
    passedTests: 0,
    failedTests: 0,
    lastUpdated: new Date().toISOString(),
    testCases: [
      { id: 'ext1', category: 'UI/UX', description: 'Install extension and Pin to toolbar', expectedResult: 'Icon visible', status: TestStatus.PENDING },
      { id: 'ext2', category: 'Spelling', description: 'Check text input on Facebook/LinkedIn', expectedResult: 'Red underline on typos', status: TestStatus.PENDING },
      { id: 'ext3', category: 'UI/UX', description: 'Clicking suggestion corrects the word', expectedResult: 'Word replaced', status: TestStatus.PENDING },
      { id: 'ext4', category: 'Performance', description: 'Extension popup load speed', expectedResult: 'Opens instantly', status: TestStatus.PENDING },
    ]
  },
  {
    id: PlatformType.WORD,
    name: '2. Microsoft Word Add-in',
    icon: 'file-text',
    progress: 0,
    totalTests: 3,
    passedTests: 0,
    failedTests: 0,
    lastUpdated: new Date().toISOString(),
    testCases: [
      { id: 'w1', category: 'UI/UX', description: 'Open Enagram Sidebar from Home tab', expectedResult: 'Sidebar loads', status: TestStatus.PENDING },
      { id: 'w2', category: 'Spelling', description: 'Scan full document functionality', expectedResult: 'Errors listed in sidebar', status: TestStatus.PENDING },
      { id: 'w3', category: 'Grammar', description: 'Apply "Fix All" (if available)', expectedResult: 'All errors fixed', status: TestStatus.PENDING },
    ]
  },
  {
    id: PlatformType.DOCS,
    name: '3. Google Docs Add-on',
    icon: 'file',
    progress: 0,
    totalTests: 3,
    passedTests: 0,
    failedTests: 0,
    lastUpdated: new Date().toISOString(),
    testCases: [
      { id: 'g1', category: 'UI/UX', description: 'Launch from Extensions menu', expectedResult: 'Sidebar appears', status: TestStatus.PENDING },
      { id: 'g2', category: 'Spelling', description: 'Real-time highlight in doc', expectedResult: 'Underlines appear', status: TestStatus.PENDING },
      { id: 'g3', category: 'Performance', description: 'Check large document (10+ pages)', expectedResult: 'No crash', status: TestStatus.PENDING },
    ]
  },
  {
    id: PlatformType.WEB,
    name: '4. Enagram.ai Website',
    icon: 'globe',
    progress: 0,
    totalTests: 3,
    passedTests: 0,
    failedTests: 0,
    lastUpdated: new Date().toISOString(),
    testCases: [
      { id: 'wb1', category: 'UI/UX', description: 'Main editor loads correctly', expectedResult: 'Ready to type', status: TestStatus.PENDING },
      { id: 'wb2', category: 'Spelling', description: 'Paste Georgian text with errors', expectedResult: 'Errors detected', status: TestStatus.PENDING },
      { id: 'wb3', category: 'UI/UX', description: 'Mobile responsiveness', expectedResult: 'Layout adapts to phone', status: TestStatus.PENDING },
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
      const progress = total === 0 ? 0 : ((passed + failed) / total) * 100;

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

  const handleAddManualTestCase = (text: string) => {
     if (!activePlatformId) return;
     const newCase: TestCase = {
      id: Date.now().toString(),
      category: 'Spelling',
      description: text,
      expectedResult: 'Manual verify',
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
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center text-indigo-600">
                <ClipboardList className="h-8 w-8 mr-2" />
                <span className="font-bold text-xl tracking-tight">Enagram QA Checklist</span>
              </div>
            </div>
            <div className="flex items-center text-sm text-slate-500">
              Manual Testing Mode
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
            onAddTestCase={handleAddManualTestCase}
          />
        )}
      </main>
    </div>
  );
};

export default App;