export enum PlatformType {
  CHROME = 'Chrome Extension',
  EDGE = 'Edge Extension',
  WORD = 'Word Add-in',
  DOCS = 'Google Docs Add-on',
  WEB = 'Enagram.ai Website'
}

export enum TestStatus {
  PENDING = 'PENDING',
  PASSED = 'PASSED',
  FAILED = 'FAILED',
  BLOCKED = 'BLOCKED'
}

export interface TestCase {
  id: string;
  category: 'Spelling' | 'Grammar' | 'UI/UX' | 'Performance';
  description: string;
  expectedResult: string;
  status: TestStatus;
  notes?: string;
  sampleText?: string; // Pre-filled text for testing
}

export interface PlatformSession {
  id: PlatformType;
  name: string;
  icon: string;
  progress: number;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  lastUpdated: string;
  testCases: TestCase[];
}