import React, { useState } from 'react';
import {
  Store,
  Truck,
  Briefcase,
  SlidersHorizontal,
  Lock,
  Mail,
  Phone,
  User as UserIcon,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  MapPin,
  Sparkles,
  Building,
  DollarSign,
  HelpCircle,
} from 'lucide-react';
import { useTradeSync } from '../../context/TradeSyncContext.tsx';
import { UserRole, RegisterPayload } from '../../types/index.ts';
import { DEMO_ACCOUNTS } from '../../data/seedData.ts';
import { validateSAPhoneNumber, validateEmail, validatePasswordOrPIN } from '../../utils/authValidation.ts';

interface AuthSectionProps {
  onSuccess?: () => void;
  isModal?: boolean;
}

export const AuthSection: React.FC<AuthSectionProps> = ({ onSuccess, isModal = false }) => {
  const { login, register, switchDemoUser, theme, toggleTheme } = useTradeSync();

  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'personas'>('login');

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('073 892 4110');
  const [loginPassword, setLoginPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register Form State
  const [regFullName, setRegFullName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('ENTREPRENEUR');
  const [regBusinessName, setRegBusinessName] = useState('');
  const [regTownship, setRegTownship] = useState('Soweto');
  const [regIndustry, setRegIndustry] = useState('Food & Kota Eatery');
  const [regCipcRegistered, setRegCipcRegistered] = useState(true);
  const [regStartingFloat, setRegStartingFloat] = useState(500);
  const [regError, setRegError] = useState<string | null>(null);

  // Real-time validation cues
  const phoneValidation = validateSAPhoneNumber(regPhone);
  const emailValid = validateEmail(regEmail);
  const passwordCheck = validatePasswordOrPIN(regPassword);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginIdentifier.trim()) {
      setLoginError('Please enter your South African phone number or email address');
      return;
    }

    if (!loginPassword || loginPassword.length < 4) {
      setLoginError('Please enter your security PIN or password (min 4 characters)');
      return;
    }

    const res = login({ identifier: loginIdentifier, password: loginPassword });
    if (res.success) {
      if (onSuccess) onSuccess();
    } else {
      setLoginError(res.error || 'Failed to authenticate');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regFullName.trim()) {
      setRegError('Please provide your full legal name');
      return;
    }

    if (!phoneValidation.isValid) {
      setRegError(phoneValidation.error || 'Invalid South African mobile number');
      return;
    }

    if (!emailValid) {
      setRegError('Please enter a valid email address');
      return;
    }

    if (!passwordCheck.isValid) {
      setRegError(passwordCheck.error || 'Security PIN / Password must be at least 6 characters');
      return;
    }

    const payload: RegisterPayload = {
      fullName: regFullName,
      phoneNumber: phoneValidation.normalized || regPhone,
      email: regEmail,
      password: regPassword,
      role: regRole,
      businessName: regBusinessName || `${regFullName}'s Enterprise`,
      township: regTownship,
      industry: regIndustry,
      cipcRegistered: regCipcRegistered,
      startingFloat: Number(regStartingFloat) || 0,
    };

    const res = register(payload);
    if (res.success) {
      if (onSuccess) onSuccess();
    } else {
      setRegError(res.error || 'Registration failed');
    }
  };

  const handlePersonaSelect = (personaKey: string) => {
    switchDemoUser(personaKey);
    if (onSuccess) onSuccess();
  };

  const townships = [
    'Soweto (Orlando, Vilakazi, Diepkloof)',
    'Tembisa (Winnie Mandela, Hospital View)',
    'Alexandra (Alex 1st–20th Avenues)',
    'Khayelitsha (Harare, Site B, Kuyasa)',
    'Umlazi (Durban KZN)',
    'Mamelodi (Pretoria East)',
    'Mitchells Plain (Cape Town)',
    'Johannesburg Central Hub',
  ];

  const industries = [
    'Food & Kota Eatery',
    'Spaza & Mini Supermarket',
    'AgriTech & Hydroponics',
    'Logistics & Two-Wheel Delivery',
    'Textile & Fashion',
    'Tech & Digital Services',
    'Hair Salon & Wellness',
    'Automotive & Spares',
  ];

  return (
    <div className={`w-full ${isModal ? '' : 'min-h-screen py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center bg-[#F8FAFC] dark:bg-slate-950 transition-colors'}`}>
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* Brand Header */}
        {!isModal && (
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 text-xs font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-amber-400 border border-blue-600 animate-pulse" />
              <span>Republic of South Africa • Youth SMME Ecosystem</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-xl shadow-blue-500/25 border-2 border-blue-500/30 bg-[#0B192C] flex items-center justify-center p-1.5 flex-shrink-0">
                <img
                  src="/assets/branding/image_8491ff9d.png"
                  alt="TradeSync Official Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-black text-[#0B192C] dark:text-white tracking-tight leading-tight">
                  TradeSync
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400">
                  Township Enterprise &amp; Trade Synchronization OS
                </p>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
              The all-in-one digital operating system, supply-chain aggregator, and global investment platform for youth entrepreneurs and small businesses in South Africa.
            </p>

            {/* Quick Value Pillars Highlights */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
              <span className="px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium shadow-xs">
                📱 WhatsApp Sales &amp; Voice Ledger
              </span>
              <span className="px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium shadow-xs">
                🤝 SupaSupplier Group Buying
              </span>
              <span className="px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium shadow-xs">
                🏛️ CIPC &amp; SARS Grant Vault
              </span>
              <span className="px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium shadow-xs">
                🎥 60s Investor Pitch Reels
              </span>
            </div>
          </div>
        )}

        {/* Auth Container Card */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-colors">
          {/* Modal branded top bar */}
          {isModal && (
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-950/40">
              <div className="w-9 h-9 rounded-xl overflow-hidden bg-[#0B192C] border border-blue-500/30 shadow-sm flex items-center justify-center p-1 flex-shrink-0">
                <img
                  src="/assets/branding/image_8491ff9d.png"
                  alt="TradeSync Official Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-base font-black text-[#0B192C] dark:text-white tracking-tight leading-tight">
                  TradeSync South Africa
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Switch account or register a new township enterprise profile
                </p>
              </div>
            </div>
          )}

          {/* Segmented Navigation Tabs */}
          <div className="grid grid-cols-3 border-b border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold text-center bg-slate-50/70 dark:bg-slate-950/50">
            <button
              onClick={() => setActiveTab('login')}
              className={`py-3.5 px-4 transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'login'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-[#0B192C] dark:hover:text-white'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Sign In</span>
            </button>

            <button
              onClick={() => setActiveTab('register')}
              className={`py-3.5 px-4 transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'register'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-[#0B192C] dark:hover:text-white'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>Register Account</span>
            </button>

            <button
              onClick={() => setActiveTab('personas')}
              className={`py-3.5 px-4 transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'personas'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-[#0B192C] dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>1-Click Personas</span>
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {/* 1. SIGN IN TAB */}
            {activeTab === 'login' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-[#0B192C] dark:text-white tracking-tight">
                    Welcome Back to TradeSync
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Sign in with your South African mobile number, WhatsApp handle, or registered email.
                  </p>
                </div>

                {loginError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-400 flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      SA Mobile (+27) or Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="e.g. 073 892 4110 or lindiwe@kasikota.co.za"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-[#0B192C] dark:text-slate-100 text-xs focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-950 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-slate-700 dark:text-slate-300 font-semibold">
                        Security PIN / Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setLoginError('Demo Mode: Your PIN is 123456 (or choose 1-Click Personas)')}
                        className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        Forgot PIN?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter 6-digit PIN or password"
                        className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-[#0B192C] dark:text-slate-100 text-xs focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-950 transition font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                      <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-0" />
                      <span>Remember this device on WhatsApp &amp; Web</span>
                    </label>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>256-bit Encrypted</span>
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Sign In to TradeSync OS</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Quick Persona Launchers */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
                      Fast 1-Click Persona Sign-In:
                    </span>
                    <button
                      onClick={() => setActiveTab('personas')}
                      className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                    >
                      View all 4 roles →
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {Object.entries(DEMO_ACCOUNTS).map(([key, acc]) => (
                      <button
                        key={key}
                        onClick={() => handlePersonaSelect(key)}
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50/70 dark:bg-slate-950 text-left transition-all hover:scale-102 cursor-pointer"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <img
                            src={acc.user.avatarUrl}
                            alt={acc.title}
                            className="w-6 h-6 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                          />
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                            {acc.roleBadge}
                          </span>
                        </div>
                        <h4 className="text-[11px] font-bold text-[#0B192C] dark:text-white truncate">
                          {acc.title.split(' ')[0]}
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {acc.business.township}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. REGISTER TAB */}
            {activeTab === 'register' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-[#0B192C] dark:text-white tracking-tight">
                    Create Your TradeSync Account
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Join thousands of South African youth entrepreneurs, suppliers, and impact investors.
                  </p>
                </div>

                {regError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-400 flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{regError}</span>
                  </div>
                )}

                <form onSubmit={handleRegisterSubmit} className="space-y-5 text-xs">
                  {/* Persona / Role Selector */}
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-2">
                      1. Select Your Primary Role:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setRegRole('ENTREPRENEUR')}
                        className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                          regRole === 'ENTREPRENEUR'
                            ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-600 text-blue-950 dark:text-white shadow-sm ring-1 ring-blue-600'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Store className={`w-5 h-5 ${regRole === 'ENTREPRENEUR' ? 'text-blue-600' : 'text-slate-400'}`} />
                          {regRole === 'ENTREPRENEUR' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                        </div>
                        <div className="mt-2">
                          <h4 className="font-bold text-xs text-[#0B192C] dark:text-white">Youth Founder / SMME</h4>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Spazas, kotas, salons, bakeries, agritech.
                          </p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRegRole('SUPPLIER')}
                        className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                          regRole === 'SUPPLIER'
                            ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-600 text-blue-950 dark:text-white shadow-sm ring-1 ring-blue-600'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Truck className={`w-5 h-5 ${regRole === 'SUPPLIER' ? 'text-blue-600' : 'text-slate-400'}`} />
                          {regRole === 'SUPPLIER' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                        </div>
                        <div className="mt-2">
                          <h4 className="font-bold text-xs text-[#0B192C] dark:text-white">Wholesale Supplier</h4>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                            FMCG distributors, bulk packaging, logistics.
                          </p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRegRole('INVESTOR')}
                        className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                          regRole === 'INVESTOR'
                            ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-600 text-blue-950 dark:text-white shadow-sm ring-1 ring-blue-600'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Briefcase className={`w-5 h-5 ${regRole === 'INVESTOR' ? 'text-blue-600' : 'text-slate-400'}`} />
                          {regRole === 'INVESTOR' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                        </div>
                        <div className="mt-2">
                          <h4 className="font-bold text-xs text-[#0B192C] dark:text-white">Angel / VC Investor</h4>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Impact capital, syndicate funds, angel debt.
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Personal Contact Details */}
                  <div className="space-y-3 pt-2">
                    <label className="block text-slate-700 dark:text-slate-300 font-bold">
                      2. Personal &amp; Contact Information:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 mb-1">Full Legal Name</label>
                        <input
                          type="text"
                          required
                          value={regFullName}
                          onChange={(e) => setRegFullName(e.target.value)}
                          placeholder="e.g. Sipho Ndlovu"
                          className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-[#0B192C] dark:text-slate-100 text-xs focus:outline-none focus:border-blue-600 focus:bg-white"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-slate-600 dark:text-slate-400">SA Mobile (+27)</label>
                          {phoneValidation.isValid && (
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" /> Valid SA
                            </span>
                          )}
                        </div>
                        <input
                          type="text"
                          required
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="e.g. 072 456 7890 or +27 83 123 4567"
                          className={`w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border text-[#0B192C] dark:text-slate-100 text-xs focus:outline-none focus:bg-white ${
                            regPhone && !phoneValidation.isValid
                              ? 'border-rose-400 dark:border-rose-600'
                              : 'border-slate-300 dark:border-slate-700 focus:border-blue-600'
                          }`}
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-slate-600 dark:text-slate-400">Email Address</label>
                          {emailValid && (
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" /> Valid
                            </span>
                          )}
                        </div>
                        <input
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="sipho@kasi.co.za"
                          className={`w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border text-[#0B192C] dark:text-slate-100 text-xs focus:outline-none focus:bg-white ${
                            regEmail && !emailValid
                              ? 'border-rose-400 dark:border-rose-600'
                              : 'border-slate-300 dark:border-slate-700 focus:border-blue-600'
                          }`}
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-slate-600 dark:text-slate-400">Security PIN / Password</label>
                          {passwordCheck.isValid && (
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                              {passwordCheck.strength.toUpperCase()}
                            </span>
                          )}
                        </div>
                        <input
                          type="password"
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="6-digit PIN or password"
                          className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-[#0B192C] dark:text-slate-100 text-xs focus:outline-none focus:border-blue-600 focus:bg-white font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Business & Township Details (for Entrepreneurs & Suppliers) */}
                  {regRole !== 'INVESTOR' && (
                    <div className="space-y-3 pt-2">
                      <label className="block text-slate-700 dark:text-slate-300 font-bold">
                        3. Enterprise &amp; Location Profile:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-600 dark:text-slate-400 mb-1">Trading / Enterprise Name</label>
                          <input
                            type="text"
                            required
                            value={regBusinessName}
                            onChange={(e) => setRegBusinessName(e.target.value)}
                            placeholder="e.g. Ndlovu Fresh Spaza & Bakery"
                            className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-[#0B192C] dark:text-slate-100 text-xs focus:outline-none focus:border-blue-600 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-600 dark:text-slate-400 mb-1">Township / Municipality</label>
                          <select
                            value={regTownship}
                            onChange={(e) => setRegTownship(e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-[#0B192C] dark:text-slate-100 text-xs focus:outline-none focus:border-blue-600 focus:bg-white cursor-pointer"
                          >
                            {townships.map((t) => (
                              <option key={t} value={t.split(' ')[0]}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-600 dark:text-slate-400 mb-1">Industry Sector</label>
                          <select
                            value={regIndustry}
                            onChange={(e) => setRegIndustry(e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-[#0B192C] dark:text-slate-100 text-xs focus:outline-none focus:border-blue-600 focus:bg-white cursor-pointer"
                          >
                            {industries.map((ind) => (
                              <option key={ind} value={ind}>
                                {ind}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-600 dark:text-slate-400 mb-1">
                            Initial Opening Till Float (ZAR)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="50"
                            value={regStartingFloat}
                            onChange={(e) => setRegStartingFloat(Number(e.target.value))}
                            className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-[#0B192C] dark:text-slate-100 text-xs focus:outline-none focus:border-blue-600 focus:bg-white"
                          />
                        </div>
                      </div>

                      {/* CIPC compliance checkbox */}
                      <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={regCipcRegistered}
                          onChange={(e) => setRegCipcRegistered(e.target.checked)}
                          className="rounded text-blue-600 focus:ring-0"
                        />
                        <div className="text-[11px] text-slate-600 dark:text-slate-300">
                          <strong className="text-[#0B192C] dark:text-white">Already CIPC Registered (PTY Ltd / Close Corp)</strong>
                          <span className="block text-slate-500 dark:text-slate-400">
                            Check this to automatically unlock tender eligibility and SEFA / NYDA grant matching.
                          </span>
                        </div>
                      </label>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <span>Complete Registration &amp; Launch OS</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* 3. 1-CLICK PERSONAS TAB */}
            {activeTab === 'personas' && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[11px] font-bold">
                      Hackathon Judge Fast-Pass
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-[#0B192C] dark:text-white tracking-tight mt-1">
                    Instant 1-Click Multi-Role Personas
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    Test the complete TradeSync platform from each stakeholder perspective with pre-populated ledgers and certified compliance profiles.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(DEMO_ACCOUNTS).map(([key, acc]) => (
                    <div
                      key={key}
                      className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all flex flex-col justify-between space-y-4 group"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={acc.user.avatarUrl}
                          alt={acc.title}
                          className="w-12 h-12 rounded-full object-cover border-2 border-slate-300 dark:border-slate-700 group-hover:border-blue-500 transition-colors flex-shrink-0"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="text-sm font-bold text-[#0B192C] dark:text-white leading-tight">
                              {acc.title}
                            </h3>
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                              {acc.roleBadge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                            {acc.tagline}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-blue-600 dark:text-emerald-400" />
                              {acc.business.township}
                            </span>
                            <span>•</span>
                            <span>{acc.user.phoneNumber}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handlePersonaSelect(key)}
                        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Launch as {acc.user.fullName.split(' ')[0]}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar inside Auth Container */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>CIPC &amp; SARS APIs Live</span>
              <span>•</span>
              <span>WhatsApp Cloud Webhook Ready</span>
            </div>

            <button
              onClick={() => handlePersonaSelect('lindiwe')}
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
            >
              Skip &amp; Explore as Guest (Lindiwe Kota Hub) →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
