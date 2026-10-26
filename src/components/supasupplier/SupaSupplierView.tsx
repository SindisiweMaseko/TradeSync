import React, { useState } from 'react';
import {
  Truck,
  Users,
  MapPin,
  TrendingDown,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  PlusCircle,
  Sparkles,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { useTradeSync } from '../../context/TradeSyncContext.tsx';
import { formatZAR, formatDate } from '../../utils/formatters.ts';
import { calculatePoolMetrics } from '../../utils/poolCalculator.ts';
import { InventoryPool, Business } from '../../types/index.ts';
import { JoinPoolModal } from './JoinPoolModal.tsx';
import { CreatePoolModal } from './CreatePoolModal.tsx';

const TOWNSHIPS: Business['township'][] = [
  'Soweto',
  'Tembisa',
  'Alexandra',
  'Khayelitsha',
  'Umlazi',
  'Mamelodi',
];

export const SupaSupplierView: React.FC = () => {
  const { pools, business, updateBusiness } = useTradeSync();
  const [selectedTownship, setSelectedTownship] = useState<Business['township']>(business.township);
  const [selectedPoolForJoin, setSelectedPoolForJoin] = useState<InventoryPool | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  // Summary calculations
  const totalPooledCommunitySavings = pools.reduce((sum, p) => {
    const metrics = calculatePoolMetrics(p);
    return sum + metrics.totalCommunitySavingsZAR;
  }, 0);

  const totalParticipatingBusinesses = pools.reduce(
    (sum, p) => sum + p.participatingBusinessesCount,
    0
  );

  const filteredPools = pools.filter((p) => {
    if (activeCategory === 'ALL') return true;
    return p.category === activeCategory;
  });

  const categories = ['ALL', 'Cooking Essentials', 'Butchery & Poultry', 'Packaging & Gas'];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-amber-500/20 dark:text-amber-400 text-[11px] font-bold border border-blue-200 dark:border-amber-500/30">
              Pillar 2: Supply Network
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Demand Aggregation Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0B192C] dark:text-white tracking-tight">
            SupaSupplier Group Buying Pools
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
            Pool orders with nearby township spazas &amp; eateries to unlock 20-35% Tier-1 FMCG wholesale discounts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Township Selector */}
          <div className="flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-amber-400 mr-1.5" />
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold mr-1">Township:</span>
            <select
              value={selectedTownship}
              onChange={(e) => {
                const ts = e.target.value as Business['township'];
                setSelectedTownship(ts);
                updateBusiness({ township: ts });
              }}
              className="bg-transparent text-xs font-bold text-[#0B192C] dark:text-white focus:outline-none cursor-pointer"
            >
              {TOWNSHIPS.map((t) => (
                <option key={t} value={t} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                  {t}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            aria-label="Create New Group Buying Pool"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Launch Bulk Pool</span>
          </button>
        </div>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Collective Community Savings</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-700 dark:text-emerald-400">
            {formatZAR(totalPooledCommunitySavings)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Unlocked across {pools.length} active inventory pools</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Participating Kasi Merchants</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#0B192C] dark:text-white">{totalParticipatingBusinesses} Spazas &amp; Kitchens</div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Co-buying in {selectedTownship} clusters</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Shared Delivery Runs</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-sky-500/10 dark:text-sky-400">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#0B192C] dark:text-white">Next Drop: Wed 28 Oct</div>
          <p className="text-xs text-blue-600 dark:text-sky-400 font-semibold mt-1">Zero individual delivery freight fee</p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
              activeCategory === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-[#0B192C] dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
          >
            {cat === 'ALL' ? 'All Bulk Pools' : cat}
          </button>
        ))}
      </div>

      {/* Live Group Buying Pools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPools.map((pool) => {
          const metrics = calculatePoolMetrics(pool);
          return (
            <div
              key={pool.id}
              className="flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:border-blue-400 dark:hover:border-slate-700 transition"
            >
              {/* Image & Badges */}
              <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-950">
                <img
                  src={pool.imageUrl}
                  alt={pool.itemName}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-bold text-[10px] shadow-sm">
                    Save {metrics.discountPercentage}%
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px]">
                    {pool.category}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  {pool.status === 'THRESHOLD_MET' ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-extrabold text-[10px] shadow-lg flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Unlocked!</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px]">
                      {metrics.unitsRemaining} more needed
                    </span>
                  )}
                </div>

                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-white bg-slate-950/85 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                  <div className="flex items-center gap-1">
                    <Truck className="w-3 h-3 text-amber-400" />
                    <span>Drop: {formatDate(pool.dispatchDate)}</span>
                  </div>
                  <span className="text-slate-300 truncate max-w-[140px]">{pool.hubLocation}</span>
                </div>
              </div>

              {/* Pool Body Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold text-[#0B192C] dark:text-white leading-snug">
                    {pool.itemName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Supplier: <strong className="text-slate-700 dark:text-slate-300">{pool.supplierName}</strong>
                  </p>

                  {/* Pricing Comparison */}
                  <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase text-slate-500 dark:text-slate-400 block font-semibold">
                        Cash &amp; Carry Single
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        {formatZAR(pool.retailPricePerUnit)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase text-blue-700 dark:text-emerald-400 block font-bold">
                        Group Pool Price
                      </span>
                      <span className="text-base font-extrabold text-blue-700 dark:text-emerald-400">
                        {formatZAR(pool.wholesalePricePerUnit)}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar towards wholesale threshold */}
                  <div className="mt-3 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        Progress ({pool.currentPooledUnits} / {pool.targetThresholdUnits} {pool.unitMeasurement})
                      </span>
                      <span className="font-bold text-blue-600 dark:text-amber-400">
                        {metrics.progressPercentage}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          metrics.isThresholdMet
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-emerald-500 dark:to-teal-400'
                            : 'bg-gradient-to-r from-blue-500 to-sky-400 dark:from-amber-500 dark:to-orange-400'
                        }`}
                        style={{ width: `${metrics.progressPercentage}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{pool.participatingBusinessesCount} businesses pledged</span>
                      <span>Save {formatZAR(metrics.savingsPerUnitZAR)}/unit</span>
                    </div>
                  </div>
                </div>

                {/* Join / Pledge Action Button */}
                <button
                  onClick={() => setSelectedPoolForJoin(pool)}
                  className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 font-bold text-xs text-white transition shadow-sm shadow-blue-500/20 cursor-pointer"
                >
                  <Users className="w-4 h-4" />
                  <span>Join Pool &amp; Save {metrics.discountPercentage}%</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Shared Delivery Route & Hub Logistics Simulation */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-[#0B192C] dark:text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-600 dark:text-amber-400" />
              <span>Consolidated Township Delivery Run Schedule</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              One shared wholesale refrigerated freight truck delivers to 4 local hubs, cutting transport costs to zero.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-emerald-500/20 dark:text-emerald-400 text-xs font-bold border border-blue-200 dark:border-emerald-500/30">
            Route 1: Soweto &amp; West Rand
          </span>
        </div>

        {/* Route Stops Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 relative">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Stop 1 • 06:30</span>
            <h4 className="text-xs font-bold text-[#0B192C] dark:text-white mt-1">MegaWholesale JHB Central</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Pallet consolidation &amp; cold load</p>
            <span className="inline-block mt-2 text-[10px] text-blue-600 dark:text-emerald-400 font-semibold">Loaded</span>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-slate-950 border border-blue-300 dark:border-emerald-500/40 relative">
            <span className="text-[10px] font-bold uppercase text-blue-700 dark:text-emerald-400 block">Stop 2 • 08:45</span>
            <h4 className="text-xs font-bold text-[#0B192C] dark:text-white mt-1">Orlando West Spaza Hub</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Cooking oil &amp; packaging drop</p>
            <span className="inline-block mt-2 text-[10px] text-amber-600 dark:text-amber-400 font-semibold">In Transit</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 relative">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Stop 3 • 10:15</span>
            <h4 className="text-xs font-bold text-[#0B192C] dark:text-white mt-1">Baragwanath Depot</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">50kg maize bags &amp; poultry boxes</p>
            <span className="inline-block mt-2 text-[10px] text-slate-400">Scheduled</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 relative">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Stop 4 • 12:00</span>
            <h4 className="text-xs font-bold text-[#0B192C] dark:text-white mt-1">Diepkloof Gas Exchange</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Commercial gas cylinder refills</p>
            <span className="inline-block mt-2 text-[10px] text-slate-400">Scheduled</span>
          </div>
        </div>
      </div>

      {/* Modals */}
      <JoinPoolModal
        pool={selectedPoolForJoin}
        isOpen={!!selectedPoolForJoin}
        onClose={() => setSelectedPoolForJoin(null)}
      />
      <CreatePoolModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};
