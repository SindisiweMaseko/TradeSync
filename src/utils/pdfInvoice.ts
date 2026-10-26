import jsPDF from 'jspdf';
import { Business } from '../types/index.ts';

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  items: InvoiceItem[];
  includeVat: boolean;
  notes?: string;
  bankName: string;
  accountNumber: string;
  accountType: string;
  branchCode: string;
}

export function generateInvoicePDF(business: Business, data: InvoiceData): jsPDF {
  const doc = new jsPDF({
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Accent Line
  doc.setFillColor(16, 185, 129); // emerald-500
  doc.rect(0, 39, pageWidth, 2, 'F');

  // Business Name & Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text(business.businessName, 14, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text(`${business.locationAddress} • ${business.township}, South Africa`, 14, 25);
  if (business.cipcNumber) {
    doc.text(`CIPC Reg: ${business.cipcNumber} | B-BBEE Level: ${business.bbbeeLevel ?? 1}`, 14, 31);
  }

  // Invoice Title Right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(245, 158, 11); // amber-400
  doc.text('TAX INVOICE', pageWidth - 14, 18, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(`Invoice #: ${data.invoiceNumber}`, pageWidth - 14, 25, { align: 'right' });
  doc.text(`Date: ${data.date}`, pageWidth - 14, 31, { align: 'right' });

  // Bill To Section
  let y = 52;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('BILL TO:', 14, y);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(data.customerName, 14, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Phone: ${data.customerPhone}`, 14, y + 11);
  if (data.customerAddress) {
    doc.text(data.customerAddress, 14, y + 16);
    y += 5;
  }

  // Due Date Right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`Payment Due: ${data.dueDate}`, pageWidth - 14, 58, { align: 'right' });

  // Items Table Header
  y += 24;
  doc.setFillColor(241, 245, 249); // slate-100
  doc.roundedRect(14, y, pageWidth - 28, 8, 1, 1, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text('DESCRIPTION', 18, y + 5.5);
  doc.text('QTY', pageWidth - 80, y + 5.5, { align: 'center' });
  doc.text('UNIT PRICE', pageWidth - 45, y + 5.5, { align: 'right' });
  doc.text('TOTAL (ZAR)', pageWidth - 18, y + 5.5, { align: 'right' });

  y += 11;
  let subtotal = 0;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);

  data.items.forEach((item, index) => {
    const itemTotal = item.quantity * item.unitPrice;
    subtotal += itemTotal;

    // Alternate row styling
    if (index % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y - 4, pageWidth - 28, 7, 'F');
    }

    doc.text(item.description, 18, y);
    doc.text(item.quantity.toString(), pageWidth - 80, y, { align: 'center' });
    doc.text(`R ${item.unitPrice.toFixed(2)}`, pageWidth - 45, y, { align: 'right' });
    doc.text(`R ${itemTotal.toFixed(2)}`, pageWidth - 18, y, { align: 'right' });

    y += 7.5;
  });

  // Table underline
  doc.setDrawColor(226, 232, 240);
  doc.line(14, y, pageWidth - 14, y);
  y += 6;

  // Calculation Totals
  const vat = data.includeVat ? subtotal * 0.15 : 0;
  const grandTotal = subtotal + vat;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Subtotal:', pageWidth - 55, y);
  doc.text(`R ${subtotal.toFixed(2)}`, pageWidth - 18, y, { align: 'right' });
  y += 6;

  if (data.includeVat) {
    doc.text('VAT (15%):', pageWidth - 55, y);
    doc.text(`R ${vat.toFixed(2)}`, pageWidth - 18, y, { align: 'right' });
    y += 6;
  }

  // Grand Total Box
  doc.setFillColor(240, 253, 244); // emerald-50
  doc.roundedRect(pageWidth - 75, y - 2, 61, 10, 1, 1, 'F');
  doc.setDrawColor(16, 185, 129);
  doc.roundedRect(pageWidth - 75, y - 2, 61, 10, 1, 1, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(6, 95, 70); // emerald-800
  doc.text('Total Due:', pageWidth - 70, y + 4.5);
  doc.text(`R ${grandTotal.toFixed(2)}`, pageWidth - 18, y + 4.5, { align: 'right' });

  // Banking Details Section
  y = Math.max(y + 20, 190);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, y, 100, 36, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, y, 100, 36, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('PAYMENT & BANKING DETAILS (EFT):', 18, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Bank: ${data.bankName}`, 18, y + 14);
  doc.text(`Account Name: ${business.businessName}`, 18, y + 19);
  doc.text(`Account Number: ${data.accountNumber} (${data.accountType})`, 18, y + 24);
  doc.text(`Branch Code: ${data.branchCode} • Reference: ${data.invoiceNumber}`, 18, y + 29);

  // TradeSync Verified Badge
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(pageWidth - 75, y, 61, 36, 2, 2, 'F');
  doc.setDrawColor(52, 211, 153);
  doc.roundedRect(pageWidth - 75, y, 61, 36, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(5, 150, 105);
  doc.text('TRADESYNC VERIFIED', pageWidth - 45, y + 12, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Encrypted Township Ledger', pageWidth - 45, y + 18, { align: 'center' });
  doc.text('Compliant B2B Tax Format', pageWidth - 45, y + 24, { align: 'center' });

  // Footer Note
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Thank you for supporting South African local township business & youth entrepreneurship.', pageWidth / 2, 280, { align: 'center' });

  return doc;
}
