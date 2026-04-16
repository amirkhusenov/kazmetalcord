import { NextResponse } from 'next/server';

export async function middleware() {
  // Create response
  const response = NextResponse.next();

  return response;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
