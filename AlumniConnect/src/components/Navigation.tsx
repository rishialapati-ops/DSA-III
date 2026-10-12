import React, { useState } from 'react';
import { 
  Search, 
  Layers, 
  FileText, 
  Binary, 
  History, 
  Info, 
  BarChart3, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  CheckCircle2,
  Database
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  corpusCount: number;
  hasResults: boolean;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  corpusCount,
  hasResults,
  theme,
  setTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Search },
    { id: 'results', label: 'Search Results', icon: FileText, badge: hasResults ? 'Active' : undefined },
    { id: 'corpus', label: 'Corpus Explorer', icon: Layers, count: corpusCount },
    { id: 'visualizer', label: 'KMP Algorithm', icon: Binary },
    { id: 'benchmark', label: 'Complexity & Tests', icon: BarChart3 },
    { id: 'history', label: 'Search History', icon: History },
    { id: 'info', label: 'Project Information', icon: Info },
  ];

  const handleSelect = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  const isDark = theme === 'dark';

  return (
    <>
      {/* Mobile Top Header */}
      <div className={`lg:hidden sticky top-0 z-40 px-4 py-3 flex items-center justify-between border-b ${
        isDark ? 'bg-slate-950/95 border-slate-800 text-white' : 'bg-white/95 border-slate-200 text-slate-900'
      } backdrop-blur-md`}>
        <div className="flex items-center gap-2.5">
          {/* Logo combining Search + Connected Nodes */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <div className="relative">
              <Search className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-violet-300 ring-1 ring-white" />
            </div>
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight block">Alumni Connect</span>
            <span className="text-[10px] text-indigo-400 font-mono block">KMP Pattern Search System</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`p-1.5 rounded-lg border transition ${
              isDark ? 'border-slate-800 text-slate-300 hover:text-white' : 'border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
            title="Toggle color theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-1.5 rounded-lg border ${
              isDark ? 'border-slate-800 text-slate-400 hover:text-white' : 'border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={`lg:hidden fixed inset-0 z-50 bg-black/50`} onClick={() => setMobileMenuOpen(false)}>
          <div
            className={`w-72 h-full p-5 flex flex-col justify-between ${
              isDark ? 'bg-slate-950 border-r border-slate-800 text-white' : 'bg-white border-r border-slate-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-800/60">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                    <Search className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-sm block">Alumni Connect</span>
                    <span className="text-[10px] text-indigo-400 font-mono block">KMP Pattern Search System</span>
                  </div>
                </div>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                        isActive
                          ? isDark
                            ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : isDark
                          ? 'text-slate-400 hover:text-white hover:bg-slate-900'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'opacity-70'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.count !== undefined && (
                        <span className="font-mono text-[10px] opacity-70">{item.count}</span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-800/60 text-xs font-mono opacity-60">
              Corpus: 100 documents verified
            </div>
          </div>
        </div>
      )}

      {/* Desktop Stable Sidebar */}
      <aside className={`hidden lg:flex w-64 shrink-0 flex-col justify-between h-screen sticky top-0 px-5 py-6 border-r transition-colors ${
        isDark
          ? 'bg-slate-950/90 border-slate-800/80 text-white'
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div>
          {/* Logo & Branding Lockup */}
          <div className="mb-7">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="text-left group focus:outline-none w-full"
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                {/* Logo combining Search + Connected Nodes */}
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                  <div className="relative">
                    <Search className="w-4 h-4" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-violet-300 ring-1 ring-white" />
                  </div>
                </div>
                <div>
                  <span className="font-bold text-base tracking-tight block">
                    Alumni Connect
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-semibold text-indigo-400 uppercase tracking-wider">
                      KMP Pattern Search
                    </span>
                    <span className="px-1 py-0.2 rounded text-[9px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                      KMP
                    </span>
                  </div>
                </div>
              </div>
              <p className={`text-[11px] leading-tight mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Discover Connections Through Intelligent Pattern Search.
              </p>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg font-medium transition group relative ${
                    isActive
                      ? isDark
                        ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-xs'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs'
                      : isDark
                      ? 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 transition-colors ${
                      isActive 
                        ? isDark ? 'text-indigo-400' : 'text-indigo-600'
                        : isDark ? 'text-slate-500 group-hover:text-slate-300' : 'text-slate-400 group-hover:text-slate-700'
                    }`} />
                    <span>{item.label}</span>
                  </div>

                  {item.count !== undefined && (
                    <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                      isDark ? 'bg-slate-900 text-slate-400 border border-slate-800' : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {item.count}
                    </span>
                  )}
                  {item.badge && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 ring-2 ring-indigo-400/20" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Corpus Status & Theme Toggle */}
        <div className={`pt-4 border-t space-y-3 ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
          {/* Corpus Status Indicator */}
          <div className={`p-2.5 rounded-lg border flex items-center justify-between text-xs ${
            isDark 
              ? 'bg-slate-900/60 border-slate-800/80 text-slate-300' 
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono text-[11px] font-medium">Corpus Status</span>
            </div>
            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {corpusCount} Docs Active
            </span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border transition ${
              isDark
                ? 'bg-slate-900/40 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2">
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-600" />}
              <span>Theme: {isDark ? 'Deep Navy' : 'Light Minimal'}</span>
            </div>
            <span className="text-[10px] font-mono opacity-60">Toggle</span>
          </button>
        </div>
      </aside>
    </>
  );
};
