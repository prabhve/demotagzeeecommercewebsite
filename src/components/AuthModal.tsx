import React, { useState } from 'react';
import {
  X,
  User as UserIcon,
  Lock,
  Mail,
  Phone,
  Building2,
  FileText,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import type { User } from '../types/index.ts';
import { validateRegistration, validateLogin } from '../utils/authAndReviews.ts';
import { INITIAL_USER } from '../data/catalog.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('ananya.deshmukh@gmail.com');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regGstin, setRegGstin] = useState('');

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Errors & Loading
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateLogin({ email: loginEmail, password: loginPassword });
    if (!validation.isValid) {
      setErrorMsg(validation.error || 'Please check your login credentials.');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Return user profile
      const loggedUser: User = {
        ...INITIAL_USER,
        email: loginEmail,
        name: loginEmail.includes('almaktoum') ? 'Tariq Sheikh (Procurement Director)' : INITIAL_USER.name,
      };
      onAuthSuccess(loggedUser);
      onClose();
    }, 400);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateRegistration({
      name: regName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
    });

    if (!validation.isValid) {
      setErrorMsg(validation.error || 'Please fill all required registration fields.');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: regName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        shippingAddress: 'Civil Lines, Regional Sector',
        city: 'Moradabad',
        state: 'Uttar Pradesh',
        pincode: '244001',
        companyName: regCompany.trim() || undefined,
        gstin: regGstin.trim().toUpperCase() || undefined,
        savedItemIds: [],
        createdAt: new Date().toISOString().split('T')[0],
      };
      onAuthSuccess(newUser);
      onClose();
    }, 500);
  };

  const handleQuickDemoLogin = (type: 'retail' | 'b2b') => {
    if (type === 'retail') {
      onAuthSuccess(INITIAL_USER);
    } else {
      onAuthSuccess({
        id: 'usr-b2b-902',
        name: 'Tariq Sheikh (Al-Maktoum Trading LLC)',
        email: 'procurement@almaktoum-decor.ae',
        phone: '+971 50 849 2201',
        shippingAddress: 'Warehouse 12B, Al Quoz Industrial Area 3',
        city: 'Dubai',
        state: 'Dubai',
        pincode: 'PO Box 84210',
        companyName: 'Al-Maktoum Royal Interior Furnishings LLC',
        gstin: '09AABCT1332L1Z5',
        savedItemIds: ['tz-urli-royal-01', 'tz-moroccan-lantern-06'],
        createdAt: '2026-02-10',
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 animate-fadeIn">
      <div className="relative bg-white rounded-3xl max-w-md w-full shadow-[0_25px_60px_rgba(0,0,0,0.18)] border border-slate-200/80 overflow-hidden text-slate-900 flex flex-col">
        {/* Modal Top Header */}
        <div className="bg-[#0F172A] text-white p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-900 text-[#DFBA73] font-serif flex items-center justify-center text-xs border border-[#C5A059]/40 shadow-xs">
              TZ
            </div>
            <div>
              <span className="font-serif text-lg font-normal text-white block">TAG ZEE Atelier Access</span>
              <span className="text-[10px] tracking-wider uppercase text-[#DFBA73] font-medium block">
                Patron &amp; Wholesale Buyer Account
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close authentication modal"
            className="p-1.5 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-slate-950 border-b-2 border-[#C5A059] font-bold shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('register');
              setErrorMsg('');
            }}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-slate-950 border-b-2 border-[#C5A059] font-bold shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Create Account
          </button>
        </div>

        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
              {errorMsg}
            </div>
          )}

          {/* MODE: LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#C5A059]"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[10px] text-[#9E7A1C] hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#C5A059]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? 'Verifying Atelier Credentials...' : 'Sign In to TAG ZEE'}
              </button>

              {/* 1-Click Demo Logins for Instant Testing */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-2 text-center">
                  Instant 1-Click Demo Profiles
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('retail')}
                    className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left text-[11px] transition-colors cursor-pointer"
                  >
                    <strong className="block text-slate-900">Ananya Deshmukh</strong>
                    <span className="text-[10px] text-slate-500">Retail Connoisseur</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('b2b')}
                    className="p-2 bg-amber-50 hover:bg-amber-100/80 border border-amber-200 rounded-lg text-left text-[11px] transition-colors cursor-pointer"
                  >
                    <strong className="block text-amber-950">Tariq Sheikh</strong>
                    <span className="text-[10px] text-amber-800">Dubai B2B Buyer</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* MODE: REGISTER */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Full Name *</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:border-[#C5A059]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Email *</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:border-[#C5A059]"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Mobile Phone *</label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:border-[#C5A059]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Password *</label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:border-[#C5A059]"
                  required
                />
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">
                  Optional Commercial / B2B Profile
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={regCompany}
                    onChange={(e) => setRegCompany(e.target.value)}
                    placeholder="Company / Firm Name"
                    className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded focus:border-[#C5A059]"
                  />
                  <input
                    type="text"
                    maxLength={15}
                    value={regGstin}
                    onChange={(e) => setRegGstin(e.target.value)}
                    placeholder="GSTIN (for Input Tax Credit)"
                    className="w-full px-2 py-1 text-xs uppercase font-mono bg-white border border-slate-300 rounded focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-slate-950 hover:bg-[#846328] text-white font-medium rounded-full text-xs uppercase tracking-wider shadow-[0_4px_16px_rgba(15,23,42,0.1)] transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? 'Creating Atelier Profile...' : 'Complete Registration'}
              </button>
            </form>
          )}

          {/* MODE: FORGOT PASSWORD */}
          {mode === 'forgot' && (
            <div className="space-y-3 text-xs">
              <p className="text-slate-600 text-xs">
                Enter your registered email address to receive password reset instructions.
              </p>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#C5A059]"
              />
              {forgotSent ? (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Password reset link transmitted to your email.</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setForgotSent(true)}
                  className="w-full py-2 bg-slate-900 text-white rounded-lg font-bold"
                >
                  Send Reset Link
                </button>
              )}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs text-[#9E7A1C] font-semibold hover:underline"
                >
                  Back to Sign In
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
