import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT, verifyCSRFToken, JWT_COOKIE_NAME, CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from './lib/auth';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Skip CSRF check for GET requests and login
  const skipCSRFCheck = 
    request.method === 'GET' || 
    request.nextUrl.pathname === '/api/auth/login';

  // Get the tokens
  const jwtToken = request.cookies.get(JWT_COOKIE_NAME)?.value;
  const csrfSecret = request.cookies.get(CSRF_COOKIE_NAME)?.value;
  const csrfToken = request.headers.get(CSRF_HEADER_NAME);

  // Check if route requires authentication
  if (request.nextUrl.pathname.startsWith('/api/') && 
      !request.nextUrl.pathname.startsWith('/api/auth/login')) {
    
    // Verify JWT
    if (!jwtToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = verifyJWT(jwtToken);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Verify CSRF token for non-GET requests
    if (!skipCSRFCheck) {
      if (!csrfSecret || !csrfToken) {
        return NextResponse.json(
          { error: 'CSRF token required' },
          { status: 403 }
        );
      }

      if (!verifyCSRFToken(csrfSecret, csrfToken)) {
        return NextResponse.json(
          { error: 'Invalid CSRF token' },
          { status: 403 }
        );
      }
    }

    // Add user info to request headers for route handlers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId);
    requestHeaders.set('x-user-role', payload.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 