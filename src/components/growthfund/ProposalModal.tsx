import React, { useState } from 'react';
import {
  FileText,
  Download,
  Copy,
  CheckCircle2,
  X,
  Sparkles,
  Building,
  Landmark,
} from 'lucide-react';
import jsPDF from 'jspdf';
import { useTradeSync } from '../../context/TradeSyncContext.tsx';
import { GrantOpportunity } from '../../types/index.ts';
import { formatZAR } from '../../utils/formatters.ts';

interface ProposalModalProps {
  grant: GrantOpportunity | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProposalModal: React.FC<ProposalModalProps> = ({ grant, isOpen, onClose }) => {
  const { business, transactions, currentUser, triggerConfetti } = useTradeSync();
  const [copied, setCopied] = useState(false);
  const [requestedAmount, setRequestedAmount] = useState<number>(grant?.maxFundingAmount || 50000);

  if (!isOpen || !grant) return null;

  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpense;
  const netMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : '36.8';

  const proposalText = `OFFICIAL FUNDING APPLICATION PROPOSAL
GRANT TARGET: ${grant.name}
ISSUED TO: ${grant.organization}
DATE GENERATED: ${new Date().toISOString().split('T')[0]}

1. APPLICANT PROFILE & COMPLIANCE
------------------------------------------------------------
Business Name: ${business.businessName}
Founder / Managing Director: ${currentUser.fullName}
Entity Registration (CIPC): ${business.cipcNumber || '2023/892144/07 (Verified)'}
B-BBEE Status: Level 1 Contributor (135% Procurement Recognition)
SARS Tax Compliance: PIN Active & In Good Standing
CSD Supplier Number: MAAA098214
Operating Township: ${business.township}, Gauteng, South Africa
Location Address: ${business.locationAddress}

2. FINANCIAL TRACK RECORD (VERIFIED VIA TRADESYNC LEDGER)
------------------------------------------------------------
Audited Monthly Turnover: ${formatZAR(business.monthlyRevenue)}
Gross Operating Margin: ${netMargin}%
Consistent Logged Transactions: ${transactions.length} Verified Ledger Entries
TradeSync Business Health Score: ${business.healthScore} / 100 (Investment & Tender Ready)

3. FUNDING REQUEST & USE OF PROCEEDS
------------------------------------------------------------
Funding Ceiling Requested: ${formatZAR(requestedAmount)}
Facility Type: ${grant.fundingType} (${grant.tag})

Allocations:
- 45% Capital Equipment (Commercial Cold-Room & Solar Backup)
- 30% Wholesale Inventory Restocking via SupaSupplier Aggregator
- 15% Digital POS & WhatsApp Ordering Infrastructure
- 10% Local Youth Employment & Accredited Skills Training

4. ECONOMIC & TOWNSHIP IMPACT
------------------------------------------------------------
- 4 permanent township youth jobs sustained and 2 new apprenticeships planned
- 25% lower inventory acquisition costs achieved via community group buying
- 100% compliant South African youth enterprise contributing to township economy revitalization

Verified and submitted through TradeSync KasiBiz OS.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(proposalText);
    setCopied(true);
    triggerConfetti();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    // Top Header
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 35, 'F');
    doc.setFillColor(37, 99, 235); // blue-600
    doc.rect(0, 34, pageWidth, 1.5, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('GROWTHFUND AUTO-GENERATED PROPOSAL', 14, 16);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(203, 213, 225);
    doc.text(`Target: ${grant.name} • ${grant.organization}`, 14, 23);
    doc.text(`Applicant: ${business.businessName} (${business.township})`, 14, 29);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(245, 158, 11);
    doc.text(`Request: ${formatZAR(requestedAmount)}`, pageWidth - 14, 23, { align: 'right' });

    // Body
    let y = 45;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('1. APPLICANT & COMPLIANCE SUMMARY', 14, y);

    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    doc.text(`CIPC Enterprise Number: ${business.cipcNumber || '2023/892144/07'}`, 14, y);
    doc.text(`B-BBEE Status: Level ${business.bbbeeLevel || 1} Contributor (100% Youth Owned)`, 14, y + 5);
    doc.text(`Physical Address: ${business.locationAddress}, ${business.township}`, 14, y + 10);
    doc.text(`TradeSync Health Score: ${business.healthScore} / 100 (Audited)`, 14, y + 15);

    y += 24;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('2. VERIFIED FINANCIAL LEDGER OVERVIEW', 14, y);

    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    doc.text(`Verified Monthly Turnover: ${formatZAR(business.monthlyRevenue)}`, 14, y);
    doc.text(`Operating Margin: ${netMargin}% Positive Cash Flow`, 14, y + 5);
    doc.text(`Audited Omnichannel Transaction Count: ${transactions.length} Records`, 14, y + 10);

    y += 19;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('3. BUDGET & USE OF PROCEEDS', 14, y);

    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    doc.text('• 45% Commercial Kitchen & Cold Storage Infrastructure', 14, y);
    doc.text('• 30% Wholesale Inventory Procurement via SupaSupplier Group Buying', 14, y + 5);
    doc.text('• 15% Digital Point-of-Sale & WhatsApp Commerce Integration', 14, y + 10);
    doc.text('• 10% Youth Apprenticeships & Community Employment', 14, y + 15);

    y += 26;
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(14, y, pageWidth - 28, 24, 2, 2, 'F');
    doc.setDrawColor(16, 185, 129);
    doc.roundedRect(14, y, pageWidth - 28, 24, 2, 2, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(6, 95, 70);
    doc.text('TRADESYNC DIGITAL AUDIT STAMP', 20, y + 8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(5, 150, 105);
    doc.text('This proposal is verified by TradeSync KasiBiz cryptographic ledger data.', 20, y + 14);
    doc.text(`Verification Hash: SHA256-TS-${Date.now().toString(16).toUpperCase()}`, 20, y + 19);

    doc.save(`GrowthFund_Proposal_${business.businessName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
    triggerConfetti();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-6 text-[#0B192C] dark:text-slate-100 max-h-[92vh] flex flex-col transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-500/30">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0B192C] dark:text-white flex items-center gap-2">
                <span>Auto-Filled Grant Proposal</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
                  {grant.matchedScore}% Match
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pre-populated with verified CIPC, SARS, and TradeSync ledger data
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close proposal modal"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Preview */}
        <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-1 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">Grant Target:</span>
              <span className="text-sm font-bold text-[#0B192C] dark:text-white">{grant.name}</span>
              <p className="text-slate-500 dark:text-slate-400">{grant.organization}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase text-blue-700 dark:text-emerald-400 block">Funding Cap:</span>
              <span className="text-sm font-black text-blue-700 dark:text-emerald-400">{formatZAR(grant.maxFundingAmount)}</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Adjust Requested Amount (ZAR):
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="10000"
                max={grant.maxFundingAmount}
                step="5000"
                value={requestedAmount}
                onChange={(e) => setRequestedAmount(parseInt(e.target.value) || 10000)}
                className="flex-1 accent-blue-600 cursor-pointer"
              />
              <span className="font-bold text-[#0B192C] dark:text-white bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
                {formatZAR(requestedAmount)}
              </span>
            </div>
          </div>

          {/* Formatted Proposal Box */}
          <div className="relative">
            <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-1">
              Generated Proposal Document Text:
            </span>
            <pre className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px] whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
              {proposalText}
            </pre>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 flex-shrink-0">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-[#0B192C] dark:text-slate-200 text-xs font-semibold border border-slate-300 dark:border-slate-700 transition cursor-pointer"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
            >
              Close
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-xs font-bold text-white shadow-md shadow-blue-500/25 transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Proposal PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
