import jwt from 'jsonwebtoken';
import { User, UserRole } from '@/types/user';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export function generateJWT(user: User): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };
  
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d', // Token expires in 7 days
  });
}

export function verifyJWT(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

// CSRF Protection using Web Crypto API
export async function generateCSRFToken(): Promise<{ secret: string; token: string }> {
  // Generate a random secret using Web Crypto API
  const secretBuffer = await crypto.subtle.generateKey(
    { name: 'HMAC', hash: 'SHA-256' },
    true,
    ['sign']
  );
  
  // Export the key as raw bytes
  const secretRaw = await crypto.subtle.exportKey('raw', secretBuffer);
  const secret = Array.from(new Uint8Array(secretRaw))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  // Create a hash of the secret as the token
  const encoder = new TextEncoder();
  const data = encoder.encode(secret);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const token = Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return { secret, token };
}

export async function verifyCSRFToken(secret: string, token: string): Promise<boolean> {
  try {
    // Hash the secret using Web Crypto API
    const encoder = new TextEncoder();
    const data = encoder.encode(secret);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const expectedToken = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    return token === expectedToken;
  } catch {
    return false;
  }
}

// Cookie options
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

export const JWT_COOKIE_NAME = 'auth-token';
export const CSRF_COOKIE_NAME = 'csrf-token';
export const CSRF_HEADER_NAME = 'X-CSRF-Token'; 