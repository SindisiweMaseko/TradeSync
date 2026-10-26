import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getUnreadCount,
  filterNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  dismissNotification,
  formatNotificationTime,
  createNotification,
} from './notificationLogic.ts';
import { AppNotification } from '../types/index.ts';

const mockNotifications: AppNotification[] = [
  {
    id: 'n1',
    category: 'SUPPLY_CHAIN',
    title: 'Cooking Oil Pool Threshold Met',
    message: 'Sunflower Oil 20L reached 500 units! 28% discount unlocked.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5m ago
    read: false,
    priority: 'HIGH',
    targetPillar: 'supasupplier',
    actionLabel: 'View Dispatch Route',
    metadata: { hub: 'Soweto Central Hub' },
  },
  {
    id: 'n2',
    category: 'INVESTMENT',
    title: 'Ubuntu Impact Capital Match',
    message: 'Nomvula Dlamini reviewed your Kota & Chill pitch reel.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h ago
    read: true,
    priority: 'HIGH',
    targetPillar: 'investors',
    actionLabel: 'Open Pitch Reel',
    metadata: { investorName: 'Ubuntu Impact Capital' },
  },
  {
    id: 'n3',
    category: 'ACADEMY',
    title: 'Micro-Lesson Completed',
    message: 'Earned +3 points to Financial Discipline score.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1d ago
    read: false,
    priority: 'MEDIUM',
    targetPillar: 'academy',
    actionLabel: 'View Health Score',
  },
];

test('getUnreadCount correctly computes unread notifications', () => {
  const count = getUnreadCount(mockNotifications);
  assert.equal(count, 2);
});

test('filterNotifications filters by category accurately', () => {
  const supplyChain = filterNotifications(mockNotifications, 'SUPPLY_CHAIN');
  assert.equal(supplyChain.length, 1);
  assert.equal(supplyChain[0].id, 'n1');

  const investments = filterNotifications(mockNotifications, 'INVESTMENT');
  assert.equal(investments.length, 1);
  assert.equal(investments[0].id, 'n2');

  const academy = filterNotifications(mockNotifications, 'ACADEMY');
  assert.equal(academy.length, 1);
  assert.equal(academy[0].id, 'n3');

  const unread = filterNotifications(mockNotifications, 'UNREAD');
  assert.equal(unread.length, 2);
});

test('filterNotifications filters by search text', () => {
  const results = filterNotifications(mockNotifications, 'ALL', 'Sunflower');
  assert.equal(results.length, 1);
  assert.equal(results[0].id, 'n1');

  const hubResults = filterNotifications(mockNotifications, 'ALL', 'Soweto');
  assert.equal(hubResults.length, 1);
  assert.equal(hubResults[0].id, 'n1');

  const emptyResults = filterNotifications(mockNotifications, 'ALL', 'nonexistent query 123');
  assert.equal(emptyResults.length, 0);
});

test('markNotificationAsRead updates specific notification without mutating other items', () => {
  const updated = markNotificationAsRead(mockNotifications, 'n1');
  assert.equal(updated.find((n) => n.id === 'n1')?.read, true);
  assert.equal(updated.find((n) => n.id === 'n3')?.read, false);
});

test('markAllNotificationsAsRead marks all notifications as read', () => {
  const updated = markAllNotificationsAsRead(mockNotifications);
  assert.ok(updated.every((n) => n.read === true));
});

test('dismissNotification removes item by id', () => {
  const updated = dismissNotification(mockNotifications, 'n2');
  assert.equal(updated.length, 2);
  assert.ok(!updated.some((n) => n.id === 'n2'));
});

test('formatNotificationTime formats relative time correctly', () => {
  const now = new Date('2026-10-24T22:00:00Z');
  const fiveMinAgo = new Date('2026-10-24T21:55:00Z').toISOString();
  const threeHoursAgo = new Date('2026-10-24T19:00:00Z').toISOString();
  const yesterday = new Date('2026-10-23T22:00:00Z').toISOString();

  assert.equal(formatNotificationTime(fiveMinAgo, now), '5m ago');
  assert.equal(formatNotificationTime(threeHoursAgo, now), '3h ago');
  assert.equal(formatNotificationTime(yesterday, now), 'Yesterday');
});

test('createNotification initializes well-formed notification object', () => {
  const notif = createNotification(
    'SUPPLY_CHAIN',
    'Order Dispatched',
    'Driver en route to hub',
    'supasupplier',
    { actionLabel: 'Track Delivery' }
  );

  assert.ok(notif.id.startsWith('notif-'));
  assert.equal(notif.category, 'SUPPLY_CHAIN');
  assert.equal(notif.read, false);
  assert.equal(notif.actionLabel, 'Track Delivery');
  assert.equal(notif.targetPillar, 'supasupplier');
});
