import { AppNotification, NotificationCategory } from '../types/index.ts';

export type NotificationFilter = 'ALL' | 'UNREAD' | NotificationCategory;

/**
 * Returns the count of unread notifications
 */
export function getUnreadCount(notifications: AppNotification[]): number {
  return notifications.filter((n) => !n.read).length;
}

/**
 * Filters notifications by filter tab and optional search query
 */
export function filterNotifications(
  notifications: AppNotification[],
  filter: NotificationFilter,
  searchQuery: string = ''
): AppNotification[] {
  const query = searchQuery.trim().toLowerCase();

  return notifications.filter((n) => {
    // Filter condition
    if (filter === 'UNREAD' && n.read) return false;
    if (filter === 'SUPPLY_CHAIN' && n.category !== 'SUPPLY_CHAIN') return false;
    if (filter === 'INVESTMENT' && n.category !== 'INVESTMENT') return false;
    if (filter === 'ACADEMY' && n.category !== 'ACADEMY') return false;

    // Search query matching
    if (query) {
      const matchTitle = n.title.toLowerCase().includes(query);
      const matchMessage = n.message.toLowerCase().includes(query);
      const matchAction = n.actionLabel?.toLowerCase().includes(query) ?? false;
      const matchHub = n.metadata?.hub?.toLowerCase().includes(query) ?? false;
      const matchInvestor = n.metadata?.investorName?.toLowerCase().includes(query) ?? false;
      return matchTitle || matchMessage || matchAction || matchHub || matchInvestor;
    }

    return true;
  });
}

/**
 * Marks a single notification as read
 */
export function markNotificationAsRead(
  notifications: AppNotification[],
  id: string
): AppNotification[] {
  return notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
}

/**
 * Marks all notifications as read
 */
export function markAllNotificationsAsRead(notifications: AppNotification[]): AppNotification[] {
  return notifications.map((n) => ({ ...n, read: true }));
}

/**
 * Dismisses/removes a single notification
 */
export function dismissNotification(
  notifications: AppNotification[],
  id: string
): AppNotification[] {
  return notifications.filter((n) => n.id !== id);
}

/**
 * Formats relative time (e.g., 'Just now', '12m ago', '2h ago', 'Yesterday', '3d ago')
 */
export function formatNotificationTime(timestamp: string, referenceDate: Date = new Date()): string {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return 'Recently';

  const diffSec = Math.floor((referenceDate.getTime() - date.getTime()) / 1000);

  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 7) return `${diffDay}d ago`;

  return date.toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' });
}

/**
 * Generates a structured AppNotification object
 */
export function createNotification(
  category: NotificationCategory,
  title: string,
  message: string,
  targetPillar: AppNotification['targetPillar'],
  options: Partial<AppNotification> = {}
): AppNotification {
  return {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    category,
    title,
    message,
    timestamp: new Date().toISOString(),
    read: false,
    priority: 'MEDIUM',
    targetPillar,
    ...options,
  };
}

/**
 * Get category badge styling and human readable labels
 */
export function getCategoryBadgeConfig(category: NotificationCategory) {
  switch (category) {
    case 'SUPPLY_CHAIN':
      return {
        label: 'Supply Chain',
        badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border-amber-300 dark:border-amber-500/30',
        dotColor: 'bg-amber-500',
        iconName: 'Package',
      };
    case 'INVESTMENT':
      return {
        label: 'Investment Match',
        badgeBg: 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300 border-blue-300 dark:border-blue-500/30',
        dotColor: 'bg-blue-500',
        iconName: 'TrendingUp',
      };
    case 'ACADEMY':
      return {
        label: 'Academy Milestone',
        badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30',
        dotColor: 'bg-emerald-500',
        iconName: 'Award',
      };
  }
}
