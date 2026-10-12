import React, { useState } from 'react';
import { 
  Search, 
  RotateCcw, 
  Sparkles, 
  Database, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  AlertCircle,
  Binary,
  Cpu
} from 'lucide-react';
import { KmpSearchResult, AlumniDocument } from '../kmp/types';
import { computeLPSArray } from '../kmp/kmpAlgorithm';
import { getSearchHistory } from '../kmp/corpusService';

interface DashboardProps {
  totalDocs: number;
  loadedDocs: number;
  lastResult: KmpSearchResult | null;
  onSearch: (pattern: string, caseSensitive: boolean, wholeWord: boolean) => void;
  isSearching: boolean;
  sampleDocs: AlumniDocument[];
  onSelectDocument: (docId: string) => void;
  onNavigateToResults: () => void;
  onNavigateToCorpus: () => void;
  onNavigateToVisualizer: () => void;
  theme: 'dark' | 'light';
}

const SEARCH_SUGGESTIONS = [
  'Java',
  'Python',
  'Machine Learning',
  'SQL',
  'React',
  'Data Science',
  'Web Development'
];

export const Dashboard: React.FC<DashboardProps> = ({
  totalDocs,
  loadedDocs,
  lastResult,
  onSearch,
  isSearching,
  sampleDocs,
  onSelectDocument,
  onNavigateToResults,
  onNavigateToCorpus,
  onNavigateToVisualizer,
  theme,
}) => {
  const [pattern, setPattern] = useState(lastResult?.pattern || '');
  const [caseSensitive, setCaseSensitive] = useState(lastResult?.caseSensitive || false);
  const [wholeWord, setWholeWord] = useState(lastResult?.wholeWord || false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const history = getSearchHistory();
  const isDark = theme === 'dark';

  // Live LPS preview computed on the fly
  const liveLps = pattern.trim()
    ? computeLPSArray(caseSensitive ? pattern.trim() : pattern.trim().toLowerCase())
    : [];

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isSearching) return; // Prevent duplicate submissions

    if (!pattern.trim()) {
      setErrorMsg('Please enter a search keyword, skill, or multi-word phrase.');
      return;
    }
    setErrorMsg(null);
    onSearch(pattern.trim(), caseSensitive, wholeWord);
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (isSearching) return;
    setPattern(suggestion);
    setErrorMsg(null);
    onSearch(suggestion, caseSensitive, wholeWord);
  };

  const handleClear = () => {
    setPattern('');
    setErrorMsg(null);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      
      {/* Dashboard Header / Hero */}
      <div className={`p-6 sm:p-8 rounded-2xl border transition-colors ${
        isDark 
          ? 'bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 border-slate-800 shadow-xl' 
          : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                DSA Project · CS-301
              </span>
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Knuth-Morris-Pratt Exact Pattern Matching
              </span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Alumni Connect
            </h1>
            <p className={`text-sm mt-1 max-w-2xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Discover Connections Through Intelligent Pattern Search. Locate skills, technologies, and experience chronicles across 100 structured text documents using the KMP algorithm.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onNavigateToVisualizer}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition ${
                isDark 
                  ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700' 
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
              }`}
            >
              <Binary className="w-3.5 h-3.5 text-indigo-400" />
              <span>How KMP Works</span>
            </button>
            <button
              onClick={onNavigateToCorpus}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition ${
                isDark 
                  ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700' 
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Corpus (100)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Required Summary Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Documents */}
        <div className={`p-5 rounded-xl border transition ${
          isDark ? 'bg-slate-900/60 border-slate-800/90' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className={`uppercase font-semibold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Total Documents
            </span>
            <Database className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-bold font-mono tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {totalDocs}
            </span>
            <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>files</span>
          </div>
          <p className={`text-[11px] mt-2 font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Target: 100 individual .txt
          </p>
        </div>

        {/* Card 2: Total Documents Indexed or Loaded */}
        <div className={`p-5 rounded-xl border transition ${
          isDark ? 'bg-slate-900/60 border-slate-800/90' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className={`uppercase font-semibold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Documents Loaded
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-400 font-mono tabular-nums">
              {loadedDocs}
            </span>
            <span className="text-xs text-emerald-500 font-medium">100% active</span>
          </div>
          <p className={`text-[11px] mt-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Loaded from <span className="font-mono">data/</span> directory
          </p>
        </div>

        {/* Card 3: Last Search Pattern */}
        <div className={`p-5 rounded-xl border transition ${
          isDark ? 'bg-slate-900/60 border-slate-800/90' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className={`uppercase font-semibold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Last Search
            </span>
            <Search className="w-4 h-4 text-violet-400" />
          </div>
          <div className="flex items-baseline gap-2 truncate">
            {lastResult ? (
              <span className="text-2xl font-bold text-violet-400 font-mono truncate">
                "{lastResult.pattern}"
              </span>
            ) : (
              <span className={`text-xl font-medium italic ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                None yet
              </span>
            )}
          </div>
          <p className={`text-[11px] mt-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {lastResult ? `Length: ${lastResult.pattern.length} characters` : 'Execute a search below'}
          </p>
        </div>

        {/* Card 4: Last Search Matches */}
        <div className={`p-5 rounded-xl border transition ${
          isDark ? 'bg-slate-900/60 border-slate-800/90' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className={`uppercase font-semibold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Last Matches
            </span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            {lastResult ? (
              <>
                <span className="text-3xl font-bold text-amber-400 font-mono tabular-nums">
                  {lastResult.matchingDocuments.length}
                </span>
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  docs ({lastResult.totalOccurrences} hits)
                </span>
              </>
            ) : (
              <span className={`text-xl font-medium italic ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                0 matches
              </span>
            )}
          </div>
          <p className={`text-[11px] mt-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {lastResult ? `Execution time: ${lastResult.executionTimeMs} ms` : 'Awaiting search submission'}
          </p>
        </div>

      </div>

      {/* Main Search Panel: Primary Focus of the Dashboard */}
      <div className={`p-6 sm:p-8 rounded-2xl border transition-colors ${
        isDark 
          ? 'bg-slate-900/80 border-slate-800 shadow-xl' 
          : 'bg-white border-slate-200 shadow-md'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Search className="w-5 h-5 text-indigo-500" />
              <span>Corpus Pattern Search</span>
            </h2>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Enter a keyword, skill, or multi-word phrase to search all 100 alumni text documents.
            </p>
          </div>
          <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 self-start sm:self-auto">
            Algorithm: KMP Linear Search
          </span>
        </div>

        <form onSubmit={handleSearchSubmit} className="space-y-4">
          {/* Large Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={pattern}
              onChange={(e) => {
                setPattern(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="Search skills, technologies, or phrases... (e.g., Java, Python, Machine Learning)"
              className={`w-full pl-12 pr-44 py-4 text-base font-mono rounded-xl border transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark 
                  ? 'bg-slate-950 text-white placeholder-slate-500 border-slate-700' 
                  : 'bg-slate-50 text-slate-900 placeholder-slate-400 border-slate-300'
              }`}
            />
            
            {/* Input Action Buttons */}
            <div className="absolute inset-y-0 right-2 flex items-center gap-1.5">
              {pattern && (
                <button
                  type="button"
                  onClick={handleClear}
                  className={`px-2.5 py-1.5 text-xs rounded-lg transition ${
                    isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                  title="Clear input"
                >
                  Clear
                </button>
              )}
              <button
                type="submit"
                disabled={isSearching}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-md shadow-indigo-600/30 transition flex items-center gap-2 cursor-pointer"
              >
                {isSearching ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <span>Run KMP Search</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Validation Error Message */}
          {errorMsg && (
            <div className="flex items-center gap-2 text-rose-400 text-xs bg-rose-950/30 border border-rose-500/20 px-3 py-2 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Options: Case-sensitivity & Whole-word Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={caseSensitive}
                  onChange={(e) => setCaseSensitive(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Case-sensitive search</span>
              </label>

              <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={wholeWord}
                  onChange={(e) => setWholeWord(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Whole-word match only</span>
              </label>
            </div>

            {/* Live LPS Array Calculation */}
            {liveLps.length > 0 && (
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>LPS Array ({liveLps.length}):</span>
                <span className={`px-2 py-0.5 rounded font-semibold border ${
                  isDark ? 'bg-slate-950 text-indigo-300 border-slate-800' : 'bg-slate-100 text-indigo-700 border-slate-200'
                }`}>
                  [{liveLps.join(', ')}]
                </span>
              </div>
            )}
          </div>

          {/* Search Suggestions */}
          <div className="pt-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Search suggestions:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SEARCH_SUGGESTIONS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleSuggestionClick(item)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-mono transition border cursor-pointer ${
                    pattern.toLowerCase() === item.toLowerCase()
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                      : isDark
                      ? 'bg-slate-950/80 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-800'
                      : 'bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 border-slate-200'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </form>

        {/* Previous Result Shortcut Banner */}
        {lastResult && (
          <div className={`mt-6 pt-5 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className={`text-xs font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Last result ready for <span className="font-mono text-indigo-400">"{lastResult.pattern}"</span>
                </p>
                <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Found <span className="font-mono font-semibold text-emerald-400">{lastResult.totalOccurrences} occurrences</span> across <span className="font-mono font-semibold">{lastResult.matchingDocuments.length} documents</span> ({lastResult.executionTimeMs} ms).
                </p>
              </div>
            </div>
            <button
              onClick={onNavigateToResults}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition shrink-0 cursor-pointer"
            >
              <span>View Full Results</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Explore the Corpus Preview Strip */}
      <div className={`p-6 rounded-2xl border transition-colors ${
        isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800/60">
          <div>
            <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Corpus Overview · 100 Alumni Documents
            </h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Each file contains verified alumni records with skills, projects, and employment history.
            </p>
          </div>
          <button
            onClick={onNavigateToCorpus}
            className="text-xs font-semibold text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All 100 Files</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {sampleDocs.slice(0, 4).map((doc) => (
            <div
              key={doc.id}
              onClick={() => onSelectDocument(doc.id)}
              className={`p-3.5 rounded-xl border transition cursor-pointer group ${
                isDark 
                  ? 'bg-slate-950/60 border-slate-800/80 hover:border-indigo-500/50' 
                  : 'bg-slate-50 border-slate-200 hover:border-indigo-400'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-indigo-400 mb-1">
                <span>{doc.filename}</span>
                <span className="opacity-70">{doc.alumniId}</span>
              </div>
              <div className={`font-semibold text-xs group-hover:text-indigo-400 transition-colors ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {doc.name}
              </div>
              <div className={`text-[11px] truncate mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {doc.currentRole} · {doc.company}
              </div>
              <div className={`text-[10px] font-mono mt-2 truncate ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {doc.skills.slice(0, 3).join(', ')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Algorithmic Complexity Guarantee Banner */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
        isDark ? 'bg-indigo-950/20 border-indigo-500/20 text-slate-300' : 'bg-indigo-50/60 border-indigo-200 text-slate-700'
      }`}>
        <div className="flex items-center gap-2.5">
          <Cpu className="w-4 h-4 text-indigo-400 shrink-0" />
          <div>
            <span className="font-semibold text-indigo-400">Guaranteed Linear Time Complexity: </span>
            <span>Preprocessing O(m) · Single Document O(n + m) · Total Corpus O(N + D×m).</span>
          </div>
        </div>
        <button
          onClick={onNavigateToVisualizer}
          className="text-xs font-semibold text-indigo-400 hover:underline shrink-0"
        >
          View Algorithmic Trace →
        </button>
      </div>

    </div>
  );
};
