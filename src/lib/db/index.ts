import { neon } from '@neondatabase/serverless'
import { ensureMigrated } from './migrate'

// neon() returns a function that accepts (sql, params) at runtime,
// but the TypeScript types only expose the tagged-template signature.
type NeonQueryFn = (sql: string, params?: unknown[]) => Promise<Record<string, unknown>[]>

export async function query<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  await ensureMigrated()
  const client = neon(process.env.DATABASE_URL!) as unknown as NeonQueryFn
  const rows = await client(sql, params)
  return rows as T[]
}
