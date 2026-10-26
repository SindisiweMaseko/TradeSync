import { InventoryPool } from '../types/index.ts';

export interface PoolMetrics {
  progressPercentage: number;
  unitsRemaining: number;
  isThresholdMet: boolean;
  savingsPerUnitZAR: number;
  discountPercentage: number;
  totalPooledValueWholesale: number;
  totalPooledValueRetail: number;
  totalCommunitySavingsZAR: number;
}

export function calculatePoolMetrics(pool: InventoryPool): PoolMetrics {
  const current = Math.max(0, pool.currentPooledUnits);
  const target = Math.max(1, pool.targetThresholdUnits);
  const progressPercentage = Math.min(100, Math.round((current / target) * 100));
  const unitsRemaining = Math.max(0, target - current);
  const isThresholdMet = current >= target || pool.status === 'THRESHOLD_MET' || pool.status === 'FULFILLED';

  const wholesale = pool.wholesalePricePerUnit;
  const retail = pool.retailPricePerUnit;
  const savingsPerUnitZAR = Math.max(0, retail - wholesale);
  const discountPercentage = retail > 0 ? Math.round(((retail - wholesale) / retail) * 100) : 0;

  const totalPooledValueWholesale = current * wholesale;
  const totalPooledValueRetail = current * retail;
  const totalCommunitySavingsZAR = current * savingsPerUnitZAR;

  return {
    progressPercentage,
    unitsRemaining,
    isThresholdMet,
    savingsPerUnitZAR,
    discountPercentage,
    totalPooledValueWholesale,
    totalPooledValueRetail,
    totalCommunitySavingsZAR,
  };
}

export function pledgeUnitsToPool(
  pool: InventoryPool,
  unitsToPledge: number
): { updatedPool: InventoryPool; userSavingsZAR: number } {
  const pledged = Math.max(1, unitsToPledge);
  const newCurrent = pool.currentPooledUnits + pledged;
  const newStatus: InventoryPool['status'] =
    newCurrent >= pool.targetThresholdUnits ? 'THRESHOLD_MET' : 'OPEN';

  const updatedPool: InventoryPool = {
    ...pool,
    currentPooledUnits: newCurrent,
    status: newStatus,
    participatingBusinessesCount: pool.participatingBusinessesCount + 1,
  };

  const userSavingsZAR = pledged * (pool.retailPricePerUnit - pool.wholesalePricePerUnit);

  return {
    updatedPool,
    userSavingsZAR,
  };
}
