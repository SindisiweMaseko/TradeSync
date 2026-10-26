import React, { useState } from 'react';
import {
  Users,
  X,
  Truck,
  CheckCircle2,
  DollarSign,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { InventoryPool } from '../../types/index.ts';
import { useTradeSync } from '../../context/TradeSyncContext.tsx';
import { formatZAR } from '../../utils/formatters.ts';

interface JoinPoolModalProps {
  pool: InventoryPool | null;
  isOpen: boolean;
  onClose: () => void;
}

export const JoinPoolModal: React.FC<JoinPoolModalProps> = ({ pool, isOpen, onClose }) => {
  const { joinPool, business } = useTradeSync();
  const [units, setUnits] = useState(2);
  const [selectedHub, setSelectedHub] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [savedAmount, setSavedAmount] = useState(0);

  if (!isOpen || !pool) return null;

  const currentHub = selectedHub || pool.hubLocation;
  const unitSavings = pool.retailPricePerUnit - pool.wholesalePricePerUnit;
  const totalUserSavings = units * unitSavings;
  const totalUserCost = units * pool.wholesalePricePerUnit;
  const retailCostEquivalent = units * pool.retailPricePerUnit;

  const handleConfirmPledge = (e: React.FormEvent) => {
    e.preventDefault();
    const res = joinPool(pool.id, units);
    setSavedAmount(res.savingsZAR);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-6 text-[#0B192C] dark:text-slate-100 transition-colors">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 dark:bg-amber-500/20 dark:text-amber-400 flex items-center justify-center border border-blue-200 dark:border-amber-500/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0B192C] dark:text-white">Join Group Buying Pool</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{pool.itemName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close join pool modal"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-emerald-500/20 border-2 border-blue-600 dark:border-emerald-500 flex items-center justify-center text-blue-600 dark:text-emerald-400 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-[#0B192C] dark:text-white">Pledge Confirmed!</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs">
              You pledged {units} units. You just saved{' '}
              <strong className="text-blue-700 dark:text-emerald-400">{formatZAR(savedAmount)}</strong> compared to single-spaza retail wholesale!
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Pickup scheduled at: {currentHub}
            </p>
          </div>
        ) : (
          <form onSubmit={handleConfirmPledge} className="my-5 space-y-4 text-xs">
            {/* Pool Highlight Summary */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
              <img
                src={pool.imageUrl}
                alt={pool.itemName}
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-800"
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#0B192C] dark:text-white">{pool.itemName}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-amber-500/20 dark:text-amber-300 font-bold border border-blue-200 dark:border-amber-500/30">
                    Tier-1 Wholesale
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400">Supplier: {pool.supplierName}</p>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 line-through">
                    Retail: {formatZAR(pool.retailPricePerUnit)}
                  </span>
                  <span className="text-blue-700 dark:text-emerald-400 font-bold">
                    Group Pool: {formatZAR(pool.wholesalePricePerUnit)}
                  </span>
                </div>
              </div>
            </div>

            {/* Units Slider / Input */}
            <div>
              <label htmlFor="units-to-pledge" className="block text-slate-700 dark:text-slate-300 font-medium mb-1.5">
                How many units to pledge? (Unit: {pool.unitMeasurement})
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="units-to-pledge"
                  type="range"
                  min="1"
                  max="25"
                  value={units}
                  onChange={(e) => setUnits(parseInt(e.target.value) || 1)}
                  className="flex-1 accent-blue-600 cursor-pointer"
                />
                <div className="w-16 text-center font-bold text-sm bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 py-1.5 rounded-lg text-blue-700 dark:text-emerald-400">
                  {units}
                </div>
              </div>
            </div>

            {/* Savings Comparison Card */}
            <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-emerald-950/20 border border-blue-200 dark:border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-700 dark:text-slate-300">Pooled Wholesale Total:</span>
                <span className="text-sm font-bold text-[#0B192C] dark:text-white">{formatZAR(totalUserCost)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span>Standard Cash &amp; Carry Price:</span>
                <span className="line-through">{formatZAR(retailCostEquivalent)}</span>
              </div>
              <div className="pt-2 border-t border-blue-200 dark:border-emerald-500/20 flex items-center justify-between text-blue-700 dark:text-emerald-400 font-bold">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Your Collective Savings:</span>
                </div>
                <span>{formatZAR(totalUserSavings)}</span>
              </div>
            </div>

            {/* Township Collection Hub */}
            <div>
              <label htmlFor="collection-hub" className="block text-slate-700 dark:text-slate-300 font-medium mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-amber-400" />
                <span>Select Township Delivery Hub / Spaza Drop Point:</span>
              </label>
              <select
                id="collection-hub"
                value={selectedHub}
                onChange={(e) => setSelectedHub(e.target.value)}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 p-2.5 text-xs text-[#0B192C] dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value={pool.hubLocation}>{pool.hubLocation} (Primary Depot)</option>
                <option value="Vilakazi St Central Spaza Hub">Vilakazi St Central Spaza Hub (Soweto)</option>
                <option value="Baragwanath Transport Interchange Depot">Baragwanath Transport Interchange Depot</option>
                <option value="Diepkloof Gas Exchange Point">Diepkloof Gas Exchange Point</option>
              </select>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-xs font-bold text-white shadow-md shadow-blue-500/25 transition cursor-pointer"
              >
                Confirm Pledge ({units} units)
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
