import React, { useState } from 'react';
import {
  Landmark,
  ShieldCheck,
  FileCheck2,
  CheckCircle2,
  Clock,
  ExternalLink,
  Sparkles,
  Award,
  ChevronRight,
  AlertCircle,
  FileText,
  BadgeCheck,
} from 'lucide-react';
import { useTradeSync } from '../../context/TradeSyncContext.tsx';
import { GrantOpportunity } from '../../types/index.ts';
import { formatZAR, formatDate } from '../../utils/formatters.ts';
import { ProposalModal } from './ProposalModal.tsx';

export const GrowthFundView: React.FC = () => {
  const {
    grants,
    business,
    complianceVault,
    toggleComplianceItem,
    healthScoreBreakdown,
  } = useTradeSync();

  const [selectedGrantForProposal, setSelectedGrantForProposal] = useState<GrantOpportunity | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredGrants = grants.filter((g) => {
    if (filterType === 'ALL') return true;
    return g.fundingType === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 text-[11px] font-bold border border-blue-200 dark:border-blue-500/30">
              Pillar 3: Capital &amp; Compliance
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">GrowthFund Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0B192C] dark:text-white tracking-tight">
            Compliance Vault &amp; Grant Matcher
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
            Store and verify CIPC, SARS PIN, and B-BBEE certificates to auto-fill high-value South African youth grants.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-right">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Tender Readiness</span>
            <span className="text-sm font-extrabold text-blue-700 dark:text-emerald-400 flex items-center justify-end gap-1">
              <ShieldCheck className="w-4 h-4" />
              <span>{complianceVault.cipcStatus === 'VERIFIED' && complianceVault.sarsStatus === 'VALID' ? '100% Eligible' : '75% Complete'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Central Compliance Vault Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-emerald-400" />
            <span>Official South African Compliance Vault</span>
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">Click any card to toggle verification status</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* CIPC Card */}
          <div
            onClick={() => toggleComplianceItem('cipc')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
              complianceVault.cipcStatus === 'VERIFIED'
                ? 'bg-white dark:bg-slate-900 border-blue-400 dark:border-emerald-500/40 shadow-xs'
                : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">CIPC Registration</span>
              {complianceVault.cipcStatus === 'VERIFIED' ? (
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-emerald-500/20 dark:text-emerald-400 text-[10px] font-bold border border-blue-200 dark:border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verified</span>
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 text-[10px] font-bold border border-amber-200 dark:border-amber-500/30">
                  Pending
                </span>
              )}
            </div>
            <div className="text-sm font-bold text-[#0B192C] dark:text-white">
              {business.cipcNumber || 'Unregistered Entity'}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              {complianceVault.cipcStatus === 'VERIFIED'
                ? 'Enterprise active with Companies & Intellectual Property Commission'
                : 'Tap to simulate 24-hr CIPC registration'}
            </p>
          </div>

          {/* SARS PIN */}
          <div
            onClick={() => toggleComplianceItem('sars')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
              complianceVault.sarsStatus === 'VALID'
                ? 'bg-white dark:bg-slate-900 border-blue-400 dark:border-emerald-500/40 shadow-xs'
                : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">SARS Tax PIN</span>
              {complianceVault.sarsStatus === 'VALID' ? (
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-emerald-500/20 dark:text-emerald-400 text-[10px] font-bold border border-blue-200 dark:border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Good Standing</span>
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 text-[10px] font-bold border border-amber-200 dark:border-amber-500/30">
                  Action Due
                </span>
              )}
            </div>
            <div className="text-sm font-bold text-[#0B192C] dark:text-white font-mono">
              {business.sarsPinValid ? 'PIN: 9482-7103-21' : 'No Active PIN'}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Required for government tender awards &amp; SEFA low-interest facilities
            </p>
          </div>

          {/* B-BBEE Level 1 */}
          <div
            onClick={() => toggleComplianceItem('bbbee')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-emerald-500/40 hover:border-blue-400 dark:hover:border-emerald-500 transition-all cursor-pointer shadow-xs"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">B-BBEE Status</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-emerald-500/20 dark:text-emerald-400 text-[10px] font-bold border border-blue-200 dark:border-emerald-500/30 flex items-center gap-1">
                <BadgeCheck className="w-3 h-3" />
                <span>Level {business.bbbeeLevel ?? 1}</span>
              </span>
            </div>
            <div className="text-sm font-bold text-[#0B192C] dark:text-white">
              Sworn Affidavit
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              135% Procurement Recognition for 100% Black Youth-Owned SMMEs
            </p>
          </div>

          {/* CSD Tender Database */}
          <div
            onClick={() => toggleComplianceItem('csd')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              complianceVault.csdStatus === 'ACTIVE'
                ? 'bg-white dark:bg-slate-900 border-blue-400 dark:border-emerald-500/40 shadow-xs'
                : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">CSD Supplier Reg</span>
              {complianceVault.csdStatus === 'ACTIVE' ? (
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-emerald-500/20 dark:text-emerald-400 text-[10px] font-bold border border-blue-200 dark:border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Active</span>
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-[10px]">
                  Unregistered
                </span>
              )}
            </div>
            <div className="text-sm font-bold text-[#0B192C] dark:text-white font-mono">
              {business.csdRegistered ? 'MAAA-098214' : 'Pending CSD'}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              National Treasury Central Supplier Database for municipal procurement
            </p>
          </div>
        </div>
      </div>

      {/* Grant Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1">
        {(['ALL', 'GRANT', 'REVOLVING_LOAN', 'EQUITY_PARTNERSHIP'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
              filterType === type
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-[#0B192C] dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
          >
            {type === 'ALL'
              ? 'All Opportunities'
              : type === 'GRANT'
              ? 'Non-Repayable Grants'
              : type === 'REVOLVING_LOAN'
              ? 'Low-Interest Concessional Loans'
              : 'Equity Growth Funds'}
          </button>
        ))}
      </div>

      {/* Grants & Tenders Matched Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredGrants.map((grant) => (
          <div
            key={grant.id}
            className="flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-400 dark:hover:border-slate-700 transition"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 font-bold text-[10px] border border-blue-200 dark:border-blue-500/30">
                      {grant.tag}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{grant.organization}</span>
                  </div>
                  <h3 className="text-base font-bold text-[#0B192C] dark:text-white leading-tight">
                    {grant.name}
                  </h3>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="flex items-center justify-end gap-1 text-xs font-bold text-blue-700 dark:text-emerald-400 bg-blue-50 dark:bg-emerald-950/60 px-2 py-1 rounded-lg border border-blue-200 dark:border-emerald-500/30">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{grant.matchedScore}% Match</span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">
                    Deadline: {formatDate(grant.deadline)}
                  </span>
                </div>
              </div>

              {/* Funding ceiling */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-slate-500 dark:text-slate-400 block font-semibold">
                    Maximum Grant Ceiling
                  </span>
                  <span className="text-lg font-black text-[#0B192C] dark:text-white">
                    {formatZAR(grant.maxFundingAmount)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase text-slate-500 dark:text-slate-400 block font-semibold">
                    Funding Structure
                  </span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    {grant.fundingType === 'GRANT' ? '100% Non-Repayable' : 'Prime - 3% Soft Facility'}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {grant.description}
              </p>

              {/* Eligibility Criteria */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 block">
                  Eligibility Criteria Check:
                </span>
                <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  {grant.eligibilityCriteria.map((c, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Auto-fill action */}
            <div className="pt-5 mt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setSelectedGrantForProposal(grant)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-xs font-bold text-white shadow-md shadow-blue-500/25 transition cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>1-Click Auto-Fill Proposal ({grant.matchedScore}% Match)</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Proposal Modal */}
      <ProposalModal
        grant={selectedGrantForProposal}
        isOpen={!!selectedGrantForProposal}
        onClose={() => setSelectedGrantForProposal(null)}
      />
    </div>
  );
};
