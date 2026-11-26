import crypto from 'node:crypto';
import type { AstroCookies } from 'astro';

export const SESSION_COOKIE = 'sr_backstage_session';
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

interface RateLimitEntry {
  failures: number;
  lockedUntil: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

function getEnv(key: string, fallback = ''): string {
  const fromImport = (import.meta.env as Record<string, string | undefined>)[key];
  return fromImport || process.env[key] || fallback;
}

export function getConfiguredPin(): string {
  return getEnv('ADMIN_PIN', '198640').trim();
}

function getSessionSecret(): string {
  return getEnv(
    'SESSION_SECRET',
    'skidrow-2027-local-dev-session-secret-change-me-on-vercel'
  );
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'local'
  );
}

export function checkRateLimit(ip: string): { allowed: boolean; retryAfterSec?: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry) return { allowed: true };
  if (entry.lockedUntil > now) {
    return {
      allowed: false,
      retryAfterSec: Math.ceil((entry.lockedUntil - now) / 1000),
    };
  }
  if (entry.lockedUntil > 0 && entry.lockedUntil <= now) {
    rateLimitMap.delete(ip);
  }
  return { allowed: true };
}

export function recordFailedPin(ip: string): { locked: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { failures: 0, lockedUntil: 0 };
  entry.failures += 1;
  if (entry.failures >= MAX_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_MS;
    rateLimitMap.set(ip, entry);
    return { locked: true, remaining: 0 };
  }
  rateLimitMap.set(ip, entry);
  return { locked: false, remaining: MAX_ATTEMPTS - entry.failures };
}

export function clearRateLimit(ip: string): void {
  rateLimitMap.delete(ip);
}

export function verifyPin(inputPin: string): boolean {
  const clean = String(inputPin || '').trim();
  const expected = getConfiguredPin();
  if (!/^\d{6}$/.test(clean) || clean.length !== expected.length) {
    return false;
  }
  const a = Buffer.from(clean, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  return crypto.timingSafeEqual(a, b);
}

function signPayload(payloadB64: string): string {
  return crypto
    .createHmac('sha256', getSessionSecret())
    .update(payloadB64)
    .digest('base64url');
}

export function createSessionToken(): string {
  const payload = {
    role: 'backstage',
    iat: Date.now(),
    exp: Date.now() + SESSION_TTL_MS,
    nonce: crypto.randomBytes(12).toString('hex'),
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const sig = signPayload(payloadB64);
  return `${payloadB64}.${sig}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token || !token.includes('.')) return false;
  const [payloadB64, sig] = token.split('.');
  if (!payloadB64 || !sig) return false;
  const expectedSig = signPayload(payloadB64);
  const a = Buffer.from(sig, 'utf8');
  const b = Buffer.from(expectedSig, 'utf8');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    return payload.role === 'backstage' && typeof payload.exp === 'number' && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export function setSessionCookie(cookies: AstroCookies): void {
  const token = createSessionToken();
  const isProd = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
  cookies.set(SESSION_COOKIE, token, {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: isProd,
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
}

export function clearSessionCookie(cookies: AstroCookies): void {
  cookies.delete(SESSION_COOKIE, { path: '/' });
}

export function isAuthenticated(cookies: AstroCookies): boolean {
  const token = cookies.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export function getAuthEnvStatus() {
  return {
    hasCustomPin: Boolean(getEnv('ADMIN_PIN')),
    hasSessionSecret: Boolean(getEnv('SESSION_SECRET')),
    hasSupabaseUrl: Boolean(getEnv('SUPABASE_URL')),
    hasSupabaseKey: Boolean(getEnv('SUPABASE_SERVICE_ROLE_KEY')),
    hasMailerLite: Boolean(getEnv('MAILERLITE_API_KEY')),
  };
}
