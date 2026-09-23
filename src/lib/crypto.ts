import crypto from 'crypto';

/**
 * Generates a cryptographically secure random API key.
 * Format: re_{32_random_chars}
 */
export function generateApiKey(): { plaintextKey: string; hash: string } {
  const randomBytes = crypto.randomBytes(24).toString('base64url'); // 32 chars
  const plaintextKey = `re_${randomBytes}`;
  const hash = hashApiKey(plaintextKey);
  
  return { plaintextKey, hash };
}

/**
 * Hashes an API key for secure storage using SHA-256.
 * We use SHA-256 instead of bcrypt for API keys because API keys are high entropy
 * and need fast validation for every API request.
 */
export function hashApiKey(apiKey: string): string {
  return crypto.createHash('sha256').update(apiKey).digest('hex');
}

/**
 * Generates a unique Idempotency Key fingerprint.
 */
export function generateIdempotencyFingerprint(projectId: string, key: string): string {
  return crypto.createHash('sha256').update(`${projectId}:${key}`).digest('hex');
}
