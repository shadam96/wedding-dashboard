import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  const rows = await query('SELECT * FROM budget_items ORDER BY created_at ASC')
  return NextResponse.json(rows)
}

export async function POST(request: Request) {
  const body = await request.json()
  const {
    category, description,
    total_amount = 0, paid_amount = 0,
    notes = null,
  } = body

  const rows = await query(
    `INSERT INTO budget_items (category, description, total_amount, paid_amount, notes)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [category, description, total_amount, paid_amount, notes]
  )
  return NextResponse.json(rows[0], { status: 201 })
}
