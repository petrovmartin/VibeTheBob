import { NextResponse } from 'next/server';
import { UserRole } from '@/types/user';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth-token');

  if (!token) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  // TODO: Verify the JWT token and get user data
  // This is just an example
  const user = {
    id: '1',
    email: 'user@example.com',
    name: 'Test User',
    role: UserRole.EMPLOYEE,
  };

  return NextResponse.json(user);
} 