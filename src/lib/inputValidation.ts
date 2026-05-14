/**
 * Input validation and sanitization utilities.
 * Prevents prompt injection and ensures data integrity.
 */

/**
 * Sanitize scene input for Gemini prompt injection prevention.
 * Removes special characters and limits length.
 */
export function sanitizeSceneInput(input: string): string {
  if (!input) return '';
  
  // Trim whitespace
  let sanitized = input.trim();
  
  // Limit to 200 characters
  sanitized = sanitized.slice(0, 200);
  
  // Remove potentially problematic characters while allowing basic punctuation
  // Allow: letters, numbers, spaces, basic punctuation (. , ! ? ' -)
  sanitized = sanitized.replace(/[^\w\s.,!?\'-]/g, '');
  
  // Remove multiple spaces
  sanitized = sanitized.replace(/\s+/g, ' ');
  
  return sanitized;
}

/**
 * Validate scene input length and content.
 */
export function isValidSceneInput(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  const trimmed = input.trim();
  return trimmed.length > 0 && trimmed.length <= 200;
}

/**
 * Sanitize category input for search/filtering.
 */
export function sanitizeSearchInput(input: string): string {
  if (!input) return '';
  
  // Trim and limit length
  let sanitized = input.trim().slice(0, 100);
  
  // Remove special regex characters
  sanitized = sanitized.replace(/[.*+?^${}()|[\]\\]/g, '');
  
  return sanitized;
}
