import React, { useState } from 'react';
import {
  Briefcase,
  X,
  CheckCircle2,
  DollarSign,
  Send,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useTradeSync } from '../../context/TradeSyncContext.tsx';
import { PitchProfile } from '../../types/index.ts';
import { formatZAR } from '../../utils/formatters.ts';

interface PledgeModalProps {
  pitch: PitchProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PledgeModal: React.FC<PledgeModalProps> = ({ pitch, isOpen, onClose }) => {
  const { pledgeInvestment } = useTradeSync();
  const [pledgeAmount, setPledgeAmount] = useState<number>(50000);
  const [investorName, setInvestorName] = useState('Angels & VCs Syndicate ZA');
  const [investorEmail, setInvestorEmail] = useState('invest@sa-impact.co.za');
  const [message, setMessage] = useState(
    'Impressive gross margin and consistent WhatsApp ledger track record. We are interested in scheduling a 30-min due diligence call regarding your franchise rollout.'
  );
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !pitch) return null;

  const handlePledge = (e: React.FormEvent) => {
    e.preventDefault();
    pledgeInvestment(pitch.id, pledgeAmount, message);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1600);
  };

  const presetAmounts = [25000, 50000, 100000, 250000];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-6 text-[#0B192C] dark:text-slate-100 transition-colors">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-500/30">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0B192C] dark:text-white">Pledge Term Sheet &amp; Direct Message</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{pitch.businessName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close pledge modal"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 dark:text-emerald-400 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-[#0B192C] dark:text-white">Term Sheet Pledge Dispatched!</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs">
              You pledged <strong className="text-emerald-600 dark:text-emerald-400">{formatZAR(pledgeAmount)}</strong> to {pitch.businessName}. Founder {pitch.founderName} has received your direct message and due diligence request.
            </p>
          </div>
        ) : (
          <form onSubmit={handlePledge} className="my-5 space-y-4 text-xs">
            {/* Target highlight */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Round Goal:</span>
                <span className="text-sm font-bold text-[#0B192C] dark:text-white">{formatZAR(pitch.fundingGoal)}</span>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">for {pitch.equityOffered}% Equity</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-bold block">Current Committed:</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatZAR(pitch.amountRaised)}</span>
              </div>
            </div>

            {/* Check Size Presets */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">
                Select Investment Check Size (ZAR):
              </label>
              <div className="grid grid-cols-4 gap-2">
                {presetAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setPledgeAmount(amt)}
                    className={`py-2 rounded-xl font-bold transition text-xs cursor-pointer ${
                      pledgeAmount === amt
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:text-[#0B192C] dark:hover:text-white border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {formatZAR(amt, { showCents: false })}
                  </button>
                ))}
              </div>
            </div>

            {/* Investor Details */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Investor / Syndicate Name:</label>
                <input
                  type="text"
                  required
                  value={investorName}
                  onChange={(e) => setInvestorName(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 p-2 text-[#0B192C] dark:text-slate-100 focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-950"
                />
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Email / WhatsApp:</label>
                <input
                  type="text"
                  required
                  value={investorEmail}
                  onChange={(e) => setInvestorEmail(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 p-2 text-[#0B192C] dark:text-slate-100 focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-950"
                />
              </div>
            </div>

            {/* Direct Message to Founder */}
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">
                Direct Message to Founder ({pitch.founderName}):
              </label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 p-2.5 text-[#0B192C] dark:text-slate-100 leading-relaxed focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-950"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-xs font-bold text-white shadow-md shadow-blue-600/30 transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Pledge {formatZAR(pledgeAmount)} &amp; Send Message</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
