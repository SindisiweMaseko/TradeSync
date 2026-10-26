import React from 'react';
import {
  TrendingUp,
  MapPin,
  ShieldCheck,
  UserCheck,
  RotateCcw,
  Store,
  Truck,
  Briefcase,
  SlidersHorizontal,
  Sun,
  Moon,
  LogOut,
  UserPlus,
} from 'lucide-react';
import { useTradeSync } from '../context/TradeSyncContext.tsx';
import { UserRole } from '../types/index.ts';
import { PWAInstallButton } from './PWAInstallButton.tsx';
import { NotificationBell, NotificationCenter } from './notifications/NotificationCenter.tsx';

export const Header: React.FC = () => {
  const {
    currentUser,
    setCurrentRole,
    business,
    healthScoreBreakdown,
    resetAllData,
    theme,
    toggleTheme,
    logout,
    setIsAuthModalOpen,
  } = useTradeSync();

  const roles: { role: UserRole; label: string; icon: React.ReactNode; color: string }[] = [
    { role: 'ENTREPRENEUR', label: 'Founder', icon: <Store className="w-3.5 h-3.5" />, color: 'emerald' },
    { role: 'SUPPLIER', label: 'Wholesale Supplier', icon: <Truck className="w-3.5 h-3.5" />, color: 'amber' },
    { role: 'INVESTOR', label: 'Angel / VC', icon: <Briefcase className="w-3.5 h-3.5" />, color: 'blue' },
    { role: 'ADMIN', label: 'Gov / Incubator', icon: <SlidersHorizontal className="w-3.5 h-3.5" />, color: 'purple' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-slate-950/90 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo & Township Tag */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-blue-500/20 border border-blue-500/30 bg-[#0B192C] p-1 flex-shrink-0">
              <img
                src="/assets/branding/image_8491ff9d.png"
                alt="TradeSync Official Logo"
                className="w-full h-full object-contain"
              />
              {/* South African flag accent dot */}
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-amber-400 border-2 border-white dark:border-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg text-[#0B192C] dark:text-white tracking-tight">
                  TradeSync
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30">
                  ZA OS
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                <MapPin className="w-3 h-3 text-blue-600 dark:text-emerald-400 flex-shrink-0" />
                <span className="truncate max-w-[140px] sm:max-w-none">
                  {business.township} • {business.businessName}
                </span>
              </div>
            </div>
          </div>

          {/* Center: Health Score Quick Pill */}
          <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-1.5">
              <div
                className={`w-2 h-2 rounded-full ${
                  healthScoreBreakdown.totalScore >= 75 ? 'bg-emerald-500' : 'bg-amber-500'
                } animate-pulse`}
              />
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Health Score:</span>
              <span className="text-xs font-bold text-[#0B192C] dark:text-white">
                {healthScoreBreakdown.totalScore}/100
              </span>
            </div>
            <div className="h-3 w-px bg-slate-200 dark:bg-slate-800" />
            <div className="flex items-center gap-1 text-xs font-semibold text-blue-700 dark:text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{healthScoreBreakdown.gradeTitle.split(':')[0]}</span>
            </div>
          </div>

          {/* Right Controls: Role Switcher, Notification Center, Theme Toggle, PWA, Reset */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Notification Center */}
            <NotificationCenter />

            {/* Theme Toggle Button: Light (Navy+White+Electric Blue) vs Dark */}
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to White mode (Navy + Electric Blue)' : 'Switch to Dark mode'}
              title={theme === 'dark' ? 'Switch to White mode (Navy + Electric Blue)' : 'Switch to Dark mode'}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 transition-all cursor-pointer font-medium text-xs shadow-xs"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">White Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-blue-600" />
                  <span className="hidden sm:inline">Dark Mode</span>
                </>
              )}
            </button>

            {/* Perspective Selector (Critical for testing multi-role perspectives) */}
            <div className="flex items-center bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-lg p-0.5">
              <span className="hidden sm:inline-block px-2 text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                Role:
              </span>
              <select
                aria-label="Switch User Role Perspective"
                value={currentUser.role}
                onChange={(e) => setCurrentRole(e.target.value as UserRole)}
                className="bg-transparent text-xs font-semibold text-[#0B192C] dark:text-slate-200 py-1 px-1.5 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                {roles.map((r) => (
                  <option key={r.role} value={r.role} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Notification Center Trigger Bell */}
            <NotificationBell />

            {/* User Profile Pill & Account Switcher */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              title="Switch Account or Register New Profile"
              className="hidden md:flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-lg border border-slate-200 bg-slate-100 hover:bg-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 transition cursor-pointer text-xs"
            >
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.fullName}
                  className="w-5 h-5 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {currentUser.fullName.charAt(0)}
                </div>
              )}
              <span className="font-bold text-[#0B192C] dark:text-white max-w-[80px] truncate">
                {currentUser.fullName.split(' ')[0]}
              </span>
              <UserPlus className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            </button>

            {/* Sign Out Button (returns directly to Login & Register Section) */}
            <button
              onClick={() => logout()}
              title="Sign Out / Change Account"
              aria-label="Sign Out"
              className="flex items-center gap-1 p-1.5 sm:px-2 sm:py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 dark:border-slate-800 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-rose-950/30 transition cursor-pointer text-xs font-semibold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Sign Out</span>
            </button>

            {/* PWA Install Button */}
            <PWAInstallButton />

            {/* Quick Reset Button for Demo Testing */}
            <button
              onClick={() => resetAllData()}
              title="Reset Demo Data"
              aria-label="Reset Demo Data"
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-900 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
