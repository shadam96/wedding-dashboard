import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  const rows = await query('SELECT * FROM buses ORDER BY created_at ASC')
  return NextResponse.json(rows)
}

export async function POST(request: Request) {
  const body = await request.json()
  const {
    label, location = null,
    provider_name = null, driver_phone = null,
    guest_in_charge = null, notes = null,
  } = body

  const rows = await query(
    `INSERT INTO buses (label, location, provider_name, driver_phone, guest_in_charge, notes)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [label, location, provider_name, driver_phone, guest_in_charge, notes]
  )
  return NextResponse.json(rows[0], { status: 201 })
}
