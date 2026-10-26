import React from 'react';
import { WifiOff, Database } from 'lucide-react';
import { useOnlineStatus } from '../hooks/usePWAInstall.ts';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2.5 rounded-xl bg-amber-500 text-slate-950 font-semibold px-4 py-2.5 shadow-2xl shadow-amber-950/50 text-xs border border-amber-300 animate-bounce"
    >
      <WifiOff className="w-4 h-4 text-slate-950" />
      <span>Offline Mode active: Local encrypted cache enabled</span>
      <Database className="w-3.5 h-3.5 opacity-80" />
    </div>
  );
};
