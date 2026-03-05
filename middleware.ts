import { NextRequest, NextResponse } from 'next/server'
import { getAuthToken } from '@/lib/auth-token'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow login page, auth API, and static files
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }

  const authToken = getAuthToken()
  const token = request.cookies.get('wedding_auth')?.value

  if (!authToken || token !== authToken) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
