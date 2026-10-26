import { Business, Transaction, AcademyLesson } from '../types/index.ts';

export interface HealthScoreBreakdown {
  totalScore: number;
  grade: 'A' | 'B' | 'C' | 'D';
  gradeTitle: string;
  profitabilityPoints: number; // max 25
  ledgerDisciplinePoints: number; // max 25
  compliancePoints: number; // max 25
  growthEducationPoints: number; // max 25
  actionItems: string[];
}

export function calculateBusinessHealthScore(
  business: Business,
  transactions: Transaction[],
  completedLessonsCount: number = 0,
  pooledOrdersCount: number = 0
): HealthScoreBreakdown {
  const actionItems: string[] = [];

  // 1. Profitability (Max 25 pts)
  let profitabilityPoints = 0;
  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpenses;
  const netMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

  if (totalIncome > 0 && netMargin >= 25) {
    profitabilityPoints = 25;
  } else if (totalIncome > 0 && netMargin >= 15) {
    profitabilityPoints = 20;
  } else if (totalIncome > 0 && netMargin >= 5) {
    profitabilityPoints = 14;
  } else if (netProfit >= 0) {
    profitabilityPoints = 8;
    actionItems.push('Improve gross margin by purchasing through SupaSupplier bulk group buying pools.');
  } else {
    profitabilityPoints = 4;
    actionItems.push('Your expenses exceed income. Review high expense categories and cut overhead costs.');
  }

  // 2. Ledger Discipline & Frequency (Max 25 pts)
  let ledgerDisciplinePoints = 0;
  const txCount = transactions.length;
  if (txCount >= 20) {
    ledgerDisciplinePoints = 25;
  } else if (txCount >= 10) {
    ledgerDisciplinePoints = 18;
  } else if (txCount >= 5) {
    ledgerDisciplinePoints = 12;
    actionItems.push('Log at least 15 transactions a month via WhatsApp notes or web to establish proof of turnover.');
  } else {
    ledgerDisciplinePoints = 6;
    actionItems.push('Start daily transaction logging via WhatsApp voice/text notes to build a credible financial trail.');
  }

  // 3. Compliance & Official Standing (Max 25 pts)
  let compliancePoints = 0;
  if (business.cipcRegistered) {
    compliancePoints += 10;
  } else {
    actionItems.push('Register your entity with CIPC via the GrowthFund vault to unlock formal grants.');
  }

  if (business.sarsPinValid) {
    compliancePoints += 8;
  } else {
    actionItems.push('Obtain SARS Tax Clearance PIN to bid for government tenders and SEFA loans.');
  }

  if (business.bbbeeLevel && business.bbbeeLevel <= 2) {
    compliancePoints += 4;
  }

  if (business.csdRegistered) {
    compliancePoints += 3;
  }

  // 4. Growth, Education & Supply Chain Optimization (Max 25 pts)
  let growthEducationPoints = 0;
  // Academy lessons (up to 15 pts)
  const lessonScore = Math.min(15, completedLessonsCount * 3);
  growthEducationPoints += lessonScore;
  if (completedLessonsCount < 3) {
    actionItems.push('Complete 2-minute TradeSync Academy operational lessons to boost bankability.');
  }

  // Group buying participation (up to 10 pts)
  const poolScore = Math.min(10, pooledOrdersCount * 5);
  growthEducationPoints += poolScore;
  if (pooledOrdersCount === 0) {
    actionItems.push('Join a township group-buying inventory pool to lower input prices by 20-30%.');
  }

  const rawTotal =
    profitabilityPoints +
    ledgerDisciplinePoints +
    compliancePoints +
    growthEducationPoints;

  const totalScore = Math.max(10, Math.min(100, Math.round(rawTotal)));

  let grade: 'A' | 'B' | 'C' | 'D' = 'D';
  let gradeTitle = 'High Risk / Unverified';

  if (totalScore >= 80) {
    grade = 'A';
    gradeTitle = 'Grade A: Investment & Tender Ready';
  } else if (totalScore >= 65) {
    grade = 'B';
    gradeTitle = 'Grade B: Bankable & Growth Stage';
  } else if (totalScore >= 50) {
    grade = 'C';
    gradeTitle = 'Grade C: Developing & Semi-Formal';
  } else {
    grade = 'D';
    gradeTitle = 'Grade D: Informal / Early Foundation';
  }

  return {
    totalScore,
    grade,
    gradeTitle,
    profitabilityPoints,
    ledgerDisciplinePoints,
    compliancePoints,
    growthEducationPoints,
    actionItems: actionItems.slice(0, 3), // Top 3 most actionable
  };
}
