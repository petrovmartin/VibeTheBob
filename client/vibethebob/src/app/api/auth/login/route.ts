import { NextResponse } from 'next/server';
import { User, UserRole } from '@/types/user';
import { 
  generateJWT, 
  generateCSRFToken, 
  COOKIE_OPTIONS, 
  JWT_COOKIE_NAME,
  CSRF_COOKIE_NAME
} from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // TODO: Replace this with your actual authentication logic
    // This is just an example
    const user = new User({
      id: '1',
      email,
      firstName: 'Test',
      lastName: 'User',
      role: UserRole.EMPLOYEE,
    });

    // Generate JWT
    const jwt = generateJWT(user);

    // Generate CSRF token
    const { secret: csrfSecret, token: csrfToken } = generateCSRFToken();

    // Create the response with the user data
    const response = NextResponse.json({ 
      user,
      csrfToken // Send CSRF token to client
    });

    // Set the JWT cookie
    response.cookies.set(JWT_COOKIE_NAME, jwt, COOKIE_OPTIONS);

    // Set the CSRF secret cookie
    response.cookies.set(CSRF_COOKIE_NAME, csrfSecret, {
      ...COOKIE_OPTIONS,
      // Make this cookie HTTP-only as well
      httpOnly: true
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
} 