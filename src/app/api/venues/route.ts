import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  const rows = await query('SELECT * FROM venues ORDER BY created_at ASC')
  return NextResponse.json(rows)
}

export async function POST(request: Request) {
  const body = await request.json()
  const {
    name, location = null,
    min_price = 0, max_price = 0,
    capacity = null, contact_name = null,
    contact_phone = null, status = 'considering',
    available_dates = [], notes = null,
  } = body

  const rows = await query(
    `INSERT INTO venues (name, location, min_price, max_price, capacity,
      contact_name, contact_phone, status, available_dates, notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
    [name, location, min_price, max_price, capacity,
     contact_name, contact_phone, status,
     JSON.stringify(available_dates), notes]
  )
  return NextResponse.json(rows[0], { status: 201 })
}
