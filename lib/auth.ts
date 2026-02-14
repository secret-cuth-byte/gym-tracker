import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const PASSWORD = process.env.APP_PASSWORD || 'superman-luke-12'
const SESSION_NAME = 'gymtracker-session'
const SESSION_VALUE = 'authenticated-' + Buffer.from(PASSWORD).toString('base64').slice(0, 16)

export async function verifyAuth(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_NAME)
  return session?.value === SESSION_VALUE
}

export function setAuthCookie(): NextResponse {
  const response = NextResponse.json({ success: true })
  response.cookies.set(SESSION_NAME, SESSION_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/'
  })
  return response
}

export function clearAuthCookie(): NextResponse {
  const response = NextResponse.json({ success: true })
  response.cookies.delete(SESSION_NAME)
  return response
}

export function checkPassword(input: string): boolean {
  return input === PASSWORD
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
