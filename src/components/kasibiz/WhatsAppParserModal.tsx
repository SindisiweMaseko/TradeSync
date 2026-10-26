import React, { useState } from 'react';
import {
  MessageSquare,
  Mic,
  MicOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  X,
  Volume2,
  AlertCircle,
} from 'lucide-react';
import { parseWhatsAppNote, ParsedWhatsAppResult } from '../../utils/whatsappParser.ts';
import { formatZAR } from '../../utils/formatters.ts';
import { useTradeSync } from '../../context/TradeSyncContext.tsx';

interface WhatsAppParserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_NOTES = [
  'Sold 15 kota meals for R525 cash at lunchtime',
  'Bought 2x 20L cooking oil from cash and carry R780',
  'Paid electricity R450 prepaid meter',
  'Received R1,200 catering deposit from church choir',
  'Paid helper Sipho weekly wage R600',
  'Purchased 10 airtime vouchers R200 for resale',
];

export const WhatsAppParserModal: React.FC<WhatsAppParserModalProps> = ({ isOpen, onClose }) => {
  const { addTransaction, triggerConfetti } = useTradeSync();
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [parsedResult, setParsedResult] = useState<ParsedWhatsAppResult | null>(null);
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleTextChange = (text: string) => {
    setInputText(text);
    if (text.trim().length > 3) {
      const res = parseWhatsAppNote(text);
      setParsedResult(res);
    } else {
      setParsedResult(null);
    }
  };

  const handleSimulateVoice = () => {
    if (isRecording) {
      setIsRecording(false);
      const randomSample = SAMPLE_NOTES[Math.floor(Math.random() * SAMPLE_NOTES.length)];
      handleTextChange(randomSample);
    } else {
      setIsRecording(true);
      setRecordingSeconds(0);
      const interval = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 3) {
            clearInterval(interval);
            setIsRecording(false);
            const randomSample = SAMPLE_NOTES[Math.floor(Math.random() * SAMPLE_NOTES.length)];
            handleTextChange(randomSample);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const handleConfirmAndAdd = () => {
    if (!parsedResult || !parsedResult.success) return;

    addTransaction({
      type: parsedResult.type,
      category: parsedResult.category,
      amount: parsedResult.amount,
      description: parsedResult.description,
      source: 'WHATSAPP',
    });

    triggerConfetti();
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      setInputText('');
      setParsedResult(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-6 text-[#0B192C] dark:text-slate-100 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center border border-blue-200 dark:border-emerald-500/30">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0B192C] dark:text-white flex items-center gap-1.5">
                <span>WhatsApp Speech &amp; Text Parser</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                  Auto-Synced
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Log township sales &amp; cash expenses right from your mobile chat or voice notes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close WhatsApp parser modal"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Voice Note Simulation & Input */}
        <div className="my-5 space-y-4">
          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-850 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <button
                onClick={handleSimulateVoice}
                className={`relative flex items-center justify-center w-11 h-11 rounded-full transition-all cursor-pointer ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-900/50'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/25'
                }`}
                title={isRecording ? 'Stop Recording' : 'Simulate WhatsApp Voice Note'}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <div>
                <p className="text-xs font-semibold text-[#0B192C] dark:text-white">
                  {isRecording ? `Recording Voice Note... (${recordingSeconds}s)` : 'Tap to simulate WhatsApp Voice Note'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isRecording ? 'Listening in South African English / slang...' : 'Or type your merchant message below'}
                </p>
              </div>
            </div>

            {isRecording && (
              <div className="flex items-center gap-1">
                <span className="w-1 h-3 bg-rose-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1 h-5 bg-rose-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1 h-7 bg-rose-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="w-1 h-4 bg-rose-500 animate-bounce" style={{ animationDelay: '450ms' }} />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="whatsapp-input-text" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              WhatsApp Message Text:
            </label>
            <div className="relative">
              <textarea
                id="whatsapp-input-text"
                rows={3}
                value={inputText}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder='e.g. "Sold 15 kota meals for R525 cash at lunchtime" or "Bought 2x 20L oil R780"'
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 p-3 text-sm text-[#0B192C] dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {inputText && (
                <button
                  onClick={() => handleTextChange('')}
                  className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Quick-Fill Sample Pills */}
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1.5">Quick-test samples:</span>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_NOTES.slice(0, 4).map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleTextChange(sample)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#0B192C] dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition cursor-pointer text-left"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>

          {/* Extracted Entity Preview */}
          {parsedResult && parsedResult.success && (
            <div className="rounded-xl border border-blue-200 bg-blue-50/60 dark:border-emerald-500/40 dark:bg-emerald-950/20 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                  <span>Smart Extraction Confirmed</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-emerald-500/20 dark:text-emerald-300 font-bold border border-blue-200 dark:border-emerald-500/30">
                  {(parsedResult.confidence * 100).toFixed(0)}% Confidence
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-left">
                <div className="p-2 rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Type</span>
                  <span
                    className={`text-xs font-bold ${
                      parsedResult.type === 'INCOME' ? 'text-blue-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {parsedResult.type === 'INCOME' ? '+ INCOME' : '- EXPENSE'}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Amount</span>
                  <span className="text-xs font-bold text-[#0B192C] dark:text-white">{formatZAR(parsedResult.amount)}</span>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Category</span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate block">
                    {parsedResult.category}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-600 dark:text-slate-300">
                <span className="text-slate-500">Source:</span> WhatsApp Omnichannel Channel • Auto-Reconciled
              </div>
            </div>
          )}

          {parsedResult && !parsedResult.success && (
            <div className="rounded-xl border border-amber-300 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-950/20 p-3 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Could not detect clear amount in ZAR (e.g. &quot;R525&quot; or &quot;525 rands&quot;). Check wording.</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmAndAdd}
            disabled={!parsedResult?.success || addedSuccess}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md cursor-pointer ${
              addedSuccess
                ? 'bg-blue-700 dark:bg-emerald-500'
                : parsedResult?.success
                ? 'bg-blue-600 hover:bg-blue-500 active:scale-95 shadow-blue-500/25'
                : 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed'
            }`}
          >
            {addedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Synced to Ledger!</span>
              </>
            ) : (
              <>
                <span>Confirm &amp; Sync to Ledger</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
