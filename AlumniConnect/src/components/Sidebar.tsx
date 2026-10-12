import React, { useState } from 'react';
import { 
  Home, 
  Search, 
  Files, 
  History, 
  Binary, 
  Info, 
  Menu, 
  X,
  User,
  LogOut,
  ArrowLeftRight,
  GraduationCap,
  BookOpen,
  LogIn
} from 'lucide-react';
import { UserProfile } from '../auth/types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  corpusCount: number;
  hasResults: boolean;
  currentUser?: UserProfile | null;
  onLogout?: () => void;
  onOpenRoleSelection?: () => void;
  onOpenSignIn?: () => void;
  onNewSearchClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  corpusCount,
  hasResults,
  currentUser = null,
  onLogout,
  onOpenRoleSelection,
  onOpenSignIn,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    ...(currentUser ? [
      { 
        id: 'my-dashboard', 
        label: currentUser.role === 'ALUMNI' ? 'Alumni Dashboard' : 'Student Dashboard', 
        icon: currentUser.role === 'ALUMNI' ? GraduationCap : BookOpen,
        highlight: true
      }
    ] : []),
    { id: 'overview', label: 'Corpus Search', icon: Home },
    { id: 'search', label: 'Results table', icon: Search, badge: hasResults ? 'Active' : undefined },
    { id: 'documents', label: '100 Documents', icon: Files, count: corpusCount },
    { id: 'history', label: 'Search history', icon: History },
    { id: 'visualizer', label: 'How KMP works', icon: Binary },
    { id: 'info', label: 'Project details', icon: Info },
  ];

  const handleSelect = (id: string) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-[#F8F7F4] border-b border-[#E8E6E0] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* Minimal connected nodes logo */}
          <svg className="w-5 h-5 text-[#315C46]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <circle cx="6" cy="7" r="2.5" />
            <circle cx="18" cy="7" r="2.5" />
            <circle cx="12" cy="17" r="2.5" />
            <line x1="8.2" y1="8.2" x2="10.3" y2="15" />
            <line x1="15.8" y1="8.2" x2="13.7" y2="15" />
            <line x1="8.5" y1="7" x2="15.5" y2="7" />
          </svg>
          <div>
            <span className="font-serif text-base font-semibold text-[#242522] tracking-tight block">
              Alumni Connect
            </span>
            <span className="text-[9px] font-mono tracking-wider text-[#777873] uppercase block">
              {currentUser ? `${currentUser.role} · ${currentUser.name}` : 'KMP Algorithm Lab'}
            </span>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 text-[#777873] hover:text-[#242522] rounded focus:outline-none cursor-pointer"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/30 backdrop-blur-xs" onClick={() => setMobileOpen(false)}>
          <div 
            className="w-72 bg-[#F8F7F4] border-r border-[#E8E6E0] h-full p-5 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Header */}
              <div className="pb-4 border-b border-[#E8E6E0] mb-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono tracking-wider text-[#777873] uppercase block">
                    KMP String Search
                  </span>
                  <span className="font-serif text-lg font-semibold text-[#242522]">
                    Alumni Connect
                  </span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="p-1 text-[#777873]">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* User Profile Card Mobile */}
              {currentUser ? (
                <div className="p-3 bg-white border border-[#E8E6E0] rounded-md mb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-[#315C46] font-semibold bg-[#EBF1EE] px-1.5 py-0.5 rounded">
                      {currentUser.role === 'ALUMNI' ? 'Alumnus' : 'Student'}
                    </span>
                    <button
                      onClick={() => { setMobileOpen(false); onOpenRoleSelection?.(); }}
                      className="text-[10px] text-[#777873] hover:text-[#315C46] flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeftRight className="w-3 h-3" />
                      <span>Switch</span>
                    </button>
                  </div>
                  <div className="font-semibold text-xs text-[#242522] truncate">{currentUser.name}</div>
                  <div className="text-[11px] text-[#777873] truncate">{currentUser.email}</div>
                </div>
              ) : (
                <div className="p-3 bg-white border border-[#E8E6E0] rounded-md mb-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#777873] block">Mode</span>
                    <span className="text-xs font-medium text-[#242522]">Algorithmic Lab</span>
                  </div>
                  <button
                    onClick={() => { setMobileOpen(false); onOpenSignIn?.(); }}
                    className="text-xs px-2.5 py-1 bg-[#315C46] text-white rounded font-medium"
                  >
                    Sign In
                  </button>
                </div>
              )}

              {/* Nav */}
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded transition-colors ${
                        isActive
                          ? 'bg-[#EBF1EE] text-[#315C46] font-medium'
                          : 'text-[#777873] hover:text-[#242522] hover:bg-[#F2F1EC]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#315C46]' : 'text-[#777873]'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.count !== undefined && (
                        <span className="font-mono text-[10px] text-[#777873]">{item.count}</span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#E8E6E0] space-y-2">
              {currentUser && (
                <button
                  onClick={() => { setMobileOpen(false); onLogout?.(); }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#777873] hover:text-[#9E3B3B] hover:bg-rose-50 rounded transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </button>
              )}
              <div className="text-[10px] text-[#777873] font-mono">
                KMP linear time · 100 documents verified
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-[#F8F7F4] border-r border-[#E8E6E0] flex-col justify-between h-screen sticky top-0 px-5 py-6">
        <div>
          {/* Brand Wordmark & Minimal Icon */}
          <div className="mb-6">
            <button
              onClick={() => setActiveTab(currentUser ? 'my-dashboard' : 'overview')}
              className="text-left group focus:outline-none w-full cursor-pointer"
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <svg className="w-5 h-5 text-[#315C46]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <circle cx="6" cy="7" r="2.5" />
                  <circle cx="18" cy="7" r="2.5" />
                  <circle cx="12" cy="17" r="2.5" />
                  <line x1="8.2" y1="8.2" x2="10.3" y2="15" />
                  <line x1="15.8" y1="8.2" x2="13.7" y2="15" />
                  <line x1="8.5" y1="7" x2="15.5" y2="7" />
                </svg>
                <span className="font-serif text-lg font-semibold text-[#242522] tracking-tight">
                  Alumni Connect
                </span>
              </div>
              <div className="text-[10px] uppercase font-mono tracking-widest text-[#777873] pl-0.5">
                Pattern Search Lab · DSA
              </div>
            </button>
          </div>

          {/* User Account / Session Pill */}
          {currentUser ? (
            <div className="p-3 bg-white border border-[#E8E6E0] rounded-lg mb-6 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono uppercase tracking-wider text-[#315C46] font-semibold bg-[#EBF1EE] px-1.5 py-0.5 rounded">
                  {currentUser.role === 'ALUMNI' ? 'Alumnus' : 'Student'}
                </span>
                <button
                  onClick={onOpenRoleSelection}
                  title="Switch Role or Account"
                  className="text-[10px] text-[#777873] hover:text-[#315C46] flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeftRight className="w-3 h-3" />
                  <span>Switch</span>
                </button>
              </div>
              <div>
                <div className="font-semibold text-xs text-[#242522] truncate">{currentUser.name}</div>
                <div className="text-[11px] text-[#777873] truncate font-mono">{currentUser.email}</div>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-white border border-[#E8E6E0] rounded-lg mb-6 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#777873] block uppercase">Viewing as</span>
                <span className="text-xs font-semibold text-[#242522]">Guest / Lab</span>
              </div>
              <button
                onClick={onOpenSignIn}
                className="text-xs px-2.5 py-1 bg-[#315C46] hover:bg-[#264736] text-white rounded font-medium transition cursor-pointer flex items-center gap-1"
              >
                <LogIn className="w-3 h-3" />
                <span>Sign in</span>
              </button>
            </div>
          )}

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded transition-colors group relative cursor-pointer ${
                    isActive
                      ? 'bg-[#EBF1EE] text-[#315C46] font-medium'
                      : 'text-[#777873] hover:text-[#242522] hover:bg-[#F2F1EC]'
                  }`}
                >
                  {/* Active Green Indicator Line */}
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-[#315C46] rounded-r" />
                  )}

                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-3.5 h-3.5 transition-colors ${
                      isActive ? 'text-[#315C46]' : 'text-[#777873] group-hover:text-[#242522]'
                    }`} />
                    <span>{item.label}</span>
                  </div>

                  {item.count !== undefined && (
                    <span className="font-mono text-[10px] text-[#777873] tabular-nums">
                      {item.count}
                    </span>
                  )}
                  {item.badge && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#315C46]" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quiet Academic Footnote & Session Controls */}
        <div className="pt-4 border-t border-[#E8E6E0] space-y-3">
          {currentUser && (
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-between px-2 py-1 text-xs text-[#777873] hover:text-[#9E3B3B] hover:bg-rose-50 rounded transition cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign out</span>
              </span>
              <span className="text-[10px] font-mono">exit</span>
            </button>
          )}

          <div className="space-y-1">
            <div className="text-[11px] font-mono text-[#777873] flex items-center justify-between">
              <span>Corpus</span>
              <span className="text-[#242522] font-medium">{corpusCount} docs</span>
            </div>
            <div className="text-[11px] font-mono text-[#777873] flex items-center justify-between">
              <span>Algorithm</span>
              <span className="text-[#315C46] font-medium">Knuth-Morris-Pratt</span>
            </div>
            <div className="text-[10px] text-[#777873]/80 pt-1 font-mono">
              Local dataset · CS-301
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
