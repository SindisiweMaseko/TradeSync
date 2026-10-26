import React from 'react';
import {
  Wallet,
  Truck,
  Landmark,
  GraduationCap,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useTradeSync, PillarId } from '../context/TradeSyncContext.tsx';

interface PillarConfig {
  id: PillarId;
  label: string;
  sublabel: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

export const PillarNavigation: React.FC = () => {
  const { currentPillar, setCurrentPillar, pools, grants, lessons } = useTradeSync();

  const openPoolsCount = pools.filter((p) => p.status === 'OPEN').length;
  const uncompletedLessonsCount = lessons.filter((l) => !l.completed).length;

  const pillars: PillarConfig[] = [
    {
      id: 'kasibiz',
      label: 'KasiBiz OS',
      sublabel: 'WhatsApp Ledger & P&L',
      icon: Wallet,
      accentColor: 'blue',
    },
    {
      id: 'supasupplier',
      label: 'SupaSupplier',
      sublabel: 'Group Buying Pools',
      badge: `${openPoolsCount} Pools`,
      icon: Truck,
      accentColor: 'amber',
    },
    {
      id: 'growthfund',
      label: 'GrowthFund',
      sublabel: 'Compliance & Grants',
      badge: `${grants.length} Grants`,
      icon: Landmark,
      accentColor: 'blue',
    },
    {
      id: 'academy',
      label: 'Academy',
      sublabel: '2-Min Micro-Lessons',
      badge: uncompletedLessonsCount > 0 ? `${uncompletedLessonsCount} New` : 'Complete',
      icon: GraduationCap,
      accentColor: 'indigo',
    },
    {
      id: 'investors',
      label: 'Investors Market',
      sublabel: 'Pitch Reels & Due Diligence',
      badge: 'Live Deals',
      icon: Sparkles,
      accentColor: 'rose',
    },
  ];

  return (
    <nav aria-label="5 Core Pillars of TradeSync" className="w-full bg-white/90 border-b border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-2.5 no-scrollbar">
          {pillars.map((p) => {
            const Icon = p.icon;
            const isActive = currentPillar === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setCurrentPillar(p.id)}
                className={`flex-shrink-0 flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-left transition-all cursor-pointer relative border ${
                  isActive
                    ? 'bg-blue-50/90 text-blue-900 border-blue-200 shadow-xs dark:bg-slate-800 dark:text-white dark:border-slate-700/80'
                    : 'border-transparent text-slate-600 hover:text-[#0B192C] hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-850/50'
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs dark:bg-blue-500/20 dark:text-blue-400'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-800/80 dark:text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold leading-tight tracking-wide">{p.label}</span>
                    {p.badge && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none ${
                          isActive
                            ? 'bg-blue-100 text-blue-700 border border-blue-300 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30'
                            : 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                        }`}
                      >
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight">
                    {p.sublabel}
                  </span>
                </div>

                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
