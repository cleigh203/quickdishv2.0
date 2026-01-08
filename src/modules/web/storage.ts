/**
 * Web-specific storage utilities
 * Uses browser localStorage/sessionStorage, not available in native
 */

import { isWeb } from '@/utils/platform';

/**
 * Safe localStorage get (web only)
 */
export const getLocalStorage = (key: string): string | null => {
  if (!isWeb() || typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

/**
 * Safe localStorage set (web only)
 */
export const setLocalStorage = (key: string, value: string): boolean => {
  if (!isWeb() || typeof window === 'undefined') return false;
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

/**
 * Safe localStorage remove (web only)
 */
export const removeLocalStorage = (key: string): boolean => {
  if (!isWeb() || typeof window === 'undefined') return false;
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

/**
 * Safe sessionStorage get (web only)
 */
export const getSessionStorage = (key: string): string | null => {
  if (!isWeb() || typeof window === 'undefined') return null;
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
};

/**
 * Safe sessionStorage set (web only)
 */
export const setSessionStorage = (key: string, value: string): boolean => {
  if (!isWeb() || typeof window === 'undefined') return false;
  try {
    sessionStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

