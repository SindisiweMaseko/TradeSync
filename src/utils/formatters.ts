/**
 * Format a numeric value into South African Rand (ZAR)
 * e.g. 1250 -> "R 1,250.00" or with optional decimals
 */
export function formatZAR(amount: number, options?: { showCents?: boolean }): string {
  const showCents = options?.showCents ?? true;
  const fixed = showCents ? amount.toFixed(2) : Math.round(amount).toString();
  const parts = fixed.split('.');
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return showCents ? `R ${intPart}.${parts[1]}` : `R ${intPart}`;
}

/**
 * Format date string into human friendly format
 */
export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
}

/**
 * Format relative time (e.g. "2 hours ago", "Yesterday")
 */
export function formatRelativeTime(dateString: string): string {
  try {
    const d = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
  } catch {
    return dateString;
  }
}

/**
 * Format percentage
 */
export function formatPercentage(val: number): string {
  return `${val >= 0 ? '+' : ''}${val.toFixed(1)}%`;
}
