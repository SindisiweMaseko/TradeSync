export type UserRole = 'ENTREPRENEUR' | 'SUPPLIER' | 'INVESTOR' | 'ADMIN';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface Business {
  id: string;
  userId: string;
  businessName: string;
  industry: string;
  locationAddress: string;
  township: string;
  latitude: number;
  longitude: number;
  cipcRegistered: boolean;
  cipcNumber?: string;
  bbbeeLevel?: number;
  sarsPinValid?: boolean;
  csdRegistered?: boolean;
  healthScore: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  createdAt: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: UserRole;
  businessName?: string;
  township?: string;
  industry?: string;
  cipcRegistered?: boolean;
  startingFloat?: number;
}

export interface Transaction {
  id: string;
  businessId: string;
  type: 'INCOME' | 'EXPENSE';
  category: 'Food & Groceries' | 'Beverages & Stock' | 'Packaging' | 'Transport & Fuel' | 'Utilities & Electricity' | 'Staff Wages' | 'Equipment & Maintenance' | 'Airtime & Data' | 'Direct Customer Sales' | 'Catering Order';
  amount: number;
  description: string;
  source: 'WEB' | 'WHATSAPP';
  createdAt: string;
}

export interface InventoryPool {
  id: string;
  itemName: string;
  category: 'Cooking Essentials' | 'Fresh Produce' | 'Butchery & Poultry' | 'Beverages' | 'Packaging & Gas';
  imageUrl: string;
  wholesalePricePerUnit: number;
  retailPricePerUnit: number;
  targetThresholdUnits: number;
  currentPooledUnits: number;
  unitMeasurement: string; // e.g. "20L drum", "50kg bag", "10kg box"
  status: 'OPEN' | 'THRESHOLD_MET' | 'FULFILLED';
  hubLocation: string;
  supplierName: string;
  dispatchDate: string;
  participatingBusinessesCount: number;
  createdAt: string;
}

export interface PitchProfile {
  id: string;
  businessId: string;
  businessName: string;
  founderName: string;
  founderAvatar: string;
  township: string;
  industry: string;
  pitchTitle: string;
  tagline: string;
  pitchVideoUrl?: string;
  fundingGoal: number;
  amountRaised: number;
  equityOffered: number;
  businessModelSummary: string;
  useOfFunds: string[];
  verifiedLedgerAccess: boolean;
  keyMetrics: {
    monthlyTurnover: number;
    grossMargin: number;
    activeCustomersMonthly: number;
    growthMoM: number;
    burnRate: number;
  };
  deckSlides: Array<{
    title: string;
    content: string;
    highlight: string;
  }>;
  createdAt: string;
}

export interface GrantOpportunity {
  id: string;
  name: string;
  organization: string; // e.g. NYDA, SEFA, NEF, IDC, Gauteng DED
  maxFundingAmount: number;
  fundingType: 'GRANT' | 'REVOLVING_LOAN' | 'EQUITY_PARTNERSHIP';
  deadline: string;
  description: string;
  eligibilityCriteria: string[];
  matchedScore: number; // 0 - 100 based on business profile
  tag: string;
}

export interface AcademyLesson {
  id: string;
  title: string;
  duration: string;
  category: 'Cash Flow' | 'Inventory' | 'Compliance' | 'Pitching & Capital' | 'Operations';
  summary: string;
  audioDurationSec: number;
  audioTranscript: string;
  actionChecklist: string[];
  healthScorePointsReward: number;
  completed: boolean;
}

export interface OperationalChecklist {
  id: string;
  title: string;
  description: string;
  frequency: 'DAILY_OPENING' | 'DAILY_CLOSING' | 'WEEKLY_STOCK';
  items: Array<{
    id: string;
    label: string;
    completed: boolean;
    importance: 'CRITICAL' | 'STANDARD';
  }>;
}

export interface GamifiedBadge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
  points: number;
}

export type NotificationCategory = 'SUPPLY_CHAIN' | 'INVESTMENT' | 'ACADEMY';

export type NotificationPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: string; // ISO string
  read: boolean;
  priority?: NotificationPriority;
  targetPillar: 'kasibiz' | 'supasupplier' | 'growthfund' | 'academy' | 'investors';
  actionLabel?: string;
  actionPayload?: {
    poolId?: string;
    pitchId?: string;
    grantId?: string;
    lessonId?: string;
    amountZAR?: number;
    points?: number;
  };
  metadata?: {
    orderRef?: string;
    hub?: string;
    investorName?: string;
    progressPercent?: number;
  };
}
