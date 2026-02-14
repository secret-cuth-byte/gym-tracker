import { NextRequest, NextResponse } from 'next/server'
import { checkPassword, setAuthCookie, clearAuthCookie, verifyAuth } from '@/lib/auth'

export async function GET() {
  const authed = await verifyAuth()
  return NextResponse.json({ authenticated: authed })
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    
    if (checkPassword(password)) {
      return setAuthCookie()
    }
    
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

export async function DELETE() {
  return clearAuthCookie()
}
