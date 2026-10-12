import { ALUMNI_CORPUS } from './corpusData';
import { searchKMP, searchNaive, computeLPSArray } from './kmpAlgorithm';
import {
  AlumniDocument,
  KmpSearchResult,
  DocumentSearchResult,
  SearchHistoryItem
} from './types';

const SEARCH_HISTORY_KEY = 'alumni_connect_kmp_search_history';

/**
 * Returns all 100 loaded alumni documents.
 */
export function getCorpusDocuments(): AlumniDocument[] {
  return ALUMNI_CORPUS;
}

/**
 * Retrieves a single document by ID or filename.
 */
export function getDocumentById(idOrFilename: string): AlumniDocument | undefined {
  return ALUMNI_CORPUS.find(
    doc => doc.id === idOrFilename || doc.filename === idOrFilename || doc.alumniId === idOrFilename
  );
}

/**
 * Executes KMP pattern search across all loaded documents.
 * Returns detailed match metrics, positions, snippets, and execution timing.
 */
export function executeCorpusSearch(
  pattern: string,
  caseSensitive = false,
  wholeWord = false
): KmpSearchResult {
  const trimmed = pattern.trim();
  if (!trimmed) {
    throw new Error('Search pattern cannot be empty. Please enter a keyword, skill, or phrase.');
  }

  const lps = computeLPSArray(caseSensitive ? trimmed : trimmed.toLowerCase());
  const matchingDocs: DocumentSearchResult[] = [];
  let totalOccurrences = 0;
  let totalComparisons = 0;
  let totalNaiveComparisons = 0;

  // Measure KMP execution time using high-resolution performance.now()
  const startTime = performance.now();

  for (const doc of ALUMNI_CORPUS) {
    const { matches, comparisons } = searchKMP(doc.rawContent, trimmed, caseSensitive, wholeWord);
    totalComparisons += comparisons;

    if (matches.length > 0) {
      totalOccurrences += matches.length;

      // Generate snippet around the first match
      const firstPos = matches[0];
      const start = Math.max(0, firstPos - 45);
      const end = Math.min(doc.rawContent.length, firstPos + trimmed.length + 65);
      const rawSnippet = doc.rawContent.substring(start, end).replace(/\n+/g, ' ').trim();
      const previewSnippet = (start > 0 ? '...' : '') + rawSnippet + (end < doc.rawContent.length ? '...' : '');

      matchingDocs.push({
        document: doc,
        occurrenceCount: matches.length,
        positions: matches,
        previewSnippet
      });
    }
  }

  const endTime = performance.now();
  const executionTimeMs = Math.max(0.01, endTime - startTime);

  // Measure Naive Search for realistic academic complexity comparison
  const naiveStart = performance.now();
  for (const doc of ALUMNI_CORPUS) {
    const { comparisons } = searchNaive(doc.rawContent, trimmed, caseSensitive, wholeWord);
    totalNaiveComparisons += comparisons;
  }
  const naiveEnd = performance.now();
  const naiveExecutionTimeMs = Math.max(0.01, naiveEnd - naiveStart);

  // Sort matching documents descending by occurrence count
  matchingDocs.sort((a, b) => b.occurrenceCount - a.occurrenceCount);

  const searchResult: KmpSearchResult = {
    pattern: trimmed,
    lpsArray: lps,
    caseSensitive,
    wholeWord,
    totalDocumentsSearched: ALUMNI_CORPUS.length,
    matchingDocuments: matchingDocs,
    totalOccurrences,
    executionTimeMs: Number(executionTimeMs.toFixed(3)),
    naiveExecutionTimeMs: Number(naiveExecutionTimeMs.toFixed(3)),
    comparisonsCount: totalComparisons,
    naiveComparisonsCount: totalNaiveComparisons,
    timestamp: new Date().toISOString()
  };

  saveSearchToHistory(searchResult);

  return searchResult;
}

/**
 * Manages search history in localStorage.
 */
export function getSearchHistory(): SearchHistoryItem[] {
  try {
    const raw = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveSearchToHistory(result: KmpSearchResult): void {
  try {
    const history = getSearchHistory();
    const newItem: SearchHistoryItem = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: result.timestamp,
      pattern: result.pattern,
      caseSensitive: result.caseSensitive,
      wholeWord: result.wholeWord,
      matchingDocsCount: result.matchingDocuments.length,
      totalOccurrences: result.totalOccurrences,
      executionTimeMs: result.executionTimeMs
    };

    // Keep unique recent 20 queries
    const filtered = history.filter(h => h.pattern.toLowerCase() !== result.pattern.toLowerCase());
    const updated = [newItem, ...filtered].slice(0, 20);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // Gracefully ignore local storage errors in private browsing
  }
}

export function clearSearchHistory(): void {
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch {
    // Ignore
  }
}

/**
 * Format search results as structured academic TXT report.
 */
export function generateTextReport(result: KmpSearchResult): string {
  const lines: string[] = [];
  lines.push('================================================================================');
  lines.push('ALUMNI CONNECT — KMP PATTERN SEARCH SYSTEM');
  lines.push('Academic Evaluation Report & DSA Demonstration');
  lines.push('================================================================================');
  lines.push(`Generated At         : ${new Date(result.timestamp).toLocaleString()}`);
  lines.push(`Algorithm            : Knuth-Morris-Pratt (KMP) String Matching`);
  lines.push(`Search Pattern       : "${result.pattern}"`);
  lines.push(`Pattern Length       : ${result.pattern.length} characters`);
  lines.push(`Case Sensitive       : ${result.caseSensitive}`);
  lines.push(`Whole Word Matching  : ${result.wholeWord}`);
  lines.push(`Computed LPS Array   : [${result.lpsArray.join(', ')}]`);
  lines.push(`Corpus Documents     : ${result.totalDocumentsSearched}`);
  lines.push(`Matching Documents   : ${result.matchingDocuments.length}`);
  lines.push(`Total Occurrences    : ${result.totalOccurrences}`);
  lines.push(`KMP Execution Time   : ${result.executionTimeMs} ms`);
  if (result.comparisonsCount) {
    lines.push(`KMP Comparisons      : ${result.comparisonsCount}`);
  }
  if (result.naiveComparisonsCount) {
    lines.push(`Naive Comparisons    : ${result.naiveComparisonsCount}`);
    lines.push(`Comparisons Saved    : ${result.naiveComparisonsCount - (result.comparisonsCount || 0)}`);
  }
  lines.push('--------------------------------------------------------------------------------');
  lines.push('MATCHING DOCUMENTS BREAKDOWN:');
  lines.push('--------------------------------------------------------------------------------');

  if (result.matchingDocuments.length === 0) {
    lines.push('No matching documents found in the corpus.');
  } else {
    for (const match of result.matchingDocuments) {
      const doc = match.document;
      lines.push(
        `File: ${doc.filename.padEnd(14)} | ID: ${doc.alumniId.padEnd(5)} | Name: ${doc.name.padEnd(22)} | Matches: ${String(match.occurrenceCount).padStart(2)} | Year: ${doc.graduationYear} | Company: ${doc.company}`
      );
      lines.push(`  Department: ${doc.department} | Role: ${doc.currentRole}`);
      lines.push(`  Match Indices: [${match.positions.join(', ')}]`);
      lines.push(`  Preview: ${match.previewSnippet}`);
      lines.push('');
    }
  }

  lines.push('================================================================================');
  lines.push('Theoretical Complexity:');
  lines.push('- LPS Array Preprocessing: O(m)');
  lines.push('- Document Search: O(n + m)');
  lines.push('- Full Corpus Search: O(N + D * m) where N = total corpus characters, D = 100 documents.');
  lines.push('================================================================================');

  return lines.join('\n');
}

/**
 * Format search results as CSV.
 */
export function generateCsvReport(result: KmpSearchResult): string {
  const headers = [
    'Document ID',
    'Filename',
    'Alumni Name',
    'Department',
    'Graduation Year',
    'Current Role',
    'Company',
    'Occurrence Count',
    'Match Positions',
    'Pattern'
  ];

  const escapeCsv = (val: string | number) => {
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = result.matchingDocuments.map(m => [
    escapeCsv(m.document.alumniId),
    escapeCsv(m.document.filename),
    escapeCsv(m.document.name),
    escapeCsv(m.document.department),
    escapeCsv(m.document.graduationYear),
    escapeCsv(m.document.currentRole),
    escapeCsv(m.document.company),
    escapeCsv(m.occurrenceCount),
    escapeCsv(m.positions.join('; ')),
    escapeCsv(result.pattern)
  ].join(','));

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Helper to trigger client-side download of a generated file.
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
