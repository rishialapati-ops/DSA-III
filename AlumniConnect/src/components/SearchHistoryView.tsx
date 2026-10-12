import React, { useState, useEffect } from 'react';
import { 
  History, 
  RotateCcw, 
  Trash2, 
  ArrowRight,
  Clock
} from 'lucide-react';
import { SearchHistoryItem } from '../kmp/types';
import { getSearchHistory, clearSearchHistory } from '../kmp/corpusService';

interface SearchHistoryViewProps {
  onRerunSearch: (pattern: string, caseSensitive: boolean, wholeWord: boolean) => void;
}

export const SearchHistoryView: React.FC<SearchHistoryViewProps> = ({
  onRerunSearch
}) => {
  const [historyItems, setHistoryItems] = useState<SearchHistoryItem[]>([]);

  useEffect(() => {
    setHistoryItems(getSearchHistory());
  }, []);

  const handleClear = () => {
    clearSearchHistory();
    setHistoryItems([]);
  };

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="max-w-3xl space-y-8 pb-16">
      
      {/* Editorial Header */}
      <div className="space-y-2 border-b border-[#E8E6E0] pb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono tracking-widest text-[#777873] uppercase">
            Session Audit
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#242522] tracking-tight">
            Search history
          </h1>
          <p className="text-sm text-[#777873] mt-1">
            Queries executed during this session.
          </p>
        </div>

        {historyItems.length > 0 && (
          <button
            onClick={handleClear}
            className="text-xs text-[#777873] hover:text-[#9E3B3B] underline underline-offset-2 transition-colors cursor-pointer self-start sm:self-auto"
          >
            Clear history
          </button>
        )}
      </div>

      {/* Understated Note */}
      <div className="text-xs text-[#777873] bg-[#F2F1EC] p-3 rounded border border-[#E8E6E0]">
        This history is stored in local browser state. Search reports produced by the Java backend are archived in the repository's <span className="font-mono text-[#242522]">results/</span> directory.
      </div>

      {/* History List */}
      {historyItems.length === 0 ? (
        <div className="py-12 text-center border border-[#E8E6E0] bg-white rounded-md p-6 space-y-2">
          <p className="font-serif text-lg text-[#242522]">No recent searches.</p>
          <p className="text-xs text-[#777873]">
            Submit a query on the overview page to see it recorded here.
          </p>
        </div>
      ) : (
        <div className="border border-[#E8E6E0] bg-white rounded-md divide-y divide-[#E8E6E0]">
          {historyItems.map((item) => (
            <div
              key={item.id}
              className="p-4 hover:bg-[#F8F7F4] transition-colors flex items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-medium text-sm text-[#242522]">
                    "{item.pattern}"
                  </span>
                  <span className="text-[10px] font-mono text-[#777873]">
                    {item.caseSensitive ? 'case-sensitive' : ''}
                    {item.wholeWord ? ' · whole-word' : ''}
                  </span>
                </div>
                <div className="text-[#777873] text-xs">
                  {item.matchingDocsCount} documents · {item.totalOccurrences} occurrences · <span className="font-mono">{item.executionTimeMs} ms</span>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className="text-[11px] font-mono text-[#777873] hidden sm:block">
                  {formatDate(item.timestamp)}
                </span>
                <button
                  onClick={() => onRerunSearch(item.pattern, item.caseSensitive, item.wholeWord)}
                  className="px-2.5 py-1 text-xs bg-white border border-[#E8E6E0] hover:border-[#315C46] text-[#242522] rounded flex items-center gap-1 transition cursor-pointer"
                >
                  <span>Rerun</span>
                  <ArrowRight className="w-3 h-3 text-[#777873]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
