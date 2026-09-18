import crypto from 'crypto';

/**
 * Generates a standard SHA-256 hash (64 characters) from any input text.
 * Highly reusable for code submissions, file checksums, or content caching.
 */
export const generateSubmissionHash = (code: string): string => {
  return crypto.createHash('sha256').update(code).digest('hex'); // 'hex' output yields exactly 64 characters
};
