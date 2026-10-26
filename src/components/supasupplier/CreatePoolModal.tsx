import React, { useState } from 'react';
import { Truck, Plus, X } from 'lucide-react';
import { useTradeSync } from '../../context/TradeSyncContext.tsx';
import { InventoryPool } from '../../types/index.ts';

interface CreatePoolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePoolModal: React.FC<CreatePoolModalProps> = ({ isOpen, onClose }) => {
  const { createPool } = useTradeSync();

  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState<InventoryPool['category']>('Cooking Essentials');
  const [wholesalePrice, setWholesalePrice] = useState('');
  const [retailPrice, setRetailPrice] = useState('');
  const [targetThresholdUnits, setTargetThresholdUnits] = useState('100');
  const [unitMeasurement, setUnitMeasurement] = useState('20L drum');
  const [hubLocation, setHubLocation] = useState('Orlando West Community Spaza Hub');
  const [supplierName, setSupplierName] = useState('MegaWholesale SA Central');
  const [dispatchDate, setDispatchDate] = useState('2026-11-05');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const wp = parseFloat(wholesalePrice);
    const rp = parseFloat(retailPrice);
    const target = parseInt(targetThresholdUnits);

    if (isNaN(wp) || isNaN(rp) || isNaN(target) || !itemName.trim()) {
      alert('Please fill out all required fields with valid numbers');
      return;
    }

    createPool({
      itemName: itemName.trim(),
      category,
      imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80',
      wholesalePricePerUnit: wp,
      retailPricePerUnit: rp,
      targetThresholdUnits: target,
      unitMeasurement,
      hubLocation,
      supplierName,
      dispatchDate,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-6 text-[#0B192C] dark:text-slate-100 max-h-[90vh] overflow-y-auto transition-colors">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 dark:bg-amber-500/20 dark:text-amber-400 flex items-center justify-center border border-blue-200 dark:border-amber-500/30">
              <Plus className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0B192C] dark:text-white">Create Group Buying Pool</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close create pool modal"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="my-5 space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Item Name:</label>
            <input
              type="text"
              required
              placeholder="e.g. White Maize Meal 50kg or Frozen Chips 10kg"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 p-2.5 text-[#0B192C] dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Category:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as InventoryPool['category'])}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 p-2.5 text-[#0B192C] dark:text-slate-200"
              >
                <option value="Cooking Essentials">Cooking Essentials</option>
                <option value="Fresh Produce">Fresh Produce</option>
                <option value="Butchery & Poultry">Butchery &amp; Poultry</option>
                <option value="Beverages">Beverages</option>
                <option value="Packaging & Gas">Packaging &amp; Gas</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Unit Measurement:</label>
              <input
                type="text"
                required
                placeholder="e.g. 50kg bag / 20L drum"
                value={unitMeasurement}
                onChange={(e) => setUnitMeasurement(e.target.value)}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 p-2.5 text-[#0B192C] dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Target Threshold (Units):</label>
              <input
                type="number"
                min="10"
                required
                value={targetThresholdUnits}
                onChange={(e) => setTargetThresholdUnits(e.target.value)}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 p-2.5 text-[#0B192C] dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Scheduled Dispatch Date:</label>
              <input
                type="date"
                required
                value={dispatchDate}
                onChange={(e) => setDispatchDate(e.target.value)}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 p-2.5 text-[#0B192C] dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Wholesale Price (ZAR):</label>
              <input
                type="number"
                step="0.5"
                min="1"
                required
                placeholder="e.g. 380.00"
                value={wholesalePrice}
                onChange={(e) => setWholesalePrice(e.target.value)}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 p-2.5 text-[#0B192C] dark:text-slate-100 font-semibold"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Single-Retail Price (ZAR):</label>
              <input
                type="number"
                step="0.5"
                min="1"
                required
                placeholder="e.g. 495.00"
                value={retailPrice}
                onChange={(e) => setRetailPrice(e.target.value)}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 p-2.5 text-[#0B192C] dark:text-slate-100 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Supplier Name:</label>
            <input
              type="text"
              required
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 p-2.5 text-[#0B192C] dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Township Drop Hub:</label>
            <input
              type="text"
              required
              value={hubLocation}
              onChange={(e) => setHubLocation(e.target.value)}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 p-2.5 text-[#0B192C] dark:text-slate-100"
            />
          </div>

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
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-md shadow-blue-500/25 cursor-pointer"
            >
              Launch Group Pool
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
