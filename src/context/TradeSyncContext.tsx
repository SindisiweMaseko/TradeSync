import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  UserRole,
  Business,
  Transaction,
  InventoryPool,
  GrantOpportunity,
  AcademyLesson,
  OperationalChecklist,
  GamifiedBadge,
  PitchProfile,
  RegisterPayload,
  AppNotification,
} from '../types/index.ts';
import {
  INITIAL_USER,
  INITIAL_BUSINESS,
  INITIAL_TRANSACTIONS,
  INITIAL_POOLS,
  INITIAL_GRANTS,
  INITIAL_LESSONS,
  INITIAL_CHECKLISTS,
  INITIAL_BADGES,
  INITIAL_PITCH_PROFILES,
  INITIAL_NOTIFICATIONS,
  DEMO_ACCOUNTS,
} from '../data/seedData.ts';
import { calculateBusinessHealthScore, HealthScoreBreakdown } from '../utils/healthScore.ts';
import {
  getUnreadCount,
  markNotificationAsRead as markNotifRead,
  markAllNotificationsAsRead as markAllNotifsRead,
  dismissNotification as dismissNotif,
  createNotification,
} from '../utils/notificationLogic.ts';

export type PillarId = 'kasibiz' | 'supasupplier' | 'growthfund' | 'academy' | 'investors';

interface TradeSyncContextType {
  // Authentication & Session
  isAuthenticated: boolean;
  login: (credentials: { identifier: string; password?: string }) => { success: boolean; error?: string };
  register: (payload: RegisterPayload) => { success: boolean; error?: string };
  logout: () => void;
  switchDemoUser: (personaKey: string) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  // Theme (White mode: navy + white + electric blue / Dark mode)
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;

  // Navigation & Role
  currentPillar: PillarId;
  setCurrentPillar: (pillar: PillarId) => void;
  currentUser: User;
  setCurrentRole: (role: UserRole) => void;

  // Business Profile & Health Score
  business: Business;
  updateBusiness: (updates: Partial<Business>) => void;
  healthScoreBreakdown: HealthScoreBreakdown;

  // Transactions (KasiBiz)
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'businessId' | 'createdAt'>) => Transaction;
  deleteTransaction: (id: string) => void;

  // Group Buying Pools (SupaSupplier)
  pools: InventoryPool[];
  joinPool: (poolId: string, units: number) => { success: boolean; savingsZAR: number };
  createPool: (pool: Omit<InventoryPool, 'id' | 'createdAt' | 'currentPooledUnits' | 'status' | 'participatingBusinessesCount'>) => void;

  // Grants & Compliance (GrowthFund)
  grants: GrantOpportunity[];
  complianceVault: {
    cipcStatus: 'VERIFIED' | 'PENDING' | 'EXPIRED';
    sarsStatus: 'VALID' | 'PENDING' | 'RENEWAL_DUE';
    bbbeeStatus: 'LEVEL_1' | 'LEVEL_2' | 'PENDING';
    csdStatus: 'ACTIVE' | 'NOT_REGISTERED';
  };
  toggleComplianceItem: (item: 'cipc' | 'sars' | 'bbbee' | 'csd') => void;

  // Academy & Checklists
  lessons: AcademyLesson[];
  checklists: OperationalChecklist[];
  badges: GamifiedBadge[];
  completeLesson: (lessonId: string) => void;
  toggleChecklistItem: (checklistId: string, itemId: string) => void;
  triggerConfetti: () => void;

  // Investors Market & Pitch
  pitchProfiles: PitchProfile[];
  pledgeInvestment: (pitchId: string, amountZAR: number, investorNote: string) => boolean;
  createPitchProfile: (pitch: Omit<PitchProfile, 'id' | 'createdAt' | 'amountRaised'>) => void;

  // Notifications
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  isNotificationCenterOpen: boolean;
  setIsNotificationCenterOpen: (open: boolean) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  dismissNotification: (id: string) => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  simulateIncomingNotification: (category: 'SUPPLY_CHAIN' | 'INVESTMENT' | 'ACADEMY') => void;

  // Reset to default seed
  resetAllData: () => void;
}

const TradeSyncContext = createContext<TradeSyncContextType | undefined>(undefined);

export const TradeSyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('tradesync_theme');
    return saved === 'dark' || saved === 'light' ? saved : 'light';
  });

  const [currentPillar, setCurrentPillar] = useState<PillarId>('kasibiz');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('tradesync_authenticated');
    return saved === 'true';
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('tradesync_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  useEffect(() => {
    localStorage.setItem('tradesync_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const [business, setBusiness] = useState<Business>(() => {
    const saved = localStorage.getItem('tradesync_business');
    return saved ? JSON.parse(saved) : INITIAL_BUSINESS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('tradesync_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [pools, setPools] = useState<InventoryPool[]>(() => {
    const saved = localStorage.getItem('tradesync_pools');
    return saved ? JSON.parse(saved) : INITIAL_POOLS;
  });

  const [lessons, setLessons] = useState<AcademyLesson[]>(() => {
    const saved = localStorage.getItem('tradesync_lessons');
    return saved ? JSON.parse(saved) : INITIAL_LESSONS;
  });

  const [checklists, setChecklists] = useState<OperationalChecklist[]>(() => {
    const saved = localStorage.getItem('tradesync_checklists');
    return saved ? JSON.parse(saved) : INITIAL_CHECKLISTS;
  });

  const [badges, setBadges] = useState<GamifiedBadge[]>(() => {
    const saved = localStorage.getItem('tradesync_badges');
    return saved ? JSON.parse(saved) : INITIAL_BADGES;
  });

  const [pitchProfiles, setPitchProfiles] = useState<PitchProfile[]>(() => {
    const saved = localStorage.getItem('tradesync_pitches');
    return saved ? JSON.parse(saved) : INITIAL_PITCH_PROFILES;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('tradesync_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);

  const [grants] = useState<GrantOpportunity[]>(INITIAL_GRANTS);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('tradesync_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('tradesync_business', JSON.stringify(business));
  }, [business]);

  useEffect(() => {
    localStorage.setItem('tradesync_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('tradesync_pools', JSON.stringify(pools));
  }, [pools]);

  useEffect(() => {
    localStorage.setItem('tradesync_lessons', JSON.stringify(lessons));
  }, [lessons]);

  useEffect(() => {
    localStorage.setItem('tradesync_checklists', JSON.stringify(checklists));
  }, [checklists]);

  useEffect(() => {
    localStorage.setItem('tradesync_badges', JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem('tradesync_pitches', JSON.stringify(pitchProfiles));
  }, [pitchProfiles]);

  useEffect(() => {
    localStorage.setItem('tradesync_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Dynamic Health Score Breakdown
  const completedLessonsCount = lessons.filter((l) => l.completed).length;
  const healthScoreBreakdown = calculateBusinessHealthScore(
    business,
    transactions,
    completedLessonsCount,
    pools.filter((p) => p.participatingBusinessesCount > 10).length
  );

  // Keep business health score in sync
  useEffect(() => {
    if (business.healthScore !== healthScoreBreakdown.totalScore) {
      setBusiness((prev) => ({
        ...prev,
        healthScore: healthScoreBreakdown.totalScore,
      }));
    }
  }, [healthScoreBreakdown.totalScore]);

  const setCurrentRole = (role: UserRole) => {
    setCurrentUser((prev) => ({ ...prev, role }));
  };

  const updateBusiness = (updates: Partial<Business>) => {
    setBusiness((prev) => ({ ...prev, ...updates }));
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10B981', '#F59E0B', '#3B82F6', '#EC4899'],
      });
    } catch {
      // safe fallback
    }
  };

  // Notification center state and operations
  const unreadNotificationsCount = getUnreadCount(notifications);

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => markNotifRead(prev, id));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => markAllNotifsRead(prev));
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => dismissNotif(prev, id));
  };

  const addNotification = (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      read: false,
      priority: 'MEDIUM',
      ...notification,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const simulateIncomingNotification = (category: 'SUPPLY_CHAIN' | 'INVESTMENT' | 'ACADEMY') => {
    if (category === 'SUPPLY_CHAIN') {
      const items = [
        {
          title: 'Wholesale Discount Unlocked: 50kg Super Maize Meal 🌽',
          message: 'The Soweto bulk buying pool crossed 100 units! Wholesale price dropped to R340/bag (22% savings). Consolidated dispatch arriving tomorrow.',
          targetPillar: 'supasupplier' as const,
          actionLabel: 'View Supply Pool',
          priority: 'HIGH' as const,
          metadata: { hub: 'Crown Mines Depot', orderRef: `ORD-${Math.floor(1000 + Math.random() * 9000)}` },
        },
        {
          title: 'Dispatch Update: Frozen Russian Sausages & Rolls 🚚',
          message: 'Driver Sipho has collected bulk order from Kasi Wholesale & FMCG Logistics. Expected delivery at Vilakazi Drop Hub at 13:45.',
          targetPillar: 'supasupplier' as const,
          actionLabel: 'Track Delivery Route',
          priority: 'MEDIUM' as const,
          metadata: { hub: 'Vilakazi Drop Hub', orderRef: `ORD-${Math.floor(1000 + Math.random() * 9000)}` },
        },
      ];
      const s = items[Math.floor(Math.random() * items.length)];
      addNotification({ ...s, category: 'SUPPLY_CHAIN' });
    } else if (category === 'INVESTMENT') {
      const items = [
        {
          title: 'Angel Syndicate Match: Ubuntu Impact Capital 💼',
          message: 'Ubuntu Impact Capital reviewed your verified WhatsApp ledger and submitted an offer to commit R75,000 for your kitchen expansion.',
          targetPillar: 'investors' as const,
          actionLabel: 'Review Deal Terms',
          priority: 'HIGH' as const,
          metadata: { investorName: 'Ubuntu Impact Capital' },
        },
        {
          title: '98% Grant Match: NYDA Youth Enterprise Voucher 🏛️',
          message: 'Your CIPC registration and compliant B-BBEE Level 1 status qualify your business for the R50,000 technology voucher.',
          targetPillar: 'growthfund' as const,
          actionLabel: 'Apply with 1-Click Vault',
          priority: 'HIGH' as const,
        },
      ];
      const s = items[Math.floor(Math.random() * items.length)];
      addNotification({ ...s, category: 'INVESTMENT' });
    } else {
      const items = [
        {
          title: 'Milestone Unlocked: Bankable Health Score 82/100 🏆',
          message: 'Great work! Consistent WhatsApp voice ledger logging for 14 straight days boosted your business credit health to Grade B.',
          targetPillar: 'kasibiz' as const,
          actionLabel: 'Inspect Health Score',
          priority: 'HIGH' as const,
        },
        {
          title: 'Micro-Lesson Completed: Stock Shrinkage Control 📚',
          message: 'You earned +3 Health Score points and unlocked the "Inventory Guardian" badge. Next lesson: Managing Cash Floats.',
          targetPillar: 'academy' as const,
          actionLabel: 'Start Next Lesson',
          priority: 'MEDIUM' as const,
        },
      ];
      const s = items[Math.floor(Math.random() * items.length)];
      addNotification({ ...s, category: 'ACADEMY' });
    }
    triggerConfetti();
  };

  const addTransaction = (tx: Omit<Transaction, 'id' | 'businessId' | 'createdAt'>): Transaction => {
    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}`,
      businessId: business.id,
      createdAt: new Date().toISOString(),
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Check if first transaction badge should unlock
    setBadges((prev) =>
      prev.map((b) =>
        b.id === 'bdg-first-tx' && !b.unlocked
          ? { ...b, unlocked: true, unlockedAt: new Date().toISOString() }
          : b
      )
    );

    return newTx;
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const joinPool = (poolId: string, units: number) => {
    let savingsZAR = 0;
    let targetPoolName = 'Bulk Buying Item';
    let targetHub = 'Township Drop Hub';

    setPools((prev) =>
      prev.map((pool) => {
        if (pool.id !== poolId) return pool;
        const newTotal = pool.currentPooledUnits + units;
        const met = newTotal >= pool.targetThresholdUnits;
        savingsZAR = units * (pool.retailPricePerUnit - pool.wholesalePricePerUnit);
        targetPoolName = pool.itemName;
        targetHub = pool.hubLocation;

        return {
          ...pool,
          currentPooledUnits: newTotal,
          status: met ? 'THRESHOLD_MET' : pool.status,
          participatingBusinessesCount: pool.participatingBusinessesCount + 1,
        };
      })
    );

    // Auto-dispatch supply-chain notification
    const orderRef = `TS-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newNotif = createNotification(
      'SUPPLY_CHAIN',
      `Bulk Order Placed: ${targetPoolName}`,
      `Committed ${units} units to community buying pool. You saved R${savingsZAR.toLocaleString()} below retail. Delivery routing to ${targetHub}.`,
      'supasupplier',
      {
        priority: 'MEDIUM',
        actionLabel: 'Track Delivery Hub',
        actionPayload: { poolId, amountZAR: savingsZAR },
        metadata: {
          hub: targetHub,
          orderRef,
          progressPercent: 100,
        },
      }
    );
    setNotifications((prev) => [newNotif, ...prev]);

    // Unlock bulk buyer badge
    setBadges((prev) =>
      prev.map((b) =>
        b.id === 'bdg-bulk-buyer' && !b.unlocked
          ? { ...b, unlocked: true, unlockedAt: new Date().toISOString() }
          : b
      )
    );

    const targetPool = pools.find((p) => p.id === poolId);
    if (targetPool) {
      addNotification({
        category: 'SUPPLY_CHAIN',
        title: 'Joined Group Buying Pool 🛒',
        message: `Pledged ${units} ${targetPool.unitMeasurement} to ${targetPool.itemName}. Estimated community savings: R${savingsZAR.toLocaleString()}.`,
        priority: 'MEDIUM',
        targetPillar: 'supasupplier',
        actionLabel: 'View Buying Pool',
        actionPayload: { poolId, amountZAR: savingsZAR },
        metadata: { hub: targetPool.hubLocation },
      });
    }

    triggerConfetti();
    return { success: true, savingsZAR };
  };

  const createPool = (poolData: Omit<InventoryPool, 'id' | 'createdAt' | 'currentPooledUnits' | 'status' | 'participatingBusinessesCount'>) => {
    const newPool: InventoryPool = {
      ...poolData,
      id: `pool-${Date.now()}`,
      currentPooledUnits: 1,
      status: 'OPEN',
      participatingBusinessesCount: 1,
      createdAt: new Date().toISOString(),
    };
    setPools((prev) => [newPool, ...prev]);
    triggerConfetti();
  };

  const complianceVault = {
    cipcStatus: business.cipcRegistered ? ('VERIFIED' as const) : ('PENDING' as const),
    sarsStatus: business.sarsPinValid ? ('VALID' as const) : ('PENDING' as const),
    bbbeeStatus: business.bbbeeLevel === 1 ? ('LEVEL_1' as const) : ('LEVEL_2' as const),
    csdStatus: business.csdRegistered ? ('ACTIVE' as const) : ('NOT_REGISTERED' as const),
  };

  const toggleComplianceItem = (item: 'cipc' | 'sars' | 'bbbee' | 'csd') => {
    if (item === 'cipc') {
      const nextVal = !business.cipcRegistered;
      updateBusiness({
        cipcRegistered: nextVal,
        cipcNumber: nextVal ? '2023/892144/07' : undefined,
      });
      if (nextVal) triggerConfetti();
    } else if (item === 'sars') {
      const nextVal = !business.sarsPinValid;
      updateBusiness({ sarsPinValid: nextVal });
      if (nextVal) triggerConfetti();
    } else if (item === 'bbbee') {
      updateBusiness({ bbbeeLevel: business.bbbeeLevel === 1 ? 2 : 1 });
    } else if (item === 'csd') {
      updateBusiness({ csdRegistered: !business.csdRegistered });
    }
  };

  const completeLesson = (lessonId: string) => {
    let completedLessonTitle = 'Micro-Lesson';
    let rewardPoints = 3;

    setLessons((prev) => {
      const updated = prev.map((l) => {
        if (l.id === lessonId) {
          completedLessonTitle = l.title;
          rewardPoints = l.healthScorePointsReward;
          return { ...l, completed: true };
        }
        return l;
      });
      const allCompleted = updated.every((l) => l.completed);
      if (allCompleted) {
        setBadges((bList) =>
          bList.map((b) =>
            b.id === 'bdg-academy-grad' ? { ...b, unlocked: true, unlockedAt: new Date().toISOString() } : b
          )
        );
      }
      return updated;
    });

    // Auto-dispatch academy milestone notification
    const newNotif = createNotification(
      'ACADEMY',
      `Milestone: ${completedLessonTitle} Completed! 🎓`,
      `+${rewardPoints} points added to your business health score. Keep up the learning streak!`,
      'academy',
      {
        priority: 'MEDIUM',
        actionLabel: 'Inspect Health Score',
        actionPayload: { lessonId, points: rewardPoints },
      }
    );
    setNotifications((prev) => [newNotif, ...prev]);

    triggerConfetti();
  };

  const toggleChecklistItem = (checklistId: string, itemId: string) => {
    setChecklists((prev) =>
      prev.map((chk) => {
        if (chk.id !== checklistId) return chk;
        return {
          ...chk,
          items: chk.items.map((it) => (it.id === itemId ? { ...it, completed: !it.completed } : it)),
        };
      })
    );
  };

  const pledgeInvestment = (pitchId: string, amountZAR: number, investorNote: string): boolean => {
    let targetBusinessName = 'Township Enterprise';

    setPitchProfiles((prev) =>
      prev.map((p) => {
        if (p.id !== pitchId) return p;
        targetBusinessName = p.businessName;
        return {
          ...p,
          amountRaised: p.amountRaised + amountZAR,
        };
      })
    );

    // Auto-dispatch investment notification
    const newNotif = createNotification(
      'INVESTMENT',
      `Pledge Submitted: R${amountZAR.toLocaleString()} to ${targetBusinessName} 🤝`,
      `Syndicate pledge recorded. Verified ledger escrow initiated with note: "${investorNote || 'Growth capital ticket'}"`,
      'investors',
      {
        priority: 'HIGH',
        actionLabel: 'View Pitch Dealflow',
        actionPayload: { pitchId, amountZAR },
        metadata: { investorName: currentUser.fullName },
      }
    );
    setNotifications((prev) => [newNotif, ...prev]);

    triggerConfetti();
    return true;
  };

  const createPitchProfile = (pitch: Omit<PitchProfile, 'id' | 'createdAt' | 'amountRaised'>) => {
    const newPitch: PitchProfile = {
      ...pitch,
      id: `pitch-${Date.now()}`,
      amountRaised: 0,
      createdAt: new Date().toISOString(),
    };
    setPitchProfiles((prev) => [newPitch, ...prev]);
    triggerConfetti();
  };

  const login = (credentials: { identifier: string; password?: string }) => {
    const idLower = credentials.identifier.trim().toLowerCase();
    const matchingKey = Object.keys(DEMO_ACCOUNTS).find((key) => {
      const acc = DEMO_ACCOUNTS[key];
      return (
        acc.user.email.toLowerCase() === idLower ||
        acc.user.phoneNumber.replace(/[\s\-\(\)]/g, '') === idLower.replace(/[\s\-\(\)]/g, '') ||
        acc.user.fullName.toLowerCase().includes(idLower)
      );
    });

    if (matchingKey) {
      const acc = DEMO_ACCOUNTS[matchingKey];
      setCurrentUser(acc.user);
      setBusiness(acc.business);
    } else {
      setCurrentUser((prev) => ({
        ...prev,
        fullName: credentials.identifier.includes('@') ? credentials.identifier.split('@')[0] : prev.fullName,
        email: credentials.identifier.includes('@') ? credentials.identifier : prev.email,
        phoneNumber: !credentials.identifier.includes('@') ? credentials.identifier : prev.phoneNumber,
      }));
    }

    setIsAuthenticated(true);
    localStorage.setItem('tradesync_authenticated', 'true');
    triggerConfetti();
    return { success: true };
  };

  const register = (payload: RegisterPayload) => {
    const newUserId = `usr-${Date.now()}`;
    const newUser: User = {
      id: newUserId,
      fullName: payload.fullName.trim(),
      email: payload.email.trim(),
      phoneNumber: payload.phoneNumber.trim(),
      role: payload.role,
      avatarUrl:
        payload.role === 'ENTREPRENEUR'
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
          : payload.role === 'SUPPLIER'
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
    };

    const newBiz: Business = {
      id: `biz-${Date.now()}`,
      userId: newUserId,
      businessName: payload.businessName?.trim() || `${payload.fullName}'s Kasi Enterprise`,
      industry: payload.industry || (payload.role === 'SUPPLIER' ? 'Logistics & Delivery' : 'Food & Kota Eatery'),
      locationAddress: `${payload.township || 'Soweto'} Main Hub`,
      township: payload.township || 'Soweto',
      latitude: -26.238,
      longitude: 27.908,
      cipcRegistered: payload.cipcRegistered ?? false,
      cipcNumber: payload.cipcRegistered ? `2024/${Math.floor(100000 + Math.random() * 900000)}/07` : undefined,
      bbbeeLevel: 1,
      sarsPinValid: true,
      csdRegistered: true,
      healthScore: 68,
      monthlyRevenue: 28000,
      monthlyExpenses: 16500,
      createdAt: new Date().toISOString(),
    };

    if (payload.startingFloat && payload.startingFloat > 0) {
      const floatTx: Transaction = {
        id: `tx-float-${Date.now()}`,
        businessId: newBiz.id,
        type: 'INCOME',
        category: 'Direct Customer Sales',
        amount: payload.startingFloat,
        description: 'Opening Till Float & Working Capital Seed',
        source: 'WEB',
        createdAt: new Date().toISOString(),
      };
      setTransactions((prev) => [floatTx, ...prev]);
    }

    setCurrentUser(newUser);
    setBusiness(newBiz);
    setIsAuthenticated(true);
    localStorage.setItem('tradesync_authenticated', 'true');
    triggerConfetti();
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('tradesync_authenticated', 'false');
  };

  const switchDemoUser = (personaKey: string) => {
    if (DEMO_ACCOUNTS[personaKey]) {
      const acc = DEMO_ACCOUNTS[personaKey];
      setCurrentUser(acc.user);
      setBusiness(acc.business);
      setIsAuthenticated(true);
      localStorage.setItem('tradesync_authenticated', 'true');
      triggerConfetti();
    }
  };

  const resetAllData = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setCurrentUser(INITIAL_USER);
    setBusiness(INITIAL_BUSINESS);
    setTransactions(INITIAL_TRANSACTIONS);
    setPools(INITIAL_POOLS);
    setLessons(INITIAL_LESSONS);
    setChecklists(INITIAL_CHECKLISTS);
    setBadges(INITIAL_BADGES);
    setPitchProfiles(INITIAL_PITCH_PROFILES);
    setNotifications(INITIAL_NOTIFICATIONS);
  };

  return (
    <TradeSyncContext.Provider
      value={{
        isAuthenticated,
        login,
        register,
        logout,
        switchDemoUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        theme,
        toggleTheme,
        setTheme,
        currentPillar,
        setCurrentPillar,
        currentUser,
        setCurrentRole,
        business,
        updateBusiness,
        healthScoreBreakdown,
        transactions,
        addTransaction,
        deleteTransaction,
        pools,
        joinPool,
        createPool,
        grants,
        complianceVault,
        toggleComplianceItem,
        lessons,
        checklists,
        badges,
        completeLesson,
        toggleChecklistItem,
        triggerConfetti,
        pitchProfiles,
        pledgeInvestment,
        createPitchProfile,
        notifications,
        unreadNotificationsCount,
        isNotificationCenterOpen,
        setIsNotificationCenterOpen,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        dismissNotification,
        addNotification,
        simulateIncomingNotification,
        resetAllData,
      }}
    >
      {children}
    </TradeSyncContext.Provider>
  );
};

export const useTradeSync = () => {
  const ctx = useContext(TradeSyncContext);
  if (!ctx) {
    throw new Error('useTradeSync must be used within a TradeSyncProvider');
  }
  return ctx;
};
