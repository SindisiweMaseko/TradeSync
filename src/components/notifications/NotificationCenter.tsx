import React, { useState, useMemo, useEffect } from 'react';
import {
  Bell,
  Package,
  Truck,
  TrendingUp,
  Award,
  CheckCheck,
  Check,
  Trash2,
  X,
  Search,
  ArrowRight,
  Sparkles,
  Clock,
  Filter,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useTradeSync, PillarId } from '../../context/TradeSyncContext.tsx';
import {
  AppNotification,
  NotificationCategory,
  NotificationPriority,
} from '../../types/index.ts';
import {
  formatNotificationTime,
  getCategoryBadgeConfig,
  filterNotifications,
  NotificationFilter,
} from '../../utils/notificationLogic.ts';

/**
 * Compact Notification Bell Button for Header Top Navigation
 */
export const NotificationBell: React.FC = () => {
  const { unreadNotificationsCount, setIsNotificationCenterOpen, isNotificationCenterOpen } = useTradeSync();

  return (
    <button
      onClick={() => setIsNotificationCenterOpen(!isNotificationCenterOpen)}
      aria-label={`Notification Center: ${unreadNotificationsCount} unread alert${unreadNotificationsCount === 1 ? '' : 's'}`}
      title="Open Notification Center"
      className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 transition-all cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <Bell className="w-4 h-4 text-slate-600 dark:text-slate-300 transition-transform group-hover:scale-110" />

      {unreadNotificationsCount > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-black leading-none text-white bg-blue-600 rounded-full border-2 border-white dark:border-slate-950 shadow-sm animate-pulse">
          {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
        </span>
      )}
    </button>
  );
};

/**
 * Main Notification Center Drawer & Management Interface
 */
export const NotificationCenter: React.FC = () => {
  const {
    notifications,
    unreadNotificationsCount,
    isNotificationCenterOpen,
    setIsNotificationCenterOpen,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    dismissNotification,
    simulateIncomingNotification,
    setCurrentPillar,
  } = useTradeSync();

  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSimulateExpanded, setIsSimulateExpanded] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isNotificationCenterOpen) {
        setIsNotificationCenterOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNotificationCenterOpen, setIsNotificationCenterOpen]);

  // Prevent body scrolling when open
  useEffect(() => {
    if (isNotificationCenterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isNotificationCenterOpen]);

  // Filtered notifications
  const filteredList = useMemo(() => {
    return filterNotifications(notifications, activeFilter, searchQuery);
  }, [notifications, activeFilter, searchQuery]);

  // Counts for tabs
  const supplyCount = useMemo(
    () => notifications.filter((n) => n.category === 'SUPPLY_CHAIN').length,
    [notifications]
  );
  const investCount = useMemo(
    () => notifications.filter((n) => n.category === 'INVESTMENT').length,
    [notifications]
  );
  const acadCount = useMemo(
    () => notifications.filter((n) => n.category === 'ACADEMY').length,
    [notifications]
  );

  if (!isNotificationCenterOpen) return null;

  const handleActionClick = (notif: AppNotification) => {
    markNotificationAsRead(notif.id);
    if (notif.targetPillar) {
      setCurrentPillar(notif.targetPillar);
    }
    setIsNotificationCenterOpen(false);
  };

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'SUPPLY_CHAIN':
        return <Package className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'INVESTMENT':
        return <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'ACADEMY':
        return <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark frosted backdrop */}
      <div
        onClick={() => setIsNotificationCenterOpen(false)}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Slide-over panel container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Notification Center"
          className="w-screen max-w-md sm:max-w-lg bg-white dark:bg-[#0B192C] border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between transition-all duration-300 ease-out"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50">
            <div className="flex items-center justify-between gap-3 mb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/30">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-extrabold text-[#0B192C] dark:text-white tracking-tight">
                      Notification Center
                    </h2>
                    {unreadNotificationsCount > 0 && (
                      <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                        {unreadNotificationsCount} New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Township trade, orders, angel capital &amp; academy
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsNotificationCenterOpen(false)}
                aria-label="Close Notification Center"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 dark:hover:text-white dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions Header Bar */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <button
                onClick={() => markAllNotificationsAsRead()}
                disabled={unreadNotificationsCount === 0}
                className={`flex items-center gap-1.5 font-semibold transition ${
                  unreadNotificationsCount > 0
                    ? 'text-blue-600 dark:text-blue-400 hover:underline cursor-pointer'
                    : 'text-slate-400 dark:text-slate-600 cursor-not-allowed'
                }`}
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all as read</span>
              </button>

              <button
                onClick={() => setIsSimulateExpanded(!isSimulateExpanded)}
                className="flex items-center gap-1 font-semibold text-slate-600 hover:text-[#0B192C] dark:text-slate-400 dark:hover:text-white transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{isSimulateExpanded ? 'Hide Test Alerts' : 'Simulate Live Alerts'}</span>
              </button>
            </div>

            {/* Simulation Accordion / Live Trigger Tool */}
            {isSimulateExpanded && (
              <div className="mt-3 p-3 rounded-xl bg-blue-50/70 border border-blue-200 dark:bg-blue-950/40 dark:border-blue-900/60 text-xs animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-[#0B192C] dark:text-blue-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Test Live Notifications:
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    Triggers realistic real-time events
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => simulateIncomingNotification('SUPPLY_CHAIN')}
                    className="flex flex-col items-center justify-center p-2 rounded-lg bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/50 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-semibold transition cursor-pointer text-center"
                  >
                    <Package className="w-4 h-4 mb-1 text-amber-600" />
                    <span className="text-[10px] leading-tight">Supply Chain</span>
                  </button>
                  <button
                    onClick={() => simulateIncomingNotification('INVESTMENT')}
                    className="flex flex-col items-center justify-center p-2 rounded-lg bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/50 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-800 dark:text-blue-300 font-semibold transition cursor-pointer text-center"
                  >
                    <TrendingUp className="w-4 h-4 mb-1 text-blue-600" />
                    <span className="text-[10px] leading-tight">Investor Match</span>
                  </button>
                  <button
                    onClick={() => simulateIncomingNotification('ACADEMY')}
                    className="flex flex-col items-center justify-center p-2 rounded-lg bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold transition cursor-pointer text-center"
                  >
                    <Award className="w-4 h-4 mb-1 text-emerald-600" />
                    <span className="text-[10px] leading-tight">Academy Score</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Search Bar & Category Filters */}
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 space-y-2.5 bg-white dark:bg-[#0B192C]">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search orders, hubs, investors, milestones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-7 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search query"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              <button
                onClick={() => setActiveFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer ${
                  activeFilter === 'ALL'
                    ? 'bg-[#0B192C] text-white dark:bg-blue-600 dark:text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300'
                }`}
              >
                All ({notifications.length})
              </button>

              <button
                onClick={() => setActiveFilter('UNREAD')}
                className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer ${
                  activeFilter === 'UNREAD'
                    ? 'bg-blue-600 text-white dark:bg-blue-600 dark:text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300'
                }`}
              >
                Unread ({unreadNotificationsCount})
              </button>

              <button
                onClick={() => setActiveFilter('SUPPLY_CHAIN')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer ${
                  activeFilter === 'SUPPLY_CHAIN'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300'
                }`}
              >
                <Package className="w-3 h-3" />
                <span>Supply Chain ({supplyCount})</span>
              </button>

              <button
                onClick={() => setActiveFilter('INVESTMENT')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer ${
                  activeFilter === 'INVESTMENT'
                    ? 'bg-blue-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300'
                }`}
              >
                <TrendingUp className="w-3 h-3" />
                <span>Investments ({investCount})</span>
              </button>

              <button
                onClick={() => setActiveFilter('ACADEMY')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer ${
                  activeFilter === 'ACADEMY'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300'
                }`}
              >
                <Award className="w-3 h-3" />
                <span>Academy ({acadCount})</span>
              </button>
            </div>
          </div>

          {/* Notifications Scrollable List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y-0">
            {filteredList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center mb-3">
                  <Bell className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-sm font-bold text-[#0B192C] dark:text-white mb-1">
                  No notifications found
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mb-4">
                  {searchQuery
                    ? `No updates match "${searchQuery}". Try a different keyword.`
                    : activeFilter === 'UNREAD'
                    ? 'All caught up! You have reviewed all active notifications.'
                    : 'No notifications in this category yet.'}
                </p>
                <button
                  onClick={() => {
                    setActiveFilter('ALL');
                    setSearchQuery('');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 text-xs font-semibold hover:bg-blue-100 transition"
                >
                  View All Notifications
                </button>
              </div>
            ) : (
              filteredList.map((notif) => {
                const badge = getCategoryBadgeConfig(notif.category);

                return (
                  <article
                    key={notif.id}
                    className={`relative group rounded-2xl p-4 border transition-all duration-200 ${
                      !notif.read
                        ? 'bg-blue-50/40 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/60 shadow-xs'
                        : 'bg-white border-slate-200/80 dark:bg-slate-900/70 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {/* Unread Indicator Glow Dot */}
                    {!notif.read && (
                      <span className="absolute top-4 left-2 w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    )}

                    <div className="pl-2">
                      {/* Top Meta Line: Category Badge, Timestamp, & Quick Controls */}
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold border ${badge.badgeBg}`}
                          >
                            {getCategoryIcon(notif.category)}
                            <span>{badge.label}</span>
                          </span>

                          {/* Extra Context Tags */}
                          {notif.metadata?.orderRef && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                              {notif.metadata.orderRef}
                            </span>
                          )}

                          {notif.metadata?.hub && (
                            <span className="hidden sm:inline-block text-[10px] text-slate-500 dark:text-slate-400">
                              • {notif.metadata.hub}
                            </span>
                          )}

                          {notif.actionPayload?.points && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                              +{notif.actionPayload.points} Health Pts
                            </span>
                          )}
                        </div>

                        {/* Top Right: Time and Dismiss */}
                        <div className="flex items-center gap-1 text-slate-400">
                          <span className="flex items-center gap-1 text-[11px] text-slate-400 whitespace-nowrap">
                            <Clock className="w-3 h-3" />
                            {formatNotificationTime(notif.timestamp)}
                          </span>

                          <button
                            onClick={() => dismissNotification(notif.id)}
                            title="Dismiss notification"
                            aria-label="Dismiss notification"
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition opacity-0 group-hover:opacity-100 focus:opacity-100"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Notification Title */}
                      <h4 className="text-sm font-bold text-[#0B192C] dark:text-white leading-snug mb-1">
                        {notif.title}
                      </h4>

                      {/* Notification Message */}
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                        {notif.message}
                      </p>

                      {/* Card Footer: Deep-Link Action & Mark Read Toggle */}
                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/60">
                        {notif.actionLabel ? (
                          <button
                            onClick={() => handleActionClick(notif)}
                            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition group/btn cursor-pointer"
                          >
                            <span>{notif.actionLabel}</span>
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Informational update</span>
                        )}

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => markNotificationAsRead(notif.id)}
                            title={notif.read ? 'Already read' : 'Mark as read'}
                            disabled={notif.read}
                            className={`flex items-center gap-1 text-[11px] font-semibold transition ${
                              notif.read
                                ? 'text-slate-400 dark:text-slate-600'
                                : 'text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 cursor-pointer'
                            }`}
                          >
                            <Check className="w-3 h-3" />
                            <span>{notif.read ? 'Read' : 'Mark read'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>

          {/* Footer Bar */}
          <footer className="p-3.5 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live trade synchronization active</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsNotificationCenterOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </footer>
        </aside>
      </div>
    </div>
  );
};
