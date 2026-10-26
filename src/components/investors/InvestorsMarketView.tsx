import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ShieldCheck,
  TrendingUp,
  Users,
  DollarSign,
  PieChart,
  MessageSquare,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Send,
  FileText,
  Briefcase,
} from 'lucide-react';
import { useTradeSync } from '../../context/TradeSyncContext.tsx';
import { PitchProfile } from '../../types/index.ts';
import { formatZAR } from '../../utils/formatters.ts';
import { PledgeModal } from './PledgeModal.tsx';

export const InvestorsMarketView: React.FC = () => {
  const { pitchProfiles, currentUser } = useTradeSync();

  const [activePitchId, setActivePitchId] = useState<string>(pitchProfiles[0]?.id || '');
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [selectedPitchForPledge, setSelectedPitchForPledge] = useState<PitchProfile | null>(null);

  const activePitch = pitchProfiles.find((p) => p.id === activePitchId) || pitchProfiles[0];

  const fundingProgress = activePitch
    ? Math.min(100, Math.round((activePitch.amountRaised / activePitch.fundingGoal) * 100))
    : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-rose-500/20 text-blue-700 dark:text-rose-400 text-[11px] font-bold border border-blue-200 dark:border-rose-500/30">
              Pillar 5: Capital &amp; Due Diligence
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Investors Market Hub</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0B192C] dark:text-white tracking-tight">
            60-Second Video Pitch Reels &amp; Verified Ledgers
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
            Discover vetted South African youth scale-ups with cryptographic proof of turnover and audited gross margins.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              if (activePitch) setSelectedPitchForPledge(activePitch);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition cursor-pointer"
          >
            <Briefcase className="w-4 h-4" />
            <span>Pledge Term Sheet</span>
          </button>
        </div>
      </div>

      {/* Venture Directory Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
        {pitchProfiles.map((pitch) => {
          const isSelected = pitch.id === activePitchId;
          return (
            <button
              key={pitch.id}
              onClick={() => {
                setActivePitchId(pitch.id);
                setIsPlayingVideo(false);
                setActiveSlideIndex(0);
              }}
              className={`flex-shrink-0 flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer text-left ${
                isSelected
                  ? 'bg-blue-50 dark:bg-slate-850 border-blue-600 dark:border-blue-500 shadow-sm dark:shadow-lg dark:shadow-blue-950/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850/60'
              }`}
            >
              <img
                src={pitch.founderAvatar}
                alt={pitch.founderName}
                className="w-10 h-10 rounded-full object-cover border-2 border-slate-300 dark:border-slate-700 flex-shrink-0"
              />
              <div>
                <h4 className="text-xs font-bold text-[#0B192C] dark:text-white leading-tight">{pitch.businessName}</h4>
                <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                  <span>{pitch.township}</span>
                  <span>•</span>
                  <span className="text-blue-600 dark:text-emerald-400 font-bold">{formatZAR(pitch.keyMetrics.monthlyTurnover)}/mo</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Pitch Feature Showcase */}
      {activePitch && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: 60-Sec Video Reel Player & Pitch Deck (8 cols) */}
          <div className="lg:col-span-8 space-y-5">
            {/* 60-Second Video Pitch Reel Simulator */}
            <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl aspect-video flex flex-col justify-between p-6">
              {/* Background gradient overlay simulating a modern reel studio */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40 z-0" />
              <img
                src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1200&auto=format&fit=crop&q=80"
                alt="Township business backdrop"
                className="absolute inset-0 w-full h-full object-cover opacity-20 -z-10"
              />

              {/* Top video controls */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    60-Sec Verified Video Pitch Reel
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                    Live Verified
                  </span>
                </div>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Center Play Button & Founder Pitch Snippet */}
              <div className="relative z-10 text-center my-auto space-y-3">
                <button
                  onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                  aria-label={isPlayingVideo ? 'Pause Video Pitch' : 'Play 60-second video pitch reel'}
                  className={`mx-auto flex items-center justify-center w-16 h-16 rounded-full transition-all cursor-pointer ${
                    isPlayingVideo
                      ? 'bg-blue-600 text-white shadow-2xl shadow-blue-900/60 scale-105'
                      : 'bg-white hover:bg-slate-200 text-slate-950 shadow-2xl shadow-black/80 hover:scale-110'
                  }`}
                >
                  {isPlayingVideo ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
                </button>

                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white drop-shadow-md">
                    &quot;{activePitch.pitchTitle}&quot;
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mt-1 line-clamp-2 drop-shadow">
                    Presented by {activePitch.founderName} ({activePitch.township})
                  </p>
                </div>
              </div>

              {/* Video Bottom Scrub & Progress */}
              <div className="relative z-10 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
                  <span>{isPlayingVideo ? '0:28' : '0:00'}</span>
                  <span className="text-[11px] text-slate-400">4K Ultra HD • Subtitled</span>
                  <span>1:00</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 via-sky-400 to-emerald-400 rounded-full"
                    style={{ width: `${isPlayingVideo ? 46 : 10}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Pitch Deck Slide Viewer */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4 transition-colors">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Executive Pitch Deck Slides</span>
                </h4>
                <div className="flex items-center gap-1">
                  {activePitch.deckSlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlideIndex(idx)}
                      className={`w-6 h-6 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                        activeSlideIndex === idx
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:text-white'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slide Content Box */}
              {activePitch.deckSlides[activeSlideIndex] && (
                <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">
                      Slide {activeSlideIndex + 1}: {activePitch.deckSlides[activeSlideIndex].title}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-emerald-500/20 text-blue-700 dark:text-emerald-300 border border-blue-200 dark:border-emerald-500/30">
                      {activePitch.deckSlides[activeSlideIndex].highlight}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#0B192C] dark:text-slate-200 leading-relaxed">
                    {activePitch.deckSlides[activeSlideIndex].content}
                  </p>
                </div>
              )}

              {/* Use of Proceeds */}
              <div className="pt-2 space-y-2">
                <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 block">
                  Capital Allocation &amp; Use of Funds:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {activePitch.useOfFunds.map((use, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-850 flex items-center gap-2 text-slate-700 dark:text-slate-300"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <span>{use}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Verified Financial Due Diligence & Pledging (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Funding Round Progress Box */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Seed Equity Round
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold text-[10px] border border-emerald-200 dark:border-emerald-500/30">
                  {fundingProgress}% Committed
                </span>
              </div>

              <div>
                <div className="text-2xl font-black text-[#0B192C] dark:text-white">
                  {formatZAR(activePitch.amountRaised)}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  raised of <strong className="text-slate-800 dark:text-slate-200">{formatZAR(activePitch.fundingGoal)}</strong> goal
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-700"
                  style={{ width: `${fundingProgress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Equity Offered:</span>
                <span className="font-bold text-[#0B192C] dark:text-white">{activePitch.equityOffered}%</span>
              </div>

              <button
                onClick={() => setSelectedPitchForPledge(activePitch)}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Briefcase className="w-4 h-4" />
                <span>Pledge Investment Term Sheet</span>
              </button>
            </div>

            {/* Verified Cryptographic Financial Ledger Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4 transition-colors">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  <span>Audited Due Diligence</span>
                </h4>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">100% Verified</span>
              </div>

              <div className="space-y-3 text-xs">
                {/* Monthly Turnover */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Verified Monthly Revenue:</span>
                  <span className="font-bold text-[#0B192C] dark:text-white">{formatZAR(activePitch.keyMetrics.monthlyTurnover)}</span>
                </div>

                {/* Gross Margin */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Audited Gross Margin:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{activePitch.keyMetrics.grossMargin}%</span>
                </div>

                {/* Growth Rate */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Month-over-Month Growth:</span>
                  <span className="font-bold text-blue-600 dark:text-sky-400">+{activePitch.keyMetrics.growthMoM}%</span>
                </div>

                {/* Active Customers */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Monthly Active Eaters/Buyers:</span>
                  <span className="font-bold text-[#0B192C] dark:text-white">{activePitch.keyMetrics.activeCustomersMonthly.toLocaleString()}</span>
                </div>

                {/* Monthly Burn Rate */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Monthly Operating Burn:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{formatZAR(activePitch.keyMetrics.burnRate)}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-emerald-950/20 border border-blue-200 dark:border-emerald-500/30 text-[11px] text-blue-950 dark:text-slate-300 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>
                  All metrics pull directly from TradeSync WhatsApp transaction ledgers and bank settlement statements. Zero self-reported inflation.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pledge Modal */}
      <PledgeModal
        pitch={selectedPitchForPledge}
        isOpen={!!selectedPitchForPledge}
        onClose={() => setSelectedPitchForPledge(null)}
      />
    </div>
  );
};
