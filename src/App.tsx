import React from 'react';
import { TradeSyncProvider, useTradeSync } from './context/TradeSyncContext.tsx';
import { Header } from './components/Header.tsx';
import { RoleBanner } from './components/shared/RoleBanner.tsx';
import { PillarNavigation } from './components/PillarNavigation.tsx';
import { KasiBizView } from './components/kasibiz/KasiBizView.tsx';
import { SupaSupplierView } from './components/supasupplier/SupaSupplierView.tsx';
import { GrowthFundView } from './components/growthfund/GrowthFundView.tsx';
import { AcademyView } from './components/academy/AcademyView.tsx';
import { InvestorsMarketView } from './components/investors/InvestorsMarketView.tsx';
import { OfflineIndicator } from './components/OfflineIndicator.tsx';
import { Heart, ShieldCheck, Zap } from 'lucide-react';

import { AuthSection } from './components/auth/AuthSection.tsx';
import { AuthModal } from './components/auth/AuthModal.tsx';

const AppContent: React.FC = () => {
  const { currentPillar, isAuthenticated, isAuthModalOpen, setIsAuthModalOpen } = useTradeSync();

  // If not logged in, display the Login & Register Section first!
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-[#0B192C] dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
        <AuthSection />
        <OfflineIndicator />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0B192C] dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Application Header */}
      <Header />

      {/* Role Context Bar */}
      <RoleBanner />

      {/* 5 Core Pillars Navigation */}
      <PillarNavigation />

      {/* Main Pillar Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentPillar === 'kasibiz' && <KasiBizView />}
        {currentPillar === 'supasupplier' && <SupaSupplierView />}
        {currentPillar === 'growthfund' && <GrowthFundView />}
        {currentPillar === 'academy' && <AcademyView />}
        {currentPillar === 'investors' && <InvestorsMarketView />}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 bg-white dark:border-slate-900 dark:bg-slate-950/80 py-6 text-xs text-slate-500 dark:text-slate-400 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#0B192C] dark:text-slate-300">TradeSync</span>
            <span>•</span>
            <span>Digital OS for South African Township SMMEs &amp; Youth Founders</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 text-blue-600 dark:text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>CIPC &amp; SARS Verified</span>
            </span>
            <span>•</span>
            <span>Soweto • Tembisa • Alex • Khayelitsha</span>
          </div>
        </div>
      </footer>

      {/* In-App Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* PWA Offline Banner */}
      <OfflineIndicator />
    </div>
  );
};

export default function App() {
  return (
    <TradeSyncProvider>
      <AppContent />
    </TradeSyncProvider>
  );
}
