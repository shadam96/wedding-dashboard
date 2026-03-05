import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  const rows = await query('SELECT * FROM guests ORDER BY created_at ASC')
  return NextResponse.json(rows)
}

export async function POST(request: Request) {
  const body = await request.json()
  const {
    name, side, subgroup, likelihood = 'green',
    has_plus_one = false, plus_one_name = null,
    plus_one_likelihood = 'green', will_dance = false,
    plus_one_will_dance = false, children = [],
    phone = null, notes = null,
  } = body

  const rows = await query(
    `INSERT INTO guests (name, side, subgroup, likelihood, has_plus_one, plus_one_name,
      plus_one_likelihood, will_dance, plus_one_will_dance, children, phone, notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
    [name, side, subgroup, likelihood, has_plus_one, plus_one_name,
     plus_one_likelihood, will_dance, plus_one_will_dance,
     JSON.stringify(children), phone, notes]
  )
  return NextResponse.json(rows[0], { status: 201 })
}
