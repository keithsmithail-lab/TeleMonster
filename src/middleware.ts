import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public routes that don't require authentication
const publicRoutes = ['/login']

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/roleplays', '/recordings', '/kb', '/personas', '/admin', '/settings']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route is public
  const isPublicRoute = publicRoutes.includes(pathname)
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // TODO: Implement proper session/JWT token checking
  // For now, we'll use a simple cookie check as placeholder
  const hasAuthCookie = request.cookies.get('auth-storage')
  
  // If accessing a protected route without authentication, redirect to login
  if (isProtectedRoute && !hasAuthCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If accessing login while authenticated, redirect to dashboard
  if (isPublicRoute && hasAuthCookie && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Allow the request to continue
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}