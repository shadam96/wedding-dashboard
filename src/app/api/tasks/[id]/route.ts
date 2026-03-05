import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const updates = await request.json()

  const keys = Object.keys(updates)
  if (keys.length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
  }

  const setClauses = keys.map((k, i) => `${k} = $${i + 1}`)
  const values = keys.map((k) => updates[k])
  values.push(id)

  const rows = await query(
    `UPDATE tasks SET ${setClauses.join(', ')} WHERE id = $${values.length} RETURNING *`,
    values
  )

  if (rows.length === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json(rows[0])
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await query('DELETE FROM tasks WHERE id = $1', [id])
  return NextResponse.json({ success: true })
}
