import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Download, 
  Copy, 
  Check, 
  ChevronUp, 
  ChevronDown,
  FileText,
  Search,
  Mail,
  Send,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { AlumniDocument } from '../kmp/types';
import { searchKMP } from '../kmp/kmpAlgorithm';
import { downloadFile } from '../kmp/corpusService';
import { getCurrentUser, sendMentorshipRequest } from '../auth/authService';
import { StudentProfile } from '../auth/types';

interface DocumentViewerProps {
  document: AlumniDocument;
  searchPattern?: string;
  caseSensitive?: boolean;
  wholeWord?: boolean;
  onBack: () => void;
  theme: 'dark' | 'light';
  onRequestConnection?: (doc: AlumniDocument) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  searchPattern = '',
  caseSensitive = false,
  wholeWord = false,
  onBack,
  theme,
  onRequestConnection,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeMatchIndex, setActiveMatchIndex] = useState(0);

  // Connection Request State
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectTopic, setConnectTopic] = useState('Career Guidance & Mail Exchange');
  const [connectMessage, setConnectMessage] = useState(
    `Hello ${document.name}, I came across your profile (${document.currentRole} at ${document.company}) in the Alumni Connect corpus and would love to connect and exchange mail IDs for guidance.`
  );
  const [connectSent, setConnectSent] = useState(false);
  const [connectNotice, setConnectNotice] = useState<string | null>(null);

  const currentUser = getCurrentUser();


  const isDark = theme === 'dark';

  // Exact match positions in this document
  const { matches: matchPositions } = React.useMemo(() => {
    if (!searchPattern) return { matches: [] };
    return searchKMP(document.rawContent, searchPattern, caseSensitive, wholeWord);
  }, [document.rawContent, searchPattern, caseSensitive, wholeWord]);

  const handleCopy = () => {
    navigator.clipboard.writeText(document.rawContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadFile(document.rawContent, document.filename, 'text/plain');
  };

  const nextMatch = () => {
    if (matchPositions.length === 0) return;
    setActiveMatchIndex((prev) => (prev + 1) % matchPositions.length);
  };

  const prevMatch = () => {
    if (matchPositions.length === 0) return;
    setActiveMatchIndex((prev) => (prev - 1 + matchPositions.length) % matchPositions.length);
  };

  const renderDocumentBody = () => {
    if (!searchPattern || matchPositions.length === 0) {
      return (
        <pre className={`font-mono text-xs sm:text-sm whitespace-pre-wrap leading-relaxed ${
          isDark ? 'text-slate-200' : 'text-slate-800'
        }`}>
          {document.rawContent}
        </pre>
      );
    }

    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    const patLen = searchPattern.length;

    matchPositions.forEach((pos, idx) => {
      if (pos > lastIndex) {
        elements.push(
          <span key={`text-${lastIndex}`}>
            {document.rawContent.substring(lastIndex, pos)}
          </span>
        );
      }

      const chunk = document.rawContent.substring(pos, pos + patLen);
      const isActive = idx === activeMatchIndex;

      elements.push(
        <mark
          key={`match-${pos}-${idx}`}
          className={isActive ? 'kmp-highlight-active' : 'kmp-highlight'}
          title={`Hit #${idx + 1} at character index ${pos}`}
        >
          {chunk}
        </mark>
      );

      lastIndex = pos + patLen;
    });

    if (lastIndex < document.rawContent.length) {
      elements.push(
        <span key="text-end">
          {document.rawContent.substring(lastIndex)}
        </span>
      );
    }

    return (
      <pre className={`font-mono text-xs sm:text-sm whitespace-pre-wrap leading-relaxed ${
        isDark ? 'text-slate-200' : 'text-slate-800'
      }`}>
        {elements}
      </pre>
    );
  };

  return (
    <div className="max-w-4xl space-y-6">
      
      {/* Top Action Bar */}
      <div className={`flex items-center justify-between pb-4 border-b ${
        isDark ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <button
          onClick={onBack}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border transition cursor-pointer ${
            isDark ? 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white' : 'bg-white border-slate-300 text-slate-700 hover:text-slate-900'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Results</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className={`px-3 py-1.5 text-xs rounded-lg border flex items-center gap-1.5 transition cursor-pointer ${
              isDark ? 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white' : 'bg-white border-slate-300 text-slate-700 hover:text-slate-900'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={handleDownload}
            className={`px-3 py-1.5 text-xs rounded-lg border flex items-center gap-1.5 transition cursor-pointer ${
              isDark ? 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white' : 'bg-white border-slate-300 text-slate-700 hover:text-slate-900'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .txt</span>
          </button>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className={`p-6 rounded-2xl border ${
        isDark ? 'bg-slate-900/90 border-slate-800 shadow-md' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-[#315C46] flex items-center gap-2 mb-1">
              <span>{document.filename}</span>
              <span>·</span>
              <span>ID: {document.alumniId}</span>
              <span>·</span>
              <span>Path: /data/{document.filename}</span>
            </div>
            <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {document.name}
            </h1>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {document.currentRole} at <strong className={isDark ? 'text-white' : 'text-slate-900'}>{document.company}</strong> · {document.department} (Graduated {document.graduationYear})
            </p>
          </div>

          <button
            onClick={() => {
              if (!currentUser) {
                setConnectNotice('Please sign in or use student demo mode to request connection and unlock mail IDs.');
                setTimeout(() => setConnectNotice(null), 4000);
                return;
              }
              setShowConnectModal(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#315C46] hover:bg-[#264736] text-white text-xs font-medium rounded-md transition cursor-pointer shadow-xs self-start sm:self-auto shrink-0"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Connect & Get Mail ID</span>
          </button>
        </div>

        {connectNotice && (
          <div className="mt-3 p-3 bg-[#EBF1EE] border border-[#315C46]/30 text-[#315C46] rounded-md text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{connectNotice}</span>
          </div>
        )}


        {/* Search Pattern Toolbar */}
        {searchPattern && (
          <div className={`mt-5 pt-4 border-t flex flex-wrap items-center justify-between gap-4 text-xs ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <div className="flex items-center gap-2">
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Searched Pattern:</span>
              <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                "{searchPattern}"
              </span>
              <span className={`font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                ({matchPositions.length} occurrences identified)
              </span>
            </div>

            {matchPositions.length > 0 && (
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                  Hit {activeMatchIndex + 1} of {matchPositions.length}
                </span>
                <button
                  onClick={prevMatch}
                  className={`p-1 rounded border cursor-pointer ${
                    isDark ? 'bg-slate-950 border-slate-800 hover:bg-slate-800' : 'bg-slate-100 border-slate-300 hover:bg-slate-200'
                  }`}
                  title="Previous match"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={nextMatch}
                  className={`p-1 rounded border cursor-pointer ${
                    isDark ? 'bg-slate-950 border-slate-800 hover:bg-slate-800' : 'bg-slate-100 border-slate-300 hover:bg-slate-200'
                  }`}
                  title="Next match"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Raw Document Body */}
      <div className={`p-6 rounded-2xl border shadow-sm ${
        isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className={`text-[11px] font-mono uppercase pb-3 mb-4 border-b flex items-center justify-between ${
          isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'
        }`}>
          <span>Raw Text Document Content (Read directly from data/ directory)</span>
          <span>{document.rawContent.length} bytes</span>
        </div>

        <div className="overflow-x-auto">
          {renderDocumentBody()}
        </div>
      </div>

      {/* Match Positions List */}
      {matchPositions.length > 0 && (
        <div className={`p-4 rounded-xl border text-xs font-mono space-y-1 ${
          isDark ? 'bg-slate-900/40 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}>
          <span className="text-[11px] uppercase tracking-wider block opacity-70">
            0-Based Match Character Indices:
          </span>
          <div className="text-indigo-400 font-semibold">
            [{matchPositions.join(', ')}]
          </div>
        </div>
      )}

      {/* Connection Request Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="w-full max-w-lg bg-[#F8F7F4] border border-[#E8E6E0] rounded-lg shadow-xl p-6 space-y-5 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[#E8E6E0] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#315C46] font-semibold block">
                  Connect & Exchange Mail ID
                </span>
                <h3 className="font-serif text-xl font-normal text-[#242522]">
                  Connect with {document.name}
                </h3>
                <p className="text-xs text-[#777873] mt-0.5">
                  {document.currentRole} at {document.company} ({document.department})
                </p>
              </div>
              <button
                onClick={() => setShowConnectModal(false)}
                className="p-1 text-[#777873] hover:text-[#242522] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {connectSent ? (
              <div className="p-4 bg-[#EBF1EE] border border-[#315C46]/30 text-[#315C46] rounded-md text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Connection request sent! When accepted, their mail ID will appear on your Student Dashboard.</span>
              </div>
            ) : (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!currentUser) return;
                  if (currentUser.role !== 'STUDENT') {
                    setConnectNotice('Connection requests to exchange mail IDs must be sent from a student profile.');
                    setShowConnectModal(false);
                    return;
                  }
                  const cleanEmail = `${document.name.toLowerCase().replace(/[^a-z0-9]+/g, '.')}@${document.company.toLowerCase().replace(/[^a-z0-9]+/g, '')}.com`;
                  sendMentorshipRequest(
                    currentUser as StudentProfile,
                    `corpus_${document.id}`,
                    document.name,
                    connectTopic,
                    connectMessage.trim(),
                    {
                      alumnusEmail: cleanEmail,
                      alumnusRole: document.currentRole,
                      alumnusCompany: document.company,
                      alumnusDepartment: document.department
                    }
                  );
                  setConnectSent(true);
                  setTimeout(() => {
                    setConnectSent(false);
                    setShowConnectModal(false);
                    setConnectNotice(`Connection request sent to ${document.name}! When accepted, their mail ID will be revealed in your Student Dashboard.`);
                  }, 1200);
                }} 
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block font-medium text-[#242522] mb-1">
                    Guidance / Discussion Topic:
                  </label>
                  <select
                    value={connectTopic}
                    onChange={(e) => setConnectTopic(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E8E6E0] rounded text-xs text-[#242522] focus:outline-none focus:border-[#315C46]"
                  >
                    <option value="Career Guidance & Mail Exchange">Career Guidance & Mail Exchange</option>
                    <option value="Interview Preparation & Tips">Interview Preparation & Tips</option>
                    <option value="Resume Review & Project Feedback">Resume Review & Project Feedback</option>
                    <option value="Technical Project Mentorship">Technical Project Mentorship</option>
                    <option value="Industry Networking & Insights">Industry Networking & Insights</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-[#242522] mb-1">
                    Personalized Message:
                  </label>
                  <textarea
                    rows={4}
                    value={connectMessage}
                    onChange={(e) => setConnectMessage(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-white border border-[#E8E6E0] rounded text-xs text-[#242522] focus:outline-none focus:border-[#315C46]"
                  />
                </div>

                <div className="p-3 bg-white border border-[#E8E6E0] rounded text-[11px] text-[#777873]">
                  🔒 <strong>Privacy Assurance:</strong> Once {document.name} accepts your request, their verified mail ID will be unlocked on your dashboard so you can continue your conversation over email.
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#E8E6E0]">
                  <button
                    type="button"
                    onClick={() => setShowConnectModal(false)}
                    className="px-3 py-1.5 border border-[#E8E6E0] bg-white text-xs text-[#777873] hover:text-[#242522] rounded transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#315C46] hover:bg-[#264736] text-white text-xs font-medium rounded transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Request</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

