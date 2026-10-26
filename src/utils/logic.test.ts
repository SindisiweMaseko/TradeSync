import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateBusinessHealthScore } from './healthScore.ts';
import { parseWhatsAppNote } from './whatsappParser.ts';
import { calculatePoolMetrics, pledgeUnitsToPool } from './poolCalculator.ts';
import { Business, Transaction, InventoryPool } from '../types/index.ts';

const mockBusiness: Business = {
  id: 'biz-1',
  userId: 'usr-1',
  businessName: 'Lindiwe Kota & Chill',
  industry: 'Food & Kota Eatery',
  locationAddress: '8442 Vilakazi St, Orlando West',
  township: 'Soweto',
  latitude: -26.238,
  longitude: 27.908,
  cipcRegistered: true,
  cipcNumber: '2023/184920/07',
  bbbeeLevel: 1,
  sarsPinValid: true,
  csdRegistered: true,
  healthScore: 78,
  monthlyRevenue: 45000,
  monthlyExpenses: 28000,
  createdAt: '2024-01-15T00:00:00Z',
};

const mockTransactions: Transaction[] = [
  { id: 't1', businessId: 'biz-1', type: 'INCOME', category: 'Direct Customer Sales', amount: 5000, description: 'Weekend rush sales', source: 'WEB', createdAt: '2026-10-20T10:00:00Z' },
  { id: 't2', businessId: 'biz-1', type: 'INCOME', category: 'Direct Customer Sales', amount: 6200, description: 'Township festival sales', source: 'WHATSAPP', createdAt: '2026-10-21T10:00:00Z' },
  { id: 't3', businessId: 'biz-1', type: 'EXPENSE', category: 'Food & Groceries', amount: 2800, description: 'Wholesale rolls and polony', source: 'WHATSAPP', createdAt: '2026-10-21T12:00:00Z' },
  { id: 't4', businessId: 'biz-1', type: 'EXPENSE', category: 'Utilities & Electricity', amount: 650, description: 'Prepaid meter', source: 'WEB', createdAt: '2026-10-22T08:00:00Z' },
];

test('calculateBusinessHealthScore returns structured breakdown with score between 10 and 100', () => {
  const result = calculateBusinessHealthScore(mockBusiness, mockTransactions, 4, 2);
  assert.ok(result.totalScore >= 10 && result.totalScore <= 100);
  assert.ok(['A', 'B', 'C', 'D'].includes(result.grade));
  assert.ok(result.profitabilityPoints >= 0);
  assert.ok(result.compliancePoints >= 20); // Has CIPC + SARS + B-BBEE
  assert.ok(Array.isArray(result.actionItems));
});

test('parseWhatsAppNote accurately extracts expense from township notes', () => {
  const raw = 'Bought 2x 20L cooking oil from cash and carry R780';
  const parsed = parseWhatsAppNote(raw);
  assert.equal(parsed.success, true);
  assert.equal(parsed.type, 'EXPENSE');
  assert.equal(parsed.amount, 780);
  assert.equal(parsed.category, 'Food & Groceries');
});

test('parseWhatsAppNote accurately extracts income from kota sales note', () => {
  const raw = 'Sold 15 kota meals for R525 cash at lunchtime';
  const parsed = parseWhatsAppNote(raw);
  assert.equal(parsed.success, true);
  assert.equal(parsed.type, 'INCOME');
  assert.equal(parsed.amount, 525);
  assert.equal(parsed.category, 'Direct Customer Sales');
});

test('parseWhatsAppNote correctly extracts catering income and handles decimal rands', () => {
  const raw = 'Received R1,200.50 deposit for wedding catering';
  const parsed = parseWhatsAppNote(raw);
  assert.equal(parsed.success, true);
  assert.equal(parsed.type, 'INCOME');
  assert.equal(parsed.category, 'Catering Order');
  assert.equal(parsed.amount, 1200.5);
});

test('calculatePoolMetrics computes accurate discount and threshold progress', () => {
  const pool: InventoryPool = {
    id: 'pool-1',
    itemName: 'Sunflower Cooking Oil 20L',
    category: 'Cooking Essentials',
    imageUrl: 'oil.jpg',
    wholesalePricePerUnit: 480,
    retailPricePerUnit: 640,
    targetThresholdUnits: 100,
    currentPooledUnits: 75,
    unitMeasurement: '20L drum',
    status: 'OPEN',
    hubLocation: 'Orlando West Cash Hub',
    supplierName: 'MegaWholesale SA',
    dispatchDate: '2026-10-28',
    participatingBusinessesCount: 14,
    createdAt: '2026-10-01T00:00:00Z',
  };

  const metrics = calculatePoolMetrics(pool);
  assert.equal(metrics.progressPercentage, 75);
  assert.equal(metrics.unitsRemaining, 25);
  assert.equal(metrics.savingsPerUnitZAR, 160);
  assert.equal(metrics.discountPercentage, 25); // (640 - 480) / 640 = 25%
  assert.equal(metrics.isThresholdMet, false);

  const { updatedPool, userSavingsZAR } = pledgeUnitsToPool(pool, 25);
  assert.equal(updatedPool.currentPooledUnits, 100);
  assert.equal(updatedPool.status, 'THRESHOLD_MET');
  assert.equal(userSavingsZAR, 4000); // 25 * 160
});

test('validateSAPhoneNumber correctly parses and normalizes SA mobile formats', async () => {
  const { validateSAPhoneNumber, validateEmail, validatePasswordOrPIN } = await import('./authValidation.ts');

  // Local 10 digit
  const r1 = validateSAPhoneNumber('0738924110');
  assert.equal(r1.isValid, true);
  assert.equal(r1.normalized, '+27 73 892 4110');

  // With +27
  const r2 = validateSAPhoneNumber('+27 82 123 4567');
  assert.equal(r2.isValid, true);
  assert.equal(r2.normalized, '+27 82 123 4567');

  // Invalid numbers
  const r3 = validateSAPhoneNumber('12345');
  assert.equal(r3.isValid, false);
  assert.ok(r3.error);

  // Email validation
  assert.equal(validateEmail('founder@kasi.co.za'), true);
  assert.equal(validateEmail('not-an-email'), false);

  // Password / PIN validation
  const p1 = validatePasswordOrPIN('123456');
  assert.equal(p1.isValid, true);
  const p2 = validatePasswordOrPIN('short');
  assert.equal(p2.isValid, false);
});

test('notification center logic accurately filters, counts unread, and updates read states', async () => {
  const {
    filterNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotificationItem,
    formatRelativeTime,
  } = await import('./notifications.ts');

  const mockNotifs = [
    {
      id: 'n1',
      category: 'SUPPLY_CHAIN' as const,
      title: 'Bulk Oil Pool Met',
      message: 'MOQ reached',
      timestamp: '2026-10-24T20:00:00Z',
      read: false,
      targetPillar: 'supasupplier' as const,
    },
    {
      id: 'n2',
      category: 'INVESTMENT' as const,
      title: 'Syndicate Pledge',
      message: 'R50k offered',
      timestamp: '2026-10-24T18:00:00Z',
      read: false,
      targetPillar: 'investors' as const,
    },
    {
      id: 'n3',
      category: 'ACADEMY' as const,
      title: 'Badge Unlocked',
      message: 'Completed lesson',
      timestamp: '2026-10-23T10:00:00Z',
      read: true,
      targetPillar: 'academy' as const,
    },
  ];

  // Test unread count
  assert.equal(getUnreadCount(mockNotifs), 2);
  assert.equal(getUnreadCount(mockNotifs, 'SUPPLY_CHAIN'), 1);
  assert.equal(getUnreadCount(mockNotifs, 'INVESTMENT'), 1);
  assert.equal(getUnreadCount(mockNotifs, 'ACADEMY'), 0);

  // Test filter
  assert.equal(filterNotifications(mockNotifs, 'ALL').length, 3);
  assert.equal(filterNotifications(mockNotifs, 'SUPPLY_CHAIN').length, 1);
  assert.equal(filterNotifications(mockNotifs, 'ALL', true).length, 2);
  assert.equal(filterNotifications(mockNotifs, 'ACADEMY', true).length, 0);

  // Test mark single as read
  const updated1 = markAsRead(mockNotifs, 'n1');
  assert.equal(getUnreadCount(updated1), 1);
  assert.equal(updated1.find(n => n.id === 'n1')?.read, true);

  // Test mark all as read
  const updatedAll = markAllAsRead(mockNotifs);
  assert.equal(getUnreadCount(updatedAll), 0);

  // Test delete item
  const afterDelete = deleteNotificationItem(mockNotifs, 'n1');
  assert.equal(afterDelete.length, 2);
  assert.equal(afterDelete.some(n => n.id === 'n1'), false);

  // Test time formatting
  const now = new Date('2026-10-24T22:00:00Z');
  assert.equal(formatRelativeTime('2026-10-24T21:55:00Z', now), '5m ago');
  assert.equal(formatRelativeTime('2026-10-24T20:00:00Z', now), '2h ago');
  assert.equal(formatRelativeTime('2026-10-23T20:00:00Z', now), 'Yesterday');
});


// Import notification center test suite
import './notificationLogic.test.ts';
