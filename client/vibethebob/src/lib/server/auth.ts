import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { type NextRequest } from 'next/server';
import { User, UserRole } from '@/types/user';
import { verifyJWT, JWT_COOKIE_NAME } from '@/lib/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(JWT_COOKIE_NAME)?.value;
    
    if (!token) {
      return null;
    }

    const payload = verifyJWT(token);
    if (!payload) {
      return null;
    }

    // In a real app, you would fetch the user data from your database
    // using the payload.userId
    return {
      user: {
        id: payload.userId,
        email: payload.email,
        firstName: 'Test',
        lastName: 'User',
        role: payload.role,
      }
    };
  } catch (error) {
    return null;
  }
}

export async function createSession(user: User) {
  cookies().set('session', 'session-token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

export async function deleteSession() {
  cookies().delete('session');
}

export function auth() {
  return async () => {
    const session = await getSession();
    
    if (!session) {
      redirect('/auth/login');
    }
    
    return session;
  };
}

export function requireRole(allowedRoles: UserRole[]) {
  return async () => {
    const session = await getSession();
    
    if (!session) {
      redirect('/auth/login');
    }
    
    if (!allowedRoles.includes(session.user.role)) {
      redirect('/unauthorized');
    }
    
    return session;
  };
} 