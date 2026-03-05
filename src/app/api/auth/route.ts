import { NextRequest, NextResponse } from 'next/server'
import { getAuthToken } from '@/lib/auth-token'

export async function POST(request: NextRequest) {
  const { password } = await request.json()

  if (password === process.env.APP_PASSWORD) {
    const authToken = getAuthToken()
    if (!authToken) {
      return NextResponse.json({ error: 'Server misconfigured — APP_PASSWORD not set' }, { status: 500 })
    }
    const response = NextResponse.json({ success: true })
    response.cookies.set('wedding_auth', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })
    return response
  }

  return NextResponse.json({ error: 'סיסמה שגויה' }, { status: 401 })
}
