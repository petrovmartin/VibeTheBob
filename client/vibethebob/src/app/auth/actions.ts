'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { User, UserRole } from '@/types/user';
import { generateJWT, JWT_COOKIE_NAME, COOKIE_OPTIONS } from '@/lib/auth';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // TODO: Replace with actual authentication
  if (!email || !password) {
    throw new Error('Invalid credentials');
  }

  // Create a user object (replace with actual user data in production)
  const user = new User({
    id: '1',
    email,
    firstName: 'Test',
    lastName: 'User',
    role: UserRole.EMPLOYEE,
  });

  // Generate JWT token
  const token = generateJWT(user);

  // Set the JWT token in cookies
  const cookieStore = await cookies();
  cookieStore.set(JWT_COOKIE_NAME, token, COOKIE_OPTIONS);

  const returnUrl = formData.get('returnUrl') as string;
  redirect(returnUrl || '/dashboard');
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(JWT_COOKIE_NAME);
  redirect('/auth/login');
} 