export interface AlumniDocument {
  id: string; // e.g. "alumni001"
  filename: string; // "alumni001.txt"
  alumniId: string; // "A001"
  name: string;
  department: string;
  graduationYear: number;
  currentRole: string;
  company: string;
  skills: string[];
  rawContent: string;
}

export interface DocumentSearchResult {
  document: AlumniDocument;
  occurrenceCount: number;
  positions: number[];
  previewSnippet: string;
}

export interface KmpSearchResult {
  pattern: string;
  lpsArray: number[];
  caseSensitive: boolean;
  wholeWord: boolean;
  totalDocumentsSearched: number;
  matchingDocuments: DocumentSearchResult[];
  totalOccurrences: number;
  executionTimeMs: number;
  naiveExecutionTimeMs?: number;
  comparisonsCount?: number;
  naiveComparisonsCount?: number;
  timestamp: string;
}

export interface KmpStep {
  stepIndex: number;
  textIndex_i: number;
  patternIndex_j: number;
  action: 'compare' | 'match_char' | 'full_match' | 'mismatch_fallback' | 'mismatch_advance' | 'complete';
  description: string;
  lpsSnapshot: number[];
  matchedIndices: number[];
  comparisonsCount: number;
}

export interface SearchHistoryItem {
  id: string;
  timestamp: string;
  pattern: string;
  caseSensitive: boolean;
  wholeWord: boolean;
  matchingDocsCount: number;
  totalOccurrences: number;
  executionTimeMs: number;
}

export interface UnitTestResult {
  id: string;
  name: string;
  pattern: string;
  text?: string;
  expected: string;
  actual: string;
  passed: boolean;
  notes: string;
}
