import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  ArrowRight, 
  LogIn, 
  Binary, 
  Sparkles,
  ShieldCheck,
  Search
} from 'lucide-react';
import { UserRole } from '../../auth/types';

interface AuthLandingProps {
  onSelectRole: (role: UserRole) => void;
  onOpenSignIn: () => void;
  onQuickDemoLogin: (role: UserRole) => void;
  onEnterGuestMode: () => void;
  theme?: 'dark' | 'light';
}

export const AuthLanding: React.FC<AuthLandingProps> = ({
  onSelectRole,
  onOpenSignIn,
  onQuickDemoLogin,
  onEnterGuestMode,
  theme = 'light'
}) => {
  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#242522] flex flex-col justify-between px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Top Header */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between pb-6 border-b border-[#E8E6E0]">
        <div className="flex items-center gap-2.5">
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
            <span className="text-[10px] font-mono tracking-wider text-[#777873] uppercase block">
              University Community & Pattern Search
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSignIn}
            className="text-xs font-medium text-[#242522] hover:text-[#315C46] px-3 py-1.5 rounded transition cursor-pointer"
          >
            Sign in
          </button>
          <button
            onClick={onEnterGuestMode}
            className="text-xs font-mono text-[#777873] hover:text-[#242522] border border-[#E8E6E0] bg-white px-3 py-1.5 rounded-md hover:border-[#315C46] transition cursor-pointer"
          >
            Algorithmic Lab →
          </button>
        </div>
      </header>

      {/* Hero & Role Selection Area */}
      <main className="max-w-4xl w-full mx-auto py-10 sm:py-16 space-y-12">
        
        {/* Editorial Heading */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-[11px] font-mono tracking-widest text-[#777873] uppercase">
            University Alumni Network · DSA Project
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#242522] tracking-tight leading-tight">
            Your next connection starts here.
          </h1>
          <p className="text-sm sm:text-base text-[#777873] leading-relaxed">
            Connect with alumni, discover skills, and explore opportunities through your university community.
          </p>
        </div>

        {/* Refined Two-Column Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Choice 1: Alumnus */}
          <div className="p-7 sm:p-8 bg-white border border-[#E8E6E0] rounded-lg shadow-xs hover:border-[#315C46] transition flex flex-col justify-between group space-y-6">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-md bg-[#EBF1EE] text-[#315C46] flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-[#315C46] font-semibold uppercase tracking-wider block">
                  For Graduates
                </span>
                <h2 className="font-serif text-2xl font-normal text-[#242522]">
                  I'm an alumnus
                </h2>
                <p className="text-xs sm:text-sm text-[#777873] leading-relaxed">
                  I've graduated and want to share my experience, skills, and career journey with junior students.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => onSelectRole('ALUMNI')}
                className="w-full py-3 bg-[#315C46] hover:bg-[#264736] text-white text-xs sm:text-sm font-medium rounded-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue as Alumni</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onQuickDemoLogin('ALUMNI')}
                className="w-full text-center text-[11px] font-mono text-[#777873] hover:text-[#315C46] py-1 cursor-pointer"
              >
                Instant Demo: Sign in as Rahul Sharma (Alumni)
              </button>
            </div>
          </div>

          {/* Choice 2: Student */}
          <div className="p-7 sm:p-8 bg-white border border-[#E8E6E0] rounded-lg shadow-xs hover:border-[#315C46] transition flex flex-col justify-between group space-y-6">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-md bg-[#EBF1EE] text-[#315C46] flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-[#315C46] font-semibold uppercase tracking-wider block">
                  For Current Students
                </span>
                <h2 className="font-serif text-2xl font-normal text-[#242522]">
                  I'm a student
                </h2>
                <p className="text-xs sm:text-sm text-[#777873] leading-relaxed">
                  I'm studying and want to discover alumni, explore career paths, and find skill-based guidance.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => onSelectRole('STUDENT')}
                className="w-full py-3 bg-[#315C46] hover:bg-[#264736] text-white text-xs sm:text-sm font-medium rounded-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue as Student</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onQuickDemoLogin('STUDENT')}
                className="w-full text-center text-[11px] font-mono text-[#777873] hover:text-[#315C46] py-1 cursor-pointer"
              >
                Instant Demo: Sign in as Ananya Iyer (Student)
              </button>
            </div>
          </div>

        </div>

        {/* Informative Footnote Banner */}
        <div className="p-4 bg-white border border-[#E8E6E0] rounded-md text-xs text-[#777873] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#315C46] shrink-0 hidden sm:block" />
            <span>
              This platform indexes alumni skills and chronicles using the Knuth-Morris-Pratt (KMP) string matching algorithm across 100 structured text documents.
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenSignIn}
              className="text-xs font-semibold text-[#242522] hover:text-[#315C46] underline underline-offset-2 cursor-pointer"
            >
              Sign in to existing account
            </button>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-5xl w-full mx-auto pt-6 border-t border-[#E8E6E0] text-[11px] font-mono text-[#777873] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>Alumni Connect · CS-301 Data Structures and Algorithms Capstone</div>
        <div className="flex items-center gap-3">
          <span>100 Corpus Documents</span>
          <span>·</span>
          <span>KMP Algorithm Core</span>
          <span>·</span>
          <button onClick={onEnterGuestMode} className="text-[#315C46] hover:underline">
            Open Algorithm Visualizer
          </button>
        </div>
      </footer>

    </div>
  );
};
