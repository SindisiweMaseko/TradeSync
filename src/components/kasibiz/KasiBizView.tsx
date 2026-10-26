import React, { useState } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Percent,
  PlusCircle,
  MessageSquare,
  FileText,
  Search,
  Filter,
  Trash2,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { useTradeSync } from '../../context/TradeSyncContext.tsx';
import { formatZAR, formatDate, formatRelativeTime } from '../../utils/formatters.ts';
import { WhatsAppParserModal } from './WhatsAppParserModal.tsx';
import { ManualTransactionModal } from './ManualTransactionModal.tsx';
import { InvoiceModal } from './InvoiceModal.tsx';

export const KasiBizView: React.FC = () => {
  const {
    business,
    transactions,
    deleteTransaction,
    healthScoreBreakdown,
  } = useTradeSync();

  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE' | 'WHATSAPP'>('ALL');

  // Calculations
  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpense;
  const netMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;
  const whatsappTxCount = transactions.filter((t) => t.source === 'WHATSAPP').length;

  // Filtered transactions
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'INCOME') return t.type === 'INCOME';
    if (filterType === 'EXPENSE') return t.type === 'EXPENSE';
    if (filterType === 'WHATSAPP') return t.source === 'WHATSAPP';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-emerald-500/20 dark:text-emerald-400 text-[11px] font-bold border border-blue-200 dark:border-emerald-500/30">
              Pillar 1: Financial Intelligence
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Omnichannel KasiBiz Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0B192C] dark:text-white tracking-tight">
            Real-Time Cash-Flow &amp; Smart Ledger
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
            Log sales by WhatsApp voice/text notes, generate compliant tax invoices, and monitor your bankable health score.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* WhatsApp Voice / Text Parser */}
          <button
            onClick={() => setIsWhatsAppModalOpen(true)}
            aria-label="Open WhatsApp Note Parser"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Note</span>
          </button>

          {/* Add Transaction Manual */}
          <button
            onClick={() => setIsManualModalOpen(true)}
            aria-label="Open Manual Transaction Entry"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-[#0B192C] dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-bold text-xs transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-blue-600 dark:text-emerald-400" />
            <span>+ Manual Entry</span>
          </button>

          {/* Instant PDF Invoicing */}
          <button
            onClick={() => setIsInvoiceModalOpen(true)}
            aria-label="Open Tax Invoice Generator"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 active:scale-95 text-blue-700 dark:bg-amber-500/20 dark:hover:bg-amber-500/30 dark:text-amber-300 border border-blue-200 dark:border-amber-500/30 font-bold text-xs transition cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Instant Tax Invoice</span>
          </button>
        </div>
      </div>

      {/* Financial Overview Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Income */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden transition-colors duration-200">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Sales Turnover</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#0B192C] dark:text-white">{formatZAR(totalIncome)}</div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-blue-600 dark:text-emerald-400 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{transactions.filter((t) => t.type === 'INCOME').length} recorded sales</span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden transition-colors duration-200">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Operating Expenses</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#0B192C] dark:text-white">{formatZAR(totalExpense)}</div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500 dark:text-slate-400">
            <span>Stock, utilities, packaging &amp; wages</span>
          </div>
        </div>

        {/* Net Profit */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden transition-colors duration-200">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Net Margin &amp; Profit</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-sky-500/10 dark:text-sky-400">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-black ${netProfit >= 0 ? 'text-blue-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {formatZAR(netProfit)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-emerald-500/20 dark:text-emerald-400">
              {netMargin.toFixed(1)}% Net Margin
            </span>
            <span className="text-slate-400">• Positive Cash Flow</span>
          </div>
        </div>

        {/* Daily Cash Float & WhatsApp Status */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden transition-colors duration-200">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Till Float &amp; WhatsApp</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-purple-500/10 dark:text-purple-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#0B192C] dark:text-white">R 500.00 Float</div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-indigo-600 dark:text-purple-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{whatsappTxCount} WhatsApp Voice/Text entries</span>
          </div>
        </div>
      </div>

      {/* Business Health Score Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
        {/* Left: Score Gauge */}
        <div className="flex flex-col justify-center items-center text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80">
          <div className="relative flex items-center justify-center w-28 h-28 mb-3">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                strokeWidth="10"
                className="stroke-slate-200 dark:stroke-slate-800"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                strokeWidth="10"
                strokeDasharray={264}
                strokeDashoffset={264 - (264 * healthScoreBreakdown.totalScore) / 100}
                strokeLinecap="round"
                className="stroke-blue-600 dark:stroke-emerald-500 transition-all duration-1000"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-[#0B192C] dark:text-white leading-none">
                {healthScoreBreakdown.totalScore}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold mt-1">out of 100</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-emerald-500/20 dark:text-emerald-300 text-xs font-bold border border-blue-200 dark:border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{healthScoreBreakdown.gradeTitle}</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            Evaluated using verified ledger consistency, CIPC standing, and group buying discipline.
          </p>
        </div>

        {/* Center: Detailed 4-Pillar Breakdown */}
        <div className="space-y-3 justify-center flex flex-col">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Health Score Criteria (0 - 100)
          </h4>

          {/* Profitability */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-700 dark:text-slate-300">Profitability &amp; Cash-Flow Margin</span>
              <span className="font-bold text-blue-600 dark:text-emerald-400">{healthScoreBreakdown.profitabilityPoints} / 25 pts</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-blue-600 dark:bg-emerald-500 rounded-full"
                style={{ width: `${(healthScoreBreakdown.profitabilityPoints / 25) * 100}%` }}
              />
            </div>
          </div>

          {/* Ledger Discipline */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-700 dark:text-slate-300">Ledger Discipline &amp; WhatsApp Logging</span>
              <span className="font-bold text-blue-600 dark:text-sky-400">{healthScoreBreakdown.ledgerDisciplinePoints} / 25 pts</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-blue-500 dark:bg-sky-500 rounded-full"
                style={{ width: `${(healthScoreBreakdown.ledgerDisciplinePoints / 25) * 100}%` }}
              />
            </div>
          </div>

          {/* Compliance */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-700 dark:text-slate-300">CIPC, SARS PIN &amp; B-BBEE Standing</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">{healthScoreBreakdown.compliancePoints} / 25 pts</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${(healthScoreBreakdown.compliancePoints / 25) * 100}%` }}
              />
            </div>
          </div>

          {/* Academy & Supply */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-700 dark:text-slate-300">Academy Lessons &amp; SupaSupplier Pools</span>
              <span className="font-bold text-indigo-600 dark:text-purple-400">{healthScoreBreakdown.growthEducationPoints} / 25 pts</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-indigo-600 dark:bg-purple-500 rounded-full"
                style={{ width: `${(healthScoreBreakdown.growthEducationPoints / 25) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Action Items to Boost Score */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Recommended Actions to Reach 90+</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {healthScoreBreakdown.actionItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Credit rating updated daily</span>
            <span className="text-blue-600 dark:text-emerald-400 font-semibold">Tender &amp; Angel Eligible</span>
          </div>
        </div>
      </div>

      {/* Transaction History Ledger */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors duration-200">
        {/* Ledger Header & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[#0B192C] dark:text-white flex items-center gap-2">
              <span>Verified Transaction Ledger</span>
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                ({filteredTransactions.length} records)
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Search and filter your audited omnichannel revenue and expense records
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 pl-8 pr-3 py-1.5 text-xs text-[#0B192C] dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-1 text-xs">
              {(['ALL', 'INCOME', 'EXPENSE', 'WHATSAPP'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setFilterType(filter)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer text-[11px] ${
                    filterType === filter
                      ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-white shadow-xs font-bold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-[#0B192C] dark:hover:text-slate-200'
                  }`}
                >
                  {filter === 'ALL'
                    ? 'All'
                    : filter === 'INCOME'
                    ? 'Income'
                    : filter === 'EXPENSE'
                    ? 'Expenses'
                    : 'WhatsApp'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Date / Time</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4 text-right">Amount (ZAR)</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No transactions match your search or filter.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition">
                    <td className="py-3 px-4 whitespace-nowrap text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                      {formatRelativeTime(tx.createdAt)}
                    </td>
                    <td className="py-3 px-4 font-medium text-[#0B192C] dark:text-white max-w-xs truncate">
                      {tx.description}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] border border-slate-200 dark:border-slate-700 font-medium">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {tx.source === 'WHATSAPP' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30 text-[10px] font-bold">
                          <MessageSquare className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-[10px]">
                          <span>Web App</span>
                        </span>
                      )}
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-bold whitespace-nowrap ${
                        tx.type === 'INCOME' ? 'text-blue-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {tx.type === 'INCOME' ? '+' : '-'} {formatZAR(tx.amount)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => deleteTransaction(tx.id)}
                        title="Delete transaction"
                        aria-label={`Delete transaction ${tx.description}`}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <WhatsAppParserModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
      />
      <ManualTransactionModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
      />
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
      />
    </div>
  );
};
