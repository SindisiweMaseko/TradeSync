import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall.ts';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running standalone, display a subtle installed badge
  if (isInstalled) {
    return (
      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-medium">
        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
        <span>PWA Installed</span>
      </div>
    );
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        aria-label="Install TradeSync PWA"
        className="flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-emerald-900/30 transition-all cursor-pointer"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          aria-label="Install TradeSync on iOS Safari"
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 hover:border-slate-600 bg-slate-800/80 hover:bg-slate-850 px-3 py-1.5 text-xs font-medium text-slate-200 transition cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
          <span>Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">Install on iPhone / iPad</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[11px]">1</span>
                  <p>In Safari, tap the <strong>Share</strong> icon (square with upward arrow) in the bottom toolbar.</p>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[11px]">2</span>
                  <p>Scroll down the menu and select <strong>Add to Home Screen</strong>.</p>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[11px]">3</span>
                  <p>Tap <strong>Add</strong> in the top-right corner to access TradeSync with offline caching.</p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 text-xs font-semibold text-white transition"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback desktop / test button for hackathon judges
  return (
    <button
      onClick={() => {
        alert('TradeSync is PWA-ready! To install on mobile, open this URL in Chrome or Safari and select Add to Home Screen.');
      }}
      aria-label="PWA Info"
      className="hidden md:flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-850/80 hover:bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition cursor-pointer"
    >
      <Download className="w-3.5 h-3.5 text-emerald-400" />
      <span>PWA Ready</span>
    </button>
  );
};
