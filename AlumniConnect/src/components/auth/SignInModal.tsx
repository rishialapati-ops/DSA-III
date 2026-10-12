import React, { useState } from 'react';
import { 
  X, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  Check, 
  GraduationCap, 
  BookOpen, 
  ShieldCheck 
} from 'lucide-react';
import { loginUser } from '../../auth/authService';
import { UserProfile, UserRole } from '../../auth/types';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
  onNavigateToRegister: (role: UserRole) => void;
  onQuickDemoLogin: (role: UserRole) => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onNavigateToRegister,
  onQuickDemoLogin,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotPasswordMsg, setForgotPasswordMsg] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    const user = loginUser(email);
    if (user) {
      setError(null);
      onSuccess(user);
    } else {
      setError('No profile found with that email. Try one of the demo accounts or register below.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="w-full max-w-md bg-[#F8F7F4] border border-[#E8E6E0] rounded-lg shadow-xl overflow-hidden p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#777873] uppercase block">
              Alumni Connect Account
            </span>
            <h2 className="font-serif text-2xl font-normal text-[#242522]">
              Sign in to your account
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-[#777873] hover:text-[#242522] rounded transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Fast-Sign-In Pills */}
        <div className="p-3.5 bg-white border border-[#E8E6E0] rounded-md space-y-2">
          <span className="text-[11px] font-mono text-[#777873] block uppercase tracking-wider">
            1-Click Demo Accounts:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onQuickDemoLogin('ALUMNI')}
              className="px-2.5 py-1.5 bg-[#F2F1EC] hover:bg-[#EBF1EE] hover:text-[#315C46] border border-[#E8E6E0] rounded text-left text-xs transition cursor-pointer"
            >
              <div className="font-semibold text-[#242522] text-[11px]">Demo Alumnus</div>
              <div className="text-[10px] text-[#777873] truncate">rahul.sharma@example.edu</div>
            </button>
            <button
              type="button"
              onClick={() => onQuickDemoLogin('STUDENT')}
              className="px-2.5 py-1.5 bg-[#F2F1EC] hover:bg-[#EBF1EE] hover:text-[#315C46] border border-[#E8E6E0] rounded text-left text-xs transition cursor-pointer"
            >
              <div className="font-semibold text-[#242522] text-[11px]">Demo Student</div>
              <div className="text-[10px] text-[#777873] truncate">ananya.iyer@student.edu</div>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#242522] mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null); }}
              placeholder="e.g., student@university.edu"
              className="w-full px-3 py-2 bg-white border border-[#E8E6E0] rounded-md text-xs sm:text-sm text-[#242522] focus:outline-none focus:border-[#315C46]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-[#242522]">
                Password
              </label>
              <button
                type="button"
                onClick={() => setForgotPasswordMsg(true)}
                className="text-[11px] text-[#777873] hover:text-[#315C46] underline underline-offset-2 cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null); }}
                placeholder="Enter your password..."
                className="w-full px-3 py-2 pr-10 bg-white border border-[#E8E6E0] rounded-md text-xs sm:text-sm text-[#242522] focus:outline-none focus:border-[#315C46]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777873] hover:text-[#242522] cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {forgotPasswordMsg && (
            <div className="p-2.5 bg-[#F2F1EC] border border-[#E8E6E0] text-[#777873] text-xs rounded">
              Demo environment note: password resets are handled locally. You can sign in using any password or use the 1-click demo accounts above.
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-[#315C46] hover:bg-[#264736] text-white text-xs sm:text-sm font-medium rounded-md transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Sign In</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Footer options */}
        <div className="pt-2 border-t border-[#E8E6E0] text-center space-y-2">
          <p className="text-xs text-[#777873]">
            Don't have an account yet?
          </p>
          <div className="flex items-center justify-center gap-4 text-xs font-medium">
            <button
              onClick={() => { onClose(); onNavigateToRegister('ALUMNI'); }}
              className="text-[#315C46] hover:underline underline-offset-2 cursor-pointer"
            >
              Register as Alumni
            </button>
            <span className="text-[#E8E6E0]">·</span>
            <button
              onClick={() => { onClose(); onNavigateToRegister('STUDENT'); }}
              className="text-[#315C46] hover:underline underline-offset-2 cursor-pointer"
            >
              Register as Student
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
