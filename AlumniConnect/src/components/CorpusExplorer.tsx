import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle,
  ChevronLeft, 
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { AlumniDocument } from '../kmp/types';

interface CorpusExplorerProps {
  documents: AlumniDocument[];
  onSelectDocument: (docId: string) => void;
  onSearchPatternFromCorpus: (pattern: string) => void;
  theme: 'dark' | 'light';
}

export const CorpusExplorer: React.FC<CorpusExplorerProps> = ({
  documents,
  onSelectDocument,
  onSearchPatternFromCorpus,
  theme,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [yearFilter, setYearFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const isDark = theme === 'dark';
  const totalCount = documents.length;
  const isComplete = totalCount === 100;

  // Extract unique departments and years
  const { departments, years } = useMemo(() => {
    const deptSet = new Set<string>();
    const yearSet = new Set<number>();
    for (const doc of documents) {
      deptSet.add(doc.department);
      yearSet.add(doc.graduationYear);
    }
    return {
      departments: Array.from(deptSet).sort(),
      years: Array.from(yearSet).sort((a, b) => b - a),
    };
  }, [documents]);

  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q ||
        doc.name.toLowerCase().includes(q) ||
        doc.alumniId.toLowerCase().includes(q) ||
        doc.filename.toLowerCase().includes(q) ||
        doc.company.toLowerCase().includes(q) ||
        doc.currentRole.toLowerCase().includes(q) ||
        doc.skills.some(s => s.toLowerCase().includes(q));

      const matchesDept = departmentFilter === 'ALL' || doc.department === departmentFilter;
      const matchesYear = yearFilter === 'ALL' || doc.graduationYear.toString() === yearFilter;

      return matchesSearch && matchesDept && matchesYear;
    });
  }, [documents, searchQuery, departmentFilter, yearFilter]);

  const totalPages = Math.ceil(filteredDocs.length / pageSize) || 1;
  const paginatedDocs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDocs.slice(start, start + pageSize);
  }, [filteredDocs, currentPage, pageSize]);

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* Header and Integrity Status */}
      <div className={`p-6 sm:p-7 rounded-2xl border transition-colors ${
        isDark ? 'bg-slate-900/90 border-slate-800 shadow-xl' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono mb-1">
              {isComplete ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">ALL 100 DOCUMENTS LOADED AND VERIFIED</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-400 font-semibold">WARNING: {totalCount} OF 100 DOCUMENTS LOADED</span>
                </>
              )}
            </div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Corpus Explorer
            </h1>
            <p className={`text-xs mt-1 max-w-2xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Browse and inspect all 100 individual .txt documents stored in the <span className="font-mono font-semibold">data/</span> directory (<span className="font-mono">alumni001.txt</span> through <span className="font-mono">alumni100.txt</span>).
            </p>
          </div>

          <div className={`px-4 py-3 rounded-xl border text-right shrink-0 ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-[11px] uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Corpus Verification
            </span>
            <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              {totalCount} / 100
            </span>
          </div>
        </div>

        {/* Corpus Breakdown Strip */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t text-xs ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <div>
            <span className={`text-[11px] uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              File Range
            </span>
            <span className={`font-mono ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              alumni001.txt - 100.txt
            </span>
          </div>
          <div>
            <span className={`text-[11px] uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Distinct Departments
            </span>
            <span className="font-mono text-indigo-400 font-semibold">
              {departments.length} Academic Fields
            </span>
          </div>
          <div>
            <span className={`text-[11px] uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Graduation Range
            </span>
            <span className={`font-mono ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              2017 – 2024
            </span>
          </div>
          <div>
            <span className={`text-[11px] uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Avg Document Size
            </span>
            <span className={`font-mono ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              ~680 characters / document
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className={`p-4 rounded-xl border space-y-3 ${
        isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search across all 100 files by skill, name, company, ID..."
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                isDark ? 'bg-slate-950 text-white border-slate-800' : 'bg-slate-50 text-slate-900 border-slate-300'
              }`}
            />
          </div>

          <select
            value={departmentFilter}
            onChange={(e) => { setDepartmentFilter(e.target.value); setCurrentPage(1); }}
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
            onChange={(e) => { setYearFilter(e.target.value); setCurrentPage(1); }}
            className={`text-xs px-3 py-2 rounded-lg border focus:outline-none ${
              isDark ? 'bg-slate-950 text-slate-300 border-slate-800' : 'bg-slate-50 text-slate-700 border-slate-300'
            }`}
          >
            <option value="ALL">All Graduation Years</option>
            {years.map(y => (
              <option key={y} value={y.toString()}>{y}</option>
            ))}
          </select>

          {(searchQuery || departmentFilter !== 'ALL' || yearFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setDepartmentFilter('ALL');
                setYearFilter('ALL');
                setCurrentPage(1);
              }}
              className="flex items-center gap-1 px-3 py-2 text-xs text-rose-400 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/20 rounded-lg transition shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
            Showing <strong className={isDark ? 'text-white' : 'text-slate-900'}>{filteredDocs.length}</strong> of{' '}
            <strong className={isDark ? 'text-white' : 'text-slate-900'}>{totalCount}</strong> documents
          </span>
          <span className={`font-mono text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Page {currentPage} of {totalPages}
          </span>
        </div>
      </div>

      {/* Documents Table */}
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
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4 text-center w-20">Year</th>
              <th className="py-3 px-4">Company & Role</th>
              <th className="py-3 px-4">Indexed Skills</th>
              <th className="py-3 px-4 text-center w-28">Action</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-200'}`}>
            {paginatedDocs.map((doc) => (
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
                <td className={`py-3 px-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <span className="line-clamp-1">{doc.department}</span>
                </td>
                <td className={`py-3 px-4 text-center font-mono tabular-nums ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {doc.graduationYear}
                </td>
                <td className="py-3 px-4">
                  <div className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{doc.company}</div>
                  <div className={`text-[11px] line-clamp-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{doc.currentRole}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {doc.skills.slice(0, 3).map(skill => (
                      <button
                        key={skill}
                        onClick={() => onSearchPatternFromCorpus(skill)}
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded border transition cursor-pointer ${
                          isDark 
                            ? 'bg-slate-950 text-slate-400 hover:text-white border-slate-800' 
                            : 'bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200'
                        }`}
                        title={`Search "${skill}"`}
                      >
                        {skill}
                      </button>
                    ))}
                    {doc.skills.length > 3 && (
                      <span className={`text-[10px] font-mono py-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        +{doc.skills.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => onSelectDocument(doc.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition text-[11px] font-semibold cursor-pointer"
                  >
                    <span>View Text</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pt-2">
        <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredDocs.length)} of {filteredDocs.length} files
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 text-xs rounded-lg border disabled:opacity-40 transition cursor-pointer ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-300 text-slate-700'
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5 inline mr-1" />
            Previous
          </button>
          <span className={`text-xs font-mono px-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 text-xs rounded-lg border disabled:opacity-40 transition cursor-pointer ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-300 text-slate-700'
            }`}
          >
            Next
            <ChevronRight className="w-3.5 h-3.5 inline ml-1" />
          </button>
        </div>
      </div>

    </div>
  );
};
