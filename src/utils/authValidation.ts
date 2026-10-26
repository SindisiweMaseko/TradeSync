/**
 * TradeSync South African Authentication & Registration Validation Utilities
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  normalized?: string;
}

/**
 * Validates and normalizes South African mobile and landline phone numbers
 * Accepts:
 * - 073 123 4567 / 0821234567 / 0612345678 (10 digits starting with 0)
 * - +27 73 123 4567 / +27821234567 (11 digits starting with +27)
 * - 27731234567 (11 digits starting with 27)
 */
export function validateSAPhoneNumber(phone: string): ValidationResult {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, error: 'Phone number is required' };
  }

  // Strip spaces, dashes, parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');

  // Case 1: Starts with +27
  if (cleaned.startsWith('+27')) {
    const digits = cleaned.slice(3);
    if (/^[6-8]\d{8}$/.test(digits)) {
      return { isValid: true, normalized: `+27 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}` };
    }
  }

  // Case 2: Starts with 27 (without +)
  if (cleaned.startsWith('27') && cleaned.length === 11) {
    const digits = cleaned.slice(2);
    if (/^[6-8]\d{8}$/.test(digits)) {
      return { isValid: true, normalized: `+27 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}` };
    }
  }

  // Case 3: Local 0 prefix (e.g. 0731234567)
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    const digits = cleaned.slice(1);
    if (/^[6-8]\d{8}$/.test(digits)) {
      return { isValid: true, normalized: `+27 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}` };
    }
  }

  return {
    isValid: false,
    error: 'Enter a valid South African mobile number (e.g., 073 892 4110 or +27 82 123 4567)',
  };
}

/**
 * Validates standard email address format
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates password or 6-digit security PIN
 */
export function validatePasswordOrPIN(value: string): {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  error?: string;
} {
  if (!value || value.length < 6) {
    return {
      isValid: false,
      strength: 'weak',
      error: 'Password or PIN must be at least 6 characters',
    };
  }

  // If 6-digit numeric PIN
  if (/^\d{6}$/.test(value)) {
    return { isValid: true, strength: 'medium' };
  }

  let score = 0;
  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value)) score++;
  if (/[0-9]/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;

  if (score >= 3) {
    return { isValid: true, strength: 'strong' };
  } else if (score >= 2) {
    return { isValid: true, strength: 'medium' };
  }

  return { isValid: true, strength: 'weak' };
}
