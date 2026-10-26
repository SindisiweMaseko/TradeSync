import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Download,
  Printer,
  X,
  CheckCircle,
  Building,
} from 'lucide-react';
import { useTradeSync } from '../../context/TradeSyncContext.tsx';
import { generateInvoicePDF, InvoiceData, InvoiceItem } from '../../utils/pdfInvoice.ts';
import { formatZAR } from '../../utils/formatters.ts';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose }) => {
  const { business, triggerConfetti } = useTradeSync();

  const [customerName, setCustomerName] = useState('Orlando Pirates Supporters Club');
  const [customerPhone, setCustomerPhone] = useState('+27 82 445 9012');
  const [customerAddress, setCustomerAddress] = useState('Orlando Stadium VIP Suite, Soweto');
  const [invoiceNumber, setInvoiceNumber] = useState(`TS-INV-${Math.floor(1000 + Math.random() * 9000)}`);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  );
  const [includeVat, setIncludeVat] = useState(false);

  const [bankName, setBankName] = useState('Capitec Business');
  const [accountNumber, setAccountNumber] = useState('1052849102');
  const [branchCode, setBranchCode] = useState('470010');
  const [accountType, setAccountType] = useState('Current / Cheque');

  const [items, setItems] = useState<InvoiceItem[]>([
    { description: 'Gourmet Kota Catering (Double Cheese, Russian, Achaar)', quantity: 35, unitPrice: 65.0 },
    { description: 'Assorted Cold Cans (Coca-Cola, Stoney, Sparletta 330ml)', quantity: 35, unitPrice: 18.0 },
    { description: 'Delivery & Hot Box Setup at Orlando Stadium', quantity: 1, unitPrice: 250.0 },
  ]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    setItems((prev) => [...prev, { description: '', quantity: 1, unitPrice: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice || 0), 0);
  const vat = includeVat ? subtotal * 0.15 : 0;
  const grandTotal = subtotal + vat;

  const handleDownloadPDF = () => {
    const data: InvoiceData = {
      invoiceNumber,
      date,
      dueDate,
      customerName,
      customerPhone,
      customerAddress,
      items: items.filter((i) => i.description.trim().length > 0),
      includeVat,
      bankName,
      accountNumber,
      accountType,
      branchCode,
    };

    const doc = generateInvoicePDF(business, data);
    doc.save(`${invoiceNumber}-${customerName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
    triggerConfetti();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-3xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-6 text-[#0B192C] dark:text-slate-100 max-h-[92vh] flex flex-col transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 dark:bg-amber-500/20 dark:text-amber-400 flex items-center justify-center border border-blue-200 dark:border-amber-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0B192C] dark:text-white flex items-center gap-2">
                <span>Instant Digital Tax Invoice Generator</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30">
                  CIPC &amp; SARS Compliant
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generate and download professional PDF tax invoices for corporate clients &amp; catering orders
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close invoice modal"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
          {/* Metadata Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase text-blue-700 dark:text-emerald-400 block mb-2">
                Issued By (Your Business)
              </span>
              <p className="font-bold text-[#0B192C] dark:text-white text-sm">{business.businessName}</p>
              <p className="text-slate-600 dark:text-slate-400">{business.locationAddress}, {business.township}</p>
              <p className="text-slate-600 dark:text-slate-400">CIPC: {business.cipcNumber ?? 'Pending'} • B-BBEE Level {business.bbbeeLevel ?? 1}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label className="text-slate-600 dark:text-slate-400">Invoice Number:</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-2.5 py-1 text-[#0B192C] dark:text-slate-100 font-mono text-xs text-right"
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <label className="text-slate-600 dark:text-slate-400">Invoice Date:</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-2 py-1 text-[#0B192C] dark:text-slate-100 text-xs"
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <label className="text-slate-600 dark:text-slate-400">Due Date:</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-2 py-1 text-[#0B192C] dark:text-slate-100 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
            <span className="text-[10px] font-bold uppercase text-blue-700 dark:text-amber-400 block">
              Bill To (Customer / Client)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Customer / Organization Name:</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Soweto Rugby Club"
                  className="w-full rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-2 text-[#0B192C] dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Phone / WhatsApp:</label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. +27 82 000 0000"
                  className="w-full rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-2 text-[#0B192C] dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Delivery / Street Address:</label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="e.g. 124 Msimango St, Soweto"
                  className="w-full rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-2 text-[#0B192C] dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-blue-700 dark:text-sky-400">
                Invoice Line Items
              </span>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-emerald-400 dark:hover:text-emerald-300 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Item description (e.g. Special Kota)"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    className="flex-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-2 text-xs text-[#0B192C] dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <div className="w-20">
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                      className="w-full rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-2 text-xs text-center text-[#0B192C] dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="w-28 relative">
                    <span className="absolute left-2.5 top-2 text-[11px] text-slate-400">R</span>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      placeholder="Price"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="w-full rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 pl-6 pr-2 py-2 text-xs text-right text-[#0B192C] dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="w-24 text-right text-xs font-semibold text-blue-700 dark:text-emerald-400">
                    {formatZAR(item.quantity * item.unitPrice)}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col items-end gap-1.5 text-xs">
              <div className="flex items-center gap-8">
                <span className="text-slate-600 dark:text-slate-400">Subtotal:</span>
                <span className="font-semibold text-[#0B192C] dark:text-slate-200">{formatZAR(subtotal)}</span>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={includeVat}
                    onChange={(e) => setIncludeVat(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Include 15% VAT:</span>
                </label>
                <span className="font-semibold text-[#0B192C] dark:text-slate-200">{formatZAR(vat)}</span>
              </div>
              <div className="flex items-center gap-8 text-sm font-bold pt-1 border-t border-slate-200 dark:border-slate-800 text-blue-700 dark:text-emerald-400">
                <span>Total Due:</span>
                <span>{formatZAR(grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Banking Details */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
            <span className="text-[10px] font-bold uppercase text-blue-700 dark:text-purple-400 block">
              Payment &amp; Banking Details (South African EFT / Capitec / FNB / Nedbank / Standard Bank)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Bank Name:</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-2 text-[#0B192C] dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Account Number:</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-2 text-[#0B192C] dark:text-slate-100 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Branch Code:</label>
                <input
                  type="text"
                  value={branchCode}
                  onChange={(e) => setBranchCode(e.target.value)}
                  className="w-full rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-2 text-[#0B192C] dark:text-slate-100 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Account Type:</label>
                <input
                  type="text"
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                  className="w-full rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-2 text-[#0B192C] dark:text-slate-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 flex-shrink-0">
          <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            Includes TradeSync security QR and verified ledger stamp.
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition"
            >
              Cancel
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-xs font-bold text-white shadow-md shadow-blue-500/25 transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Invoice</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
