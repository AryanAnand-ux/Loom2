/**
 * Structured error logging utility.
 * Provides consistent error reporting across the application.
 */

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface StructuredError {
  severity: ErrorSeverity;
  operation: string;
  error: string;
  details?: Record<string, unknown>;
  timestamp: string;
  userContext?: {
    userId?: string;
    email?: string;
  };
}

/**
 * Log errors in a structured format for better debugging and monitoring.
 */
export function logStructuredError(
  severity: ErrorSeverity,
  operation: string,
  error: unknown,
  details?: Record<string, unknown>
): StructuredError {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const structuredError: StructuredError = {
    severity,
    operation,
    error: errorMessage,
    details,
    timestamp: new Date().toISOString(),
  };

  // Log to console in development
  if (import.meta.env.DEV) {
    console.error(`[${severity}] ${operation}:`, structuredError);
  }

  // In production, you would send to error tracking service (Sentry, etc.)
  // if (import.meta.env.PROD && window.Sentry) {
  //   window.Sentry.captureException(error, { level: severity.toLowerCase() });
  // }

  return structuredError;
}

/**
 * Get user-friendly error message from error object.
 */
export function getUserFriendlyMessage(error: unknown, operation: string): string {
  if (error instanceof Error) {
    // Firebase errors
    if (error.message.includes('permission-denied')) {
      return 'You don\'t have permission to perform this action. Please check your login.';
    }
    if (error.message.includes('not-found')) {
      return `${operation} failed: Resource not found.`;
    }
    if (error.message.includes('unauthenticated')) {
      return 'You are not authenticated. Please log in again.';
    }
    if (error.message.includes('network')) {
      return 'Network error. Please check your internet connection.';
    }
    // Default error message
    return `${operation} failed. Please try again.`;
  }
  return `${operation} failed unexpectedly. Please try again.`;
}
