import { PostgrestError } from '@supabase/supabase-js';

export interface ErrorResult {
  title: string;
  description: string;
  isNetworkError: boolean;
  shouldRetry: boolean;
  isAuthError?: boolean;
}

// User-friendly error messages (under 10 words)
const ERROR_MESSAGES = {
  network: "Connection failed. Check internet and try again.",
  auth: "Invalid email or password. Please try again.",
  authExpired: "Your session expired. Please log in again.",
  googleAuth: "Google sign-in failed. Try again or use email.",
  saveFailed: "Couldn't save. Try again?",
  loadFailed: "Couldn't load. Check connection and try again.",
  generic: "Something went wrong. Please try again.",
} as const;

export const handleSupabaseError = (error: any): ErrorResult => {
  // Network errors
  if (error.message?.includes('Failed to fetch') || 
      error.message?.includes('NetworkError') ||
      error.message?.includes('Network request failed')) {
    return {
      title: 'Connection Error',
      description: 'Please check your internet connection and try again',
      isNetworkError: true,
      shouldRetry: true,
    };
  }

  // Session/Auth errors
  if (error.message?.includes('JWT') || 
      error.message?.includes('session') ||
      error.message?.includes('not authenticated')) {
    return {
      title: 'Session Expired',
      description: ERROR_MESSAGES.authExpired,
      isNetworkError: false,
      shouldRetry: false,
      isAuthError: true,
    };
  }
  
  // Invalid credentials
  if (error.message?.includes('Invalid login') || 
      error.message?.includes('Invalid email') ||
      error.status === 400) {
    return {
      title: 'Sign in failed',
      description: ERROR_MESSAGES.auth,
      isNetworkError: false,
      shouldRetry: true,
      isAuthError: true,
    };
  }

  // Permission errors
  if (error.message?.includes('permission') || 
      error.message?.includes('policy') ||
      error.code === 'PGRST301') {
    return {
      title: 'Access Denied',
      description: 'You don\'t have permission to perform this action',
      isNetworkError: false,
      shouldRetry: false,
    };
  }

  // Rate limiting
  if (error.status === 429) {
    return {
      title: 'Too Many Requests',
      description: 'Please wait a moment before trying again',
      isNetworkError: false,
      shouldRetry: true,
    };
  }

  // Server errors (5xx)
  if (error.status >= 500) {
    return {
      title: 'Server Error',
      description: 'Our servers are having trouble. Please try again',
      isNetworkError: false,
      shouldRetry: true,
    };
  }

  // Validation errors
  if (error.code === '23505') {
    return {
      title: 'Already Exists',
      description: 'This item already exists',
      isNetworkError: false,
      shouldRetry: false,
    };
  }

  if (error.code === '23503') {
    return {
      title: 'Invalid Reference',
      description: 'Referenced item does not exist',
      isNetworkError: false,
      shouldRetry: false,
    };
  }

  // Generic error (hide technical details from users)
  return {
    title: 'Error',
    description: ERROR_MESSAGES.generic,
    isNetworkError: false,
    shouldRetry: true,
  };
};

export const getErrorMessage = (context: 'save' | 'load' | 'network' | 'auth'): string => {
  switch (context) {
    case 'save': return ERROR_MESSAGES.saveFailed;
    case 'load': return ERROR_MESSAGES.loadFailed;
    case 'network': return ERROR_MESSAGES.network;
    case 'auth': return ERROR_MESSAGES.auth;
    default: return ERROR_MESSAGES.generic;
  }
};

export const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const errorInfo = handleSupabaseError(error);
      
      // Don't retry if it's not a retryable error
      if (!errorInfo.shouldRetry) {
        throw error;
      }
      
      // Don't retry on last attempt
      if (attempt === maxRetries - 1) {
        throw error;
      }
      
      // Exponential backoff
      const delay = delayMs * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};
