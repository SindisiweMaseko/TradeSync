import React, { useState } from 'react';
import { PlusCircle, X, DollarSign, Tag, FileText, CheckCircle2 } from 'lucide-react';
import { useTradeSync } from '../../context/TradeSyncContext.tsx';
import { Transaction } from '../../types/index.ts';

interface ManualTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: Transaction['category'][] = [
  'Direct Customer Sales',
  'Catering Order',
  'Food & Groceries',
  'Beverages & Stock',
  'Packaging',
  'Transport & Fuel',
  'Utilities & Electricity',
  'Staff Wages',
  'Equipment & Maintenance',
  'Airtime & Data',
];

export const ManualTransactionModal: React.FC<ManualTransactionModalProps> = ({ isOpen, onClose }) => {
  const { addTransaction, triggerConfetti } = useTradeSync();
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('INCOME');
  const [category, setCategory] = useState<Transaction['category']>('Direct Customer Sales');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Please enter a valid amount in ZAR');
      return;
    }
    if (!description.trim()) {
      alert('Please enter a description');
      return;
    }

    setIsSubmitting(true);
    addTransaction({
      type,
      category,
      amount: parsedAmount,
      description: description.trim(),
      source: 'WEB',
    });

    triggerConfetti();
    setTimeout(() => {
      setIsSubmitting(false);
      setAmount('');
      setDescription('');
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-6 text-[#0B192C] dark:text-slate-100 transition-colors">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center border border-blue-200 dark:border-emerald-500/30">
              <PlusCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0B192C] dark:text-white">Manual Transaction Entry</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close manual transaction modal"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="my-5 space-y-4">
          {/* Income vs Expense Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setType('INCOME');
                setCategory('Direct Customer Sales');
              }}
              className={`py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                type === 'INCOME'
                  ? 'bg-blue-600 dark:bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-[#0B192C] dark:hover:text-white'
              }`}
            >
              + INCOME (Sales)
            </button>
            <button
              type="button"
              onClick={() => {
                setType('EXPENSE');
                setCategory('Food & Groceries');
              }}
              className={`py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                type === 'EXPENSE'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-[#0B192C] dark:hover:text-white'
              }`}
            >
              - EXPENSE (Cost)
            </button>
          </div>

          {/* Amount input */}
          <div>
            <label htmlFor="amount" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Amount (South African Rand - ZAR):
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs font-bold text-blue-600 dark:text-emerald-400">R</span>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0.5"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 pl-8 pr-3 py-2 text-sm text-[#0B192C] dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
              />
            </div>
          </div>

          {/* Category selection */}
          <div>
            <label htmlFor="category" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Category:
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Transaction['category'])}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 p-2.5 text-xs text-[#0B192C] dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Description / Notes:
            </label>
            <input
              id="description"
              type="text"
              required
              placeholder="e.g. 10 Kota Specials or Bulk Spaza cooking oil"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 p-2.5 text-xs text-[#0B192C] dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-xs font-bold text-white shadow-md shadow-blue-500/25 transition cursor-pointer"
            >
              Record Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
