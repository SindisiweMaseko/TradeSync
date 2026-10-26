import React from 'react';
import { Store, Truck, Briefcase, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useTradeSync } from '../../context/TradeSyncContext.tsx';

export const RoleBanner: React.FC = () => {
  const { currentUser } = useTradeSync();

  const roleDetails = {
    ENTREPRENEUR: {
      title: 'Entrepreneur Mode',
      desc: 'Active business: Lindiwe’s Gourmet Kota (Vilakazi St, Soweto). WhatsApp notes logging, instant PDF invoices, and group buying unlocked.',
      icon: Store,
      badgeColor: 'border-blue-300 bg-blue-50 text-blue-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400',
    },
    SUPPLIER: {
      title: 'Wholesale Supplier Mode',
      desc: 'Aggregated demand portal: 84+ township spazas & eateries pooling inventory orders. Wholesale discount thresholds and dispatch planning.',
      icon: Truck,
      badgeColor: 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400',
    },
    INVESTOR: {
      title: 'Angel & Impact Investor Mode',
      desc: 'Due Diligence Hub: Verified financial turnover ledgers, 60-second video pitch reels, and direct term sheet pledging for high-growth township enterprises.',
      icon: Briefcase,
      badgeColor: 'border-blue-300 bg-blue-100/70 text-blue-900 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400',
    },
    ADMIN: {
      title: 'Ecosystem & Grant Officer Mode',
      desc: 'Incubator & NYDA/SEFA Oversight: Automated compliance scoring, CIPC/SARS verification audits, and grant application auto-fill engine.',
      icon: SlidersHorizontal,
      badgeColor: 'border-indigo-300 bg-indigo-50 text-indigo-800 dark:border-purple-500/30 dark:bg-purple-500/10 dark:text-purple-400',
    },
  }[currentUser.role];

  const Icon = roleDetails.icon;

  return (
    <div className="w-full bg-slate-50/90 border-b border-slate-200 dark:bg-slate-900/40 dark:border-slate-800/80 px-4 py-2 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-bold text-[11px] ${roleDetails.badgeColor}`}>
            <Icon className="w-3.5 h-3.5" />
            <span>{roleDetails.title}</span>
          </div>
          <span className="text-slate-600 dark:text-slate-300 hidden sm:inline">{roleDetails.desc}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>Switch role in top-right menu anytime</span>
        </div>
      </div>
    </div>
  );
};
