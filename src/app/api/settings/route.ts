import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get('key')
  if (!key) {
    return NextResponse.json({ error: 'Missing key parameter' }, { status: 400 })
  }

  const rows = await query(
    'SELECT value FROM app_settings WHERE key = $1',
    [key]
  )

  if (rows.length === 0) {
    return NextResponse.json({ value: null })
  }
  return NextResponse.json({ value: (rows[0] as { value: unknown }).value })
}

export async function PUT(request: Request) {
  const { key, value } = await request.json()
  if (!key) {
    return NextResponse.json({ error: 'Missing key' }, { status: 400 })
  }

  await query(
    `INSERT INTO app_settings (key, value, updated_at)
     VALUES ($1, $2, now())
     ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = now()`,
    [key, JSON.stringify(value)]
  )

  return NextResponse.json({ success: true })
}
