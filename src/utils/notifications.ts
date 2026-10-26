import { AppNotification, NotificationCategory, NotificationPriority } from '../types/index.ts';

/**
 * Filter notifications by category and optional unread-only status
 */
export function filterNotifications(
  notifications: AppNotification[],
  category: NotificationCategory | 'ALL',
  unreadOnly = false
): AppNotification[] {
  return notifications.filter((notif) => {
    const matchesCategory = category === 'ALL' || notif.category === category;
    const matchesUnread = !unreadOnly || !notif.read;
    return matchesCategory && matchesUnread;
  });
}

/**
 * Get count of unread notifications, optionally filtered by category
 */
export function getUnreadCount(
  notifications: AppNotification[],
  category?: NotificationCategory
): number {
  return notifications.filter((notif) => {
    const matchesCategory = !category || notif.category === category;
    return !notif.read && matchesCategory;
  }).length;
}

/**
 * Mark a single notification as read or unread
 */
export function markAsRead(
  notifications: AppNotification[],
  id: string,
  readState = true
): AppNotification[] {
  return notifications.map((notif) =>
    notif.id === id ? { ...notif, read: readState } : notif
  );
}

/**
 * Mark all notifications (or all in a specific category) as read
 */
export function markAllAsRead(
  notifications: AppNotification[],
  category: NotificationCategory | 'ALL' = 'ALL'
): AppNotification[] {
  return notifications.map((notif) => {
    if (category === 'ALL' || notif.category === category) {
      return { ...notif, read: true };
    }
    return notif;
  });
}

/**
 * Delete a specific notification item
 */
export function deleteNotificationItem(
  notifications: AppNotification[],
  id: string
): AppNotification[] {
  return notifications.filter((notif) => notif.id !== id);
}

/**
 * Formats an ISO timestamp into a human-friendly relative time string
 */
export function formatRelativeTime(isoString: string, now = new Date()): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'Recently';

    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 0) return 'Just now';
    if (diffSeconds < 60) return 'Just now';
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' });
  } catch {
    return 'Recently';
  }
}

/**
 * Generates sample contextual notifications for demo/simulation
 */
export function generateSimulatedNotification(
  category: NotificationCategory
): Omit<AppNotification, 'id' | 'timestamp' | 'read'> {
  switch (category) {
    case 'SUPPLY_CHAIN': {
      const items = [
        {
          category: 'SUPPLY_CHAIN' as const,
          title: 'Wholesale Discount Unlocked: 50kg Super Maize Meal',
          message: 'The Soweto bulk buying pool crossed 100 units! Wholesale price dropped to R 340/bag (22% savings). Dispatch scheduled for tomorrow morning.',
          targetPillar: 'supasupplier' as const,
          actionLabel: 'View Supply Pool',
          priority: 'HIGH' as NotificationPriority,
          metadata: { orderRef: 'ORD-9821', hub: 'Crown Mines Depot', progressPercent: 100 },
        },
        {
          category: 'SUPPLY_CHAIN' as const,
          title: 'Order En Route: 10kg Russian Sausages & Burgers',
          message: 'Driver Sipho has picked up bulk order from Kasi Wholesale & FMCG Logistics. Expected delivery at Vilakazi Drop Hub at 13:45.',
          targetPillar: 'supasupplier' as const,
          actionLabel: 'Track Delivery Route',
          priority: 'MEDIUM' as NotificationPriority,
          metadata: { orderRef: 'ORD-9844', hub: 'Vilakazi Drop Hub' },
        },
        {
          category: 'SUPPLY_CHAIN' as const,
          title: 'New Bulk Buying Pool: 20L Sunflower Oil',
          message: 'A new 20L Sunflower Cooking Oil pool opened at R 540/unit (down from R 680 retail). Join before Friday 17:00 cutoff.',
          targetPillar: 'supasupplier' as const,
          actionLabel: 'Join Bulk Pool',
          priority: 'LOW' as NotificationPriority,
          metadata: { orderRef: 'ORD-9860', hub: 'Diepkloof Hub' },
        },
      ];
      return items[Math.floor(Math.random() * items.length)];
    }

    case 'INVESTMENT': {
      const items = [
        {
          category: 'INVESTMENT' as const,
          title: 'Angel Syndicate Pledge: Ubuntu Impact Capital',
          message: 'Ubuntu Impact Capital reviewed your verified WhatsApp ledger and submitted an offer to commit R 75,000 for your kitchen expansion.',
          targetPillar: 'investors' as const,
          actionLabel: 'Review Deal Terms',
          priority: 'HIGH' as NotificationPriority,
          metadata: { investorName: 'Ubuntu Impact Capital' },
        },
        {
          category: 'INVESTMENT' as const,
          title: '98% Grant Match: NYDA Youth Enterprise Voucher',
          message: 'Your CIPC registration and compliant B-BBEE Level 1 status qualify your business for the R 50,000 technology voucher.',
          targetPillar: 'growthfund' as const,
          actionLabel: 'Apply with 1-Click Vault',
          priority: 'HIGH' as NotificationPriority,
        },
        {
          category: 'INVESTMENT' as const,
          title: 'Investor Pitch Viewed: 12 New Watchers',
          message: 'Your 60-second video pitch reel received 12 investor views today. 2 angels bookmarked your deal terms for upcoming syndication.',
          targetPillar: 'investors' as const,
          actionLabel: 'Inspect Deal Views',
          priority: 'MEDIUM' as NotificationPriority,
        },
      ];
      return items[Math.floor(Math.random() * items.length)];
    }

    case 'ACADEMY':
    default: {
      const items = [
        {
          category: 'ACADEMY' as const,
          title: 'Milestone Unlocked: Bankable Health Score 82/100',
          message: 'Great work! Consistent WhatsApp voice ledger logging for 14 straight days boosted your business credit health to Grade B.',
          targetPillar: 'kasibiz' as const,
          actionLabel: 'Inspect Health Score',
          priority: 'HIGH' as NotificationPriority,
        },
        {
          category: 'ACADEMY' as const,
          title: 'Micro-Lesson Completed: Stock Shrinkage Control',
          message: 'You earned +3 Health Score points and unlocked the "Inventory Guardian" badge. Next lesson: Managing Cash Floats.',
          targetPillar: 'academy' as const,
          actionLabel: 'Start Next Lesson',
          priority: 'MEDIUM' as NotificationPriority,
        },
        {
          category: 'ACADEMY' as const,
          title: 'Operational Streak: 7-Day Morning Stock Audit',
          message: 'Your team completed 7 consecutive daily opening checklists. Wastage reduced by an estimated 15% this week.',
          targetPillar: 'academy' as const,
          actionLabel: 'Open Checklists',
          priority: 'LOW' as NotificationPriority,
        },
      ];
      return items[Math.floor(Math.random() * items.length)];
    }
  }
}
