import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  const rows = await query('SELECT * FROM tasks ORDER BY created_at ASC')
  return NextResponse.json(rows)
}

export async function POST(request: Request) {
  const body = await request.json()
  const {
    title, description = null,
    status = 'todo', priority = 'medium',
    owner = 'both', due_date = null,
  } = body

  const rows = await query(
    `INSERT INTO tasks (title, description, status, priority, owner, due_date)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [title, description, status, priority, owner, due_date]
  )
  return NextResponse.json(rows[0], { status: 201 })
}
