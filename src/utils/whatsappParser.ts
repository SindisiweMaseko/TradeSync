import { Transaction } from '../types/index.ts';

export interface ParsedWhatsAppResult {
  success: boolean;
  type: 'INCOME' | 'EXPENSE';
  category: Transaction['category'];
  amount: number;
  description: string;
  source: 'WHATSAPP';
  confidence: number; // 0 - 1
  rawText: string;
}

function extractNumber(text: string): number {
  // Normalize whitespace
  const lower = text.toLowerCase();

  // Pattern 1: Explicit R / ZAR prefix: R1,200.50 | R 1200.50 | R525 | ZAR 3500 | R1,500
  const rPattern = /(?:r\s*|zar\s*)([0-9]{1,3}(?:[,\s][0-9]{3})*(?:\.[0-9]{1,2})?|[0-9]+(?:\.[0-9]{1,2})?|[0-9]+(?:,[0-9]{2})?)/i;
  const matchR = text.match(rPattern);

  if (matchR && matchR[1]) {
    return cleanAndParseNum(matchR[1]);
  }

  // Pattern 2: Suffix like 500 rands / 1200 bucks
  const suffixPattern = /([0-9]{1,3}(?:[,\s][0-9]{3})*(?:\.[0-9]{1,2})?|[0-9]+(?:\.[0-9]{1,2})?|[0-9]+(?:,[0-9]{2})?)\s*(?:rands?|zar|bucks)/i;
  const matchSuffix = text.match(suffixPattern);
  if (matchSuffix && matchSuffix[1]) {
    return cleanAndParseNum(matchSuffix[1]);
  }

  // Pattern 3: general tokens
  const tokens = text.split(/\s+/);
  for (const token of tokens) {
    const cleaned = token.replace(/[^0-9.,]/g, '');
    if (cleaned.length > 0 && /^[0-9]/.test(cleaned)) {
      const val = cleanAndParseNum(cleaned);
      if (val > 0 && val < 5000000) {
        return val;
      }
    }
  }

  return 0;
}

function cleanAndParseNum(raw: string): number {
  // If string has both ',' and '.', e.g. "1,200.50", remove commas then parse float
  if (raw.includes(',') && raw.includes('.')) {
    const num = parseFloat(raw.replace(/,/g, ''));
    return isNaN(num) ? 0 : num;
  }
  // If string has comma like "1,200", check if 3 digits follow comma
  if (raw.includes(',')) {
    const parts = raw.split(',');
    if (parts.length === 2 && parts[1].length === 3) {
      // Thousands separator
      return parseFloat(parts[0] + parts[1]);
    }
    // If 2 digits, it's cents: "50,50" -> 50.50
    return parseFloat(raw.replace(',', '.'));
  }
  // Remove internal spaces e.g. "1 200"
  const clean = raw.replace(/\s+/g, '');
  const val = parseFloat(clean);
  return isNaN(val) ? 0 : val;
}

export function parseWhatsAppNote(rawText: string, businessId: string = ''): ParsedWhatsAppResult {
  const text = rawText.trim();
  const lower = text.toLowerCase();

  const amount = extractNumber(text);

  // 2. Type detection: INCOME vs EXPENSE
  let type: 'INCOME' | 'EXPENSE' = 'INCOME';
  const expenseKeywords = [
    'bought',
    'buy',
    'purchased',
    'purchase',
    'paid',
    'pay',
    'spent',
    'spend',
    'expense',
    'cost',
    'cash & carry',
    'cash and carry',
    'wholesaler',
    'wages',
    'rent',
    'fuel',
    'petrol',
    'diesel',
    'electricity',
    'airtime',
    'stock up',
  ];

  const incomeKeywords = [
    'sold',
    'sell',
    'sales',
    'sale',
    'received',
    'deposit',
    'earned',
    'made',
    'customer',
    'order',
    'payment in',
    'income',
    'revenue',
    'cashing up',
    'turnover',
  ];

  let expenseMatches = 0;
  let incomeMatches = 0;

  for (const kw of expenseKeywords) {
    if (lower.includes(kw)) expenseMatches++;
  }
  for (const kw of incomeKeywords) {
    if (lower.includes(kw)) incomeMatches++;
  }

  if (expenseMatches > incomeMatches) {
    type = 'EXPENSE';
  } else if (incomeMatches > expenseMatches) {
    type = 'INCOME';
  } else {
    if (lower.startsWith('bought') || lower.startsWith('paid') || lower.startsWith('spent')) {
      type = 'EXPENSE';
    } else {
      type = 'INCOME';
    }
  }

  // 3. Category detection
  let category: Transaction['category'] = type === 'INCOME' ? 'Direct Customer Sales' : 'Food & Groceries';

  if (type === 'INCOME') {
    if (lower.includes('catering') || lower.includes('event') || lower.includes('party') || lower.includes('buffet')) {
      category = 'Catering Order';
    } else {
      category = 'Direct Customer Sales';
    }
  } else {
    // Expense categorization
    if (lower.includes('wage') || lower.includes('salary') || lower.includes('helper') || lower.includes('worker') || lower.includes('staff')) {
      category = 'Staff Wages';
    } else if (lower.includes('electric') || lower.includes('power') || lower.includes('water') || lower.includes('meter') || lower.includes('rates')) {
      category = 'Utilities & Electricity';
    } else if (lower.includes('fuel') || lower.includes('petrol') || lower.includes('diesel') || lower.includes('transport') || lower.includes('taxi') || lower.includes('van')) {
      category = 'Transport & Fuel';
    } else if (lower.includes('airtime') || lower.includes('data') || lower.includes('wifi') || lower.includes('vodacom') || lower.includes('mtn')) {
      category = 'Airtime & Data';
    } else if (lower.includes('box') || lower.includes('container') || lower.includes('foil') || lower.includes('bag') || lower.includes('packag')) {
      category = 'Packaging';
    } else if (lower.includes('coke') || lower.includes('drink') || lower.includes('beverage') || lower.includes('juice') || lower.includes('water bottle')) {
      category = 'Beverages & Stock';
    } else if (lower.includes('repair') || lower.includes('fix') || lower.includes('grill') || lower.includes('deep fryer') || lower.includes('fridge') || lower.includes('maintenance')) {
      category = 'Equipment & Maintenance';
    } else {
      category = 'Food & Groceries';
    }
  }

  const success = amount > 0 && text.length > 3;
  const confidence = success ? (text.toLowerCase().includes('r') ? 0.95 : 0.8) : 0.2;

  return {
    success,
    type,
    category,
    amount: Math.round(amount * 100) / 100,
    description: text,
    source: 'WHATSAPP',
    confidence,
    rawText: text,
  };
}
