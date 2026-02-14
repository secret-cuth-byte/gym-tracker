import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PASSWORD = process.env.APP_PASSWORD || 'superman-luke-12'
const SESSION_NAME = 'gymtracker-session'
const SESSION_VALUE = 'authenticated-' + Buffer.from(PASSWORD).toString('base64').slice(0, 16)

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow auth endpoint
  if (pathname === '/api/auth') {
    return NextResponse.next()
  }

  // Protect all other API routes
  if (pathname.startsWith('/api/')) {
    const session = request.cookies.get(SESSION_NAME)
    if (session?.value !== SESSION_VALUE) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*'
}
