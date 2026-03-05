import { neon } from '@neondatabase/serverless'

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  console.error('DATABASE_URL env var is required')
  process.exit(1)
}

type NeonQueryFn = (sql: string, params?: unknown[]) => Promise<Record<string, unknown>[]>
const sql = neon(DATABASE_URL) as unknown as NeonQueryFn

interface SeedGuest {
  name: string
  side: string
  subgroup: string
  likelihood: string
  has_plus_one: boolean
  plus_one_name: string | null
  phone: string | null
  notes: string | null
}

function g(
  name: string, side: string, subgroup: string,
  likelihood = 'green', has_plus_one = false,
  plus_one_name: string | null = null, notes: string | null = null,
): SeedGuest {
  return { name, side, subgroup, likelihood, has_plus_one, plus_one_name, phone: null, notes }
}

// Sample guests — replace with your own!
const guests: SeedGuest[] = [
  g('דוד כהן', 'suson', 'חברים'),
  g('שרה לוי', 'suson', 'משפחה', 'green', true, 'יוסי לוי'),
  g('מיכל אברהם', 'susonit', 'חברים'),
  g('רון ישראלי', 'susonit', 'משפחה', 'yellow'),
  g('נועה פרידמן', 'suson', 'עבודה', 'green', true, 'אלון פרידמן'),
]

async function seed() {
  console.log(`Inserting ${guests.length} sample guests...`)

  let inserted = 0
  for (const guest of guests) {
    await sql(
      `INSERT INTO guests (name, side, subgroup, likelihood, has_plus_one, plus_one_name, phone, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [guest.name, guest.side, guest.subgroup, guest.likelihood,
       guest.has_plus_one, guest.plus_one_name, guest.phone, guest.notes]
    )
    inserted++
  }

  console.log(`Done! ${inserted} guests added.`)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
