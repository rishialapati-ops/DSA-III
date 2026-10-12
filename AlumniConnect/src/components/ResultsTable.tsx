import React, { useState, useMemo } from 'react';
import { 
  Download, 
  RotateCcw, 
  Search, 
  FileText, 
  ExternalLink, 
  FileSpreadsheet, 
  Code, 
  CheckCircle2, 
  Clock,
  ArrowUpDown
} from 'lucide-react';
import { KmpSearchResult, DocumentSearchResult } from '../kmp/types';
import { generateTextReport, generateCsvReport, downloadFile } from '../kmp/corpusService';

interface ResultsTableProps {
  searchResult: KmpSearchResult | null;
  onSelectDocument: (docId: string) => void;
  onBackToSearch: () => void;
  theme: 'dark' | 'light';
}

export const ResultsTable: React.FC<ResultsTableProps> = ({
  searchResult,
  onSelectDocument,
  onBackToSearch,
  theme,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [yearFilter, setYearFilter] = useState('ALL');
  const [companyFilter, setCompanyFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'occurrences' | 'name' | 'year' | 'id'>('occurrences');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [notice, setNotice] = useState<string | null>(null);

  const isDark = theme === 'dark';

  // Extract unique departments, years, companies
  const { departments, years, companies } = useMemo(() => {
    if (!searchResult) return { departments: [], years: [], companies: [] };
    const dSet = new Set<string>();
    const ySet = new Set<number>();
    const cSet = new Set<string>();
    for (const m of searchResult.matchingDocuments) {
      dSet.add(m.document.department);
      ySet.add(m.document.graduationYear);
      cSet.add(m.document.company);
    }
    return {
      departments: Array.from(dSet).sort(),
      years: Array.from(ySet).sort((a, b) => b - a),
      companies: Array.from(cSet).sort(),
    };
  }, [searchResult]);

  // Filtered and sorted matches
  const filteredMatches = useMemo(() => {
    if (!searchResult) return [];
    return searchResult.matchingDocuments.filter(m => {
      const doc = m.document;
      const q = filterQuery.toLowerCase();
      const matchesText = !q ||
        doc.name.toLowerCase().includes(q) ||
        doc.alumniId.toLowerCase().includes(q) ||
        doc.company.toLowerCase().includes(q) ||
        doc.currentRole.toLowerCase().includes(q);

      const matchesDept = departmentFilter === 'ALL' || doc.department === departmentFilter;
      const matchesYear = yearFilter === 'ALL' || doc.graduationYear.toString() === yearFilter;
      const matchesComp = companyFilter === 'ALL' || doc.company === companyFilter;

      return matchesText && matchesDept && matchesYear && matchesComp;
    }).sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'occurrences') {
        cmp = a.occurrenceCount - b.occurrenceCount;
      } else if (sortBy === 'name') {
        cmp = a.document.name.localeCompare(b.document.name);
      } else if (sortBy === 'year') {
        cmp = a.document.graduationYear - b.document.graduationYear;
      } else if (sortBy === 'id') {
        cmp = a.document.alumniId.localeCompare(b.document.alumniId);
      }
      return sortOrder === 'desc' ? -cmp : cmp;
    });
  }, [searchResult, filterQuery, departmentFilter, yearFilter, companyFilter, sortBy, sortOrder]);

  if (!searchResult) {
    return (
      <div className={`p-12 text-center rounded-2xl border ${
        isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          No Active Search Results
        </h3>
        <p className={`text-sm max-w-md mx-auto mt-1 mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Submit a search keyword or phrase from the dashboard to execute the KMP algorithm across the 100 documents.
        </p>
        <button
          onClick={onBackToSearch}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const handleExportTxt = () => {
    const content = generateTextReport(searchResult);
    const filename = `${searchResult.pattern.toLowerCase().replace(/[^a-z0-9]/g, '_')}_kmp_report.txt`;
    downloadFile(content, filename, 'text/plain');
    setNotice(`Saved report to ${filename} (Browser download). For repository export, run the Java CLI to write directly into results/ directory.`);
    setTimeout(() => setNotice(null), 6000);
  };

  const handleExportCsv = () => {
    const content = generateCsvReport(searchResult);
    const filename = `${searchResult.pattern.toLowerCase().replace(/[^a-z0-9]/g, '_')}_matches.csv`;
    downloadFile(content, filename, 'text/csv');
    setNotice(`Saved CSV dataset to ${filename}`);
    setTimeout(() => setNotice(null), 6000);
  };

  const handleExportJson = () => {
    const content = JSON.stringify(searchResult, null, 2);
    const filename = `${searchResult.pattern.toLowerCase().replace(/[^a-z0-9]/g, '_')}_results.json`;
    downloadFile(content, filename, 'application/json');
    setNotice(`Saved JSON file to ${filename}`);
    setTimeout(() => setNotice(null), 6000);
  };

  const resetFilters = () => {
    setFilterQuery('');
    setDepartmentFilter('ALL');
    setYearFilter('ALL');
    setCompanyFilter('ALL');
    setSortBy('occurrences');
    setSortOrder('desc');
  };

  const renderSnippet = (snippet: string, targetPattern: string) => {
    if (!targetPattern) return snippet;
    const regex = new RegExp(`(${targetPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, searchResult.caseSensitive ? 'g' : 'gi');
    const tokens = snippet.split(regex);

    return tokens.map((token, i) => {
      const isMatch = searchResult.caseSensitive 
        ? token === targetPattern 
        : token.toLowerCase() === targetPattern.toLowerCase();

      return isMatch ? (
        <mark key={i} className="kmp-highlight">
          {token}
        </mark>
      ) : (
        <span key={i}>{token}</span>
      );
    });
  };

  const unmatchedCount = searchResult.totalDocumentsSearched - searchResult.matchingDocuments.length;

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* Search Summary Header */}
      <div className={`p-6 sm:p-7 rounded-2xl border transition-colors ${
        isDark ? 'bg-slate-900/90 border-slate-800 shadow-xl' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
              <span>ALGORITHM: KMP STRING MATCHING</span>
              <span>·</span>
              <span>CASE: {searchResult.caseSensitive ? 'SENSITIVE' : 'INSENSITIVE'}</span>
              <span>·</span>
              <span>WORD: {searchResult.wholeWord ? 'WHOLE' : 'SUBSTRING'}</span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Results for <span className="font-mono text-indigo-400">"{searchResult.pattern}"</span>
            </h1>
            <p className={`text-xs font-mono mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              LPS Array: <span className="text-indigo-400 font-semibold">[{searchResult.lpsArray.join(', ')}]</span> (precomputed in O(m) time)
            </p>
          </div>

          {/* Export Action Controls */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleExportTxt}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
              }`}
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Export TXT</span>
            </button>
            <button
              onClick={handleExportCsv}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleExportJson}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
              }`}
            >
              <Code className="w-3.5 h-3.5 text-amber-400" />
              <span>JSON</span>
            </button>
            <button
              onClick={onBackToSearch}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition cursor-pointer"
            >
              New Search
            </button>
          </div>
        </div>

        {/* Download Notice Notification */}
        {notice && (
          <div className="mt-4 p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 text-xs flex items-center justify-between">
            <span>{notice}</span>
            <button onClick={() => setNotice(null)} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        {/* 6 Required Search Summary KPI metrics */}
        <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <div>
            <span className={`text-[11px] uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Documents Searched
            </span>
            <span className={`text-lg font-bold font-mono tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {searchResult.totalDocumentsSearched}
            </span>
          </div>
          <div>
            <span className={`text-[11px] uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Matching Documents
            </span>
            <span className="text-lg font-bold font-mono tabular-nums text-emerald-400">
              {searchResult.matchingDocuments.length}
            </span>
          </div>
          <div>
            <span className={`text-[11px] uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Without Matches
            </span>
            <span className={`text-lg font-bold font-mono tabular-nums ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {unmatchedCount}
            </span>
          </div>
          <div>
            <span className={`text-[11px] uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Total Occurrences
            </span>
            <span className="text-lg font-bold font-mono tabular-nums text-amber-400">
              {searchResult.totalOccurrences}
            </span>
          </div>
          <div>
            <span className={`text-[11px] uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Search Duration
            </span>
            <span className="text-lg font-bold font-mono tabular-nums text-indigo-400">
              {searchResult.executionTimeMs} ms
            </span>
          </div>
          <div>
            <span className={`text-[11px] uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Algorithm
            </span>
            <span className="text-xs font-bold font-mono text-indigo-400 uppercase">
              Knuth-Morris-Pratt
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className={`p-4 rounded-xl border space-y-3 ${
        isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter by name, ID, role, or company..."
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                isDark ? 'bg-slate-950 text-white border-slate-800' : 'bg-slate-50 text-slate-900 border-slate-300'
              }`}
            />
          </div>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className={`text-xs px-3 py-2 rounded-lg border focus:outline-none ${
              isDark ? 'bg-slate-950 text-slate-300 border-slate-800' : 'bg-slate-50 text-slate-700 border-slate-300'
            }`}
          >
            <option value="ALL">All Departments ({departments.length})</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className={`text-xs px-3 py-2 rounded-lg border focus:outline-none ${
              isDark ? 'bg-slate-950 text-slate-300 border-slate-800' : 'bg-slate-50 text-slate-700 border-slate-300'
            }`}
          >
            <option value="ALL">All Graduation Years</option>
            {years.map(y => (
              <option key={y} value={y.toString()}>{y}</option>
            ))}
          </select>

          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className={`text-xs px-3 py-2 rounded-lg border focus:outline-none ${
              isDark ? 'bg-slate-950 text-slate-300 border-slate-800' : 'bg-slate-50 text-slate-700 border-slate-300'
            }`}
          >
            <option value="ALL">All Companies ({companies.length})</option>
            {companies.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {(filterQuery || departmentFilter !== 'ALL' || yearFilter !== 'ALL' || companyFilter !== 'ALL') && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-3 py-2 text-xs text-rose-400 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/20 rounded-lg transition shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
            Showing <strong className={isDark ? 'text-white' : 'text-slate-900'}>{filteredMatches.length}</strong> of{' '}
            <strong className={isDark ? 'text-white' : 'text-slate-900'}>{searchResult.matchingDocuments.length}</strong> matching documents
          </span>
          <div className="flex items-center gap-1 font-mono text-[11px]">
            <button
              onClick={() => {
                if (sortBy === 'occurrences') setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
                else { setSortBy('occurrences'); setSortOrder('desc'); }
              }}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                sortBy === 'occurrences' ? 'bg-indigo-600 text-white' : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hits {sortBy === 'occurrences' ? (sortOrder === 'desc' ? '↓' : '↑') : ''}
            </button>
            <button
              onClick={() => {
                if (sortBy === 'year') setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
                else { setSortBy('year'); setSortOrder('desc'); }
              }}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                sortBy === 'year' ? 'bg-indigo-600 text-white' : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Year {sortBy === 'year' ? (sortOrder === 'desc' ? '↓' : '↑') : ''}
            </button>
            <button
              onClick={() => {
                if (sortBy === 'name') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                else { setSortBy('name'); setSortOrder('asc'); }
              }}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                sortBy === 'name' ? 'bg-indigo-600 text-white' : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Name {sortBy === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </button>
          </div>
        </div>
      </div>

      {/* Results Table */}
      {filteredMatches.length === 0 ? (
        <div className={`p-12 text-center rounded-xl border ${
          isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            No documents match the current filter criteria
          </p>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Try clearing the active filters or searching for another keyword.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-500 transition cursor-pointer"
          >
            Clear Active Filters
          </button>
        </div>
      ) : (
        <div className={`overflow-x-auto rounded-xl border shadow-sm ${
          isDark ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className={`border-b font-mono uppercase tracking-wider text-[11px] ${
                isDark ? 'bg-slate-950/80 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}>
                <th className="py-3 px-4 w-20">ID</th>
                <th className="py-3 px-4">Filename</th>
                <th className="py-3 px-4">Alumni Name</th>
                <th className="py-3 px-4 text-center w-20">Grad Year</th>
                <th className="py-3 px-4">Company & Role</th>
                <th className="py-3 px-4 text-right w-24">KMP Hits</th>
                <th className="py-3 px-4 min-w-[280px]">Text Snippet</th>
                <th className="py-3 px-4 text-center w-28">Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-200'}`}>
              {filteredMatches.map((match) => {
                const doc = match.document;
                return (
                  <tr 
                    key={doc.id}
                    className={`transition-colors group ${
                      isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-indigo-400">
                      {doc.alumniId}
                    </td>
                    <td className={`py-3 px-4 font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {doc.filename}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => onSelectDocument(doc.id)}
                        className={`font-semibold hover:text-indigo-400 text-left transition cursor-pointer ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {doc.name}
                      </button>
                    </td>
                    <td className={`py-3 px-4 text-center font-mono tabular-nums ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {doc.graduationYear}
                    </td>
                    <td className="py-3 px-4">
                      <div className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{doc.company}</div>
                      <div className={`text-[11px] line-clamp-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{doc.currentRole}</div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-mono font-bold text-amber-400 tabular-nums bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                        {match.occurrenceCount}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] leading-relaxed">
                      <div className={`line-clamp-2 max-w-md p-1.5 rounded border ${
                        isDark ? 'bg-slate-950/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}>
                        {renderSnippet(match.previewSnippet, searchResult.pattern)}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onSelectDocument(doc.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition text-[11px] font-semibold cursor-pointer"
                      >
                        <span>Open</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
